import { NextResponse } from "next/server"
import type { AppUser } from "@/lib/types"

/** JSON error response used by every API route. */
export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

/** JSON success response used by every API route. */
export function jsonOk<T>(data: T, status = 200) {
  return NextResponse.json(data, { status })
}

/** Reads and JSON-parses a request body, answering with a 400 on garbage. */
export async function readJson<T = Record<string, unknown>>(
  request: Request
): Promise<T | null> {
  try {
    return (await request.json()) as T
  } catch {
    return null
  }
}

/**
 * Gate used by every protected API route: 401 when signed out, 403 when the
 * account has been blocked by an admin (blocked users lose all write access).
 */
export function guardUser(user: AppUser | null): NextResponse | null {
  if (!user) return jsonError("You must be signed in to do that.", 401)
  if (user.blocked) {
    return jsonError(
      "Your account has been blocked by an administrator. Contact support to restore access.",
      403
    )
  }
  return null
}

export function requireRole(user: AppUser, roles: AppUser["role"][]): boolean {
  return roles.includes(user.role)
}
