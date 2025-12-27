# 프로젝트 요약 (GPT에게 전달용)

## 프로젝트 개요
Next.js 16 App Router + TypeScript + Tailwind CSS 기반의 포트폴리오 웹사이트로, YouTube 쇼츠 자동 수집 및 표시 기능이 포함되어 있습니다.

## 주요 기능

### 1. 포트폴리오 페이지
- `/portfolio`: 프로젝트 카드 리스트 표시
- `core/data/mock.ts`에서 프로젝트 데이터 관리
- `components/ProjectCard.tsx`로 카드 UI 구현

### 2. YouTube 쇼츠 자동 수집 시스템
- **크론 작업**: `/api/cron/sync-shorts` (30분마다 자동 실행)
  - YouTube Data API v3로 채널의 업로드 재생목록에서 최신 영상 50개 수집
  - 필터링: duration ≤ 60초, embeddable, public 영상만
  - Vercel KV에 `shorts:latest` 키로 저장 (TTL 6시간)
  
- **데이터 조회**: `core/logic/getShorts.ts`
  - Vercel KV에서 쇼츠 데이터 읽기
  - `getShorts()`: 전체 쇼츠 목록
  - `getLatestShorts(n)`: 최신 N개

### 3. 쇼츠 페이지 (`/shorts`)
- 유튜브 썸네일을 `next/image`로 표시 (초기 로딩 최적화)
- 카드 클릭 시 모달 열어서 선택한 영상만 iframe 로드
- Flexbox 기반 반응형 그리드 (모바일 퍼스트)
- 모달: 배경 클릭 또는 X 버튼으로 닫기

### 4. 메인 페이지 (`/`)
- Hero 섹션
- 쇼츠 섹션 (제목 + "전체 쇼츠 보기" 링크만, 영상은 미표시)
- `/shorts` 페이지로 이동 가능

## 기술 스택
- **프레임워크**: Next.js 16.1.0 (App Router)
- **언어**: TypeScript 5
- **스타일링**: Tailwind CSS 4
- **스토리지**: Vercel KV (Redis)
- **배포**: Vercel (크론 작업 포함)

## 프로젝트 구조
```
app/
  page.tsx                    # 메인 페이지 (Hero + 쇼츠 섹션)
  portfolio/page.tsx          # 포트폴리오 리스트
  shorts/page.tsx             # 쇼츠 전체 목록 페이지
  api/
    cron/sync-shorts/route.ts # 크론 작업 (YouTube API → KV)
    kv-test/route.ts          # KV 연결 테스트 API
components/
  ProjectCard.tsx             # 프로젝트 카드 컴포넌트
  ShortsGrid.tsx              # 쇼츠 그리드 (클라이언트 컴포넌트, 모달 포함)
core/
  data/mock.ts                # 프로젝트 mock 데이터
  logic/
    getProjects.ts            # 프로젝트 조회 로직
    getShorts.ts              # 쇼츠 조회 로직 (KV에서 읽기)
```

## 핵심 아키텍처
- **Core Logic 분리**: `core/` 폴더에서 비즈니스 로직 관리
- **UI 컴포넌트**: `components/`에서 프레젠테이션만 담당
- **데이터 소스 교체 용이**: mock → API → DB로 확장 가능한 구조

## 환경 변수
- `YOUTUBE_API_KEY`: YouTube Data API v3 키
- `YOUTUBE_CHANNEL_ID`: 대상 채널 ID
- `SHORTS_SYNC_SECRET`: 크론 작업 인증 시크릿
- `KV_REST_API_URL`, `KV_REST_API_TOKEN`: Vercel KV 인증

## 주요 특징
1. **성능 최적화**: 썸네일만 초기 로드, 클릭한 영상만 iframe 로드
2. **자동화**: 크론 작업으로 YouTube에서 자동 수집 및 KV 저장
3. **반응형 디자인**: 모바일 퍼스트, Flexbox 기반 그리드
4. **타입 안전성**: TypeScript로 전체 프로젝트 타입 관리

