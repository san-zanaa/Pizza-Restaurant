import { redirect } from "next/navigation"
import { getSessionUser } from "@/lib/session"
import { SubscriptionPage } from "@/components/dashboard/subscription"

export default async function SubscriptionRoute() {
  const user = await getSessionUser()
  if (!user) redirect("/sign-in")
  if (user.role !== "vendor") redirect("/dashboard")

  return <SubscriptionPage user={user} />
}
