/** Tiny typed fetch helpers shared by the dashboard client components. */

export type ApiResult<T> = { data: T | null; error: string | null }

async function parse<T>(res: Response): Promise<ApiResult<T>> {
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
}

export async function apiGet<T>(url: string): Promise<ApiResult<T>> {
  try {
    const res = await fetch(url, { cache: "no-store" })
    return await parse<T>(res)
  } catch {
    return {
      data: null,
      error: "Network error — check your connection and retry.",
    }
  }
}

export async function apiSend<T>(
  url: string,
  method: "POST" | "PATCH" | "PUT" | "DELETE",
  payload?: unknown
): Promise<ApiResult<T>> {
  try {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: payload === undefined ? undefined : JSON.stringify(payload),
    })
    return await parse<T>(res)
  } catch {
    return {
      data: null,
      error: "Network error — check your connection and retry.",
    }
  }
}
