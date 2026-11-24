import { NextResponse } from "next/server"
import { serverApi } from "@/lib/server-api"


export async function GET() {
  const { data, error, status } = await serverApi<{ transactions: unknown[] }>(
    "/api/transactions"
  )
  if (error) return NextResponse.json({ error }, { status })
  return NextResponse.json(data ?? { transactions: [] })
}
