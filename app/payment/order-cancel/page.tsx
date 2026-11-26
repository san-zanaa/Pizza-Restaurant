import Link from "next/link"

export default function OrderPaymentCancelPage() {
  return (
    <div className="flex min-h-[calc(100svh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 text-center shadow-[0_40px_90px_-50px_rgba(0,0,0,0.5)]">
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
          Payment cancelled
        </h1>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
          No charge was made and no order was created. You can try again from
          the menu whenever you&apos;re ready.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
          <Link
            href="/menu"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-gradient-to-r from-[#f4574a] to-[#ff7d68] px-6 text-sm font-semibold text-white shadow-[0_16px_40px_-16px_rgba(244,87,74,0.95)] transition hover:brightness-110 focus-visible:ring-2 focus-visible:ring-[#f4574a]/50 focus-visible:outline-none">
            Back to menu
          </Link>
          <Link
            href="/dashboard/orders"
            className="inline-flex h-11 items-center gap-2 rounded-full border border-border bg-background px-6 text-sm font-semibold text-foreground transition hover:border-[#f4574a]/50 hover:text-[#f4574a] focus-visible:ring-2 focus-visible:ring-[#f4574a]/50 focus-visible:outline-none">
            My orders
          </Link>
        </div>
      </div>
    </div>
  )
}
