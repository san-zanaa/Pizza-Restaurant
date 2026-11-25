
const RAW = (
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.API_BASE_URL ||
  "http://localhost:5000"
)
  .trim()
  .replace(/\/+$/, "")

export const API_BASE = /\/api$/.test(RAW) ? RAW : `${RAW}/api`

export function apiUrl(path: string): string {
  return `${API_BASE}${path.replace(/^\/api(?=\/|$)/, "")}`
}
