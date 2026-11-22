"use client"

import Link from "next/link"
import { ArrowRight, Beef, ChefHat, CupSoda, Leaf, Pizza, Sandwich } from "lucide-react"
import { useEffect, useState } from "react"
import { apiGet } from "@/lib/client-fetch"
import { useInView } from "@/hooks/use-in-view"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

type CategoryTile = {
  name: string
  icon: LucideIcon
  accent: {
    tile: string
    count: string
    explore: string
    hover: string
    focus: string
  }
}

const CATEGORIES: CategoryTile[] = [
  {
    name: "Classic Pizzas",
    icon: Pizza,
    accent: {
      tile: "bg-[#f4574a]/10 text-[#f4574a] ring-[#f4574a]/25",
      count: "text-[#f4574a]",
      explore: "text-[#f4574a]",
      hover: "hover:border-[#f4574a]/45 hover:shadow-[0_18px_40px_-26px_rgba(244,87,74,0.75)]",
      focus: "focus-visible:ring-[#f4574a]/50",
    },
  },
  {
    name: "Vegetarian Pizzas",
    icon: Leaf,
    accent: {
      tile: "bg-emerald-500/10 text-emerald-600 ring-emerald-500/25 dark:text-emerald-400",
      count: "text-emerald-600 dark:text-emerald-400",
      explore: "text-emerald-600 dark:text-emerald-400",
      hover: "hover:border-emerald-500/45 hover:shadow-[0_18px_40px_-26px_rgba(16,185,129,0.75)]",
      focus: "focus-visible:ring-emerald-500/50",
    },
  },
  {
    name: "Meat Lovers",
    icon: Beef,
    accent: {
      tile: "bg-orange-500/10 text-orange-600 ring-orange-500/25 dark:text-orange-400",
      count: "text-orange-600 dark:text-orange-400",
      explore: "text-orange-600 dark:text-orange-400",
      hover: "hover:border-orange-500/45 hover:shadow-[0_18px_40px_-26px_rgba(249,115,22,0.75)]",
      focus: "focus-visible:ring-orange-500/50",
    },
  },
  {
    name: "Specialty / Gourmet Pizzas",
    icon: ChefHat,
    accent: {
      tile: "bg-violet-500/10 text-violet-600 ring-violet-500/25 dark:text-violet-400",
      count: "text-violet-600 dark:text-violet-400",
      explore: "text-violet-600 dark:text-violet-400",
      hover: "hover:border-violet-500/45 hover:shadow-[0_18px_40px_-26px_rgba(139,92,246,0.75)]",
      focus: "focus-visible:ring-violet-500/50",
    },
  },
  {
    name: "Sides & Appetizers",
    icon: Sandwich,
    accent: {
      tile: "bg-sky-500/10 text-sky-600 ring-sky-500/25 dark:text-sky-400",
      count: "text-sky-600 dark:text-sky-400",
      explore: "text-sky-600 dark:text-sky-400",
      hover: "hover:border-sky-500/45 hover:shadow-[0_18px_40px_-26px_rgba(14,165,233,0.75)]",
      focus: "focus-visible:ring-sky-500/50",
    },
  },
  {
    name: "Beverages & Desserts",
    icon: CupSoda,
    accent: {
      tile: "bg-amber-500/10 text-amber-600 ring-amber-500/25 dark:text-amber-400",
      count: "text-amber-600 dark:text-amber-400",
      explore: "text-amber-600 dark:text-amber-400",
      hover: "hover:border-amber-500/45 hover:shadow-[0_18px_40px_-26px_rgba(245,158,11,0.75)]",
      focus: "focus-visible:ring-amber-500/50",
    },
  },
]

export function PizzaCategories() {
  const [headerRef, headerVisible] = useInView<HTMLDivElement>(0.25)
  const [gridRef, gridVisible] = useInView<HTMLDivElement>(0.1)

  const [counts, setCounts] = useState<Record<string, number> | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let alive = true
    apiGet<{ categories: { category: string; count: number }[] }>(
      "/api/menu/categories"
    ).then(({ data, error }) => {
      if (!alive) return
      if (error || !data) {
        setFailed(true)
        return
      }
      setCounts(
        Object.fromEntries(data.categories.map((row) => [row.category, row.count]))
      )
    })
    return () => {
      alive = false
    }
  }, [])

  const countLabel = (name: string) => {
    if (counts) {
      const n = counts[name] ?? 0
      return `${n} ${n === 1 ? "dish" : "dishes"}`
    }
    return failed ? "—" : "…"
  }

  return (
    <section
      aria-labelledby="categories-heading"
      className="relative isolate overflow-hidden border-t border-border/60 bg-[#fffaf5] py-16 sm:py-20 dark:bg-[#0b0a09]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-16 -z-10 size-80 rounded-full bg-[#ff9740]/12 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-28 -left-20 -z-10 size-96 rounded-full bg-[#f4574a]/10 blur-3xl"
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
            Explore the menu
            <span
              aria-hidden="true"
              className="h-px w-8 bg-gradient-to-l from-transparent to-[#f4574a]/70"
            />
          </span>

          <h2
            id="categories-heading"
            style={{ animationDelay: "80ms" }}
            className={cn(
              "standard-reveal mt-4 text-[clamp(1.75rem,1.1rem+2.4vw,2.75rem)] leading-[1.08] font-extrabold tracking-tight text-foreground",
              headerVisible && "is-in"
            )}>
            Pizza{" "}
            <span className="bg-gradient-to-r from-[#e63329] via-[#f4574a] to-[#ff8a5c] bg-clip-text text-transparent">
              Categories
            </span>
          </h2>

          <p
            style={{ animationDelay: "160ms" }}
            className={cn(
              "standard-reveal mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground",
              headerVisible && "is-in"
            )}>
            From wood-fired classics to sides and sips — pick a category and
            jump straight into the live menu.
          </p>
        </div>

        <div
          ref={gridRef}
          className="mt-10 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-6">
          {CATEGORIES.map((tile, index) => {
            const { icon: Icon, name, accent } = tile
            return (
              <Link
                key={name}
                href={`/menu?category=${encodeURIComponent(name)}`}
                style={{ animationDelay: `${index * 70}ms` }}
                aria-label={`Explore ${name}`}
                className={cn(
                  "standard-reveal group flex flex-col rounded-2xl border border-border bg-card p-4 text-left shadow-sm sm:p-5",
                  "transition-all duration-300 hover:-translate-y-1",
                  accent.hover,
                  accent.focus,
                  "focus-visible:ring-2 focus-visible:outline-none",
                  gridVisible && "is-in"
                )}>
                <span
                  aria-hidden="true"
                  className={cn(
                    "inline-flex size-11 shrink-0 items-center justify-center rounded-xl ring-1 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105",
                    accent.tile
                  )}>
                  <Icon className="size-5" strokeWidth={2.1} />
                </span>

                <span className="mt-3.5 min-h-[2.5rem] text-[13.5px] leading-snug font-extrabold text-foreground sm:text-sm">
                  {name}
                </span>

                <span className="mt-2 flex items-center justify-between gap-2 border-t border-border pt-2.5">
                  <span
                    className={cn(
                      "text-[11.5px] font-bold tracking-wide",
                      accent.count
                    )}>
                    {countLabel(name)}
                  </span>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "inline-flex items-center gap-0.5 text-[11.5px] font-extrabold opacity-80 transition-all group-hover:translate-x-0.5 group-hover:opacity-100",
                      accent.explore
                    )}>
                    Explore
                    <ArrowRight className="size-3.5" />
                  </span>
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
