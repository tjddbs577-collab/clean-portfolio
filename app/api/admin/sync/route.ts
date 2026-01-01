import { NextResponse } from "next/server";
import { syncShorts } from "@/core/logic/syncShorts";

export const runtime = "nodejs";

export async function GET() {
  try {
    const result = await syncShorts();

    // syncShorts()의 결과를 그대로 반환
    return NextResponse.json(result);
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
