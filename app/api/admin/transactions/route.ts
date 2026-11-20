import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getSessionUser } from "@/lib/session"
import { jsonError, jsonOk, guardUser } from "@/lib/api"
import { transactionsCollection } from "@/lib/db"
import type { Transaction } from "@/lib/types"

/**
 * GET /api/admin/transactions
 * Admin only: read-only ledger of verified Stripe payments.
 */
export async function GET() {
  const user = await getSessionUser()
  const gate = guardUser(user)
  if (gate) return gate
  if (!user || user.role !== "admin") return jsonError("Admin access required.", 403)

  const transactions = await transactionsCollection()
    .find({})
    .sort({ createdAt: -1 })
    .toArray()

  return jsonOk({ transactions: transactions as Transaction[] })
}
