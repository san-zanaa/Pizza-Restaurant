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

export async function getSessionUser(): Promise<AppUser | null> {
  "use server"
  const { headers } = await import("next/headers")
  const session = await auth.api.getSession({ headers: headers() })
  return normalize(session?.user)
}

export function isBlocked(user: AppUser): boolean {
  return user.blocked
}