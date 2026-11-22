import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getSessionUser } from "@/lib/session"
import { jsonError, jsonOk, readJson, guardUser } from "@/lib/api"
import { menuItemsCollection } from "@/lib/db"
import { validateMenuItem } from "@/lib/validation"
import type { MenuItem } from "@/lib/types"
import { FREE_PLAN_ACTIVE_LIMIT } from "@/lib/types"

/**
 * GET /api/menu
 * Query: scope ("admin" | "mine" | undefined), q, status, category, limit
 * - Public (no scope): Approved + Active items only
 * - scope=mine: vendor's own items (vendor auth required)
 * - scope=admin: all items (admin auth required)
 * - limit: max number of items to return (capped at 100)
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const scope = searchParams.get("scope")
  const q = searchParams.get("q")
  const status = searchParams.get("status")
  const category = searchParams.get("category")
  const limit = Number(searchParams.get("limit"))

  const user = await getSessionUser()

  // Role gating
  if (scope === "admin" && (!user || user.role !== "admin")) {
    return jsonError("Admin access required.", 403)
  }
  if (scope === "mine" && (!user || user.role !== "vendor")) {
    return jsonError("Vendor access required.", 403)
  }

  const filter: Record<string, unknown> = {}

  if (scope === "mine" && user) {
    filter.vendorId = user.id
  } else if (!scope) {
    // Public browse: only approved and available items
    filter.status = "Approved"
    filter.availability = true
  }

  if (status) filter.status = status
  if (category) filter.category = category

  if (q) {
    filter.$or = [
      { name: { $regex: q, $options: "i" } },
      { description: { $regex: q, $options: "i" } },
      { location: { $regex: q, $options: "i" } },
      { vendorName: { $regex: q, $options: "i" } },
    ]
  }

  let cursor = menuItemsCollection()
    .find(filter)
    .sort({ createdAt: -1 })

  if (Number.isFinite(limit) && limit >= 1) {
    cursor = cursor.limit(Math.min(Math.floor(limit), 100))
  }

  const items = await cursor.toArray()

  return jsonOk({ items: items as MenuItem[] })
}

/**
 * POST /api/menu
 * Vendor creates a new menu item. Free plan: max 3 active items. Premium: unlimited.
 * New items are saved as "Pending" awaiting admin approval.
 */
export async function POST(request: Request) {
  const user = await getSessionUser()
  const gate = guardUser(user)
  if (gate) return gate
  if (!user || user.role !== "vendor") return jsonError("Vendors only.", 403)

  const body = await readJson<Partial<MenuItem>>(request)
  if (!body) return jsonError("Invalid request body.", 400)

  const validationError = validateMenuItem(body)
  if (validationError) return jsonError(validationError, 400)

  // Free plan limit: count active (Approved + availability) items
  if (user.plan === "free") {
    const activeCount = await menuItemsCollection().countDocuments({
      vendorId: user.id,
      status: "Approved",
      availability: true,
    })
    if (activeCount >= FREE_PLAN_ACTIVE_LIMIT) {
      return jsonError(
        "Free plan limit reached (3 active items). Upgrade to Premium for unlimited active items.",
        403
      )
    }
  }

  const now = new Date().toISOString()
  const item: MenuItem = {
    _id: crypto.randomUUID(),
    name: body.name!.trim(),
    category: body.category!,
    description: body.description!.trim(),
    price: Number(body.price),
    location: body.location!.trim(),
    imageUrl: body.imageUrl!,
    vendorId: user.id,
    vendorName: user.name,
    status: "Pending",
    availability: true,
    createdAt: now,
    updatedAt: now,
  }

  await menuItemsCollection().insertOne(item)

  return jsonOk({ item }, 201)
}
