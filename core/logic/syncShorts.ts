import { kv } from "@vercel/kv";
import type { Video } from "./getShorts";

export interface ShortsData {
  videos: Video[];
  updatedAt: number;
}

export interface SyncResult {
  success: true;
  count: number;
  updatedAt: number;
}

export interface SyncError {
  success: false;
  error: string;
  detail?: string;
}

/**
 * YouTube 채널에서 쇼츠를 동기화하는 공통 함수
 */
export async function syncShorts(): Promise<SyncResult | SyncError> {
  console.log("▶ syncShorts start");

  const lockKey = "shorts:sync:lock";
  let hasLock = false;

  try {
    const apiKey = process.env.YOUTUBE_API_KEY;
    const channelId = process.env.YOUTUBE_CHANNEL_ID;

    // 0️⃣ 환경변수 체크
    if (!apiKey || !channelId) {
      return {
        success: false,
        error: "Missing YOUTUBE_API_KEY or YOUTUBE_CHANNEL_ID",
      };
    }

    // 🔒 중복 실행 방어 (5분)
    const locked = await kv.get<string>(lockKey);
    if (locked) {
      return {
        success: true,
        count: 0,
        updatedAt: Date.now(),
      };
    }

    await kv.set(lockKey, "1", { ex: 300 });
    hasLock = true;

    // 1️⃣ 채널 정보
    const channelRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${apiKey}`
    );
    if (!channelRes.ok) throw new Error("Failed to fetch channel");

    const channelData: {
      items?: {
        contentDetails?: {
          relatedPlaylists?: { uploads?: string };
        };
      }[];
    } = await channelRes.json();

    const uploadsPlaylistId =
      channelData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;

    if (!uploadsPlaylistId) {
      throw new Error("Uploads playlist not found");
    }

    // 2️⃣ 재생목록
    const playlistRes = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=50&key=${apiKey}`
    );
    if (!playlistRes.ok) throw new Error("Failed to fetch playlist items");

    const playlistData: {
      items?: {
        snippet?: {
          resourceId?: { videoId?: string };
        };
      }[];
    } = await playlistRes.json();

    const videoIds = playlistData.items
      ?.map(item => item.snippet?.resourceId?.videoId)
      .filter((id): id is string => Boolean(id))
      .join(",");

    if (!videoIds) {
      return {
        success: true,
        count: 0,
        updatedAt: Date.now(),
      };
    }

    // 3️⃣ 영상 상세
    const videosRes = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet,status&id=${videoIds}&key=${apiKey}`
    );
    if (!videosRes.ok) throw new Error("Failed to fetch videos");

    const videosData: {
      items?: {
        id: string;
        snippet?: { title?: string };
        contentDetails?: { duration?: string };
        status?: {
          embeddable?: boolean;
          privacyStatus?: string;
        };
      }[];
    } = await videosRes.json();

    // 4️⃣ Shorts 필터
    const shorts: Video[] = [];

    for (const video of videosData.items ?? []) {
      const duration = video.contentDetails?.duration;
      const isEmbeddable = video.status?.embeddable === true;
      const privacyStatus = video.status?.privacyStatus;

      let seconds = 0;
      const match = duration?.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
      if (match) {
        seconds =
          Number(match[1] || 0) * 3600 +
          Number(match[2] || 0) * 60 +
          Number(match[3] || 0);
      }

      if (seconds > 0 && seconds <= 60 && isEmbeddable && privacyStatus === "public") {
        shorts.push({
          id: video.id,
          title: video.snippet?.title ?? "",
        });
      }
    }

    // 5️⃣ KV 저장
    const shortsData: ShortsData = {
      videos: shorts,
      updatedAt: Date.now(),
    };

    await kv.set("shorts:latest", shortsData, { ex: 60 * 60 });

    console.log("▶ syncShorts success");

    return {
      success: true,
      count: shorts.length,
      updatedAt: shortsData.updatedAt,
    };
  } catch (error) {
    console.error("❌ syncShorts exception", error);
    return {
      success: false,
      error: "Internal server error",
      detail: error instanceof Error ? error.message : String(error),
    };
  } finally {
    // 🔓 실제로 락을 잡았을 때만 해제
    if (hasLock) {
      await kv.del(lockKey);
    }
  }
}
