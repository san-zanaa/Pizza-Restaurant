import { redirect } from "next/navigation"
import { getSessionUser } from "@/lib/session"
import { AdminUsers } from "@/components/dashboard/admin-users"

export default async function AdminUsersPage() {
  const user = await getSessionUser()
  if (!user) redirect("/sign-in")
  if (user.role !== "admin") redirect("/dashboard")

  return <AdminUsers />
}
