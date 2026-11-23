"use client"

import Link from "next/link"
import { ArrowRight, Flame, MapPin, Pizza } from "lucide-react"
import { useEffect, useState } from "react"
import { apiGet } from "@/lib/client-fetch"
import { EmptyState, Loading } from "@/components/dashboard/ui-custom"
import { useInView } from "@/hooks/use-in-view"
import { cn } from "@/lib/utils"
import { primaryImage, type MenuItem } from "@/lib/types"

type Combo = { items: MenuItem[] }

export function PopularCombos() {
  const [headerRef, headerVisible] = useInView<HTMLDivElement>(0.25)
  const [gridRef, gridVisible] = useInView<HTMLDivElement>(0.1)

  const [combos, setCombos] = useState<Combo[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let alive = true
    apiGet<{ items: MenuItem[] }>(`/api/menu?limit=4`).then(
      ({ data, error: err }) => {
        if (!alive) return
        if (err || !data) {
          setError(err)
          setCombos([])
          return
        }
        const items = data.items ?? []
        const paired: Combo[] = []
        for (let i = 0; i + 1 < items.length; i += 2) {
          paired.push({ items: [items[i], items[i + 1]] })
        }
        setCombos(paired.slice(0, 2))
      }
    )
    return () => {
      alive = false
    }
  }, [])

  return (
    <section
      aria-labelledby="combos-heading"
      className="relative isolate overflow-hidden border-t border-border/60 bg-[#fffaf5] py-16 sm:py-20 dark:bg-[#0b0a09]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 -z-10 size-[30rem] -translate-x-1/2 rounded-full bg-[#ff9740]/12 blur-3xl"
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
            Crowd favourites
            <span
              aria-hidden="true"
              className="h-px w-8 bg-gradient-to-l from-transparent to-[#f4574a]/70"
            />
          </span>

          <h2
            id="combos-heading"
            style={{ animationDelay: "80ms" }}
            className={cn(
              "standard-reveal mt-4 text-[clamp(1.75rem,1.1rem+2.4vw,2.75rem)] leading-[1.08] font-extrabold tracking-tight text-foreground",
              headerVisible && "is-in"
            )}>
            Popular Pizza{" "}
            <span className="bg-gradient-to-r from-[#e63329] via-[#f4574a] to-[#ff8a5c] bg-clip-text text-transparent">
              Combos
            </span>
          </h2>

          <p
            style={{ animationDelay: "160ms" }}
            className={cn(
              "standard-reveal mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground",
              headerVisible && "is-in"
            )}>
            Two of our most-loved dishes paired together — pick a combo and
            order it straight to your door.
          </p>
        </div>

        {error ? (
          <p className="mt-10 text-center text-sm text-rose-500">{error}</p>
        ) : combos === null ? (
          <div className="mt-10">
            <Loading label="Loading popular combos…" />
          </div>
        ) : combos.length === 0 ? (
          <div className="mt-10">
            <EmptyState
              icon={Pizza}
              title="No combos yet"
              hint="Popular dishes will show up here as soon as they're available."
            />
          </div>
        ) : (
          <div
            ref={gridRef}
            className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {combos.map((combo, index) => {
              const [a, b] = combo.items
              const total = a.price + b.price
              return (
                <article
                  key={`${a._id}-${b._id}`}
                  style={{ animationDelay: `${index * 90}ms` }}
                  className={cn(
                    "standard-reveal group flex overflow-hidden rounded-3xl border border-border bg-card shadow-sm",
                    "transition-all duration-300 hover:-translate-y-1 hover:border-[#f4574a]/40 hover:shadow-[0_24px_50px_-30px_rgba(244,87,74,0.6)]",
                    gridVisible && "is-in"
                  )}>
                  <div className="grid w-2/5 grid-rows-2 gap-1 bg-muted sm:w-1/3">
                    <div className="relative overflow-hidden">
                      <img
                        src={primaryImage(a)}
                        alt={a.itemName}
                        loading="lazy"
                        className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="relative overflow-hidden">
                      <img
                        src={primaryImage(b)}
                        alt={b.itemName}
                        loading="lazy"
                        className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#f4574a]/10 px-3 py-1 text-[10.5px] font-extrabold tracking-wider text-[#f4574a] uppercase">
                      <Flame className="size-3.5" />
                      Combo deal
                    </span>

                    <h3 className="mt-3 text-lg font-extrabold leading-snug text-foreground sm:text-xl">
                      {a.itemName}{" "}
                      <span className="text-[#f4574a]">+</span> {b.itemName}
                    </h3>

                    <p className="mt-2 line-clamp-2 text-[13px] leading-snug text-muted-foreground">
                      {a.description} {b.description}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-3 text-[12px] text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="size-3.5 text-[#f4574a]" />
                        <span className="truncate">{a.category}</span>
                      </span>
                    </div>

                    <div className="mt-auto flex items-end justify-between gap-3 pt-5">
                      <div>
                        <p className="text-[10.5px] font-extrabold tracking-wider text-muted-foreground uppercase">
                          Combo price
                        </p>
                        <p className="mt-0.5 text-2xl font-extrabold text-[#f4574a]">
                          BDT {total}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/menu/${a._id}`}
                          className="inline-flex h-9 items-center gap-1.5 rounded-full border border-[#f4574a]/40 px-4 text-[12.5px] font-bold text-[#f4574a] transition-colors hover:bg-[#f4574a] hover:text-white">
                          {a.itemName}
                          <ArrowRight className="size-3.5" />
                        </Link>
                        <Link
                          href={`/menu/${b._id}`}
                          className="inline-flex h-9 items-center gap-1.5 rounded-full border border-[#f4574a]/40 px-4 text-[12.5px] font-bold text-[#f4574a] transition-colors hover:bg-[#f4574a] hover:text-white">
                          {b.itemName}
                          <ArrowRight className="size-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
