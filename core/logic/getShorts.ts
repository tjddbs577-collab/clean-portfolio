// core/logic/getShorts.ts
import { syncShorts, getMemoryShorts } from "./syncShorts";

/**
 * 쇼츠 공통 타입 (유일한 정의 ✅)
 */
export interface Video {
  id: string;
  title: string;
}

/**
 * 쇼츠 전체 (자동 동기화 포함)
 */
export async function getShorts(): Promise<Video[]> {
  let shorts = getMemoryShorts();

  // 🔥 메모리가 비어 있으면 자동 동기화
  if (shorts.length === 0) {
    await syncShorts();
    shorts = getMemoryShorts();
  }

  return shorts;
}

/**
 * 최신 N개
 */
export async function getLatestShorts(count = 3): Promise<Video[]> {
  const shorts = await getShorts();
  return shorts.slice(0, count);
}
