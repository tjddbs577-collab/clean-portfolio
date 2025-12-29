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
        <div className="shorts-empty">
          <p className="mb-4">아직 플레이리스트에 영상이 없습니다.</p>
          <div className="text-sm space-y-2 text-slate-600 dark:text-slate-400">
            <p className="font-semibold">해결 방법:</p>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>
                <a
                  href="/api/kv-check"
                  target="_blank"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  KV 데이터 확인
                </a>{" "}
                - KV에 데이터가 있는지 확인
              </li>
              <li>
                크론 작업 수동 실행 필요 (로컬 개발 시):
                <br />
                <code className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded mt-1 block">
                  http://localhost:3000/api/cron/sync-shorts?secret=YOUR_SECRET
                </code>
              </li>
              <li>
                <a
                  href="/api/kv-test"
                  target="_blank"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  KV 연결 테스트
                </a>{" "}
                - KV 연결 상태 확인
              </li>
            </ol>
            <p className="text-xs mt-4 text-slate-500">
              💡 Vercel에 배포하면 크론 작업이 자동으로 30분마다 실행됩니다.
            </p>
          </div>
        </div>
      ) : (
        <ShortsGrid videos={shorts} />
      )}
    </main>
  );
}
