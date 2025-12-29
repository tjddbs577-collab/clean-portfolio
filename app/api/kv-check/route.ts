import { kv } from "@vercel/kv";

export async function GET() {
  try {
    // shorts:latest 키에서 데이터 가져오기
    const data = await kv.get("shorts:latest");

    return Response.json({
      success: true,
      hasData: !!data,
      data: data,
      env: {
        hasUrl: !!process.env.KV_REST_API_URL,
        hasToken: !!process.env.KV_REST_API_TOKEN,
      },
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        env: {
          hasUrl: !!process.env.KV_REST_API_URL,
          hasToken: !!process.env.KV_REST_API_TOKEN,
        },
      },
      { status: 500 }
    );
  }
}

