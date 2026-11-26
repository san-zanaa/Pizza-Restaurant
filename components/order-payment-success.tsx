"use client"

import Link from "next/link"
import {
  CircleCheckBig,
  CreditCard,
  LoaderCircle,
  Pizza,
  ShieldCheck,
} from "lucide-react"
import { useEffect, useState } from "react"
import { apiGet } from "@/lib/client-fetch"
import type { AppUser, Order } from "@/lib/types"

type VerifyResult = {
  status: string
  orders: Order[]
}

const MAX_POLL_SECONDS = 30
const POLL_INTERVAL_MS = 4000

export function OrderPaymentSuccess({
  sessionId,
  user,
}: {
  sessionId?: string
  user: AppUser | null
}) {
  const [result, setResult] = useState<VerifyResult | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (!sessionId) return

    let alive = true
    let polls = 0

    const tick = async () => {
      const res = await apiGet<VerifyResult>(
        `/api/orders/verify-session?session_id=${encodeURIComponent(sessionId)}`
      )
      if (!alive) return
      if (res.data) setResult(res.data)
      const status = res.data?.status
      if (status === "paid") return
      if (status === "failed" || status === "expired" || res.error) {
        // Only mark failed if we've retried a bit.
        polls += 1
        if (polls >= 3) {
          setFailed(true)
          return
        }
      }
      polls += 1
      if (polls * POLL_INTERVAL_MS < MAX_POLL_SECONDS * 1000) {
        window.setTimeout(tick, POLL_INTERVAL_MS)
      } else {
        setFailed(true)
      }
    }

    void tick()
    return () => {
      alive = false
    }
  }, [sessionId])

  const status = result?.status
  const orders = result?.orders ?? []
  const paid = status === "paid" && orders.length > 0

  return (
    <div className="flex min-h-[calc(100svh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-8 text-center shadow-[0_40px_90px_-50px_rgba(0,0,0,0.5)]">
        {paid ? (
          <>
            <span className="mx-auto grid size-16 place-items-center rounded-full bg-gradient-to-br from-[#34d399] to-[#10b981] text-emerald-950 shadow-[0_14px_36px_-14px_rgba(16,185,129,0.95)]">
              <CircleCheckBig className="size-7" strokeWidth={2.6} />
            </span>
            <h1 className="mt-5 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              Payment confirmed
            </h1>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Your order is placed and pending vendor acceptance. Track it any
              time from your dashboard.
            </p>
            <ul className="mt-5 space-y-2 text-left">
              {orders.map((order) => (
                <li
                  key={order._id}
                  className="flex items-center gap-3 rounded-2xl border border-border bg-muted/30 px-3.5 py-2.5"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#f4574a]/10 text-[#f4574a]">
                    <Pizza className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13.5px] font-bold text-foreground">
                      {order.itemName}
                    </p>
                    <p className="truncate text-[11.5px] text-muted-foreground">
                      {order.vendorName} · {order.deliveryDate}
                    </p>
                  </div>
                  <p className="shrink-0 text-[13.5px] font-extrabold text-foreground">
                    ৳{order.itemPrice.toFixed(0)}
                  </p>
                </li>
              ))}
            </ul>
          </>
        ) : failed ? (
          <>
            <span className="mx-auto grid size-16 place-items-center rounded-full bg-rose-500/15 text-rose-500">
              <ShieldCheck className="size-7" />
            </span>
            <h1 className="mt-5 text-2xl font-extrabold tracking-tight text-foreground">
              We couldn&apos;t confirm your order
            </h1>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Payment may still be processing. Check your orders page in a
              moment — if you were charged, the order will appear there. If not,
              you can retry from the menu.
            </p>
          </>
        ) : (
          <>
            <span className="mx-auto grid size-16 place-items-center rounded-full bg-amber-500/15 text-amber-500">
              <CreditCard className="size-7" />
            </span>
            <h1 className="mt-5 text-2xl font-extrabold tracking-tight text-foreground">
              Confirming your payment…
            </h1>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Stripe is verifying the purchase. We&apos;ll show your order as
              soon as payment is confirmed — usually in a few seconds.
            </p>
            <p className="mt-2 flex items-center justify-center gap-1.5 text-xs font-semibold text-[#f4574a]">
              <LoaderCircle className="size-3.5 animate-spin motion-reduce:animate-none" />
              <span>Checking again…</span>
            </p>
          </>
        )}

        <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
          {paid ? (
            <>
              <Link
                href="/dashboard/orders"
                className="inline-flex h-11 items-center rounded-full bg-gradient-to-r from-[#f4574a] to-[#ff7d68] px-6 text-sm font-semibold text-white shadow-[0_16px_40px_-16px_rgba(244,87,74,0.95)] transition hover:brightness-110 focus-visible:ring-2 focus-visible:ring-[#f4574a]/50 focus-visible:outline-none">
                View my orders
              </Link>
              <Link
                href="/menu"
                className="inline-flex h-11 items-center rounded-full border border-border bg-background px-6 text-sm font-semibold text-foreground transition hover:border-[#f4574a]/50 hover:text-[#f4574a] focus-visible:ring-2 focus-visible:ring-[#f4574a]/50 focus-visible:outline-none">
                Browse menu
              </Link>
            </>
          ) : failed ? (
            <>
              <Link
                href="/menu"
                className="inline-flex h-11 items-center rounded-full bg-gradient-to-r from-[#f4574a] to-[#ff7d68] px-6 text-sm font-semibold text-white shadow-[0_16px_40px_-16px_rgba(244,87,74,0.95)] transition hover:brightness-110 focus-visible:ring-2 focus-visible:ring-[#f4574a]/50 focus-visible:outline-none">
                Back to menu
              </Link>
              <Link
                href="/dashboard/orders"
                className="inline-flex h-11 items-center rounded-full border border-border bg-background px-6 text-sm font-semibold text-foreground transition hover:border-[#f4574a]/50 hover:text-[#f4574a] focus-visible:ring-2 focus-visible:ring-[#f4574a]/50 focus-visible:outline-none">
                My orders
              </Link>
            </>
          ) : (
            <Link
              href="/dashboard"
              className="inline-flex h-11 items-center rounded-full border border-border bg-background px-6 text-sm font-semibold text-foreground transition hover:border-[#f4574a]/50 hover:text-[#f4574a] focus-visible:ring-2 focus-visible:ring-[#f4574a]/50 focus-visible:outline-none">
              Back to Dashboard
            </Link>
          )}
        </div>

        {user ? null : (
          <p className="mt-4 text-[12.5px] text-muted-foreground">
            Signed out?{" "}
            <Link href="/sign-in" className="font-bold text-[#f4574a] hover:underline">
              Sign in
            </Link>{" "}
            to see your orders.
          </p>
        )}
      </div>
    </div>
  )
}
