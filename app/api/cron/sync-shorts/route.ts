import { syncShorts } from "@/core/logic/syncShorts";

export async function GET(request: Request) {
  const isDev = process.env.NODE_ENV === "development";

  // 🔐 Secret 검증 (production에서만 수행)
  if (!isDev) {
    const url = new URL(request.url);
    const secretFromQuery = url.searchParams.get("secret");
    const secretFromHeader = request.headers.get("x-cron-secret");
    const expectedSecret = process.env.SHORTS_SYNC_SECRET;

    if (!expectedSecret) {
      return new Response(
        JSON.stringify({ error: "SHORTS_SYNC_SECRET not configured" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    if (
      secretFromQuery !== expectedSecret &&
      secretFromHeader !== expectedSecret
    ) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  const result = await syncShorts();

  if (!result.success) {
    return new Response(
      JSON.stringify({ error: result.error, detail: result.detail }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  return Response.json({
    success: true,
    count: result.count,
    updatedAt: result.updatedAt,
  });
}
