import { jsonOk } from "@/lib/api"
import { menuItemsCollection } from "@/lib/db"
import { MENU_CATEGORIES } from "@/lib/types"

/**
 * GET /api/menu/categories
 * Public: approved + available item counts per category, in canonical order.
 * Powers the homepage "Pizza Categories" section.
 */
export async function GET() {
  const counts = await menuItemsCollection()
    .aggregate([
      { $match: { status: "Approved", availability: true } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ])
    .toArray()

  const byCategory = new Map(
    counts.map((row) => [String(row._id), row.count as number])
  )

  return jsonOk({
    categories: MENU_CATEGORIES.map((category) => ({
      category,
      count: byCategory.get(category) ?? 0,
    })),
  })
}
