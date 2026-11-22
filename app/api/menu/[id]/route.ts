import { NextResponse } from "next/server"
import { getSessionUser } from "@/lib/session"
import { jsonError, jsonOk, readJson, guardUser } from "@/lib/api"
import { menuItemsCollection } from "@/lib/db"
import type { MenuItem } from "@/lib/types"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const existing = await menuItemsCollection().findOne({ _id: id })
  if (!existing) return jsonError("Menu item not found.", 404)
  return jsonOk({ item: existing as MenuItem })
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser()
  const gate = guardUser(user)
  if (gate) return gate
  if (!user || user.role !== "admin") return jsonError("Admin access required.", 403)

  const { id } = await params
  const body = await readJson<Partial<MenuItem>>(request)
  if (!body) return jsonError("Invalid request body.", 400)

  const update: Record<string, unknown> = {}
  if (body.name !== undefined) update.name = body.name.trim()
  if (body.category !== undefined) update.category = body.category
  if (body.description !== undefined) update.description = body.description.trim()
  if (body.price !== undefined) update.price = Number(body.price)
  if (body.image !== undefined) update.image = body.image

  if (Object.keys(update).length === 0) {
    return jsonError("No fields to update.", 400)
  }

  await menuItemsCollection().updateOne({ _id: id }, { $set: update })
  const updated = await menuItemsCollection().findOne({ _id: id })
  return jsonOk({ item: updated as MenuItem })
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser()
  const gate = guardUser(user)
  if (gate) return gate
  if (!user || user.role !== "admin") return jsonError("Admin access required.", 403)

  const { id } = await params
  await menuItemsCollection().deleteOne({ _id: id })
  return jsonOk({ ok: true })
}
