import { Redis } from "@upstash/redis";

/**
 * Vercel에 연결된 Upstash Redis를 자동으로 사용
 * (환경변수는 Vercel이 알아서 주입)
 */
export const redis = Redis.fromEnv();
