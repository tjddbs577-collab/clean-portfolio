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

  const isDev = process.env.NODE_ENV === "development";
  const lockKey = "shorts:sync:lock";

  try {
    const apiKey = process.env.YOUTUBE_API_KEY;
    const channelId = process.env.YOUTUBE_CHANNEL_ID;

    // 0️⃣ 환경변수 체크
    if (!apiKey || !channelId) {
      console.error("❌ Missing env", { apiKey, channelId });
      return {
        success: false,
        error: "Missing YOUTUBE_API_KEY or YOUTUBE_CHANNEL_ID",
      };
    }

    // 🔒 0-1️⃣ 크론 중복 실행 방어 (prod only)
    if (!isDev) {
      const locked = await kv.get(lockKey);
      if (locked) {
        console.warn("⏭ syncShorts skipped: already running");
        return {
          success: true,
          count: 0,
          updatedAt: Date.now(),
        };
      }

      // 5분 락
      await kv.set(lockKey, "1", { ex: 300 });
    }

    // 1️⃣ 채널 정보 가져오기
    console.log("▶ step 1: fetch channel");
    const channelRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${apiKey}`
    );

    if (!channelRes.ok) {
      const errorText = await channelRes.text();
      console.error("❌ channel fetch failed", errorText);
      throw new Error("Failed to fetch channel");
    }

    const channelData = await channelRes.json();
    const uploadsPlaylistId =
      channelData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;

    if (!uploadsPlaylistId) {
      throw new Error("Uploads playlist not found");
    }

    // 2️⃣ 업로드 재생목록 조회
    console.log("▶ step 2: fetch playlist items");
    const playlistRes = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=50&key=${apiKey}`
    );

    if (!playlistRes.ok) {
      const errorText = await playlistRes.text();
      console.error("❌ playlist fetch failed", errorText);
      throw new Error("Failed to fetch playlist items");
    }

    const playlistData = await playlistRes.json() as {
      items?: Array<{ snippet?: { resourceId?: { videoId?: string } } }>;
    };
    const videoIds = playlistData.items
      ?.map((item) => item.snippet?.resourceId?.videoId)
      .filter(Boolean)
      .join(",");

    if (!videoIds) {
      console.warn("⚠️ No video IDs found");
      return {
        success: true,
        count: 0,
        updatedAt: Date.now(),
      };
    }

    // 3️⃣ 영상 상세 조회
    console.log("▶ step 3: fetch videos detail");
    const videosRes = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet,status&id=${videoIds}&key=${apiKey}`
    );

    if (!videosRes.ok) {
      const errorText = await videosRes.text();
      console.error("❌ videos fetch failed", errorText);
      throw new Error("Failed to fetch videos");
    }

    const videosData = await videosRes.json();

    // 4️⃣ Shorts 필터링
    console.log("▶ step 4: filter shorts");
    const shorts: Video[] = [];

    for (const video of videosData.items || []) {
      const duration = video.contentDetails?.duration;
      const isEmbeddable = video.status?.embeddable === true;
      const privacyStatus = video.status?.privacyStatus;

      let durationInSeconds = 0;
      if (duration) {
        const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
        if (match) {
          const hours = parseInt(match[1] || "0", 10);
          const minutes = parseInt(match[2] || "0", 10);
          const seconds = parseInt(match[3] || "0", 10);
          durationInSeconds = hours * 3600 + minutes * 60 + seconds;
        }
      }

      if (
        durationInSeconds > 0 &&
        durationInSeconds <= 60 &&
        isEmbeddable &&
        privacyStatus === "public"
      ) {
        shorts.push({
          id: video.id,
          title: video.snippet?.title || "",
        });
      }
    }

    console.log(`▶ shorts filtered count: ${shorts.length}`);

    // 5️⃣ KV 저장
    const shortsData: ShortsData = {
      videos: shorts,
      updatedAt: Date.now(),
    };

    if (isDev) {
      console.log("⚠️ dev mode: skip KV save", shortsData);
    } else {
      console.log("▶ step 5: save to KV");
      await kv.set("shorts:latest", shortsData, { ex: 21600 });
    }

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
    // 🔓 lock 해제 (prod only)
    if (!isDev) {
      await kv.del(lockKey);
    }
  }
}
