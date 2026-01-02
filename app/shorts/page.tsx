// app/shorts/page.tsx
import Link from "next/link";

interface Video {
  id: string;
  title: string;
}

async function fetchShorts(): Promise<Video[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}/api/shorts`,
    { cache: "no-store" } // 항상 최신
  );

  if (!res.ok) {
    console.error("❌ failed to fetch /api/shorts");
    return [];
  }

  const json = await res.json();
  console.log("SHORTS API RESULT:", json);

  return json.videos ?? [];
}

export default async function ShortsPage() {
  const shorts = await fetchShorts();

  return (
    <main className="shorts-main">
      <Link href="/" className="text-sm text-gray-500">
        ← 메인으로 돌아가기
      </Link>

      <h1 className="mt-4 text-2xl font-bold">🎬 AI 자동화 쇼츠</h1>

      {shorts.length === 0 ? (
        <p className="mt-6 text-gray-400">
          아직 불러온 쇼츠가 없습니다.
        </p>
      ) : (
        <ul className="mt-6 space-y-3">
          {shorts.map((video) => (
            <li key={video.id} className="border p-3 rounded">
              <p className="font-medium">{video.title}</p>
              <a
                href={`https://www.youtube.com/watch?v=${video.id}`}
                target="_blank"
                className="text-sm text-blue-500 underline"
              >
                YouTube에서 보기
              </a>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

