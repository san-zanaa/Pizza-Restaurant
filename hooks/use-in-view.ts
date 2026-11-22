"use client"

import { useCallback, useEffect, useState } from "react"

export function useInView<T extends HTMLElement>(threshold = 0.18) {
  // Use a state-backed node so the effect re-runs when the observed element
  // mounts (e.g. after async data loads), not just once on first render.
  const [node, setNode] = useState<T | null>(null)
  const [inView, setInView] = useState(true)

  const ref = useCallback((instance: T | null) => {
    setNode(instance)
  }, [])

  useEffect(() => {
    if (!node) return

    if (typeof IntersectionObserver === "undefined") {
      const id = setTimeout(() => setInView(true), 0)
      return () => clearTimeout(id)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true)
            observer.disconnect()
          }
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" }
    )
    observer.observe(node)

    return () => {
      observer.disconnect()
    }
  }, [node, threshold])

  return [ref, inView] as const
}
