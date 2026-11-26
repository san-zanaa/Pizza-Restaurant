import { redirect } from "next/navigation"
import { getSessionUser } from "@/lib/session"
import { OrderPaymentSuccess } from "@/components/order-payment-success"

export default async function OrderPaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const user = await getSessionUser()
  if (!user) redirect("/sign-in")

  const params = await searchParams
  const sessionId = params?.session_id

  return <OrderPaymentSuccess sessionId={sessionId} user={user} />
}
