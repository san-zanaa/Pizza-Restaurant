"use client"

import Link from "next/link"
import {
  ArrowRight,
  Cake,
  ChefHat,
  CupSoda,
  Pizza,
  Sandwich,
} from "lucide-react"
import { useEffect, useState } from "react"
import { apiGet } from "@/lib/client-fetch"
import { useInView } from "@/hooks/use-in-view"
import { MENU_CATEGORIES } from "@/lib/types"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

type CategoryRow = { category: string; count: number | null }

/**
 * Accent palette, cycled across however many categories the API returns so
 * the grid still looks right if a category is added later.
 */
const ACCENTS: { tile: string; count: string; explore: string; hover: string; focus: string }[] = [
  { tile: "bg-[#f4574a]/10 text-[#f4574a] ring-[#f4574a]/25", count: "text-[#f4574a]", explore: "text-[#f4574a]", hover: "hover:border-[#f4574a]/45 hover:shadow-[0_18px_40px_-26px_rgba(244,87,74,0.75)]", focus: "focus-visible:ring-[#f4574a]/50" },
  { tile: "bg-violet-500/10 text-violet-600 ring-violet-500/25 dark:text-violet-400", count: "text-violet-600 dark:text-violet-400", explore: "text-violet-600 dark:text-violet-400", hover: "hover:border-violet-500/45 hover:shadow-[0_18px_40px_-26px_rgba(139,92,246,0.75)]", focus: "focus-visible:ring-violet-500/50" },
  { tile: "bg-indigo-500/10 text-indigo-600 ring-indigo-500/25 dark:text-indigo-400", count: "text-indigo-600 dark:text-indigo-400", explore: "text-indigo-600 dark:text-indigo-400", hover: "hover:border-indigo-500/45 hover:shadow-[0_18px_40px_-26px_rgba(99,102,241,0.75)]", focus: "focus-visible:ring-indigo-500/50" },
  { tile: "bg-sky-500/10 text-sky-600 ring-sky-500/25 dark:text-sky-400", count: "text-sky-600 dark:text-sky-400", explore: "text-sky-600 dark:text-sky-400", hover: "hover:border-sky-500/45 hover:shadow-[0_18px_40px_-26px_rgba(14,165,233,0.75)]", focus: "focus-visible:ring-sky-500/50" },
  { tile: "bg-amber-500/10 text-amber-600 ring-amber-500/25 dark:text-amber-400", count: "text-amber-600 dark:text-amber-400", explore: "text-amber-600 dark:text-amber-400", hover: "hover:border-amber-500/45 hover:shadow-[0_18px_40px_-26px_rgba(245,158,11,0.75)]", focus: "focus-visible:ring-amber-500/50" },
  { tile: "bg-pink-500/10 text-pink-600 ring-pink-500/25 dark:text-pink-400", count: "text-pink-600 dark:text-pink-400", explore: "text-pink-600 dark:text-pink-400", hover: "hover:border-pink-500/45 hover:shadow-[0_18px_40px_-26px_rgba(236,72,153,0.75)]", focus: "focus-visible:ring-pink-500/50" },
]

/** Icon matched against the category name so tiles never show a stale icon. */
const ICON_MATCHES: Array<[RegExp, LucideIcon]> = [
  [/pizza/i, Pizza],
  [/side|appetizer/i, Sandwich],
  [/dessert|sweet|cake/i, Cake],
  [/beverage|drink|soda/i, CupSoda],
  [/pasta|gourmet/i, ChefHat],
]

const iconFor = (name: string): LucideIcon =>
  ICON_MATCHES.find(([pattern]) => pattern.test(name))?.[1] ?? Pizza

export function PizzaCategories() {
  const [headerRef, headerVisible] = useInView<HTMLDivElement>(0.25)
  const [gridRef, gridVisible] = useInView<HTMLDivElement>(0.1)

  const [rows, setRows] = useState<CategoryRow[] | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let alive = true
    apiGet<{ categories: CategoryRow[] }>("/api/menu/categories").then(
      ({ data, error }) => {
        if (!alive) return
        if (error || !data) {
          setFailed(true)
          return
        }
        setRows(data.categories)
      }
    )
    return () => {
      alive = false
    }
  }, [])

  const countLabel = (count: number | null) => {
    if (count !== null) return `${count} ${count === 1 ? "dish" : "dishes"}`
    return failed ? "—" : "…"
  }

  // Until the counts land we render the canonical list so the tiles (and their
  // links) are never pointing at a category that doesn't exist.
  const tiles: CategoryRow[] =
    rows ?? MENU_CATEGORIES.map((category) => ({ category, count: null }))

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
          className="mt-10 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3">
          {tiles.map(({ category, count }, index) => {
            const Icon = iconFor(category)
            const accent = ACCENTS[index % ACCENTS.length]
            return (
              <Link
                key={category}
                href={`/menu?category=${encodeURIComponent(category)}`}
                style={{ animationDelay: `${index * 70}ms` }}
                aria-label={`Explore ${category}`}
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
                  {category}
                </span>

                <span className="mt-2 flex items-center justify-between gap-2 border-t border-border pt-2.5">
                  <span
                    className={cn(
                      "text-[11.5px] font-bold tracking-wide",
                      accent.count
                    )}>
                    {countLabel(count)}
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
