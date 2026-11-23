"use client"

import Link from "next/link"
import { ArrowRight, Pizza } from "lucide-react"
import { useEffect, useState } from "react"
import { apiGet } from "@/lib/client-fetch"
import { EmptyState, Loading } from "@/components/dashboard/ui-custom"
import { MenuItemCard } from "@/components/menu-item-card"
import { useInView } from "@/hooks/use-in-view"
import { cn } from "@/lib/utils"
import type { MenuItem } from "@/lib/types"

export function FeaturedMenu() {
  const [headerRef, headerVisible] = useInView<HTMLDivElement>(0.25)
  const [gridRef, gridVisible] = useInView<HTMLDivElement>(0.1)

  const [items, setItems] = useState<MenuItem[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let alive = true
    apiGet<{ items: MenuItem[] }>(`/api/menu?limit=8`).then(
      ({ data, error: err }) => {
        if (!alive) return
        setItems(data?.items ?? [])
        setError(err)
      }
    )
    return () => {
      alive = false
    }
  }, [])

  return (
    <section
      aria-labelledby="featured-heading"
      className="relative isolate overflow-hidden border-t border-border/60 bg-background py-16 sm:py-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 -z-10 size-[30rem] -translate-x-1/2 rounded-full bg-[#f4574a]/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -right-20 -z-10 size-80 rounded-full bg-[#ff9740]/10 blur-3xl"
      />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div ref={headerRef} className="mx-auto max-w-3xl text-center">
          <span
            className={cn(
              "standard-reveal inline-flex items-center gap-3 text-[11px] font-extrabold tracking-[0.3em] text-[#e63329] uppercase dark:text-[#ff7d68]",
              headerVisible && "is-in"
            )}>
            <span
              aria-hidden="true"
              className="h-px w-8 bg-gradient-to-r from-transparent to-[#f4574a]/70"
            />
            Fresh from the oven
            <span
              aria-hidden="true"
              className="h-px w-8 bg-gradient-to-l from-transparent to-[#f4574a]/70"
            />
          </span>

          <h2
            id="featured-heading"
            style={{ animationDelay: "80ms" }}
            className={cn(
              "standard-reveal mt-4 text-[clamp(1.75rem,1.1rem+2.4vw,2.75rem)] leading-[1.08] font-extrabold tracking-tight text-foreground",
              headerVisible && "is-in"
            )}>
            Featured Menu{" "}
            <span className="bg-gradient-to-r from-[#e63329] via-[#f4574a] to-[#ff8a5c] bg-clip-text text-transparent">
              Items
            </span>
          </h2>

          <p
            style={{ animationDelay: "160ms" }}
            className={cn(
              "standard-reveal mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground",
              headerVisible && "is-in"
            )}>
            Approved dishes, still in stock, straight from our vendors&apos;
            kitchens — tap through for the full story on each one.
          </p>
        </div>

        {error ? (
          <p className="mt-10 text-center text-sm text-rose-500">{error}</p>
        ) : items === null ? (
          <div className="mt-10">
            <Loading label="Fetching today&apos;s featured dishes…" />
          </div>
        ) : items.length === 0 ? (
          <div className="mt-10">
            <EmptyState
              icon={Pizza}
              title="Nothing featured yet"
              hint="Approved and available dishes will show up here as soon as vendors add them."
            />
          </div>
        ) : (
          <div
            ref={gridRef}
            className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.slice(0, 8).map((item, index) => (
              <MenuItemCard
                key={item._id}
                item={item}
                index={index}
                visible={gridVisible}
              />
            ))}
          </div>
        )}

        {items && items.length > 0 ? (
          <div
            style={{ animationDelay: "360ms" }}
            className={cn(
              "standard-reveal mt-10 text-center",
              gridVisible && "is-in"
            )}>
            <Link
              href="/menu"
              className="group inline-flex h-11 items-center gap-2 rounded-full bg-gradient-to-r from-[#f4574a] to-[#ff7d68] px-6 text-sm font-bold text-white shadow-[0_14px_30px_-16px_rgba(244,87,74,0.9)] transition hover:brightness-110 focus-visible:ring-2 focus-visible:ring-[#f4574a]/50 focus-visible:outline-none">
              Browse the full menu
              <ArrowRight
                className="size-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  )
}
