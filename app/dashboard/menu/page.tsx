import { getSessionUser } from "@/lib/session"
import { VendorMenuList } from "@/components/dashboard/vendor-menu-list"

export default async function VendorMenuPage() {
  const user = await getSessionUser()
  if (!user || user.role !== "vendor") return null
  return <VendorMenuList />
}
