import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { SuccessPage } from "@/components/payment-success"

export const metadata: Metadata = { title: "Payment Success · PizzaHub" }

type SearchParams = Promise<{ session_id?: string }>


export default async function PaymentSuccessRoute({ searchParams }: { searchParams: SearchParams }) {
  const { session_id: sessionId } = await searchParams
  const { getSessionUser } = await import("@/lib/session")
  const user = await getSessionUser()
  if (!user) redirect("/sign-in")
  return <SuccessPage sessionId={sessionId} user={user} />
}
