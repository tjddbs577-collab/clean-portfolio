// core/logic/syncShorts.ts
import type { Video } from "./getShorts";

/**
 * 서버 메모리 저장소
 * ⚠️ 서버 재시작 시 초기화됨 (의도된 동작)
 */
let MEMORY_SHORTS: Video[] = [];
let LAST_UPDATED = 0;

/**
 * YouTube playlist item 최소 타입
 */
interface PlaylistItem {
  snippet?: {
    resourceId?: {
      videoId?: string;
    };
  };
}

/**
 * YouTube video item 최소 타입
 */
interface VideoItem {
  id: string;
  snippet?: {
    title?: string;
  };
  contentDetails?: {
    duration?: string;
  };
  status?: {
    embeddable?: boolean;
    privacyStatus?: string;
  };
}

/**
 * YouTube 채널에서 쇼츠를 동기화
 */
export async function syncShorts() {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY;
    const channelId = process.env.YOUTUBE_CHANNEL_ID;

    if (!apiKey || !channelId) {
      return { success: false, error: "Missing env" };
    }

    // 1분 이내 재호출 방지
    const now = Date.now();
    if (now - LAST_UPDATED < 60_000) {
      return { success: true, count: MEMORY_SHORTS.length };
    }

    /* =========================
       1️⃣ 채널 정보
    ========================= */
    const channelRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${apiKey}`
    );
    if (!channelRes.ok) throw new Error("Failed to fetch channel");

    const channelData: {
      items?: {
        contentDetails?: {
          relatedPlaylists?: {
            uploads?: string;
          };
        };
      }[];
    } = await channelRes.json();

    const uploadsPlaylistId =
      channelData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;

    if (!uploadsPlaylistId) {
      throw new Error("Uploads playlist not found");
    }

    /* =========================
       2️⃣ 재생목록
    ========================= */
    const playlistRes = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=50&key=${apiKey}`
    );
    if (!playlistRes.ok) throw new Error("Failed to fetch playlist items");

    const playlistData: { items?: PlaylistItem[] } =
      await playlistRes.json();

    const videoIds =
      playlistData.items
        ?.map(item => item.snippet?.resourceId?.videoId)
        .filter((id): id is string => Boolean(id))
        .join(",") ?? "";

    if (!videoIds) {
      MEMORY_SHORTS = [];
      LAST_UPDATED = now;
      return { success: true, count: 0 };
    }

    /* =========================
       3️⃣ 영상 상세
    ========================= */
    const videosRes = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet,status&id=${videoIds}&key=${apiKey}`
    );
    if (!videosRes.ok) throw new Error("Failed to fetch videos");

    const videosData: { items?: VideoItem[] } =
      await videosRes.json();

    /* =========================
       4️⃣ ⭐️ shorts 선언 (핵심!)
    ========================= */
    const shorts: Video[] = [];

    for (const v of videosData.items ?? []) {
      const duration = v.contentDetails?.duration ?? "";
      const isEmbeddable = v.status?.embeddable === true;
      const privacyStatus = v.status?.privacyStatus;

      let seconds = 0;
      const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
      if (match) {
        seconds =
          Number(match[1] || 0) * 3600 +
          Number(match[2] || 0) * 60 +
          Number(match[3] || 0);
      }

      if (
        seconds > 0 &&
        seconds <= 60 &&
        isEmbeddable &&
        privacyStatus === "public"
      ) {
        shorts.push({
          id: v.id,
          title: v.snippet?.title ?? "",
        });
      }
    }
    console.log("SHORTS FILTER RESULT:", shorts);

    /* =========================
       5️⃣ 메모리 저장
    ========================= */
    MEMORY_SHORTS = shorts;
    LAST_UPDATED = now;

    return { success: true, count: shorts.length };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : String(e),
    };
  }
}

/**
 * getShorts.ts 에서만 사용
 */
export function getMemoryShorts(): Video[] {
  return MEMORY_SHORTS;
}
