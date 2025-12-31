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
          <div className="text-sm space-y-3 text-slate-600 dark:text-slate-400">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <p className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
                🚀 빠른 동기화
              </p>
              <a
                href="/admin/sync"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                유튜브 영상 지금 가져오기
              </a>
              <p className="text-xs mt-2 text-blue-700 dark:text-blue-300">
                버튼을 클릭하면 유튜브 채널에서 쇼츠를 가져옵니다.
              </p>
            </div>
            <div className="mt-4">
              <p className="font-semibold mb-2">기타 확인 방법:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>
                  <a
                    href="/api/kv-check"
                    target="_blank"
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    KV 데이터 확인
                  </a>
                </li>
                <li>
                  <a
                    href="/api/kv-test"
                    target="_blank"
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    KV 연결 테스트
                  </a>
                </li>
              </ul>
            </div>
            <p className="text-xs mt-4 text-slate-500">
              💡 이후부터는 10분마다 자동으로 동기화됩니다.
            </p>
          </div>
        </div>
      ) : (
        <ShortsGrid videos={shorts} />
      )}
    </main>
  );
}
