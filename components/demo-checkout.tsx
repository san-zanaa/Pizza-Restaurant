"use client"

import Image from "next/image"
import {
  ArrowRight,
  CreditCard,
  LoaderCircle,
  Pizza,
  ShieldCheck,
  X,
} from "lucide-react"
import { useEffect } from "react"
import { Alert } from "@/components/dashboard/ui-custom"

export type CheckoutLine = {
  image: string
  name: string
  vendor: string
  deliveryLabel?: string
  amount: number
}

const money = (value: number) => `৳${value.toFixed(2)}`

export function DemoCheckout({
  open,
  lines,
  subtotal,
  discount = 0,
  paying = false,
  error = null,
  onConfirm,
  onBack,
}: {
  open: boolean
  lines: CheckoutLine[]
  subtotal: number
  discount?: number
  paying?: boolean
  error?: string | null
  onConfirm: () => void
  onBack: () => void
}) {
  // Escape returns to the order details, but never mid-payment.
  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !paying) onBack()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [open, paying, onBack])

  if (!open) return null

  const total = Math.max(0, subtotal - discount)

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="demo-checkout-title"
    >
      <div className="relative my-auto w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl sm:p-7">
        <button
          type="button"
          onClick={onBack}
          disabled={paying}
          aria-label="Close checkout"
          className="absolute top-5 right-5 grid size-9 place-items-center rounded-full border border-border text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-40"
        >
          <X className="size-4" />
        </button>

        

        <h2
          id="demo-checkout-title"
          className="mt-4 text-[26px] leading-tight font-extrabold tracking-tight text-foreground"
        >
          Checkout
        </h2>

        <div className="mt-4 flex items-center gap-3 rounded-2xl border border-border bg-muted/40 px-4 py-3">
          <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-emerald-500/12 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="size-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[13.5px] font-bold text-foreground">
              Secure payment
            </p>
            <p className="truncate text-[12px] text-muted-foreground">
              You&apos;ll be redirected to Stripe to complete payment
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-amber-500/15 px-2.5 py-1 text-[10px] font-extrabold tracking-wider text-amber-600 uppercase dark:text-amber-300">
            Test mode
          </span>
        </div>

        <ul className="mt-4 divide-y divide-border rounded-2xl border border-border">
          {lines.map((line, index) => (
            <li key={`${line.name}-${index}`} className="flex items-center gap-3 p-3.5">
              {line.image ? (
                <Image
                  src={line.image}
                  alt={line.name}
                  width={44}
                  height={44}
                  className="size-11 shrink-0 rounded-xl border border-border object-cover"
                />
              ) : (
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-muted text-muted-foreground">
                  <Pizza className="size-5" />
                </span>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-bold text-foreground">
                  {line.name}
                </p>
                <p className="truncate text-[12px] text-muted-foreground">
                  {line.vendor}
                  {line.deliveryLabel ? ` · ${line.deliveryLabel}` : ""}
                </p>
              </div>
              <p className="shrink-0 text-[14.5px] font-extrabold text-foreground">
                {money(line.amount)}
              </p>
            </li>
          ))}
        </ul>

        {discount > 0 ? (
          <p className="mt-2 flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2.5 text-[13px] font-bold text-emerald-700 dark:text-emerald-300">
            <span>Combo discount</span>
            <span>−{money(discount)}</span>
          </p>
        ) : null}

        <div className="mt-4 flex items-center gap-3 rounded-2xl border border-[#635bff]/25 bg-[#635bff]/8 px-4 py-3">
          <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#635bff]/15 text-[#635bff]">
            <CreditCard className="size-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[13.5px] font-bold text-foreground">
              Powered by Stripe
            </p>
            <p className="truncate text-[12px] text-muted-foreground">
              Use test card 4242 4242 4242 4242, any future expiry, any CVC
            </p>
          </div>
        </div>

        <p className="mt-3.5 text-[11.5px] leading-relaxed text-muted-foreground">
          You&apos;ll be taken to Stripe&apos;s secure checkout to complete the
          payment. The order is created only after payment succeeds.
        </p>

        {error ? (
          <div className="mt-4">
            <Alert kind="error">{error}</Alert>
          </div>
        ) : null}

        <button
          type="button"
          onClick={onConfirm}
          disabled={paying}
          className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#f4574a] to-[#ff7d68] text-[15px] font-bold text-white shadow-[0_14px_34px_-16px_rgba(244,87,74,0.95)] transition hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {paying ? (
            <>
              <LoaderCircle className="size-4 animate-spin motion-reduce:animate-none" />
              Redirecting…
            </>
          ) : (
            <>
              Pay {money(total)}
              <ArrowRight className="size-4" />
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onBack}
          disabled={paying}
          className="mt-3.5 w-full rounded-full py-2 text-[13.5px] font-semibold text-muted-foreground transition hover:text-foreground disabled:opacity-50"
        >
          Back to order details
        </button>
      </div>
    </div>
  )
}
