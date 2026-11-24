import { NextResponse } from "next/server"
import { serverApi } from "@/lib/server-api"

/** Proxy GET /api/overview to the backend. */

export async function GET() {
  const { data, error, status } = await serverApi("/api/overview")
  if (error) return NextResponse.json({ error }, { status })
  return NextResponse.json(data ?? {})
}
