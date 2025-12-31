import { syncShorts } from "@/core/logic/syncShorts";

export async function GET() {
  const result = await syncShorts();

  if (!result.success) {
    return new Response(
      JSON.stringify({
        error: result.error,
        detail: result.detail,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  return Response.json({
    success: true,
    count: result.count,
    updatedAt: result.updatedAt,
    message: `성공적으로 ${result.count}개의 쇼츠를 동기화했습니다.`,
  });
}

