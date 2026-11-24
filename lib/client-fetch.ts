import { apiUrl } from "@/lib/api-url"

export type ApiResult<T> = {
  data: T | null
  error: string | null
  status: number
}

const TOKEN_ENDPOINT = "/api/auth/token"

type CachedToken = { token: string; expiresAt: number }
let tokenCache: CachedToken | null = null

export function clearAuthToken() {
  tokenCache = null
}

async function fetchToken(force = false): Promise<string | null> {
  if (!force && tokenCache && tokenCache.expiresAt - Date.now() > 15_000) {
    return tokenCache.token
  }
  try {
    const res = await fetch(TOKEN_ENDPOINT, { cache: "no-store" })
    if (!res.ok) {
      tokenCache = null
      return null
    }
    const body = (await res.json().catch(() => null)) as {
      token?: string
      expiresInSeconds?: number
    } | null
    if (!body?.token) {
      tokenCache = null
      return null
    }
    tokenCache = {
      token: body.token,
      expiresAt: Date.now() + (body.expiresInSeconds ?? 900) * 1000,
    }
    return body.token
  } catch {
    tokenCache = null
    return null
  }
}

async function parse<T>(res: Response): Promise<ApiResult<T>> {
  const body = (await res.json().catch(() => ({}))) as Record<string, unknown>
  if (!res.ok) {
    return {
      data: null,
      error:
        typeof body?.error === "string"
          ? body.error
          : `Request failed (${res.status}).`,
      status: res.status,
    }
  }
  return { data: body as T, error: null, status: res.status }
}

async function request<T>(
  path: string,
  init: RequestInit,
  retry = true
): Promise<ApiResult<T>> {
  const token = await fetchToken()
  const headers = new Headers(init.headers)
  if (init.body) headers.set("Content-Type", "application/json")
  if (token) headers.set("Authorization", `Bearer ${token}`)

  try {
    const res = await fetch(apiUrl(path), { ...init, headers, cache: "no-store" })

    if (res.status === 401 && retry && (await fetchToken(true))) {
      return request<T>(path, init, false)
    }

    return await parse<T>(res)
  } catch {
    return {
      data: null,
      error: "Network error — check your connection and retry.",
      status: 0,
    }
  }
}

export async function apiGet<T>(path: string): Promise<ApiResult<T>> {
  return request<T>(path, { method: "GET" })
}

export async function apiSend<T>(
  path: string,
  method: "POST" | "PATCH" | "PUT" | "DELETE",
  payload?: unknown
): Promise<ApiResult<T>> {
  return request<T>(path, {
    method,
    body: payload === undefined ? undefined : JSON.stringify(payload),
  })
}
