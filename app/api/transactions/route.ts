import { NextResponse } from "next/server"
import { serverApi } from "@/lib/server-api"

/** Proxy GET /api/transactions to the backend (read-only ledger). */

export async function GET() {
  const { data, error, status } = await serverApi<{ transactions: unknown[] }>(
    "/api/transactions"
  )
  if (error) return NextResponse.json({ error }, { status })
  return NextResponse.json(data ?? { transactions: [] })
}
