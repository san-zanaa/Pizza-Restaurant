import Link from "next/link"
import { CircleX, RotateCcw } from "lucide-react"

export const metadata = { title: "Payment Cancelled · PizzaHub" }

export default function PaymentCancelPage() {
  return (
    <div className="flex min-h-[calc(100svh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-8 text-center shadow-[0_40px_90px_-50px_rgba(0,0,0,0.5)]">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-rose-500/15 text-rose-400">
          <CircleX className="size-7" strokeWidth={2.4} />
        </span>
        <h1 className="mt-5 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          Checkout cancelled
        </h1>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
          No charge was made and your plan stays as it is. Whenever you&apos;re
          ready, the Premium upgrade is one click away.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
          <Link
            href="/dashboard/subscription"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-gradient-to-r from-[#f4574a] to-[#ff7d68] px-6 text-sm font-semibold text-white shadow-[0_16px_40px_-16px_rgba(244,87,74,0.95)] transition hover:brightness-110 focus-visible:ring-2 focus-visible:ring-[#f4574a]/50 focus-visible:outline-none"
          >
            <RotateCcw className="size-4" />
            Try again
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex h-11 items-center rounded-full border border-border bg-background px-6 text-sm font-semibold text-foreground transition hover:border-[#f4574a]/50 hover:text-[#f4574a] focus-visible:ring-2 focus-visible:ring-[#f4574a]/50 focus-visible:outline-none"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
