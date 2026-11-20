"use client"

import Image from "next/image"
import Link from "next/link"
import { MapPin, Pizza, Search } from "lucide-react"
import { useEffect, useState } from "react"
import { apiGet } from "@/lib/client-fetch"
import { EmptyState, Loading } from "@/components/dashboard/ui-custom"
import { MENU_CATEGORIES, type MenuItem } from "@/lib/types"

export function BrowseMenu() {
  const [items, setItems] = useState<MenuItem[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("")

  useEffect(() => {
    const params = new URLSearchParams()
    if (query) params.set("q", query)
    if (category) params.set("category", category)
    apiGet<{ items: MenuItem[] }>(`/api/menu?${params.toString()}`).then(
      ({ data, error: err }) => {
        setItems(data?.items ?? null)
        setError(err)
      }
    )
  }, [query, category])

  return (
    <>
      <div className="mx-auto max-w-6xl px-4 pt-10 pb-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-[11px] font-extrabold tracking-[0.24em] text-[#f4574a] uppercase">
            Fresh from the oven
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Browse the{" "}
            <span className="bg-gradient-to-r from-[#f4574a] to-[#ff9e2c] bg-clip-text text-transparent">
              Menu
            </span>
          </h1>
          <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
            Only approved, available dishes from verified pizzerias — pick one
            and order it straight to your door.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search dishes…"
              aria-label="Search dishes"
              className="h-11 w-64 rounded-full border border-input bg-background pr-4 pl-10 text-sm text-foreground transition outline-none placeholder:text-muted-foreground/60 focus:border-[#f4574a]/60 focus:ring-4 focus:ring-[#f4574a]/12"
            />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            <CategoryChip
              label="All"
              active={category === ""}
              onClick={() => setCategory("")}
            />
            {MENU_CATEGORIES.map((option) => (
              <CategoryChip
                key={option}
                label={option}
                active={category === option}
                onClick={() => setCategory(option)}
              />
            ))}
          </div>
        </div>

        {error ? <p className="mt-8 text-sm text-rose-500">{error}</p> : null}
        {!items ? (
          <div className="mt-8">
            <Loading label="Warming up the menu…" />
          </div>
        ) : items.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              icon={Pizza}
              title="No dishes found"
              hint="Try a different search or category."
            />
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((item) => (
              <Link
                key={item._id}
                href={`/menu/${item._id}`}
                className="group overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:border-[#f4574a]/40 hover:shadow-[0_24px_50px_-30px_rgba(244,87,74,0.6)] focus-visible:ring-2 focus-visible:ring-[#f4574a]/50 focus-visible:outline-none"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 rounded-full bg-black/55 px-2.5 py-1 text-[10.5px] font-extrabold tracking-wider text-white uppercase backdrop-blur">
                    {item.category}
                  </span>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="text-[15px] leading-snug font-extrabold text-foreground">
                      {item.name}
                    </h2>
                    <span className="shrink-0 rounded-full bg-[#f4574a]/10 px-2.5 py-1 text-[13px] font-extrabold text-[#f4574a]">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>
                  <p className="mt-1.5 line-clamp-2 text-[12.5px] leading-snug text-muted-foreground">
                    {item.description}
                  </p>
                  <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                    <span className="flex min-w-0 items-center gap-1 text-[12px] font-semibold text-muted-foreground">
                      <MapPin className="size-3.5 shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </span>
                    <span className="truncate text-[12px] font-semibold text-[#f4574a]">
                      {item.vendorName}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

function CategoryChip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full px-3.5 py-2 text-[12.5px] font-bold transition-colors focus-visible:ring-2 focus-visible:ring-[#f4574a]/50 focus-visible:outline-none ${
        active
          ? "bg-gradient-to-r from-[#f4574a] to-[#ff7d68] text-white shadow-[0_6px_18px_-10px_rgba(244,87,74,0.9)]"
          : "border border-border bg-background text-muted-foreground hover:text-foreground"
      }`}
    >
      {label}
    </button>
  )
}
