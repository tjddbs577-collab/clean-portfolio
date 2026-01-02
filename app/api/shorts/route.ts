// app/api/shorts/route.ts
import { NextResponse } from "next/server";
import { getShorts } from "@/core/logic/getShorts";

export const runtime = "nodejs";

export async function GET() {
  try {
    const videos = await getShorts(); // 🔥 여기서 자동 sync 발생

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
