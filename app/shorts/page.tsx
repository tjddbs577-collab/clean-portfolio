import Link from "next/link";

interface Video {
  id: string;
  title: string;
}

async function fetchShorts(): Promise<Video[]> {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ??
    "https://clean-portfolio-pink.vercel.app";

  const res = await fetch(`${baseUrl}/api/shorts`, {
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("❌ failed to fetch /api/shorts");
    return [];
  }

  const json = await res.json();
  return json.videos ?? [];
}

export default async function ShortsPage() {
  const shorts = await fetchShorts();

  return (
    <main className="shorts-main max-w-md mx-auto px-4">
      <Link href="/" className="text-sm text-gray-500">
        ← 메인으로 돌아가기
      </Link>

      <h1 className="mt-4 text-2xl font-bold">🎬 AI 자동화 쇼츠</h1>

      {shorts.length === 0 ? (
        <p className="mt-6 text-gray-400">
          아직 불러온 쇼츠가 없습니다.
        </p>
      ) : (
        <ul className="mt-6 space-y-8">
          {shorts.map((video) => (
            <li key={video.id} className="border rounded-lg p-3">
              {/* 🎥 쇼츠 영상 */}
              <iframe
                width="100%"
                height="640"
                src={`https://www.youtube.com/embed/${video.id}`}
                title={video.title}
                className="rounded"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />

              {/* 제목 */}
              <p className="mt-2 font-medium">{video.title}</p>

              {/* 유튜브 이동 */}
              <a
                href={`https://www.youtube.com/watch?v=${video.id}`}
                target="_blank"
                rel="noopener noreferrer"
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
