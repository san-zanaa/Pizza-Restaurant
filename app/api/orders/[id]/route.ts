import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getSessionUser } from "@/lib/session"
import { jsonError, jsonOk, readJson, guardUser } from "@/lib/api"
import { ordersCollection } from "@/lib/db"
import type { Order, OrderStatus } from "@/lib/types"

type Action = "accept" | "reject" | "cancel"

/**
 * PATCH /api/orders/[id]
 * - Vendor: accept or reject a pending order (own items only, once).
 * - Customer: cancel a pending order (own orders only, once).
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser()
  const gate = guardUser(user)
  if (gate) return gate
  if (!user) return jsonError("You must be signed in.", 401)

  const { id } = await params
  const body = await readJson<{ action: Action }>(request)
  if (!body || !body.action) {
    return jsonError("Action (accept/reject/cancel) is required.", 400)
  }

  const existing = await ordersCollection().findOne({ _id: id })
  if (!existing) return jsonError("Order not found.", 404)

  let nextStatus: OrderStatus

  if (body.action === "cancel") {
    if (user.role !== "customer") {
      return jsonError("Only customers can cancel orders.", 403)
    }
    if (existing.customerId !== user.id) {
      return jsonError("You can only cancel your own orders.", 403)
    }
    nextStatus = "Cancelled"
  } else {
    if (user.role !== "vendor") return jsonError("Vendors only.", 403)
    if (existing.vendorId !== user.id) {
      return jsonError("You can only decide orders for your own items.", 403)
    }
    nextStatus = body.action === "accept" ? "Accepted" : "Rejected"
  }

  // Only pending orders can be changed, and only once
  if (existing.status !== "Pending") {
    return jsonError(
      `This order is already ${existing.status.toLowerCase()} and can't be changed.`,
      400
    )
  }

  const now = new Date().toISOString()
  await ordersCollection().updateOne(
    { _id: id, status: "Pending" },
    { $set: { status: nextStatus, updatedAt: now } }
  )

  const updated = await ordersCollection().findOne({ _id: id })
  return jsonOk({ order: updated as Order })
}
