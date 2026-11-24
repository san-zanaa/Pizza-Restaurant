import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { readJson } from "@/lib/api"
import { serverApi } from "@/lib/server-api"


export async function GET() {
  const { data, error, status } = await serverApi("/api/profile")
  if (error) return NextResponse.json({ error }, { status })
  return NextResponse.json(data ?? { user: null })
}

export async function PATCH(request: NextRequest) {
  const body = await readJson(request)
  const { data, error, status } = await serverApi("/api/profile", {
    method: "PATCH",
    body: JSON.stringify(body ?? {}),
  })
  if (error) return NextResponse.json({ error }, { status })
  return NextResponse.json(data ?? { user: null })
}
