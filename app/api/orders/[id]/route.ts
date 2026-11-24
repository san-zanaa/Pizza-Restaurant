import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { readJson } from "@/lib/api"
import { serverApi } from "@/lib/server-api"


type Ctx = { params: Promise<{ id: string }> }

export async function GET(_request: NextRequest, { params }: Ctx) {
  const { id } = await params
  const { data, error, status } = await serverApi(`/api/orders/${id}`)
  if (error) return NextResponse.json({ error }, { status })
  return NextResponse.json(data ?? { order: null })
}

export async function PATCH(request: NextRequest, { params }: Ctx) {
  const { id } = await params
  const body = await readJson(request)
  const { data, error, status } = await serverApi(`/api/orders/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body ?? {}),
  })
  if (error) return NextResponse.json({ error }, { status })
  return NextResponse.json(data ?? { order: null })
}
