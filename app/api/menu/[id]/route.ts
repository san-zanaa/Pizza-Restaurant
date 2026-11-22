import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getSessionUser } from "@/lib/session"
import { jsonError, jsonOk, readJson, guardUser } from "@/lib/api"
import { menuItemsCollection } from "@/lib/db"
import { validateMenuItem } from "@/lib/validation"
import type { MenuItem } from "@/lib/types"

/**
 * GET /api/menu/[id]
 * - Public: approved + available items only
 * - Vendor (own item) / admin: any item (e.g. preview before approval)
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const existing = await menuItemsCollection().findOne({ _id: id })
  if (!existing) return jsonError("Menu item not found.", 404)

  const isPublic =
    existing.status === "Approved" && existing.availability === true
  if (isPublic) return jsonOk({ item: existing as MenuItem })

  const user = await getSessionUser()
  if (user && (user.role === "admin" || user.id === existing.vendorId)) {
    return jsonOk({ item: existing as MenuItem })
  }
  return jsonError("Menu item not found.", 404)
}

/**
 * PATCH /api/menu/[id]
 * - Vendor: update their own item's fields (name, category, description, price, location, imageUrl, availability)
 * - Admin: update any item's status only
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
  const body = await readJson<Partial<MenuItem>>(request)
  if (!body) return jsonError("Invalid request body.", 400)

  const existing = await menuItemsCollection().findOne({ _id: id })
  if (!existing) return jsonError("Menu item not found.", 404)

  const isOwner = existing.vendorId === user.id
  const isAdmin = user.role === "admin"

  if (!isOwner && !isAdmin) {
    return jsonError("You can only edit your own menu items.", 403)
  }

  const update: Record<string, unknown> = { updatedAt: new Date().toISOString() }

  if (isAdmin && body.status !== undefined) {
    // Admin can only change the approval status
    if (!["Pending", "Approved", "Rejected"].includes(body.status)) {
      return jsonError("Invalid status.", 400)
    }
    update.status = body.status
  }

  if (isOwner) {
    // Vendor can update editable fields
    if (body.name !== undefined) {
      if (body.name.trim().length < 2 || body.name.trim().length > 80) {
        return jsonError("Item name must be between 2 and 80 characters.", 400)
      }
      update.name = body.name.trim()
    }
    if (body.category !== undefined) update.category = body.category
    if (body.description !== undefined) {
      if (
        body.description.trim().length < 10 ||
        body.description.trim().length > 1000
      ) {
        return jsonError("Description must be between 10 and 1000 characters.", 400)
      }
      update.description = body.description.trim()
    }
    if (body.price !== undefined) {
      const price = Number(body.price)
      if (!Number.isFinite(price) || price <= 0 || price > 10000) {
        return jsonError("Price must be a positive amount (max 10,000).", 400)
      }
      update.price = price
    }
    if (body.location !== undefined) {
      if (body.location.trim().length < 2 || body.location.trim().length > 120) {
        return jsonError("Location (area / city) is required.", 400)
      }
      update.location = body.location.trim()
    }
    if (body.imageUrl !== undefined) update.imageUrl = body.imageUrl
    if (body.availability !== undefined) update.availability = body.availability
  }

  if (Object.keys(update).length <= 1) {
    return jsonError("No fields to update.", 400)
  }

  await menuItemsCollection().updateOne({ _id: id }, { $set: update })

  const updated = await menuItemsCollection().findOne({ _id: id })
  return jsonOk({ item: updated as MenuItem })
}

/**
 * DELETE /api/menu/[id]
 * - Vendor: delete their own item
 * - Admin: delete any item
 */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser()
  const gate = guardUser(user)
  if (gate) return gate
  if (!user) return jsonError("You must be signed in.", 401)

  const { id } = await params
  const existing = await menuItemsCollection().findOne({ _id: id })
  if (!existing) return jsonError("Menu item not found.", 404)

  const isOwner = existing.vendorId === user.id
  const isAdmin = user.role === "admin"

  if (!isOwner && !isAdmin) {
    return jsonError("You can only delete your own menu items.", 403)
  }

  await menuItemsCollection().deleteOne({ _id: id })
  return jsonOk({ ok: true })
}
