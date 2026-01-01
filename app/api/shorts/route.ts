import { NextResponse } from "next/server";
import { getShorts } from "@/core/logic/getShorts";

// ⭐️ 핵심: Turbopack/Edge 우회 → Node.js 런타임 강제
export const runtime = "nodejs";

/**
 * GET /api/shorts
 * - KV에 저장된 쇼츠 데이터를 반환
 * - KV가 비어 있으면 내부 로직에 따라 YouTube에서 가져와 저장 후 반환
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
