import { redirect } from "next/navigation"
import { getSessionUser } from "@/lib/session"
import { AdminMenuItems } from "@/components/dashboard/admin-menu-items"

export default async function AdminMenuItemsPage() {
  const user = await getSessionUser()
  if (!user) redirect("/sign-in")
  if (user.role !== "admin") redirect("/dashboard")

  return <AdminMenuItems />
}
