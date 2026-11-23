import { notFound, redirect } from "next/navigation"
import { getSessionUser } from "@/lib/session"
import { serverApi } from "@/lib/server-api"
import { VendorMenuItemForm } from "@/components/dashboard/vendor-menu-form"
import { PageHeader } from "@/components/dashboard/ui"
import type { MenuItem } from "@/lib/types"

type Params = { params: Promise<{ id: string }> }

export default async function MenuItemDetailPage({ params }: Params) {
  const user = await getSessionUser()
  if (!user) redirect("/sign-in")
  if (user.role !== "vendor") redirect("/dashboard")

  const { id } = await params
  const { data } = await serverApi<{ item: MenuItem }>(`/api/menu/${id}`)
  const item = data?.item

  // Ownership is verified server-side too — this just keeps the 404 tidy.
  if (!item || item.vendorId !== user.id) notFound()

  return (
    <>
      <PageHeader
        title={item.itemName}
        subtitle={`${item.category} · ${item.location}`}
      />
      <VendorMenuItemForm item={item} />
    </>
  )
}
