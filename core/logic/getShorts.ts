import { kv } from "@vercel/kv";

export interface Video {
  id: string;
  title: string;
}

interface ShortsData {
  videos: Video[];
  updatedAt: number;
}

async function getShortsFromKV(): Promise<Video[]> {
  try {
    const data = await kv.get<ShortsData>("shorts:latest");
    return data?.videos || [];
  } catch (error) {
    // KV가 설정되지 않았거나 패키지가 없을 경우 빈 배열 반환
    if (process.env.NODE_ENV === "development") {
      console.warn("KV not available, returning empty array:", error instanceof Error ? error.message : error);
    }
    return [];
  }
}

export async function getShorts(): Promise<Video[]> {
  return getShortsFromKV();
}

export async function getLatestShorts(count: number = 3): Promise<Video[]> {
  const shorts = await getShortsFromKV();
  return shorts.slice(0, count);
}

