import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getSessionUser } from "@/lib/session"
import { jsonError, jsonOk, guardUser } from "@/lib/api"
import { usersCollection } from "@/lib/db"

/**
 * PATCH /api/admin/users/[id]
 * Admin only: block or unblock a user.
 * Body: { action: "block" | "unblock" }
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser()
  const gate = guardUser(user)
  if (gate) return gate
  if (!user || user.role !== "admin") return jsonError("Admin access required.", 403)

  const { id } = await params
  const body = (await request.json().catch(() => null)) as {
    action?: "block" | "unblock"
  } | null
  if (!body || !body.action) {
    return jsonError("Action (block/unblock) is required.", 400)
  }

  const target = await usersCollection().findOne({ _id: id } as never)
  if (!target) return jsonError("User not found.", 404)

  // Prevent an admin from blocking themselves
  if (String(target._id) === user.id) {
    return jsonError("You can't block your own account.", 400)
  }

  await usersCollection().updateOne(
    { _id: id } as never,
    { $set: { blocked: body.action === "block" } } as never
  )

  return jsonOk({
    id,
    blocked: body.action === "block",
  })
}
