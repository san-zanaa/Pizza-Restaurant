import { auth } from "@/lib/auth"
import type { AppUser, Plan, Role } from "@/lib/types"

function normalize(raw: unknown): AppUser | null {
  if (!raw || typeof raw !== "object") return null
  const user = raw as Record<string, unknown>
  if (typeof user.id !== "string" || !user.id) return null

  const role: Role =
    user.role === "vendor" || user.role === "admin" ? user.role : "customer"
  const plan: Plan = user.plan === "premium" ? "premium" : "free"

  return {
    id: user.id,
    name: typeof user.name === "string" ? user.name : "",
    email: typeof user.email === "string" ? user.email : "",
    image: typeof user.image === "string" ? user.image : null,
    role,
    blocked: user.blocked === true,
    plan,
  }
}

// Server-only: get session user (called from Server Components and API routes)
export async function getSessionUser(): Promise<AppUser | null> {
  "use server"
  // Use empty headers object - better-auth will use the request context
  // When called from API routes, the request headers are available automatically
  // When called from Server Components, we pass minimal headers
  try {
    const session = await auth.api.getSession({ headers: {} })
    return normalize(session?.user)
  } catch {
    return null
  }
}

// Client-friendly: get session user without next/headers dependency
// Returns null on the client; use in Server Components or API routes instead.
export async function getSessionUserClient(): Promise<AppUser | null> {
  "use client"
  // Client-side session check - in a real app, this would use
  // better-auth's client SDK or a session cookie/token check.
  // For now, return null to avoid next/headers dependency in client components.
  return null
}

export function isBlocked(user: AppUser): boolean {
  return user.blocked
}