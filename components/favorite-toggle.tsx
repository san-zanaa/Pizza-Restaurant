"use client"

import { Heart } from "lucide-react"
import { useFavorites } from "@/lib/favorites"
import { authClient } from "@/lib/auth-client"
import { cn } from "@/lib/utils"

/**
 * Favorites/wishlist toggle. Visible only when signed in.
 * Preferences are stored per user in localStorage.
 */
export function FavoriteToggle({
  itemId,
  className,
}: {
  itemId: string
  className?: string
}) {
  const { data: session } = authClient.useSession()
  const userId = session?.user?.id ?? ""
  const { isFavorite, toggle } = useFavorites(userId)

  if (!userId) return null

  const favorited = isFavorite(itemId)

  return (
    <button
      type="button"
      onClick={() => toggle(itemId)}
      aria-pressed={favorited}
      aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
      title={favorited ? "Remove from favorites" : "Add to favorites"}
      className={cn(
        "inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-[12px] font-semibold transition focus-visible:ring-2 focus-visible:ring-[#f4574a]/40 focus-visible:outline-none",
        favorited
          ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
          : "text-muted-foreground hover:text-foreground",
        className
      )}>
      <Heart
        className="size-3.5 transition-transform"
        fill={favorited ? "#ef4444" : "none"}
        stroke={favorited ? "none" : "currentColor"}
      />
      {favorited ? "Favorited" : "Favorite"}
    </button>
  )
}
