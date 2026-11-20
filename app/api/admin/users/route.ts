import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getSessionUser } from "@/lib/session"
import { jsonError, jsonOk, guardUser } from "@/lib/api"
import { usersCollection } from "@/lib/db"

type AdminUser = {
  id: string
  name: string
  email: string
  role: string
  blocked: boolean
  plan: string
  createdAt: string
}

/**
 * GET /api/admin/users
 * Query: q, role
 * Admin only: search and filter registered users.
 */
export async function GET(request: Request) {
  const user = await getSessionUser()
  const gate = guardUser(user)
  if (gate) return gate
  if (!user || user.role !== "admin") return jsonError("Admin access required.", 403)

  const { searchParams } = new URL(request.url)
  const q = searchParams.get("q")
  const role = searchParams.get("role")

  const filter: Record<string, unknown> = {}
  if (q) {
    filter.$or = [
      { name: { $regex: q, $options: "i" } },
      { email: { $regex: q, $options: "i" } },
    ]
  }
  if (role) filter.role = role

  const users = await usersCollection()
    .find(filter)
    .sort({ createdAt: -1 })
    .toArray()

  const result: AdminUser[] = users.map((u) => ({
    id: String(u._id),
    name: u.name ?? "",
    email: u.email ?? "",
    role: u.role ?? "customer",
    blocked: u.blocked === true,
    plan: u.plan ?? "free",
    createdAt: u.createdAt ? new Date(u.createdAt).toISOString() : "",
  }))

  return jsonOk({ users: result })
}
