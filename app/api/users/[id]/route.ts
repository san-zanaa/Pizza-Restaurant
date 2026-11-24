import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { readJson } from "@/lib/api"
import { serverApi } from "@/lib/server-api"

/** Proxy GET/PATCH /api/users/:id to the backend. */

type Ctx = { params: Promise<{ id: string }> }

export async function GET(_request: NextRequest, { params }: Ctx) {
  const { id } = await params
  const { data, error, status } = await serverApi(`/api/users/${id}`)
  if (error) return NextResponse.json({ error }, { status })
  return NextResponse.json(data ?? { user: null })
}

export async function PATCH(request: NextRequest, { params }: Ctx) {
  const { id } = await params
  const body = await readJson(request)
  const { data, error, status } = await serverApi(`/api/users/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body ?? {}),
  })
  if (error) return NextResponse.json({ error }, { status })
  return NextResponse.json(data ?? { user: null })
}
