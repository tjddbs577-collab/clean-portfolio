import Link from "next/link";
import { getShorts } from "@/core/logic/getShorts";
import { ShortsGrid } from "@/components/ShortsGrid";

export const revalidate = 3600; // 1시간마다 자동 갱신

export default async function ShortsPage() {
  const shorts = await getShorts();

  return (
    <main className="shorts-main">
      <Link
        href="/"
        className="mb-6 inline-flex items-center text-sm font-medium text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
      >
        ← 메인으로 돌아가기
      </Link>
      <h1 className="shorts-title">🎬 AI 자동화 쇼츠</h1>

      {shorts.length === 0 ? (
        <p className="shorts-empty">아직 플레이리스트에 영상이 없습니다.</p>
      ) : (
        <ShortsGrid videos={shorts} />
      )}
    </main>
  );
}

