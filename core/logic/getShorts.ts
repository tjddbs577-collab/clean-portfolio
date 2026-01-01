import { redis } from "@/core/lib/redis";

/**
 * 공통 Video 타입
 */
export interface Video {
  id: string;
  title: string;
}

/**
 * Redis에 저장되는 구조
 */
interface ShortsData {
  videos: Video[];
  updatedAt: number;
}

/* =========================================================
 * Redis에서 쇼츠 가져오기
 * ========================================================= */
async function getShortsFromRedis(): Promise<Video[]> {
  try {
    const data = await redis.get<ShortsData>("shorts:latest");
    return data?.videos ?? [];
  } catch (error) {
    console.warn("Redis read failed:", error);
    return [];
  }
}

/* =========================================================
 * 🔥 반드시 export 되어 있어야 함
 * ========================================================= */
export async function getShorts(): Promise<Video[]> {
  return getShortsFromRedis();
}

/* =========================================================
 * 최신 N개만
 * ========================================================= */
export async function getLatestShorts(count: number = 3): Promise<Video[]> {
  const shorts = await getShortsFromRedis();
  return shorts.slice(0, count);
}
