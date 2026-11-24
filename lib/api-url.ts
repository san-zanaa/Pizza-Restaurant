/**
 * Single source of truth for the backend base URL.
 *
 * The env var may be configured either with or without the `/api` suffix
 * (e.g. `http://localhost:5000` or `http://localhost:5000/api`) and callers
 * may pass paths either with or without it (`/api/menu` or `/menu`).
 * Normalising both sides here prevents the doubled `/api/api/...` URLs that
 * would otherwise 404 on the Express backend.
 */
const RAW = (
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.API_BASE_URL ||
  "http://localhost:5000"
)
  .trim()
  .replace(/\/+$/, "")

export const API_BASE = /\/api$/.test(RAW) ? RAW : `${RAW}/api`

/** Build an absolute backend URL from a path such as `/api/menu`. */
export function apiUrl(path: string): string {
  return `${API_BASE}${path.replace(/^\/api(?=\/|$)/, "")}`
}
