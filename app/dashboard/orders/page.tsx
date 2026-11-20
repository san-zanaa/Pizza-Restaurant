import { getSessionUser } from "@/lib/session"
import { CustomerOrders } from "@/components/dashboard/customer-orders"
import { VendorOrders } from "@/components/dashboard/vendor-orders"

export default async function OrdersPage() {
  const user = await getSessionUser()
  if (!user) return null

  if (user.role === "vendor") return <VendorOrders />
  return <CustomerOrders />
}
