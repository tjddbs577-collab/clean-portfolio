export async function GET() {
  const API_KEY = process.env.YOUTUBE_API_KEY;
  const PLAYLIST_ID = process.env.YOUTUBE_PLAYLIST_ID;

  if (!API_KEY || !PLAYLIST_ID) {
    return new Response(
      JSON.stringify({ error: "Missing API key or playlist ID" }),
      { status: 500 }
    );
  }

  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${PLAYLIST_ID}&maxResults=10&key=${API_KEY}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    const text = await res.text();
    return new Response(
      JSON.stringify({ error: "YouTube API failed", detail: text }),
      { status: 500 }
    );
  }

  const data = await res.json();

  const shorts = data.items.map((item: any) => ({
    id: item.snippet.resourceId.videoId,
    title: item.snippet.title,
  }));

  return Response.json(shorts);
}

