import { NextResponse } from "next/server"
import { serverApi } from "@/lib/server-api"

/** Proxy POST /api/subscription/cancel to the backend. */

export async function POST() {
  const { data, error, status } = await serverApi("/api/subscription/cancel", {
    method: "POST",
  })
  if (error) return NextResponse.json({ error }, { status })
  return NextResponse.json(data ?? {})
}
