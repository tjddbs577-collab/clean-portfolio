# 크론 작업 수동 실행 가이드

## 크론 작업 파일 위치

**파일**: `app/api/cron/sync-shorts/route.ts`
- Next.js App Router의 API Route
- GET 메서드로 실행

**크론 설정**: `vercel.json`
- 경로: `/api/cron/sync-shorts`
- 스케줄: 30분마다 (`*/30 * * * *`)

---

## 수동 실행 방법

### 1. Vercel 배포 환경에서 실행

#### 방법 A: curl (Query Parameter)
```bash
curl -X GET "https://your-domain.vercel.app/api/cron/sync-shorts?secret=YOUR_SHORTS_SYNC_SECRET"
```

#### 방법 B: curl (Header)
```bash
curl -X GET "https://your-domain.vercel.app/api/cron/sync-shorts" \
  -H "x-cron-secret: YOUR_SHORTS_SYNC_SECRET"
```

#### 방법 C: Vercel 대시보드
1. Vercel 대시보드 > 프로젝트 > Functions
2. `/api/cron/sync-shorts` 찾기
3. "Test" 버튼 클릭 (secret은 환경 변수에서 자동 사용)

---

### 2. 로컬 Node 환경에서 실행

#### 방법 A: Next.js 개발 서버 실행 후 호출
```bash
# 1. 개발 서버 실행
npm run dev

# 2. 새 터미널에서 실행
curl -X GET "http://localhost:3000/api/cron/sync-shorts?secret=YOUR_SHORTS_SYNC_SECRET"
```

#### 방법 B: Node.js 스크립트로 직접 실행

`scripts/run-sync-shorts.js` 파일 생성:
```javascript
// scripts/run-sync-shorts.js
import { config } from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// .env.local 로드
config({ path: join(__dirname, '../.env.local') });

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const secret = process.env.SHORTS_SYNC_SECRET;

if (!secret) {
  console.error('❌ SHORTS_SYNC_SECRET이 설정되지 않았습니다.');
  process.exit(1);
}

async function runSync() {
  try {
    const url = `${baseUrl}/api/cron/sync-shorts?secret=${secret}`;
    console.log(`🔄 크론 작업 실행 중: ${url}`);
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ 성공:', data);
    } else {
      console.error('❌ 실패:', data);
    }
  } catch (error) {
    console.error('❌ 에러:', error);
  }
}

runSync();
```

실행:
```bash
node scripts/run-sync-shorts.js
```

---

## KV에 저장되는 데이터 구조

### 저장 키 (Key)
```
shorts:latest
```

### 저장 데이터 (Value)

```typescript
interface ShortsData {
  videos: Video[];        // 쇼츠 영상 배열
  updatedAt: number;      // 업데이트 타임스탬프 (Unix timestamp)
}

interface Video {
  id: string;            // 유튜브 영상 ID (예: "abc123xyz")
  title: string;         // 영상 제목
}
```

### 실제 저장 예시

```json
{
  "videos": [
    {
      "id": "dQw4w9WgXcQ",
      "title": "영상 제목 1"
    },
    {
      "id": "jNQXAC9IVRw",
      "title": "영상 제목 2"
    }
  ],
  "updatedAt": 1704067200000
}
```

### 저장 옵션
- **TTL (Time To Live)**: 21600초 (6시간)
- **설정 위치**: `app/api/cron/sync-shorts/route.ts` 149번 줄
  ```typescript
  await kv.set("shorts:latest", shortsData, { ex: 21600 });
  ```

---

## 필터링 조건

크론 작업이 KV에 저장하기 전에 필터링하는 조건:

1. **duration ≤ 60초**: 영상 길이가 60초 이하
2. **embeddable = true**: 임베드 가능한 영상
3. **privacyStatus = "public"**: 공개 영상

이 조건을 모두 만족하는 영상만 `videos` 배열에 포함됩니다.

---

## 실행 결과 확인

### 성공 응답
```json
{
  "success": true,
  "count": 5,
  "updatedAt": 1704067200000
}
```

### 에러 응답
```json
{
  "error": "Unauthorized"
}
// 또는
{
  "error": "Missing YOUTUBE_API_KEY or YOUTUBE_CHANNEL_ID"
}
```

---

## 주의사항

1. **Secret 필수**: `SHORTS_SYNC_SECRET` 환경 변수가 반드시 설정되어 있어야 합니다.
2. **환경 변수**: 다음 환경 변수들이 모두 설정되어 있어야 정상 동작합니다:
   - `YOUTUBE_API_KEY`
   - `YOUTUBE_CHANNEL_ID`
   - `SHORTS_SYNC_SECRET`
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
3. **API 할당량**: YouTube Data API v3는 일일 할당량이 있으므로 과도한 실행은 피하세요.

