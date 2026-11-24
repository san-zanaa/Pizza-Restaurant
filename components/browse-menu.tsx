"use client"

import { useSearchParams } from "next/navigation"
import { MapPin, Pizza, Search } from "lucide-react"
import { useEffect, useState } from "react"
import { apiGet } from "@/lib/client-fetch"
import { EmptyState, Loading } from "@/components/dashboard/ui-custom"
import { MenuItemCard } from "@/components/menu-item-card"
import { MENU_CATEGORIES, type MenuItem } from "@/lib/types"

/**
 * Public browse page: search by name, filter by category and by location.
 * The API only ever returns `approved` items, so rejected/pending dishes can
 * never leak here.
 */
export function BrowseMenu() {
  const searchParams = useSearchParams()
  const [items, setItems] = useState<MenuItem[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState(() => searchParams.get("q") ?? "")
  const [category, setCategory] = useState(
    () => searchParams.get("category") ?? ""
  )
  const [location, setLocation] = useState(
    () => searchParams.get("location") ?? ""
  )
  const [sort, setSort] = useState(() => searchParams.get("sort") ?? "")

  useEffect(() => {
    const params = new URLSearchParams()
    if (query.trim()) params.set("q", query.trim())
    if (category) params.set("category", category)
    if (location.trim()) params.set("location", location.trim())
    if (sort) params.set("sort", sort)

    let alive = true
    const timer = window.setTimeout(() => {
      apiGet<{ items: MenuItem[] }>(`/api/menu?${params.toString()}`).then(
        ({ data, error: err }) => {
          if (!alive) return
          setItems(data?.items ?? [])
          setError(err)
        }
      )
    }, 220)

    return () => {
      alive = false
      window.clearTimeout(timer)
    }
  }, [query, category, location, sort])

  const hasFilters = Boolean(query || category || location)

  return (
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

      <div className="mt-8 flex flex-col items-center gap-3">
        <div className="flex w-full max-w-2xl flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by dish name…"
              aria-label="Search dishes by name"
              className="h-11 w-full rounded-full border border-input bg-background pr-4 pl-10 text-sm text-foreground transition outline-none placeholder:text-muted-foreground/60 focus:border-[#f4574a]/60 focus:ring-4 focus:ring-[#f4574a]/12"
            />
          </div>
          <div className="relative sm:w-64">
            <MapPin className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              placeholder="Filter by location…"
              aria-label="Filter by location"
              className="h-11 w-full rounded-full border border-input bg-background pr-4 pl-10 text-sm text-foreground transition outline-none placeholder:text-muted-foreground/60 focus:border-[#f4574a]/60 focus:ring-4 focus:ring-[#f4574a]/12"
            />
          </div>
        </div>

        <div className="mt-3 flex items-center justify-center gap-2">
          <label
            htmlFor="browse-sort"
            className="text-[13px] font-bold text-muted-foreground">
            Sort
          </label>
          <select
            id="browse-sort"
            aria-label="Sort menu items"
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="h-11 min-w-44 rounded-full border border-input bg-background px-4 text-sm text-foreground transition outline-none focus:border-[#f4574a]/60 focus:ring-4 focus:ring-[#f4574a]/12"
          >
            <option value="">Recommended</option>
            <option value="price_asc">Price: Low → High</option>
            <option value="price_desc">Price: High → Low</option>
          </select>
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

      {error ? <p className="mt-8 text-center text-sm text-rose-500">{error}</p> : null}

      {!items ? (
        <div className="mt-8">
          <Loading label="Warming up the menu…" />
        </div>
      ) : items.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon={Pizza}
            title={hasFilters ? "No dishes match those filters" : "No dishes yet"}
            hint={
              hasFilters
                ? "Try clearing the search, category or location filter."
                : "Approved dishes will appear here as soon as vendors add them."
            }
          />
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item, index) => (
            <MenuItemCard key={item._id} item={item} index={index} />
          ))}
        </div>
      )}
    </div>
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
