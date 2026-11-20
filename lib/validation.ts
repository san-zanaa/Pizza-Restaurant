import { MENU_CATEGORIES, type MenuItem } from "@/lib/types"

export function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

export function isImgbbUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return (
      url.protocol === "https:" &&
      (url.hostname === "i.ibb.co" || url.hostname === "ibb.co")
    )
  } catch {
    return false
  }
}

export function validateMenuItem(body: Partial<MenuItem>): string | null {
  const name = body.name?.trim() ?? ""
  if (name.length < 2 || name.length > 80) {
    return "Item name must be between 2 and 80 characters."
  }
  if (
    !MENU_CATEGORIES.includes(body.category as (typeof MENU_CATEGORIES)[number])
  ) {
    return "Pick a valid category."
  }
  const description = body.description?.trim() ?? ""
  if (description.length < 10 || description.length > 1000) {
    return "Description must be between 10 and 1000 characters."
  }
  const price = Number(body.price)
  if (!Number.isFinite(price) || price <= 0 || price > 10000) {
    return "Price must be a positive amount (max 10,000)."
  }
  const location = body.location?.trim() ?? ""
  if (location.length < 2 || location.length > 120) {
    return "Location (area / city) is required."
  }
  const imageUrl = body.imageUrl?.trim() ?? ""
  if (!imageUrl) return "An item image is required — upload one with ImgBB."
  if (!isImgbbUrl(imageUrl)) {
    return "The item image must be uploaded through ImgBB."
  }
  return null
}

export function isIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const date = new Date(`${value}T00:00:00Z`)
  return !Number.isNaN(date.getTime())
}
