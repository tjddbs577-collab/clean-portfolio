import Link from "next/link";

const pricing = {
  title: "Clean Portfolio Template",
  price: "₩19,000",
  note: "1회 결제 · 소스코드 제공",
};

const bullets = [
  {
    title: "Core Logic 분리 구조",
    desc: "데이터/비즈니스 로직(core)과 UI(components)를 분리해 유지보수와 확장이 쉽습니다.",
  },
  {
    title: "데이터 소스 교체 용이",
    desc: "mock → API → DB로 단계적으로 전환해도 UI를 그대로 재사용할 수 있습니다.",
  },
  {
    title: "판매/재사용 최적화",
    desc: "템플릿 배포를 염두에 둔 폴더 구조와 문서(README)로 빠른 온보딩이 가능합니다.",
  },
];

const included = [
  "Next.js(App Router) + TypeScript + Tailwind 기본 세팅",
  "Landing(/) + Portfolio(/portfolio) + Template(/template) 페이지",
  "core/data(mock) + core/logic(getProjects) 구조",
  "ProjectCard UI 컴포넌트(태그/링크 포함)",
  "README(설치/구조/커스터마이징 가이드) 기본 제공",
];

const notIncluded = [
  "실제 프로젝트 이미지/실제 사례 데이터(샘플 데이터는 포함)",
  "백엔드 API/DB 연결(확장 가이드는 제공 가능)",
  "커스텀 디자인 의뢰/브랜딩 작업(별도 문의)",
];

const license = [
  "구매자 본인/팀의 프로젝트에 상업적 사용 가능",
  "템플릿 원본/소스 그대로 재판매·재배포 금지",
  "수정 후 결과물(최종 사이트) 배포/판매는 가능(원본 템플릿 재배포는 불가)",
];

const support = [
  "설치/실행 관련 기본 문제: 로그 기반 안내",
  "커스터마이징 방향 제안: 간단 가이드 제공",
  "대규모 기능 추가/디자인 수정 작업은 별도 견적",
];

export default function TemplateSalesPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="container mx-auto px-4 py-12">
        {/* HERO */}
        <div className="space-y-10">
          <div className="rounded-3xl border border-white/20 bg-white/80 p-10 shadow-sm backdrop-blur dark:bg-slate-900/60">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="space-y-3">
                <p className="text-sm uppercase tracking-[0.4em] text-slate-600 dark:text-slate-300">
                  Template Demo
                </p>
                <h1 className="text-4xl font-semibold leading-tight text-slate-900 dark:text-white md:text-5xl">
                  {pricing.title}
                </h1>
                <p className="max-w-2xl text-sm leading-6 text-slate-700 dark:text-slate-300">
                  core logic과 UI를 분리한 구조로, 데이터를 바꿔도 UI는 그대로 재사용할 수
                  있게 설계된 포트폴리오 템플릿입니다. 빠르게 데모를 띄우고, 쉽게 확장해서
                  실제 서비스/포트폴리오로 연결하세요.
                </p>
              </div>

              <div className="rounded-2xl border border-black/10 bg-white/70 p-6 text-right dark:border-white/10 dark:bg-black/20">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                  Price
                </p>
                <p className="mt-1 text-3xl font-semibold text-slate-900 dark:text-white">
                  {pricing.price}
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {pricing.note}
                </p>

                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <Link
                    href="/portfolio"
                    className="inline-flex h-11 items-center justify-center rounded-full bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                  >
                    포트폴리오 미리보기
                  </Link>
                  <a
                    href="#buy"
                    className="inline-flex h-11 items-center justify-center rounded-full border border-black/10 bg-transparent px-5 text-sm font-semibold text-slate-900 transition hover:bg-black/[.04] dark:border-white/20 dark:text-white dark:hover:bg-white/10"
                  >
                    구매 안내 보기
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* FEATURES */}
          <div className="grid gap-6 md:grid-cols-3">
            {bullets.map((b) => (
              <div
                key={b.title}
                className="rounded-3xl border border-white/20 bg-white/80 p-6 shadow-sm backdrop-blur dark:bg-slate-900/60"
              >
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  {b.title}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
                  {b.desc}
                </p>
              </div>
            ))}
          </div>

          {/* INCLUDED / NOT INCLUDED */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-white/20 bg-white/80 p-8 shadow-sm backdrop-blur dark:bg-slate-900/60">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                포함 사항
              </h2>
              <ul className="mt-4 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                {included.map((t) => (
                  <li key={t} className="flex gap-2">
                    <span className="mt-0.5">✅</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-white/20 bg-white/80 p-8 shadow-sm backdrop-blur dark:bg-slate-900/60">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                미포함 사항
              </h2>
              <ul className="mt-4 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                {notIncluded.map((t) => (
                  <li key={t} className="flex gap-2">
                    <span className="mt-0.5">⚠️</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* LICENSE / SUPPORT */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-white/20 bg-white/80 p-8 shadow-sm backdrop-blur dark:bg-slate-900/60">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                라이선스 요약
              </h2>
              <ul className="mt-4 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                {license.map((t) => (
                  <li key={t} className="flex gap-2">
                    <span className="mt-0.5">📌</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
                * 최종 라이선스 문구는 판매 채널 정책에 맞춰 README/판매 페이지에 명시하세요.
              </p>
            </div>

            <div className="rounded-3xl border border-white/20 bg-white/80 p-8 shadow-sm backdrop-blur dark:bg-slate-900/60">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                지원 범위
              </h2>
              <ul className="mt-4 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                {support.map((t) => (
                  <li key={t} className="flex gap-2">
                    <span className="mt-0.5">🛠️</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* CTA */}
          <div
            id="buy"
            className="rounded-3xl border border-white/20 bg-white/80 p-10 shadow-sm backdrop-blur dark:bg-slate-900/60"
          >
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
                  구매 안내
                </h2>
                <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">
                  판매 링크/결제 페이지가 준비되면 아래 버튼에 연결하세요. 현재는 데모용
                  버튼입니다.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href="#"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-slate-900 px-6 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                >
                  구매하기(링크 연결)
                </a>
                <Link
                  href="/"
                  className="inline-flex h-12 items-center justify-center rounded-full border border-black/10 bg-transparent px-6 text-sm font-semibold text-slate-900 transition hover:bg-black/[.04] dark:border-white/20 dark:text-white dark:hover:bg-white/10"
                >
                  홈으로
                </Link>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-black/10 bg-white/70 p-5 dark:border-white/10 dark:bg-black/20">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                  Setup
                </p>
                <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                  README대로 3분 설치 · 바로 실행
                </p>
              </div>
              <div className="rounded-2xl border border-black/10 bg-white/70 p-5 dark:border-white/10 dark:bg-black/20">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                  Custom
                </p>
                <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                  mock 데이터만 바꿔도 즉시 커스텀
                </p>
              </div>
              <div className="rounded-2xl border border-black/10 bg-white/70 p-5 dark:border-white/10 dark:bg-black/20">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                  Scale
                </p>
                <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                  API/DB로 확장해도 UI 재사용
                </p>
              </div>
            </div>
          </div>

          <footer className="pt-2 text-center text-xs text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} clean-portfolio — Template Demo
          </footer>
        </div>
      </div>
    </div>
  );
}
