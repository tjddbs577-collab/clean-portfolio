import Link from "next/link";
import { getLatestShorts } from "@/core/logic/getShorts";

export default async function HomePage() {
  const shorts = await getLatestShorts(3);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="container mx-auto px-4 py-16 space-y-24">
        {/* ===== HERO ===== */}
        <section className="space-y-6">
          <p className="text-sm uppercase tracking-[0.4em] text-slate-600 dark:text-slate-300">
            Creative Portfolio Template
          </p>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
            웹 포트폴리오
          </h1>
          <p className="max-w-xl text-slate-600 dark:text-slate-400">
            Next.js App Router 기반 프로젝트입니다.
          </p>
        </section>

        {/* ===== 최신 쇼츠 섹션 ===== */}
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              🎬 최신 AI 자동화 쇼츠
            </h2>
            <Link
              href="/shorts"
              className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
            >
              전체 쇼츠 보기 →
            </Link>
          </div>

          {shorts.length === 0 && (
            <p className="text-slate-500">아직 쇼츠가 없습니다.</p>
          )}
        </section>
      </div>
    </div>
  );
}
