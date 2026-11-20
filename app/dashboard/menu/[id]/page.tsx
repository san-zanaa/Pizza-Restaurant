import { notFound, redirect } from "next/navigation"
import { getSessionUser } from "@/lib/session"
import { menuItemsCollection } from "@/lib/db"
import { VendorMenuItemForm } from "@/components/dashboard/vendor-menu-form"
import { PageHeader } from "@/components/dashboard/ui"
import type { MenuItem } from "@/lib/types"

type Params = { params: Promise<{ id: string }> }

export default async function MenuItemDetailPage({ params }: Params) {
  const user = await getSessionUser()
  if (!user) redirect("/sign-in")
  if (user.role !== "vendor") redirect("/dashboard")

  const { id } = await params
  const item = await menuItemsCollection().findOne({ _id: id })
  if (!item || item.vendorId !== user.id) notFound()

  const serializable: MenuItem = {
    ...item,
    _id: String(item._id),
  }

  return (
    <>
      <PageHeader
        title={item.name}
        subtitle={`${item.category} · ${item.location}`}
      />
      <VendorMenuItemForm item={serializable} />
    </>
  )
}
