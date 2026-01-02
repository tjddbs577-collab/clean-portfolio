// src/app/api/admin/sync/route.ts
import { syncShorts } from "@/core/logic/syncShorts";

export async function GET() {
  const result = await syncShorts();
  return Response.json(result);
}
