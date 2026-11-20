import { redirect } from "next/navigation"
import { getSessionUser } from "@/lib/session"
import { AdminTransactions } from "@/components/dashboard/admin-transactions"

export default async function AdminTransactionsPage() {
  const user = await getSessionUser()
  if (!user) redirect("/sign-in")
  if (user.role !== "admin") redirect("/dashboard")

  return <AdminTransactions />
}
