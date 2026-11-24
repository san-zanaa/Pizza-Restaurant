"use client"

import { useState } from "react"
import {
  BadgeCheck,
  Check,
  Crown,
  LoaderCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react"
import { apiSend } from "@/lib/client-fetch"
import { cn } from "@/lib/utils"
import { Alert, PageHeader } from "@/components/dashboard/ui"
import type { AppUser } from "@/lib/types"

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    tagline: "For vendors getting their first dishes online.",
    cta: "Current plan",
    features: [
      { text: "Max 3 active menu items", included: true },
      { text: "Basic vendor dashboard", included: true },
      { text: "Order management", included: true },
      { text: "Premium vendor badge", included: false },
      { text: "Featured menu placement", included: false },
      { text: "Unlimited active items", included: false },
    ],
  },
  {
    id: "premium",
    name: "Premium",
    price: "$29",
    tagline: "For pizzerias ready to fill every table.",
    cta: "Upgrade to Premium",
    features: [
      { text: "Unlimited active menu items", included: true },
      { text: "Premium vendor badge", included: true },
      { text: "Featured menu placement", included: true },
      { text: "All Free features", included: true },
      { text: "Priority review of new items", included: true },
      { text: "Dedicated payout support", included: true },
    ],
  },
] as const


export function SubscriptionPage({ user }: { user: AppUser }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const upgrade = async () => {
    if (busy) return
    setBusy(true)
    setError(null)
    const { data, error: err } = await apiSend<{ url?: string }>(
      "/api/subscription/checkout",
      "POST"
    )
    if (err) {
      setError(err)
      setBusy(false)
      return
    }
    if (data?.url) {
      window.location.assign(data.url)
      return
    }
    setError("Stripe didn't return a checkout link — try again.")
    setBusy(false)
  }

  return (
    <>
      <PageHeader
        title="Subscription"
        subtitle="Your plan decides how many active items you can publish."
      />

      {error ? (
        <div className="mb-5 max-w-3xl">
          <Alert kind="error">{error}</Alert>
        </div>
      ) : null}

      <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2">
        {PLANS.map((plan) => {
          const isCurrent =
            (plan.id === "premium") === (user.plan === "premium")
          const isPremium = plan.id === "premium"
          return (
            <div
              key={plan.id}
              className={cn(
                "relative overflow-hidden rounded-3xl border bg-card p-6 shadow-sm",
                isPremium
                  ? "border-[#ff9e2c]/50 shadow-[0_20px_50px_-30px_rgba(255,158,44,0.55)]"
                  : "border-border",
                isCurrent && "ring-2 ring-[#f4574a]/40"
              )}
            >
              {isPremium ? (
                <span className="absolute top-4 right-4 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#f4574a] to-[#ff9e2c] px-2.5 py-1 text-[10px] font-extrabold tracking-wider text-white uppercase">
                  <Sparkles className="size-3" />
                  Best value
                </span>
              ) : null}
              <p className="flex items-center gap-2 text-[15px] font-extrabold text-foreground">
                <Crown
                  className={cn(
                    "size-4",
                    isPremium
                      ? "text-[#e07f00] dark:text-[#ffb454]"
                      : "text-muted-foreground"
                  )}
                />
                {plan.name}
              </p>
              <p className="mt-1 text-[13px] text-muted-foreground">
                {plan.tagline}
              </p>
              <p className="mt-4 text-4xl font-extrabold tracking-tight text-foreground">
                {plan.price}
                <span className="text-base font-semibold text-muted-foreground">
                  {isPremium ? " one-time" : ""}
                </span>
              </p>

              <ul className="mt-5 flex flex-col gap-2.5">
                {plan.features.map((feature) => (
                  <li
                    key={feature.text}
                    className="flex items-start gap-2.5 text-[13px]"
                  >
                    {feature.included ? (
                      <Check className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                    ) : (
                      <span className="mt-0.5 grid size-4 shrink-0 place-items-center text-muted-foreground/50">
                        —
                      </span>
                    )}
                    <span
                      className={cn(
                        feature.included
                          ? "text-foreground"
                          : "text-muted-foreground line-through"
                      )}
                    >
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              {isCurrent ? (
                <span className="mt-6 flex h-11 items-center justify-center gap-2 rounded-full border border-[#f4574a]/50 bg-[#f4574a]/10 text-sm font-bold text-[#f4574a]">
                  <BadgeCheck className="size-4" />
                  {user.plan === "premium" ? "Premium active" : "Current plan"}
                </span>
              ) : isPremium ? (
                <button
                  type="button"
                  onClick={upgrade}
                  disabled={busy}
                  className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#f4574a] to-[#ff7d68] text-sm font-bold text-white shadow-[0_16px_40px_-16px_rgba(244,87,74,0.95)] transition hover:brightness-110 focus-visible:ring-2 focus-visible:ring-[#f4574a]/50 focus-visible:outline-none active:scale-[0.98] disabled:cursor-wait disabled:opacity-70"
                >
                  {busy ? (
                    <LoaderCircle className="size-4 animate-spin motion-reduce:animate-none" />
                  ) : (
                    <Crown className="size-4" />
                  )}
                  {busy ? "Starting checkout…" : "Upgrade to Premium"}
                </button>
              ) : (
                <span className="mt-6 flex h-11 items-center justify-center rounded-full bg-muted text-sm font-bold text-muted-foreground">
                  Free forever
                </span>
              )}
            </div>
          )
        })}
      </div>

      <div className="mx-auto mt-5 flex max-w-3xl items-start gap-2.5 rounded-2xl border border-border bg-card p-4 text-[12.5px] leading-snug text-muted-foreground">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-500" />
        <p>
          Checkout is powered by Stripe. We never see your card details — and
          your Premium plan is activated only after Stripe confirms the payment.
          You&apos;ll get a Payment Success page on return, and the transaction
          appears in the admin ledger immediately.
        </p>
      </div>
    </>
  )
}
