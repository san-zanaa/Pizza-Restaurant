import { redirect } from "next/navigation"
import { getSessionUser } from "@/lib/session"
import { VendorMenuItemForm } from "@/components/dashboard/vendor-menu-form"
import { PageHeader } from "@/components/dashboard/ui"

export default async function NewMenuItemPage() {
  const user = await getSessionUser()
  if (!user) redirect("/sign-in")
  if (user.role !== "vendor") redirect("/dashboard")

  return (
    <>
      <PageHeader
        title="Add Menu Item"
        subtitle="Submit a new dish — an admin approves it before customers can see it."
      />
      <VendorMenuItemForm />
    </>
  )
}
