# GPT에게 Fetch 경로 문제 설명하기

## 상황 설명

### 현재 문제
`core/logic/getShorts.ts` 파일에서 fetch를 사용하려고 하는데, 올바른 경로를 찾지 못하고 있습니다.

### 현재 코드 상태
```typescript
// core/logic/getShorts.ts
export async function getShorts(): Promise<Video[]> {
  return [];
}
```
- 현재는 빈 배열을 반환함
- **fetch 호출이 없음**

### 원하는 것
YouTube Data API v3를 직접 호출하는 fetch 경로를 찾아서 `getShorts.ts`에서 사용하고 싶습니다.

---

## 질문 예시 1 (간단한 버전)

```
Next.js 프로젝트에서 core/logic/getShorts.ts 파일을 수정하려고 해요.

현재 상태:
- getShorts.ts는 빈 배열을 반환함
- fetch를 사용하지 않음

원하는 것:
- getShorts.ts에서 YouTube Data API v3를 직접 fetch로 호출하고 싶어요
- 하지만 올바른 API 엔드포인트 URL을 찾지 못하고 있어요

질문:
1. YouTube Data API v3에서 채널의 최신 영상 목록을 가져오는 올바른 fetch URL은 무엇인가요?
2. 필요한 query parameters는 무엇인가요?
3. API 키는 어디에 포함해야 하나요?
4. 응답 형식은 어떻게 되나요?
```

---

## 질문 예시 2 (상세한 버전)

```
Next.js 프로젝트에서 YouTube 쇼츠를 가져오는 로직을 구현하려고 해요.

**현재 상황:**
- `core/logic/getShorts.ts` 파일이 있음
- 현재는 빈 배열을 반환함 (fetch 사용 안 함)
- `core/logic/syncShorts.ts`에는 YouTube API 호출 로직이 있지만, 이것은 크론 작업용

**문제:**
- getShorts.ts에서 직접 YouTube API를 호출하는 fetch 경로를 찾지 못하고 있어요

**원하는 것:**
- YouTube Data API v3를 사용해서 채널의 최신 영상 목록을 fetch로 가져오고 싶어요
- 필요한 것:
  1. 올바른 API 엔드포인트 URL
  2. 필요한 query parameters (part, channelId, maxResults 등)
  3. API 키를 어떻게 포함할지
  4. 응답에서 영상 목록을 어떻게 추출할지

**질문:**
1. YouTube Data API v3로 채널의 최신 영상 목록을 가져오는 완전한 fetch 예시를 보여주세요.
2. 예를 들어, channelId가 "UCxxxxx"이고 API 키가 "YOUR_API_KEY"일 때의 정확한 URL은?
3. 응답에서 videoId와 title을 추출하는 방법은?
```

---

## 질문 예시 3 (코드와 함께)

```
Next.js 프로젝트에서 YouTube Data API v3를 fetch로 호출하려고 하는데,
올바른 URL 경로를 찾지 못하고 있어요.

**현재 코드:**
```typescript
// core/logic/getShorts.ts
async function getShorts(): Promise<Video[]> {
  // 여기서 fetch를 사용하고 싶어요
  const response = await fetch(/* ??? 올바른 URL이 뭔가요? */);
  // ...
}
```

**필요한 정보:**
- 채널 ID: YOUTUBE_CHANNEL_ID
- API 키: YOUTUBE_API_KEY
- 가져올 것: 최신 영상 목록 (videoId, title)

**질문:**
1. YouTube Data API v3의 올바른 엔드포인트 URL은 무엇인가요?
2. 채널의 최신 영상을 가져오려면 어떤 API를 사용해야 하나요?
   - channels.list?
   - playlistItems.list?
   - videos.list?
3. 완전한 fetch 코드 예시를 보여주세요.
```

---

## 참고 정보 (GPT에게 제공하면 좋을 것)

### 환경 변수
```env
YOUTUBE_API_KEY=your_api_key
YOUTUBE_CHANNEL_ID=your_channel_id
```

### 현재 syncShorts.ts에서 사용하는 방식
```typescript
// 1. 채널 정보 가져오기
https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${apiKey}

// 2. 재생목록 아이템 가져오기
https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=50&key=${apiKey}

// 3. 영상 상세 정보 가져오기
https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet,status&id=${videoIds}&key=${apiKey}
```

### 참고하면 좋을 것
- 현재 `syncShorts.ts`에는 YouTube API 호출 로직이 있지만, 이것은 크론 작업용
- `getShorts.ts`에서 직접 호출하려면 어떤 방식이 좋을지?

---

## 가장 추천하는 질문 (명확하고 구체적)

```
Next.js 프로젝트에서 core/logic/getShorts.ts 파일에서 
YouTube Data API v3를 fetch로 직접 호출하려고 해요.

**현재:**
- getShorts.ts는 빈 배열 반환
- fetch 호출 없음

**원하는 것:**
- YouTube Data API v3로 채널의 최신 영상 목록을 fetch로 가져오기
- 채널 ID와 API 키는 환경 변수에서 가져옴

**질문:**
1. YouTube Data API v3에서 채널의 최신 업로드 영상 목록을 가져오는 
   완전한 fetch 코드 예시를 보여주세요.
2. 필요한 엔드포인트 URL과 query parameters는 무엇인가요?
3. 응답에서 videoId와 title을 추출하는 방법은?
```

