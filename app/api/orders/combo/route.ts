import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { readJson } from "@/lib/api"
import { serverApi } from "@/lib/server-api"


export async function POST(request: NextRequest) {
  const body = await readJson(request)
  const { data, error, status } = await serverApi("/api/orders/combo", {
    method: "POST",
    body: JSON.stringify(body ?? {}),
  })
  if (error) return NextResponse.json({ error }, { status })
  return NextResponse.json(data ?? {}, { status })
}
