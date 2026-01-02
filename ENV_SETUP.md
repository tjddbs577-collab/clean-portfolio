# 환경 변수 설정 가이드

## 필수 환경 변수

### YouTube Data API v3
- `YOUTUBE_API_KEY`: YouTube Data API v3 키
  - [Google Cloud Console](https://console.cloud.google.com/)에서 생성
  - YouTube Data API v3 활성화 필요

- `YOUTUBE_CHANNEL_ID`: 대상 YouTube 채널 ID
  - 채널 URL에서 확인 가능 (예: `UCxxxxxxxxxxxxxxxxxxxxxxx`)
  - 또는 채널 설정 > 고급 설정에서 확인

### 크론 작업 보안
- `SHORTS_SYNC_SECRET`: 크론 작업 인증을 위한 시크릿 키
  - 임의의 긴 문자열 사용 (예: `openssl rand -hex 32`)
  - Vercel 환경 변수에 설정


## 로컬 개발 환경 설정

`.env.local` 파일 생성:

```env
YOUTUBE_API_KEY=your_api_key_here
YOUTUBE_CHANNEL_ID=your_channel_id_here
SHORTS_SYNC_SECRET=your_secret_here

```

## Vercel 배포 시 설정

1. Vercel 대시보드 > 프로젝트 > Settings > Environment Variables에서 위의 환경 변수들을 모두 설정
2. 크론 작업은 Vercel 배포 시 자동으로 활성화됩니다.
   - 기본 스케줄: 30분마다 (`*/30 * * * *`)
   - 변경하려면 `vercel.json`의 `schedule` 값을 수정하세요.
   - **주의**: Vercel 크론은 내부 네트워크를 통해 호출되므로 보안이 유지됩니다.

## 크론 작업 수동 실행 (테스트용)

```bash
# Query parameter로 secret 전달
curl -X GET "https://your-domain.vercel.app/api/cron/sync-shorts?secret=YOUR_SECRET"

# 또는 Header로 secret 전달
curl -X GET "https://your-domain.vercel.app/api/cron/sync-shorts" \
  -H "x-cron-secret: YOUR_SECRET"
```


