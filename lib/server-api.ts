import { getSessionUser } from "@/lib/session"
import { signAppJwt } from "@/lib/jwt"
import type { ApiResult } from "@/lib/client-fetch"

const BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
  process.env.API_BASE_URL?.replace(/\/$/, "") ||
  "http://localhost:5000/api"

export async function serverApi<T>(
  path: string,
  init: RequestInit = {}
): Promise<ApiResult<T>> {
  try {
    const headers = new Headers(init.headers)
    if (!headers.has("Content-Type") && init.body) {
      headers.set("Content-Type", "application/json")
    }

    const user = await getSessionUser()
    if (user && !user.blocked) {
      headers.set("Authorization", `Bearer ${await signAppJwt(user)}`)
    }

    const res = await fetch(`${BASE}${path}`, { ...init, headers, cache: "no-store" })
    const body = (await res.json().catch(() => ({}))) as Record<string, unknown>

    if (!res.ok) {
      return {
        data: null,
        error:
          typeof body?.error === "string"
            ? body.error
            : `Request failed (${res.status}).`,
      }
    }
    return { data: body as T, error: null }
  } catch (err) {
    return {
      data: null,
      error:
        err instanceof Error ? err.message : "Network error — please retry.",
    }
  }
}
