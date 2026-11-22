import { NextResponse } from "next/server"
import { getSessionUser } from "@/lib/session"
import { jsonError, jsonOk, readJson, guardUser } from "@/lib/api"
import { menuItemsCollection } from "@/lib/db"
import type { MenuItem } from "@/lib/types"

/**
 * GET /api/menu
 * Query: scope ("admin" | "mine" | undefined), q, category, limit
 * Sorts items from id 1 → last id.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const scope = searchParams.get("scope")
  const q = searchParams.get("q")
  const category = searchParams.get("category")
  const limit = Number(searchParams.get("limit"))

  const user = await getSessionUser()

  if (scope === "admin" && (!user || user.role !== "admin")) {
    return jsonError("Admin access required.", 403)
  }
  if (scope === "mine" && (!user || user.role !== "vendor")) {
    return jsonError("Vendor access required.", 403)
  }

  const filter: Record<string, unknown> = {}

  if (scope === "mine" && user) {
    filter["vendor.id"] = user.id
  }

  if (category) filter.category = category

  if (q) {
    filter.$or = [
      { name: { $regex: q, $options: "i" } },
      { description: { $regex: q, $options: "i" } },
    ]
  }

  const all = await menuItemsCollection().find(filter).toArray()

  all.sort((a, b) => {
    const na = Number(String(a.id ?? "").match(/(\d+)\s*$/)?.[1] ?? 0)
    const nb = Number(String(b.id ?? "").match(/(\d+)\s*$/)?.[1] ?? 0)
    if (na !== nb) return na - nb
    return String(a.id ?? "").localeCompare(String(b.id ?? ""))
  })

  let items = all
  if (Number.isFinite(limit) && limit >= 1) {
    items = all.slice(0, Math.min(Math.floor(limit), 100))
  }

  const serialized = items.map((it) => ({ ...it, _id: it._id?.toString?.() ?? it._id }))
  return jsonOk({ items: serialized as MenuItem[] })
}

export async function POST(request: Request) {
  const user = await getSessionUser()
  const gate = guardUser(user)
  if (gate) return gate
  if (!user || user.role !== "vendor") return jsonError("Vendors only.", 403)

  const body = await readJson<Partial<MenuItem>>(request)
  if (!body) return jsonError("Invalid request body.", 400)
  if (!body.name || !body.category || !body.description || !body.price) {
    return jsonError("Missing required fields.", 400)
  }

  const item: MenuItem = {
    _id: crypto.randomUUID(),
    id: crypto.randomUUID(),
    name: body.name.trim(),
    category: body.category,
    description: body.description.trim(),
    price: Number(body.price),
    image: body.image ?? "",
  }

  await menuItemsCollection().insertOne(item)

  return jsonOk({ item }, 201)
}
