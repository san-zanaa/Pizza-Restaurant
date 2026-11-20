import Stripe from "stripe"
import { transactionsCollection, usersCollection } from "@/lib/db"

let stripe: Stripe | null | undefined

export function getStripe(): Stripe | null {
  if (stripe !== undefined) return stripe
  const key = process.env.STRIPE_SECRET_KEY?.trim()
  stripe = key ? new Stripe(key) : null
  return stripe
}

export type FulfillResult =
  | { ok: true; alreadyFulfilled: boolean }
  | { ok: false; reason: "not-configured" | "unverified" | "missing-vendor" }

export async function fulfillCheckoutSession(
  sessionId: string
): Promise<FulfillResult> {
  const client = getStripe()
  if (!client) return { ok: false, reason: "not-configured" }

  let session: Stripe.Checkout.Session
  try {
    session = await client.checkout.sessions.retrieve(sessionId)
  } catch {
    return { ok: false, reason: "unverified" }
  }

  if (session.payment_status !== "paid") {
    return { ok: false, reason: "unverified" }
  }

  const vendorId =
    session.client_reference_id || session.metadata?.vendorId || ""
  if (!vendorId) return { ok: false, reason: "missing-vendor" }

  const existing = await transactionsCollection().findOne({
    stripeSessionId: sessionId,
  })
  if (existing) return { ok: true, alreadyFulfilled: true }

  const amount = session.amount_total ?? 0
  const currency = (session.currency ?? "usd").toLowerCase()

  await transactionsCollection().insertOne({
    _id: crypto.randomUUID(),
    vendorId,
    vendorName: session.metadata?.vendorName ?? "",
    vendorEmail: session.metadata?.vendorEmail ?? "",
    plan: "premium",
    amount,
    currency,
    status: "paid",
    stripeSessionId: sessionId,
    createdAt: new Date().toISOString(),
  })

  await usersCollection().updateOne(
    { _id: vendorId } as never,
    { $set: { plan: "premium" } } as never
  )

  return { ok: true, alreadyFulfilled: false }
}
