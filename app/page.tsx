import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="container mx-auto px-4 py-16">
        {/* HERO */}
        <div className="space-y-10">
          <div className="space-y-4 rounded-3xl border border-white/20 bg-white/80 p-10 shadow-sm backdrop-blur dark:bg-slate-900/60">
            <p className="text-sm uppercase tracking-[0.4em] text-slate-600 dark:text-slate-300">
              Creative Portfolio Template
            </p>
            <h1 className="text-4xl font-semibold leading-tight text-slate-900 dark:text-white md:text-5xl">
              포트폴리오를 “템플릿처럼” 빠르게 확장하는 구조
            </h1>
            <p className="max-w-2xl text-base leading-7 text-slate-700 dark:text-slate-300">
              core logic과 UI를 분리해 데이터 소스(mock → API → DB)를 바꿔도 UI는 그대로
              재사용할 수 있도록 설계했습니다. 협업/유지보수/판매에 모두 유리한 구조를
              목표로 합니다.
            </p>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <Link
                href="/portfolio"
                className="inline-flex h-12 items-center justify-center rounded-full bg-slate-900 px-6 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
              >
                포트폴리오 보기
              </Link>

              <Link
                href="/template"
                className="inline-flex h-12 items-center justify-center rounded-full border border-black/10 bg-transparent px-6 text-sm font-semibold text-slate-900 transition hover:bg-black/[.04] dark:border-white/20 dark:text-white dark:hover:bg-white/10"
              >
                템플릿 데모
              </Link>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              * “템플릿 데모”는 /template 페이지가 없으면 404가 뜰 수 있어요. (원하면 내가
              바로 만들어줄게)
            </p>
          </div>

          {/* FEATURES */}
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-white/20 bg-white/80 p-6 shadow-sm backdrop-blur dark:bg-slate-900/60">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                Core Logic 분리
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
                데이터 로직(core)과 UI(components)를 분리해서 유지보수와 교체가 쉽습니다.
              </p>
            </div>

            <div className="rounded-3xl border border-white/20 bg-white/80 p-6 shadow-sm backdrop-blur dark:bg-slate-900/60">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                판매/재사용 최적화
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
                mock → API → DB 전환이 쉬워서 템플릿으로 판매하거나 확장하기 좋습니다.
              </p>
            </div>

            <div className="rounded-3xl border border-white/20 bg-white/80 p-6 shadow-sm backdrop-blur dark:bg-slate-900/60">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                빠른 UI 작업
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
                Tailwind로 컴포넌트를 빠르게 만들고, 프로젝트 카드 같은 UI를 쉽게 확장합니다.
              </p>
            </div>
          </div>

          {/* FOOTER */}
          <footer className="pt-6 text-center text-xs text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} clean-portfolio — Next.js + Tailwind CSS
          </footer>
        </div>
      </div>
    </div>
  );
}
