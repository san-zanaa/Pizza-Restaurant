import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getSessionUser } from "@/lib/session"
import { jsonError, jsonOk, readJson, guardUser } from "@/lib/api"
import { ordersCollection, menuItemsCollection } from "@/lib/db"
import { isIsoDate } from "@/lib/validation"
import type { Order } from "@/lib/types"

/**
 * GET /api/orders
 * Query: scope ("vendor" | undefined/customer)
 * - vendor: orders for this vendor's items
 * - customer (default): the signed-in customer's own orders
 */
export async function GET(request: Request) {
  const user = await getSessionUser()
  const gate = guardUser(user)
  if (gate) return gate
  if (!user) return jsonError("You must be signed in.", 401)

  const { searchParams } = new URL(request.url)
  const scope = searchParams.get("scope")

  const filter: Record<string, unknown> = {}

  if (scope === "vendor") {
    if (user.role !== "vendor") {
      return jsonError("Vendor access required.", 403)
    }
    filter.vendorId = user.id
  } else {
    // Default: customer's own orders (any authenticated user can view their own)
    filter.customerId = user.id
  }

  const orders = await ordersCollection()
    .find(filter)
    .sort({ createdAt: -1 })
    .toArray()

  return jsonOk({ orders: orders as Order[] })
}

/**
 * POST /api/orders
 * Customer places a new order. Status starts as "Pending".
 */
export async function POST(request: Request) {
  const user = await getSessionUser()
  const gate = guardUser(user)
  if (gate) return gate
  if (!user || user.role !== "customer") return jsonError("Customers only.", 403)

  const body = await readJson<{
    itemId: string
    deliveryDate: string
    deliveryAddress: string
    message?: string
  }>(request)
  if (!body) return jsonError("Invalid request body.", 400)

  if (!body.itemId || typeof body.itemId !== "string") {
    return jsonError("Item is required.", 400)
  }
  if (!body.deliveryDate || !isIsoDate(body.deliveryDate)) {
    return jsonError("A valid delivery date is required.", 400)
  }
  if (body.deliveryDate < new Date().toISOString().slice(0, 10)) {
    return jsonError("Delivery date can't be in the past.", 400)
  }
  if (
    !body.deliveryAddress ||
    body.deliveryAddress.trim().length < 5
  ) {
    return jsonError("Enter a delivery address (at least 5 characters).", 400)
  }

  // Verify the item exists and is approved + available
  const item = await menuItemsCollection().findOne({ _id: body.itemId })
  if (!item) return jsonError("Menu item not found.", 404)
  if (item.status !== "Approved" || !item.availability) {
    return jsonError("This item is not available for ordering.", 400)
  }

  const now = new Date().toISOString()
  const order: Order = {
    _id: crypto.randomUUID(),
    itemId: item._id,
    itemName: item.name,
    itemImage: item.imageUrl,
    itemPrice: item.price,
    vendorId: item.vendorId,
    vendorName: item.vendorName,
    customerId: user.id,
    customerName: user.name,
    customerEmail: user.email,
    deliveryDate: body.deliveryDate,
    deliveryAddress: body.deliveryAddress.trim(),
    message: body.message?.trim() ?? "",
    status: "Pending",
    createdAt: now,
    updatedAt: now,
  }

  await ordersCollection().insertOne(order)

  return jsonOk({ order }, 201)
}
