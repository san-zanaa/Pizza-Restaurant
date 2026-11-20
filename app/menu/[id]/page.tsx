import { getSessionUser } from "@/lib/session"
import { MenuItemDetail } from "@/components/menu-item-detail"

type Params = { params: Promise<{ id: string }> }

export const metadata = { title: "Dish · PizzaHub" }

/** Menu item details + order form. */
export default async function MenuItemPage({ params }: Params) {
  const { id } = await params
  const user = await getSessionUser()
  return <MenuItemDetail id={id} user={user} />
}
