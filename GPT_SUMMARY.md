# GPT에게 전달할 프로젝트 설명

## 프로젝트 개요
Next.js 16 App Router + TypeScript + Tailwind CSS 기반 포트폴리오 웹사이트입니다. YouTube 쇼츠를 자동으로 수집하고 표시하는 기능이 포함되어 있습니다.

## 최근 완료한 주요 작업

### 1. YouTube 쇼츠 자동 수집 시스템 구축
- **크론 작업**: `/api/cron/sync-shorts` 엔드포인트 생성
  - YouTube Data API v3로 채널의 최신 영상 50개 수집
  - 필터링: duration ≤ 60초, embeddable, public 영상만 쇼츠로 판별
  - 쇼츠 데이터 처리
  - Secret 기반 인증 (`SHORTS_SYNC_SECRET`)
  
- **데이터 조회**: `core/logic/getShorts.ts`
  - KV에서 쇼츠 데이터 읽기
  - `getShorts()`: 전체 목록 반환
  - `getLatestShorts(n)`: 최신 N개 반환

- **크론 스케줄**: `vercel.json`에 30분마다 자동 실행 설정

### 2. 쇼츠 페이지 UI 개선 (`/shorts`)
- 유튜브 썸네일을 `next/image`로 표시 (초기 로딩 최적화)
- 카드 클릭 시 모달 열어서 선택한 영상만 iframe 로드
- Flexbox 기반 반응형 그리드 (모바일 퍼스트)
- 9:16 비율 유지, 중앙 정렬, hover 효과

### 3. 디버깅 및 모니터링 도구 추가
- `/api/shorts`: 쇼츠 데이터 확인
- 쇼츠 페이지에 데이터가 없을 때 해결 방법 안내 추가

### 4. 코드 정리 및 최적화
- 불필요한 파일 삭제 (`app/api/youtube-shorts/route.ts` - KV로 대체)
- 빈 폴더 정리 (`app/template/`)
- 사용하지 않는 문서 파일 정리

## 기술 스택
- **프레임워크**: Next.js 16.1.0 (App Router)
- **언어**: TypeScript 5
- **스타일링**: Tailwind CSS 4
- **스토리지**: 메모리 (임시)
- **외부 API**: YouTube Data API v3
- **배포**: Vercel (크론 작업 포함)

## 프로젝트 구조
```
app/
  page.tsx                      # 메인 페이지 (Hero + 쇼츠 섹션)
  portfolio/page.tsx            # 포트폴리오 리스트
  shorts/page.tsx               # 쇼츠 전체 목록 (썸네일 + 모달)
  api/
    cron/sync-shorts/route.ts   # 크론 작업 (YouTube API → KV)
components/
  ProjectCard.tsx               # 프로젝트 카드 컴포넌트
  ShortsGrid.tsx                # 쇼츠 그리드 (클라이언트, 모달 포함)
core/
  data/mock.ts                  # 프로젝트 mock 데이터
  logic/
    getProjects.ts              # 프로젝트 조회 로직
    getShorts.ts                # 쇼츠 조회 로직
```

## 핵심 아키텍처
- **Core Logic 분리**: `core/` 폴더에서 비즈니스 로직 관리
- **UI 컴포넌트**: `components/`에서 프레젠테이션만 담당
- **데이터 플로우**: YouTube API → 크론 작업 → `getShorts()` → UI
- **성능 최적화**: 썸네일만 초기 로드, 클릭한 영상만 iframe 로드

## 환경 변수
필수 환경 변수:
- `YOUTUBE_API_KEY`: YouTube Data API v3 키
- `YOUTUBE_CHANNEL_ID`: 대상 채널 ID
- `SHORTS_SYNC_SECRET`: 크론 작업 인증 시크릿

## 주요 특징
1. **자동화**: 크론 작업으로 YouTube에서 자동 수집 및 KV 저장
2. **성능**: 썸네일만 초기 로드, 선택한 영상만 iframe 로드
3. **반응형**: 모바일 퍼스트, Flexbox 기반 그리드
4. **타입 안전성**: TypeScript로 전체 프로젝트 타입 관리
5. **로컬 개발 지원**: 크론 작업 수동 실행 가능 (`?secret=...`)

## 현재 상태 및 이슈
- **정상 동작**: Vercel 배포 시 크론 작업이 30분마다 자동 실행됨
- **로컬 개발**: 크론 작업을 수동으로 실행 가능
- **데이터 플로우**: YouTube API → 크론 → `getShorts()` → 페이지 표시

## 문서
- `PROJECT_SUMMARY.md`: 프로젝트 전체 요약
- `ENV_SETUP.md`: 환경 변수 설정 가이드
- `CRON_MANUAL_EXEC.md`: 크론 작업 수동 실행 가이드
- `TROUBLESHOOTING.md`: 문제 해결 가이드

