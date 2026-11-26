import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { serverApi } from "@/lib/server-api"

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.toString()
  const { data, error, status } = await serverApi<{
    status: string
    orders: unknown[]
  }>(`/api/orders/verify-session${query ? `?${query}` : ""}`)
  if (error) return NextResponse.json({ error }, { status })
  return NextResponse.json(data ?? { status: "unknown", orders: [] })
}
