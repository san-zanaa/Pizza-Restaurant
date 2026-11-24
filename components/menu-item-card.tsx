"use client"

import Link from "next/link"
import { MapPin, Store } from "lucide-react"
import { primaryImage, type MenuItem } from "@/lib/types"
import { cn } from "@/lib/utils"
import { FavoriteToggle } from "@/components/favorite-toggle"

export function MenuItemCard({
  item,
  visible = true,
  index = 0,
}: {
  item: MenuItem
  visible?: boolean
  index?: number
}) {
  return (
    <article
      style={{ animationDelay: `${index * 70}ms` }}
      className={cn(
        "standard-reveal group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm",
        "transition-all duration-300 hover:-translate-y-1 hover:border-[#f4574a]/40 hover:shadow-[0_24px_50px_-30px_rgba(244,87,74,0.6)]",
        visible && "is-in"
      )}>
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={primaryImage(item)}
          alt={item.itemName}
          loading="lazy"
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute top-3 left-3 rounded-full bg-black/55 px-2.5 py-1 text-[10.5px] font-extrabold tracking-wider text-white uppercase backdrop-blur">
          {item.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-[15px] leading-snug font-extrabold text-foreground">
            {item.itemName}
          </h3>
          <span className="shrink-0 rounded-full bg-[#f4574a]/10 px-2.5 py-1 text-[13px] font-extrabold text-[#f4574a]">
            ৳{item.price}
          </span>
        </div>
        <FavoriteToggle itemId={item._id} />

        <p className="mt-2 line-clamp-2 text-[12.5px] leading-snug text-muted-foreground">
          {item.description}
        </p>

        <div className="mt-3 space-y-1.5 border-t border-border pt-3 text-[12px] font-semibold text-muted-foreground">
          <span className="flex min-w-0 items-center gap-1.5">
            <MapPin className="size-3.5 shrink-0 text-[#f4574a]" />
            <span className="truncate">{item.location || "—"}</span>
          </span>
          <span className="flex min-w-0 items-center gap-1.5">
            <Store className="size-3.5 shrink-0 text-[#f4574a]" />
            <span className="truncate">{item.vendorName || "PizzaHub vendor"}</span>
          </span>
        </div>

        <Link
          href={`/menu/${item._id}`}
          className="mt-4 inline-flex h-9 w-full items-center justify-center rounded-full bg-gradient-to-r from-[#f4574a] to-[#ff7d68] text-[13px] font-bold text-white transition hover:brightness-110 focus-visible:ring-2 focus-visible:ring-[#f4574a]/50 focus-visible:outline-none">
          View Details
        </Link>
      </div>
    </article>
  )
}
