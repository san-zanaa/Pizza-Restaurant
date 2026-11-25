import { getSessionUser } from "@/lib/session"
import { AdminOverview } from "@/components/dashboard/admin-overview"
import { CustomerOverview } from "@/components/dashboard/customer-overview"
import { VendorOverview } from "@/components/dashboard/vendor-overview"

export default async function DashboardPage() {
  const user = await getSessionUser()
  if (!user) return null

  if (user.role === "admin") return <AdminOverview user={user} />
  if (user.role === "vendor") return <VendorOverview user={user} />
  return <CustomerOverview user={user} />
}
