import { NextResponse } from "next/server"
import type { AppUser } from "@/lib/types"

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

/** JSON success response used by every API route. */
export function jsonOk<T>(data: T, status = 200) {
  return NextResponse.json(data, { status })
}

export async function readJson<T = Record<string, unknown>>(
  request: Request
): Promise<T | null> {
  try {
    return (await request.json()) as T
  } catch {
    return null
  }
}

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
