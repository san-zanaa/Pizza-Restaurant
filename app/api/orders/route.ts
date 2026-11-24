import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { readJson } from "@/lib/api"
import { serverApi } from "@/lib/server-api"

/** Proxy GET/POST /api/orders to the backend. */

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.toString()
  const { data, error, status } = await serverApi<{ orders: unknown[] }>(
    `/api/orders${query ? `?${query}` : ""}`
  )
  if (error) return NextResponse.json({ error }, { status })
  return NextResponse.json(data ?? { orders: [] })
}

export async function POST(request: NextRequest) {
  const body = await readJson(request)
  const { data, error, status } = await serverApi("/api/orders", {
    method: "POST",
    body: JSON.stringify(body ?? {}),
  })
  if (error) return NextResponse.json({ error }, { status })
  return NextResponse.json(data ?? {}, { status })
}
