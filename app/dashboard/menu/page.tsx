import { redirect } from "next/navigation"
import { getSessionUser } from "@/lib/session"
import { VendorMenuList } from "@/components/dashboard/vendor-menu-list"

export default async function VendorMenuPage() {
  const user = await getSessionUser()
  if (!user) redirect("/sign-in")
  if (user.role !== "vendor") redirect("/dashboard")
  return <VendorMenuList />
}
