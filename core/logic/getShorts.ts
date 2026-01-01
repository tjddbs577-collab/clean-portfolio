import { kv } from "@vercel/kv";

/* =========================================================
 * 공통 타입
 * ========================================================= */
export interface Video {
  id: string;
  title: string;
}

interface ShortsData {
  videos: Video[];
  updatedAt: number;
}

/* =========================================================
 * YouTube API 응답 최소 타입 (필요한 부분만)
 * ========================================================= */
interface YouTubePlaylistItem {
  snippet: {
    title: string;
    resourceId: {
      videoId: string;
    };
  };
}

interface YouTubePlaylistResponse {
  items: YouTubePlaylistItem[];
}

/* =========================================================
 * 1️⃣ YouTube Data API v3에서 최신 업로드 영상 가져오기
 * ========================================================= */
async function getShortsFromYouTube(): Promise<Video[]> {
  const channelId = process.env.YOUTUBE_CHANNEL_ID;
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!channelId || !apiKey) {
    console.error("YouTube env missing");
    return [];
  }

  // 업로드 플레이리스트 ID (UC → UU 규칙)
  const uploadPlaylistId = channelId.replace("UC", "UU");

  const url = new URL("https://www.googleapis.com/youtube/v3/playlistItems");
  url.searchParams.set("part", "snippet");
  url.searchParams.set("playlistId", uploadPlaylistId);
  url.searchParams.set("maxResults", "10");
  url.searchParams.set("key", apiKey);

  const res = await fetch(url.toString());

  if (!res.ok) {
    console.error("YouTube API error:", await res.text());
    return [];
  }

  const json: YouTubePlaylistResponse = await res.json();

  return json.items.map((item) => ({
    id: item.snippet.resourceId.videoId,
    title: item.snippet.title,
  }));
}

/* =========================================================
 * 2️⃣ KV에서 쇼츠 데이터 읽기
 * ========================================================= */
async function getShortsFromKV(): Promise<Video[]> {
  try {
    const data = await kv.get<ShortsData>("shorts:latest");
    return data?.videos || [];
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "KV not available, returning empty array:",
        error instanceof Error ? error.message : error
      );
    }
    return [];
  }
}

/* =========================================================
 * 3️⃣ 메인 함수
 *    - 기본: KV에서 읽기
 *    - KV가 비어 있으면 → YouTube에서 가져와 KV에 저장
 * ========================================================= */
export async function getShorts(): Promise<Video[]> {
  // 1) KV 먼저 시도
  const cached = await getShortsFromKV();
  if (cached.length > 0) {
    return cached;
  }

  // 2) KV가 비어 있으면 YouTube 호출
  const fromYouTube = await getShortsFromYouTube();

  // 3) YouTube 결과를 KV에 저장
  if (fromYouTube.length > 0) {
    try {
      await kv.set(
        "shorts:latest",
        {
          videos: fromYouTube,
          updatedAt: Date.now(),
        },
        { ex: 60 * 60 } // 1시간 TTL
      );
    } catch (error) {
      console.warn("Failed to save shorts to KV:", error);
    }
  }

  return fromYouTube;
}

/* =========================================================
 * 4️⃣ 최신 N개만 가져오기 (UI용)
 * ========================================================= */
export async function getLatestShorts(
  count: number = 3
): Promise<Video[]> {
  const shorts = await getShorts();
  return shorts.slice(0, count);
}
// deploy-trigger: no-op


