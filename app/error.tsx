"use client"

import { Image as ImageIcon, RefreshCw, TriangleAlert } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

/**
 * Route error boundary. Handles failed API requests (inside client
 * components too), invalid form submissions, unauthorized access, missing
 * records and similar failures.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const status = (error as { status?: number }).status
  const label = status
    ? `Request failed (${status})`
    : "Something went wrong while loading this page"
  const [showDigest, setShowDigest] = useState(false)

  return (
    <div className="flex min-h-[calc(100svh-4rem)] flex-col items-center justify-center px-4 text-center">
      <span className="grid size-16 place-items-center rounded-full bg-rose-500/10 text-rose-500">
        <TriangleAlert className="size-6" />
      </span>
      <h1 className="mt-5 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
        {label}
      </h1>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
        {error.message ||
          "The server is having a moment. Your pizza — and the rest of the menu — are fine."}
      </p>
      {error.digest ? (
        <button
          type="button"
          onClick={() => setShowDigest((v) => !v)}
          className="mt-3 text-[12.5px] font-bold text-[#f4574a] hover:underline">
          {showDigest ? "Hide" : "View"} error reference
        </button>
      ) : null}
      {showDigest ? (
        <p className="mt-2 font-mono text-[11px] text-muted-foreground">
          {error.digest}
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={reset}
          className="inline-flex h-10 items-center gap-2 rounded-full bg-gradient-to-r from-[#f4574a] to-[#ff7d68] px-5 text-sm font-semibold text-white shadow-[0_8px_20px_-12px_rgba(244,87,74,0.8)] transition hover:brightness-110 focus-visible:ring-2 focus-visible:ring-[#f4574a]/50 focus-visible:outline-none active:scale-95">
          <RefreshCw className="size-4" />
          Try again
        </button>
      </div>

      <p className="mt-4 flex items-center justify-center gap-1.5 text-[12.5px] text-muted-foreground">
        <ImageIcon className="size-3.5 text-[#f4574a]" />
        <Link href="/" className="font-bold text-[#f4574a] hover:underline">
          Back to the menu
        </Link>{" "}
        is always a click away.
      </p>
    </div>
  )
}
