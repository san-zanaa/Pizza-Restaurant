import Link from "next/link"
import { CircleCheckBig, CreditCard, ShieldCheck } from "lucide-react"
import { getSessionUser } from "@/lib/session"
import { fulfillCheckoutSession } from "@/lib/stripe"

export const metadata = { title: "Payment Success · PizzaHub" }

type SearchParams = Promise<{ session_id?: string }>

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const { session_id: sessionId } = await searchParams
  const user = await getSessionUser()

  let state: "verified" | "unverified" | "missing" = "missing"
  let alreadyFulfilled = false

  if (sessionId) {
    try {
      const result = await fulfillCheckoutSession(sessionId)
      if (result.ok) {
        state = "verified"
        alreadyFulfilled = result.alreadyFulfilled
      } else {
        state = "unverified"
      }
    } catch {
      state = "unverified"
    }
  }

  return (
    <div className="flex min-h-[calc(100svh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-8 text-center shadow-[0_40px_90px_-50px_rgba(0,0,0,0.5)]">
        {state === "verified" ? (
          <>
            <span className="mx-auto grid size-16 place-items-center rounded-full bg-gradient-to-br from-[#34d399] to-[#10b981] text-emerald-950 shadow-[0_14px_36px_-14px_rgba(16,185,129,0.95)]">
              <CircleCheckBig className="size-7" strokeWidth={2.6} />
            </span>
            <h1 className="mt-5 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              Welcome to <span className="text-emerald-500">Premium</span>
            </h1>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Payment confirmed by Stripe. Your transaction is saved, your plan
              is now Premium, and you can publish unlimited active menu items.
              {alreadyFulfilled ? " (This payment was already recorded.)" : ""}
            </p>
          </>
        ) : state === "missing" ? (
          <>
            <span className="mx-auto grid size-16 place-items-center rounded-full bg-amber-500/15 text-amber-500">
              <CreditCard className="size-7" />
            </span>
            <h1 className="mt-5 text-2xl font-extrabold tracking-tight text-foreground">
              No payment to confirm
            </h1>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
              You reached the success page without a checkout session. If you
              completed a payment moments ago, give it a few seconds and reopen
              this link from Stripe.
            </p>
          </>
        ) : (
          <>
            <span className="mx-auto grid size-16 place-items-center rounded-full bg-amber-500/15 text-amber-500">
              <ShieldCheck className="size-7" />
            </span>
            <h1 className="mt-5 text-2xl font-extrabold tracking-tight text-foreground">
              We couldn&apos;t verify that payment
            </h1>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Stripe hasn&apos;t confirmed this checkout as paid. Nothing was
              charged to your plan — if the money moved, contact support and
              we&apos;ll reconcile it manually.
            </p>
          </>
        )}

        <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
          <Link
            href="/dashboard/subscription"
            className="inline-flex h-11 items-center rounded-full bg-gradient-to-r from-[#f4574a] to-[#ff7d68] px-6 text-sm font-semibold text-white shadow-[0_16px_40px_-16px_rgba(244,87,74,0.95)] transition hover:brightness-110 focus-visible:ring-2 focus-visible:ring-[#f4574a]/50 focus-visible:outline-none"
          >
            Go to Subscription
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex h-11 items-center rounded-full border border-border bg-background px-6 text-sm font-semibold text-foreground transition hover:border-[#f4574a]/50 hover:text-[#f4574a] focus-visible:ring-2 focus-visible:ring-[#f4574a]/50 focus-visible:outline-none"
          >
            Dashboard
          </Link>
        </div>
        {user ? null : (
          <p className="mt-4 text-[12.5px] text-muted-foreground">
            Signed out?{" "}
            <Link
              href="/sign-in"
              className="font-bold text-[#f4574a] hover:underline"
            >
              Sign in
            </Link>{" "}
            to see your plan.
          </p>
        )}
      </div>
    </div>
  )
}
