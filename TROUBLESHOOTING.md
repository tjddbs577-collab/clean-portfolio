# 쇼츠 페이지 문제 해결 가이드

## 문제: "아직 플레이리스트에 영상이 없습니다" 메시지가 표시됨

### 원인
1. **KV에 데이터가 없음** - 크론 작업이 실행되지 않았거나 실패함
2. **환경 변수가 설정되지 않음** - YouTube API 키 또는 KV 설정 누락
3. **크론 작업이 아직 실행되지 않음** - 로컬 개발 환경에서는 수동 실행 필요

---

## 해결 방법

### 1단계: KV 데이터 확인

브라우저에서 다음 URL 접속:
```
http://localhost:3000/api/kv-check
```

**결과 해석:**
- `hasData: false` → KV에 데이터가 없음 (2단계로 진행)
- `hasData: true` → 데이터가 있지만 페이지에 표시되지 않음 (다른 문제)

### 2단계: 크론 작업 수동 실행 (데이터 수집)

#### 방법 A: 브라우저에서 직접 실행

1. `.env.local` 파일에서 `SHORTS_SYNC_SECRET` 값을 확인
2. 브라우저에서 다음 URL 접속:
```
http://localhost:3000/api/cron/sync-shorts?secret=YOUR_SECRET_HERE
```

#### 방법 B: 터미널에서 curl 실행

```bash
# .env.local의 SHORTS_SYNC_SECRET 값을 사용
curl -X GET "http://localhost:3000/api/cron/sync-shorts?secret=YOUR_SECRET_HERE"
```

**성공 응답 예시:**
```json
{
  "success": true,
  "count": 5,
  "updatedAt": 1704067200000
}
```

**실패 응답 예시:**
```json
{
  "error": "Unauthorized"
}
```
→ `SHORTS_SYNC_SECRET` 값이 일치하지 않음

```json
{
  "error": "Missing YOUTUBE_API_KEY or YOUTUBE_CHANNEL_ID"
}
```
→ 환경 변수가 설정되지 않음

### 3단계: 환경 변수 확인

`.env.local` 파일에 다음이 모두 설정되어 있어야 합니다:

```env
# YouTube API
YOUTUBE_API_KEY=your_api_key_here
YOUTUBE_CHANNEL_ID=your_channel_id_here

# 크론 작업 보안
SHORTS_SYNC_SECRET=your_secret_here

# Vercel KV (로컬 개발 시)
KV_REST_API_URL=https://your-kv-instance.vercel-storage.com
KV_REST_API_TOKEN=your_token_here
```

### 4단계: 쇼츠 페이지 다시 확인

크론 작업이 성공한 후:
```
http://localhost:3000/shorts
```
페이지를 새로고침하면 영상이 표시됩니다.

---

## 자주 묻는 질문

### Q: 로컬에서도 크론 작업을 자동으로 실행할 수 있나요?
A: 로컬 개발 환경에서는 자동 크론이 실행되지 않습니다. Vercel에 배포하면 `vercel.json`에 설정한 스케줄(30분마다)에 따라 자동으로 실행됩니다.

### Q: 크론 작업은 어떻게 실행되나요?
A:
1. **로컬 개발**: 수동으로 `/api/cron/sync-shorts?secret=...` 호출
2. **Vercel 배포**: `vercel.json`의 크론 스케줄에 따라 자동 실행 (30분마다)

### Q: YouTube API 할당량은 어떻게 되나요?
A: YouTube Data API v3는 기본적으로 일일 10,000 units 할당량이 있습니다. 크론 작업은 약 100 units를 사용하므로 일일 약 100회 실행 가능합니다.

### Q: KV 없이 로컬에서 테스트할 수 있나요?
A: 현재는 KV가 필수입니다. 로컬 개발 환경에서도 Vercel KV를 설정하거나, mock 데이터를 사용하도록 코드를 수정해야 합니다.

---

## 체크리스트

다음을 순서대로 확인하세요:

- [ ] `.env.local` 파일이 존재함
- [ ] `YOUTUBE_API_KEY` 설정됨
- [ ] `YOUTUBE_CHANNEL_ID` 설정됨
- [ ] `SHORTS_SYNC_SECRET` 설정됨
- [ ] `KV_REST_API_URL` 설정됨
- [ ] `KV_REST_API_TOKEN` 설정됨
- [ ] 개발 서버 실행 중 (`npm run dev`)
- [ ] 크론 작업 수동 실행 성공 (`/api/cron/sync-shorts?secret=...`)
- [ ] KV 데이터 확인 (`/api/kv-check`에서 `hasData: true`)
- [ ] 쇼츠 페이지 새로고침

---

## 빠른 진단 명령어

터미널에서 실행:

```bash
# 1. 환경 변수 확인 (값은 표시되지 않음)
cd /Users/choisungyun/커서ai/clean-portfolio
cat .env.local | grep -E "YOUTUBE_API_KEY|YOUTUBE_CHANNEL_ID|SHORTS_SYNC_SECRET|KV_" | cut -d'=' -f1

# 2. 개발 서버가 실행 중인지 확인
curl -s http://localhost:3000/api/kv-check | head -20

# 3. 크론 작업 실행 (SECRET 값을 직접 입력해야 함)
# curl -X GET "http://localhost:3000/api/cron/sync-shorts?secret=YOUR_SECRET"
```

