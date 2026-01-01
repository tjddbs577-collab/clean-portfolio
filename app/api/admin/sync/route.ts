import { NextResponse } from "next/server";
import { syncShorts } from "@/core/logic/syncShorts";

// Node 런타임 강제
export const runtime = "nodejs";

/**
 * GET /api/admin/sync
 * - YouTube → Shorts 동기화
 * - Redis/KV에 저장
 */
export async function GET() {
  try {
    const result = await syncShorts();

    return NextResponse.json(result);
  } catch (error) {
    console.error("❌ admin sync error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
