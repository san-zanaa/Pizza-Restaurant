import { ObjectId } from "mongodb"
import { getSessionUser } from "@/lib/session"
import { menuItemsCollection } from "@/lib/db"
import { MenuItemDetail } from "@/components/menu-item-detail"

type Params = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Params) {
  const { id } = await params
  try {
    const item = await menuItemsCollection().findOne({ _id: new ObjectId(id) })
    return { title: item ? `${item.name} · PizzaHub` : "Dish · PizzaHub" }
  } catch {
    return { title: "Dish · PizzaHub" }
  }
}

export default async function MenuItemPage({ params }: Params) {
  const { id } = await params
  const user = await getSessionUser()
  return <MenuItemDetail id={id} user={user} />
}
