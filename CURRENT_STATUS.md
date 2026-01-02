# 프로젝트 현재 상태 (GPT에게 전달용)

## 프로젝트 개요
Next.js 16 App Router + TypeScript 기반 포트폴리오 웹사이트입니다. YouTube 쇼츠를 수집하고 표시하는 기능이 있습니다.

## 현재 구현 상태

### ✅ 완료된 부분

#### 1. YouTube 쇼츠 수집 로직 (`core/logic/syncShorts.ts`)
- YouTube Data API v3로 채널의 최신 영상 50개 수집
- 필터링: duration ≤ 60초, embeddable, public 영상만
- **저장소**: 서버 메모리 (변수로 저장)
- 1분 이내 재호출 방지 로직 있음

#### 2. 쇼츠 조회 로직 (`core/logic/getShorts.ts`)
- `getShorts()`: 전체 쇼츠 목록 반환
- `getLatestShorts(n)`: 최신 N개 반환
- **자동 동기화**: 메모리가 비어있으면 자동으로 `syncShorts()` 호출

#### 3. API 엔드포인트 (`app/api/shorts/route.ts`)
- `GET /api/shorts`: 쇼츠 데이터 반환
- 내부에서 `getShorts()` 호출 → 자동 sync 발생

#### 4. UI 페이지
- `/shorts` 페이지: 쇼츠 목록 표시 (썸네일 + 모달)
- 메인 페이지: 최신 쇼츠 섹션

### ⚠️ 현재 구조의 특징

1. **메모리 기반 저장소**
   - 서버 재시작 시 데이터 초기화됨
   - 영구 저장소 없음

2. **자동 동기화 방식**
   - `getShorts()` 호출 시 메모리가 비어있으면 자동 sync
   - 수동 크론 작업 없음

3. **크론 작업 삭제됨**
   - `app/api/cron/sync-shorts/route.ts` 삭제됨
   - `app/api/admin/sync/route.ts` 삭제됨
   - `vercel.json`의 크론 설정 비어있음

## 현재 파일 구조

```
core/logic/
  ├── syncShorts.ts    # YouTube API 호출 + 메모리 저장
  ├── getShorts.ts     # 메모리에서 읽기 + 자동 sync
  └── getProjects.ts   # 포트폴리오 프로젝트 조회

app/api/
  └── shorts/
      └── route.ts     # GET /api/shorts 엔드포인트

app/
  ├── page.tsx         # 메인 페이지
  ├── shorts/page.tsx  # 쇼츠 목록 페이지
  └── portfolio/page.tsx  # 포트폴리오 페이지

components/
  ├── ShortsGrid.tsx   # 쇼츠 그리드 컴포넌트
  └── ProjectCard.tsx  # 프로젝트 카드 컴포넌트
```

## 핵심 코드 흐름

### 1. 쇼츠 수집 (`syncShorts.ts`)
```typescript
// 메모리 변수
let MEMORY_SHORTS: Video[] = [];
let LAST_UPDATED = 0;

// YouTube API 호출 → 필터링 → 메모리에 저장
export async function syncShorts() {
  // 1. 채널 정보 가져오기
  // 2. 재생목록 가져오기
  // 3. 영상 상세 정보 가져오기
  // 4. 60초 이하 영상만 필터링
  // 5. MEMORY_SHORTS에 저장
}
```

### 2. 쇼츠 조회 (`getShorts.ts`)
```typescript
export async function getShorts(): Promise<Video[]> {
  let shorts = getMemoryShorts();
  
  // 메모리가 비어있으면 자동 동기화
  if (shorts.length === 0) {
    await syncShorts();
    shorts = getMemoryShorts();
  }
  
  return shorts;
}
```

## 현재 문제점 및 개선 필요 사항

### 🔴 주요 문제

1. **데이터 영구 저장 안 됨**
   - 서버 재시작 시 모든 데이터 초기화
   - 배포 시마다 데이터 사라짐

2. **자동 갱신 없음**
   - 크론 작업이 없어서 주기적 동기화 안 됨
   - 페이지 접속할 때만 동기화됨

3. **성능 문제 가능성**
   - 매번 API 호출 시 YouTube API 호출 가능 (1분 제한 있지만)
   - 여러 사용자가 동시 접속 시 중복 API 호출 가능

### ⚠️ 개선이 필요한 부분

1. **저장소 변경 필요**
   - 메모리 → 영구 저장소 (예: 데이터베이스, 파일 시스템, 외부 저장소)

2. **크론 작업 복구 필요**
   - 주기적 자동 동기화를 위한 크론 작업 필요
   - 또는 다른 자동 갱신 방식 필요

3. **동시성 처리**
   - 여러 요청이 동시에 syncShorts() 호출하는 것 방지 필요

## 환경 변수

필수:
- `YOUTUBE_API_KEY`: YouTube Data API v3 키
- `YOUTUBE_CHANNEL_ID`: 대상 채널 ID

## 의존성

```json
{
  "dependencies": {
    "next": "16.1.0",
    "react": "19.2.3",
    "react-dom": "19.2.3"
  }
}
```

**주요 패키지:**
- Next.js 16 App Router
- TypeScript
- Tailwind CSS
- **KV/Redis 관련 패키지 없음** (모두 제거됨)

## 질문할 내용

1. **저장소 개선**: 메모리 저장소를 영구 저장소로 변경하는 방법
   - 어떤 저장소를 사용할지? (DB, 파일, 외부 서비스 등)
   - 구현 방법은?

2. **자동 갱신 구현**: 크론 작업 없이 주기적 동기화 방법
   - Next.js에서 크론 작업 구현 방법
   - 또는 다른 자동 갱신 방식

3. **동시성 처리**: 여러 요청 시 중복 API 호출 방지
   - Lock 메커니즘 구현 방법

4. **코드 검토**: 현재 구현된 로직이 올바른지 확인
   - YouTube API 호출 순서
   - 필터링 로직
   - 에러 처리

---

## GPT에게 질문할 때 사용할 템플릿

```
Next.js 16 App Router 프로젝트에서 YouTube 쇼츠를 수집하고 표시하는 기능을 구현했어요.

**현재 상태:**
- YouTube Data API v3로 쇼츠 수집 (60초 이하 필터링)
- 서버 메모리에 저장 (변수로)
- getShorts() 호출 시 자동 동기화
- 크론 작업 없음

**문제점:**
1. 서버 재시작 시 데이터 초기화됨 (영구 저장 안 됨)
2. 주기적 자동 갱신 없음 (페이지 접속 시에만 동기화)
3. 동시 요청 시 중복 API 호출 가능

**질문:**
1. 메모리 저장소를 영구 저장소로 변경하려면 어떻게 해야 하나요?
2. 크론 작업 없이 주기적 자동 동기화를 구현하는 방법은?
3. 동시 요청 시 중복 API 호출을 방지하는 방법은?
4. 현재 구현된 코드를 검토해주세요.
```

