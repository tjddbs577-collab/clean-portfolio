import { kv } from "@vercel/kv";
import type { Video } from "@/core/logic/getShorts";

interface ShortsData {
  videos: Video[];
  updatedAt: number;
}

export async function GET(request: Request) {
  // Secret 검증 (query param 또는 header 지원)
  const url = new URL(request.url);
  const secretFromQuery = url.searchParams.get("secret");
  const secretFromHeader = request.headers.get("x-cron-secret");
  const expectedSecret = process.env.SHORTS_SYNC_SECRET;

  if (!expectedSecret) {
    return new Response(
      JSON.stringify({ error: "SHORTS_SYNC_SECRET not configured" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  if (secretFromQuery !== expectedSecret && secretFromHeader !== expectedSecret) {
    return new Response(
      JSON.stringify({ error: "Unauthorized" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const apiKey = process.env.YOUTUBE_API_KEY;
    const channelId = process.env.YOUTUBE_CHANNEL_ID;

    if (!apiKey || !channelId) {
      return new Response(
        JSON.stringify({ error: "Missing YOUTUBE_API_KEY or YOUTUBE_CHANNEL_ID" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // 1. 채널의 업로드 재생목록 ID 가져오기
    const channelRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${apiKey}`
    );

    if (!channelRes.ok) {
      const errorText = await channelRes.text();
      return new Response(
        JSON.stringify({ error: "Failed to fetch channel", detail: errorText }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const channelData = await channelRes.json();
    const uploadsPlaylistId =
      channelData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;

    if (!uploadsPlaylistId) {
      return new Response(
        JSON.stringify({ error: "Uploads playlist not found" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // 2. 재생목록에서 최근 영상 ID들 가져오기 (최대 50개)
    const playlistRes = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=50&key=${apiKey}`
    );

    if (!playlistRes.ok) {
      const errorText = await playlistRes.text();
      return new Response(
        JSON.stringify({ error: "Failed to fetch playlist items", detail: errorText }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const playlistData = await playlistRes.json();
    const videoIds = playlistData.items
      ?.map((item: any) => item.snippet.resourceId.videoId)
      .filter(Boolean)
      .join(",");

    if (!videoIds) {
      return new Response(
        JSON.stringify({ error: "No videos found" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // 3. 영상 상세 정보 가져오기 (duration, snippet, status)
    const videosRes = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet,status&id=${videoIds}&key=${apiKey}`
    );

    if (!videosRes.ok) {
      const errorText = await videosRes.text();
      return new Response(
        JSON.stringify({ error: "Failed to fetch videos", detail: errorText }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const videosData = await videosRes.json();

    // 4. duration 파싱 및 필터링 (≤ 60초, embeddable, public)
    const shorts: Video[] = [];

    for (const video of videosData.items || []) {
      const duration = video.contentDetails?.duration;
      const isEmbeddable = video.status?.embeddable === true;
      const privacyStatus = video.status?.privacyStatus;

      // ISO 8601 duration 파싱 (예: PT1M30S -> 90초)
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

    // 5. KV에 저장 (TTL 6시간 = 21600초)
    const shortsData: ShortsData = {
      videos: shorts,
      updatedAt: Date.now(),
    };

    await kv.set("shorts:latest", shortsData, { ex: 21600 });

    return Response.json({
      success: true,
      count: shorts.length,
      updatedAt: shortsData.updatedAt,
    });
  } catch (error) {
    console.error("Error syncing shorts:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        detail: error instanceof Error ? error.message : String(error),
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

