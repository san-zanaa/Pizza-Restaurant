import { NextResponse } from "next/server"
import { serverApi } from "@/lib/server-api"

/** Proxy GET /api/menu/categories to the backend. */

export async function GET() {
  const { data, error, status } = await serverApi<{ categories: unknown[] }>(
    "/api/menu/categories"
  )
  if (error) return NextResponse.json({ error }, { status })
  return NextResponse.json(data ?? { categories: [] })
}
