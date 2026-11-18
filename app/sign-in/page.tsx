import Link from "next/link"

export default function SignInPage() {
  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <div className="flex w-full max-w-sm flex-col items-center gap-4 rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <h1 className="text-lg font-semibold">Sign in to PizzaHub</h1>
        <p className="text-sm text-muted-foreground">
          The sign-in flow will be wired up here. For now, this is a placeholder so the button
          doesn&apos;t 404.
        </p>
        <Link
          href="/"
          className="inline-flex h-9 items-center justify-center rounded-full bg-gradient-to-r from-[#f4574a] to-[#ff7d68] px-5 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(244,87,74,0.35)] transition hover:brightness-110 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}
