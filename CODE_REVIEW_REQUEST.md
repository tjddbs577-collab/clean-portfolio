# 코드 리뷰 요청 (GPT에게 전달용)

## 프로젝트 개요
Next.js 16 App Router + TypeScript 기반 프로젝트로, YouTube 쇼츠를 자동으로 수집하고 표시하는 기능을 구현했습니다.

## 주요 구현 내용

### 1. YouTube 쇼츠 자동 수집 시스템
- YouTube Data API v3로 채널의 최신 영상 50개 수집
- duration ≤ 60초, embeddable, public 영상만 필터링
- Vercel KV(Redis)에 저장 (TTL 6시간)
- 크론 작업으로 10분마다 자동 동기화

## 검토 요청 사항

### 1. 공통 로직 함수 (`core/logic/syncShorts.ts`)
```typescript
// 핵심 질문: 이 함수의 로직이 올바른가요?
// - YouTube API 호출 순서가 적절한가요?
// - duration 파싱 로직이 정확한가요?
// - 에러 처리가 충분한가요?
// - 타입 정의가 올바른가요?
```

### 2. API 엔드포인트 구조
- `/api/cron/sync-shorts/route.ts`: 크론 작업용 (Secret 검증)
- `/admin/sync/route.ts`: 관리자 페이지용 (Secret 검증 없음)

### 3. 데이터 흐름
YouTube API → syncShorts() → Vercel KV → getShorts() → UI

## 질문할 내용

1. **로직 검증**: `syncShorts.ts`의 YouTube API 호출 및 필터링 로직이 올바른지 확인
2. **에러 처리**: 에러 케이스들이 적절하게 처리되었는지 확인
3. **타입 안전성**: TypeScript 타입 정의가 올바른지 확인
4. **성능**: API 호출 최적화 여부 확인
5. **보안**: Secret 검증 로직이 안전한지 확인

## 파일 구조
```
core/logic/
  ├── syncShorts.ts      # YouTube API 호출 및 KV 저장 (공통 로직)
  └── getShorts.ts       # KV에서 쇼츠 데이터 읽기

app/api/
  ├── cron/sync-shorts/route.ts  # 크론 작업 엔드포인트
  └── admin/sync/route.ts        # 관리자 동기화 엔드포인트
```

## 확인 방법
GPT에게 다음 질문을 하면 됩니다:

"다음 Next.js 프로젝트의 YouTube 쇼츠 자동 수집 로직을 검토해주세요.
핵심 파일은 `core/logic/syncShorts.ts`인데, 이 코드의 로직이 올바른지,
에러 처리가 충분한지, 타입 정의가 정확한지 확인해주세요."

