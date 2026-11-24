import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { readJson } from "@/lib/api"
import { serverApi } from "@/lib/server-api"

/** Proxy GET/PATCH/DELETE /api/menu/:id to the backend. */

type Ctx = { params: Promise<{ id: string }> }

export async function GET(_request: NextRequest, { params }: Ctx) {
  const { id } = await params
  const { data, error, status } = await serverApi(`/api/menu/${id}`)
  if (error) return NextResponse.json({ error }, { status })
  return NextResponse.json(data ?? { item: null })
}

export async function PATCH(request: NextRequest, { params }: Ctx) {
  const { id } = await params
  const body = await readJson(request)
  const { data, error, status } = await serverApi(`/api/menu/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body ?? {}),
  })
  if (error) return NextResponse.json({ error }, { status })
  return NextResponse.json(data ?? { item: null })
}

export async function DELETE(_request: NextRequest, { params }: Ctx) {
  const { id } = await params
  const { data, error, status } = await serverApi(`/api/menu/${id}`, {
    method: "DELETE",
  })
  if (error) return NextResponse.json({ error }, { status })
  return NextResponse.json(data ?? { ok: true })
}
