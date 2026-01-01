import { NextResponse } from "next/server";
import { getShorts } from "@/core/logic/getShorts";

export const runtime = "nodejs";

/**
 * GET /api/shorts
 * - Redis(KV)에 저장된 쇼츠 데이터만 반환
 */
export async function GET() {
  try {
    const videos = await getShorts();

    return NextResponse.json({
      success: true,
      count: videos.length,
      videos,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
