"use client";

import { useState } from "react";

export default function SyncPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success?: boolean;
    message?: string;
    count?: number;
    error?: string;
  } | null>(null);

  const handleSync = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/admin/sync");
      const data = await response.json();

      if (response.ok) {
        setResult({
          success: true,
          message: data.message || "동기화 완료",
          count: data.count,
        });
        // 성공 시 2초 후 쇼츠 페이지로 리다이렉트
        setTimeout(() => {
          window.location.href = "/shorts";
        }, 2000);
      } else {
        setResult({
          success: false,
          error: data.error || "동기화 실패",
        });
      }
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : "알 수 없는 오류",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            유튜브 쇼츠 동기화
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
            유튜브 채널에서 쇼츠를 가져와 웹사이트에 표시합니다.
          </p>

          <button
            onClick={handleSync}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            {loading ? "동기화 중..." : "지금 동기화하기"}
          </button>

          {result && (
            <div
              className={`mt-4 p-4 rounded-lg ${
                result.success
                  ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300"
                  : "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300"
              }`}
            >
              {result.success ? (
                <div>
                  <p className="font-medium">✅ {result.message}</p>
                  {result.count !== undefined && (
                    <p className="text-sm mt-1">
                      {result.count}개의 쇼츠가 동기화되었습니다.
                    </p>
                  )}
                  <p className="text-xs mt-2">
                    곧 쇼츠 페이지로 이동합니다...
                  </p>
                </div>
              ) : (
                <div>
                  <p className="font-medium">❌ 오류 발생</p>
                  <p className="text-sm mt-1">{result.error}</p>
                </div>
              )}
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              💡 이후부터는 10분마다 자동으로 동기화됩니다.
            </p>
            <div className="mt-4 space-y-2">
              <a
                href="/shorts"
                className="block text-sm text-blue-600 hover:underline dark:text-blue-400"
              >
                → 쇼츠 페이지로 가기
              </a>
              <a
                href="/"
                className="block text-sm text-slate-600 hover:underline dark:text-slate-400"
              >
                → 메인으로 돌아가기
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

