"use client"

import Link from "next/link"
import {
  CircleCheckBig,
  CreditCard,
  ShieldCheck,
  Store,
} from "lucide-react"
import { useEffect, useState } from "react"
import { apiGet } from "@/lib/client-fetch"
import type { AppUser } from "@/lib/types"

type Status = {
  plan?: string
  premium?: boolean
  expiresAt?: string | null
  session?: { id: string; status: string; paidAt: string | null } | null
}

const MAX_POLL_SECONDS = 30
const POLL_INTERVAL_MS = 5000

export function SuccessPage({
  sessionId,
  user,
}: {
  sessionId?: string
  user: AppUser | null
}) {
  const [status, setStatus] = useState<Status | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (!sessionId) return

    let alive = true
    let polls = 0

    const tick = async () => {
      const result = await apiGet<Status>(
        `/api/subscription/status?session_id=${encodeURIComponent(sessionId)}`
      )
      if (!alive) return
      setStatus(result.data ?? null)
      const sessionStatus = result.data?.session?.status
      if (sessionStatus === "paid") return
      if (sessionStatus === "failed" || sessionStatus === "expired") {
        setFailed(true)
        return
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

  const sessionStatus = status?.session?.status

  return (
    <div className="flex min-h-[calc(100svh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-8 text-center shadow-[0_40px_90px_-50px_rgba(0,0,0,0.5)]">
        {sessionStatus === "paid" ? (
          <>
            <span className="mx-auto grid size-16 place-items-center rounded-full bg-gradient-to-br from-[#34d399] to-[#10b981] text-emerald-950 shadow-[0_14px_36px_-14px_rgba(16,185,129,0.95)]">
              <CircleCheckBig className="size-7" strokeWidth={2.6} />
            </span>
            <h1 className="mt-5 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              Welcome to <span className="text-emerald-500">Premium</span>
            </h1>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Stripe confirmed your payment. Your transaction is saved in the
              ledger, and you can now publish unlimited active menu items.
            </p>
            <p className="mt-1.5 text-xs text-muted-foreground">
              Plan: Premium · Subscription ends{" "}
              {status?.expiresAt ? new Date(status.expiresAt).toLocaleDateString() : "30 days from today"}
            </p>
          </>
        ) : failed ? (
          <>
            <span className="mx-auto grid size-16 place-items-center rounded-full bg-rose-500/15 text-rose-500">
              <ShieldCheck className="size-7" />
            </span>
            <h1 className="mt-5 text-2xl font-extrabold tracking-tight text-foreground">
              Payment didn&apos;t go through
            </h1>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
              We couldn&apos;t confirm this checkout as paid within our tracking
              window. Your plan is unchanged, so there&apos;s nothing to revert.
              If you see a charge, contact support and we&apos;ll reconcile it
              manually.
            </p>
          </>
        ) : sessionStatus === "failed" || sessionStatus === "expired" ? (
          <>
            <span className="mx-auto grid size-16 place-items-center rounded-full bg-rose-500/15 text-rose-500">
              <ShieldCheck className="size-7" />
            </span>
            <h1 className="mt-5 text-2xl font-extrabold tracking-tight text-foreground">
              This checkout wasn&apos;t completed
            </h1>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
              The payment attempt ended without completing. Nothing was applied
              to your subscription — you can retry from the Subscription page.
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
              Stripe is verifying the purchase. We&apos;ll show your Premium
              status as soon as the payment is confirmed — usually in a few
              seconds.
            </p>
            <p className="mt-2 flex items-center justify-center gap-1.5 text-xs font-semibold text-[#f4574a]">
              <Store className="size-3.5" />
              <span>Checking again…</span>
            </p>
          </>
        )}

        <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
          {sessionStatus === "paid" || sessionStatus === "failed" || sessionStatus === "expired" ? (
            <>
              <Link
                href="/dashboard/subscription"
                className="inline-flex h-11 items-center rounded-full bg-gradient-to-r from-[#f4574a] to-[#ff7d68] px-6 text-sm font-semibold text-white shadow-[0_16px_40px_-16px_rgba(244,87,74,0.95)] transition hover:brightness-110 focus-visible:ring-2 focus-visible:ring-[#f4574a]/50 focus-visible:outline-none">
                Go to Subscription
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex h-11 items-center rounded-full border border-border bg-background px-6 text-sm font-semibold text-foreground transition hover:border-[#f4574a]/50 hover:text-[#f4574a] focus-visible:ring-2 focus-visible:ring-[#f4574a]/50 focus-visible:outline-none">
                Dashboard
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
            to see your plan.
          </p>
        )}
      </div>
    </div>
  )
}
