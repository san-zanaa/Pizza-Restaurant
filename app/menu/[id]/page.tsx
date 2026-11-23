import { getSessionUser } from "@/lib/session"
import { serverApi } from "@/lib/server-api"
import { MenuItemDetail } from "@/components/menu-item-detail"
import type { MenuItem } from "@/lib/types"

type Params = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Params) {
  const { id } = await params
  const { data } = await serverApi<{ item: MenuItem }>(`/api/menu/${id}`)
  return {
    title: data?.item ? `${data.item.itemName} · PizzaHub` : "Dish · PizzaHub",
  }
}

export default async function MenuItemPage({ params }: Params) {
  const { id } = await params
  const user = await getSessionUser()
  return <MenuItemDetail id={id} user={user} />
}
