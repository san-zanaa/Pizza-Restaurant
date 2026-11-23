export default function Loading() {
  return (
    <div className="flex min-h-[calc(100svh-4rem)] items-center justify-center">
      <div className="flex items-center gap-3">
        <span className="size-9 animate-pulse rounded-full bg-primary/15" aria-hidden="true" />
        <span className="size-9 animate-pulse rounded-full bg-primary/15" style={{ animationDelay: "120ms" }} aria-hidden="true" />
        <span className="size-9 animate-pulse rounded-full bg-primary/15" style={{ animationDelay: "240ms" }} aria-hidden="true" />
      </div>
      <p className="sr-only">Loading…</p>
    </div>
  )
}
