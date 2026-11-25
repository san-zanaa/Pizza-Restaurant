import { NextResponse } from "next/server"
import { serverApi } from "@/lib/server-api"

export async function POST() {
  const { data, error, status } = await serverApi(
    "/api/subscription/checkout",
    {
      method: "POST",
    }
  )
  if (error) return NextResponse.json({ error }, { status })
  return NextResponse.json(data ?? {})
}
