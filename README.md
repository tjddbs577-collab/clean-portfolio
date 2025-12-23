BEGIN

Clean Portfolio Template (Next.js)
소개 (KR)

Clean Portfolio Template은 Next.js(App Router) 기반의 포트폴리오 템플릿입니다.
핵심 목표는 core logic(데이터/비즈니스 로직) 과 UI 컴포넌트를 분리해서, 데이터 소스를 mock → API → DB로 바꿔도 UI를 그대로 재사용할 수 있게 만드는 것입니다.

Overview (EN)

Clean Portfolio Template is a Next.js (App Router) portfolio template.
It separates core logic (data/business rules) from UI components, so you can swap data sources (mock → API → DB) without rewriting UI.

주요 특징 (KR)

Core Logic Layer 분리: core/에서 데이터/로직 관리, components/는 화면만 담당

데이터 소스 교체 용이: mock 데이터에서 API/DB로 단계적 확장 가능

판매/재사용 친화 구조: 템플릿으로 배포/판매하기 좋게 구성

Tailwind 기반 UI: 빠른 커스터마이징과 일관된 스타일

Features (EN)

Core Logic Layer: core/ for data/logic, components/ for presentation

Easy Data Source Swapping: mock → API → DB with minimal changes

Template-ready Structure: suitable for distribution and resale

Tailwind UI: fast customization with consistent styling

기술 스택 (KR)

Next.js (App Router)

TypeScript

Tailwind CSS

Tech Stack (EN)

Next.js (App Router)

TypeScript

Tailwind CSS

빠른 시작 (KR)

의존성 설치

npm install


개발 서버 실행

npm run dev


빌드 / 실행

npm run build
npm run start

Turbopack 오류가 날 때 (KR)

일부 환경에서 Turbopack 런타임 오류가 날 수 있습니다. 그 경우 webpack 모드로 실행하세요.

npm run dev -- --webpack

Quick Start (EN)

Install dependencies

npm install


Start dev server

npm run dev


Build / Start

npm run build
npm run start

If Turbopack fails (EN)

If you hit a Turbopack runtime error, run in webpack mode:

npm run dev -- --webpack

프로젝트 구조 (KR)
app/
  page.tsx                # 랜딩(소개/버튼) 또는 홈
  portfolio/page.tsx      # 포트폴리오 리스트
  template/page.tsx       # (선택) 템플릿 데모 페이지
components/
  ProjectCard.tsx         # 프로젝트 카드 UI
core/
  data/mock.ts            # mockProjects 데이터 + Project 타입
  logic/getProjects.ts    # 데이터 조회 로직 (mock → API로 교체 포인트)
public/                   # 이미지/정적 파일

Project Structure (EN)
app/
  page.tsx                # Landing/home
  portfolio/page.tsx      # Portfolio list
  template/page.tsx       # (Optional) Template demo page
components/
  ProjectCard.tsx         # Project card UI
core/
  data/mock.ts            # mockProjects data + Project type
  logic/getProjects.ts    # Fetch logic (swap point for API/DB)
public/                   # Images/static assets

데이터 수정 방법 (KR)
1) 프로젝트 데이터 바꾸기

core/data/mock.ts의 mockProjects를 수정하세요.

2) API로 바꾸기(확장)

core/logic/getProjects.ts에서 mockProjects 대신 API 호출로 교체하면 됩니다. UI는 그대로 재사용됩니다.

Data Editing (EN)
1) Edit portfolio data

Update mockProjects in core/data/mock.ts.

2) Swap to an API

Replace mockProjects with an API call inside core/logic/getProjects.ts. UI stays unchanged.

커스터마이징 (KR)

랜딩 페이지: app/page.tsx

포트폴리오 페이지 문구: app/portfolio/page.tsx

카드 UI: components/ProjectCard.tsx

Customization (EN)

Landing page: app/page.tsx

Portfolio copy: app/portfolio/page.tsx

Card UI: components/ProjectCard.tsx

배포 (KR)

Vercel 배포를 권장합니다.

npm run build가 정상 통과되면 대부분의 플랫폼에 배포 가능합니다.

Deployment (EN)

Vercel is recommended.

If npm run build succeeds, you can deploy to most platforms.

라이선스 (KR)

판매/배포 정책에 맞춰 라이선스를 설정하세요. (예: 개인/상업 사용, 재배포 금지 등)

License (EN)

Define a license that matches your distribution/sales policy (personal/commercial use, redistribution rules, etc.).
END