"use client"

import { useCallback, useState } from "react"

const STORAGE_PREFIX = "pizzahub-favorites"

function keyFor(userId: string) {
  return `${STORAGE_PREFIX}:${userId}`
}

function readFavorites(userId: string): string[] {
  try {
    const raw = window.localStorage.getItem(keyFor(userId))
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string") : []
  } catch {
    return []
  }
}

function writeFavorites(userId: string, ids: string[]) {
  try {
    window.localStorage.setItem(keyFor(userId), JSON.stringify(ids))
  } catch {
    /* storage may be unavailable — favorites are a convenience */
  }
}

/**
 * Favorites/wishlist stored in localStorage per signed-in user.
 * `toggle` flips an item id; `isFavorite` reads the current set.
 */
export function useFavorites(userId: string) {
  const [favorites, setFavorites] = useState<string[]>(() => readFavorites(userId))

  const toggle = useCallback(
    (itemId: string) => {
      setFavorites((prev) => {
        const next = prev.includes(itemId)
          ? prev.filter((id) => id !== itemId)
          : [...prev, itemId]
        writeFavorites(userId, next)
        return next
      })
    },
    [userId]
  )

  const isFavorite = useCallback((itemId: string) => favorites.includes(itemId), [favorites])

  return { favorites, isFavorite, toggle }
}
