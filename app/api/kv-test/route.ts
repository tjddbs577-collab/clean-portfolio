import { kv } from "@vercel/kv";

export async function GET() {
  try {
    // KV 연결 테스트
    const testKey = "kv-test:connection";
    const testValue = {
      message: "KV connection successful",
      timestamp: Date.now(),
    };

    // set 테스트
    await kv.set(testKey, testValue, { ex: 60 }); // 60초 TTL

    // get 테스트
    const retrieved = await kv.get(testKey);

    return Response.json({
      success: true,
      message: "KV is working correctly",
      set: testValue,
      get: retrieved,
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

export async function POST() {
  try {
    // shorts:latest 키 테스트
    const testData = {
      videos: [
        { id: "test-1", title: "Test Video 1" },
        { id: "test-2", title: "Test Video 2" },
      ],
      updatedAt: Date.now(),
    };

    await kv.set("shorts:latest", testData, { ex: 300 }); // 5분 TTL

    const retrieved = await kv.get("shorts:latest");

    return Response.json({
      success: true,
      message: "Shorts data saved and retrieved successfully",
      saved: testData,
      retrieved: retrieved,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

