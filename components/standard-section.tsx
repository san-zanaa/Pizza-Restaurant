"use client"

import { useEffect, useRef, useState } from "react"
import type { LucideIcon } from "lucide-react"
import {
  Award,
  Leaf,
  Sprout,
  Thermometer,
  Timer,
  TrendingUp,
  Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"

type Metric = {
  value: number
  suffix?: string
  label: string
}

type Feature = {
  id: string
  icon: LucideIcon
  title: string
  description: string
  metric: Metric
  badge: { icon: LucideIcon; text: string }
  accent: {
    tile: string
    glow: string
    metric: string
    badge: string
    hoverRing: string
    hairline: string
  }
}

const FEATURES: Feature[] = [
  {
    id: "fresh-ingredients",
    icon: Leaf,
    title: "Fresh Ingredients",
    description:
      "0% frozen dough. Certified San Marzano D.O.P. tomatoes and 48-hour cold fermented organic flours without additives.",
    metric: { value: 48, suffix: "h", label: "Cold Ferment" },
    badge: { icon: Sprout, text: "Farm Verified" },
    accent: {
      tile: "bg-gradient-to-br from-rose-500/25 via-rose-500/10 to-transparent text-rose-600 ring-rose-500/25 dark:text-rose-400",
      glow: "bg-rose-500/30",
      metric: "from-rose-500 to-rose-300 dark:from-rose-400 dark:to-rose-200",
      badge: "bg-rose-500/10 text-rose-600 ring-rose-500/25 dark:text-rose-300",
      hoverRing: "hover:ring-rose-500/40",
      hairline: "group-hover:from-rose-500",
    },
  },
  {
    id: "thermal-delivery",
    icon: Thermometer,
    title: "Fast Thermal Delivery",
    description:
      "Specially engineered induction-heated transport modules maintain 68°C crust crispiness from brick oven to doorstep.",
    metric: { value: 68, suffix: "°C", label: "Crust Held" },
    badge: { icon: Timer, text: "28 Mins Avg" },
    accent: {
      tile: "bg-gradient-to-br from-amber-500/25 via-amber-500/10 to-transparent text-amber-600 ring-amber-500/25 dark:text-amber-400",
      glow: "bg-amber-500/30",
      metric:
        "from-amber-500 to-amber-300 dark:from-amber-400 dark:to-amber-200",
      badge:
        "bg-amber-500/10 text-amber-700 ring-amber-500/25 dark:text-amber-300",
      hoverRing: "hover:ring-amber-500/40",
      hairline: "group-hover:from-amber-500",
    },
  },
  {
    id: "trusted-artisans",
    icon: Award,
    title: "Trusted Artisans",
    description:
      "Only top 10% rated independent master pizzaiolos who meet stringent quality and authentic hydration standards.",
    metric: { value: 10, suffix: "%", label: "Top Rated" },
    badge: { icon: Zap, text: "Master Curated" },
    accent: {
      tile: "bg-gradient-to-br from-teal-500/25 via-teal-500/10 to-transparent text-teal-600 ring-teal-500/25 dark:text-teal-400",
      glow: "bg-teal-500/30",
      metric: "from-teal-500 to-teal-300 dark:from-teal-400 dark:to-teal-200",
      badge: "bg-teal-500/10 text-teal-700 ring-teal-500/25 dark:text-teal-300",
      hoverRing: "hover:ring-teal-500/40",
      hairline: "group-hover:from-teal-500",
    },
  },
  {
    id: "seamless-ordering",
    icon: TrendingUp,
    title: "Seamless Ordering",
    description:
      "Real-time step-by-step dough to door tracking. Watch your pizza stretch, bake, and travel on live telemetry maps.",
    metric: { value: 100, suffix: "%", label: "Live Tracking" },
    badge: { icon: TrendingUp, text: "Live DPS" },
    accent: {
      tile: "bg-gradient-to-br from-orange-500/25 via-orange-500/10 to-transparent text-orange-600 ring-orange-500/25 dark:text-orange-400",
      glow: "bg-orange-500/30",
      metric:
        "from-orange-500 to-orange-300 dark:from-orange-400 dark:to-orange-200",
      badge:
        "bg-orange-500/10 text-orange-700 ring-orange-500/25 dark:text-orange-300",
      hoverRing: "hover:ring-orange-500/40",
      hairline: "group-hover:from-orange-500",
    },
  },
]

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
}

function supportsHover() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches
  )
}

function useInView<T extends HTMLElement>(threshold = 0.18) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const node = ref.current
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
    return () => observer.disconnect()
  }, [threshold])

  return [ref, inView] as const
}

function useCountUp(target: number, active: boolean, duration = 1300) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!active) return
    if (prefersReducedMotion()) {
      const id = requestAnimationFrame(() => setValue(target))
      return () => cancelAnimationFrame(id)
    }

    let frame = 0
    const start = performance.now()

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(target * eased))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target, active, duration])

  return value
}

function FeatureCard({
  feature,
  index,
  visible,
}: {
  feature: Feature
  index: number
  visible: boolean
}) {
  const { icon: Icon, title, description, metric, badge, accent } = feature
  const { icon: BadgeIcon } = badge
  const count = useCountUp(metric.value, visible, 1200 + index * 120)

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    const node = event.currentTarget
    if (!supportsHover() || prefersReducedMotion()) return

    const rect = node.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width
    const y = (event.clientY - rect.top) / rect.height

    node.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`)
    node.style.setProperty("--my", `${(y * 100).toFixed(1)}%`)
    node.style.setProperty("--rx", `${((0.5 - y) * 6).toFixed(2)}deg`)
    node.style.setProperty("--ry", `${((x - 0.5) * 6).toFixed(2)}deg`)
  }

  const handlePointerLeave = (event: React.PointerEvent<HTMLElement>) => {
    const node = event.currentTarget
    node.style.setProperty("--rx", "0deg")
    node.style.setProperty("--ry", "0deg")
  }

  return (
    <article
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{
        animationDelay: `${index * 90}ms`,
        transform:
          "perspective(1100px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) translateY(var(--lift, 0px))",
      }}
      className={cn(
        "standard-reveal group relative flex flex-col overflow-hidden rounded-3xl p-6 sm:p-7",
        "bg-white/80 shadow-[0_24px_50px_-32px_rgba(28,25,23,0.45)] ring-1 ring-black/5",
        "dark:bg-white/[0.045] dark:shadow-[0_24px_60px_-34px_rgba(0,0,0,0.9)] dark:ring-white/10",
        "transition-[transform,box-shadow,ring-color] duration-500 ease-out will-change-transform",
        "hover:shadow-[0_34px_60px_-30px_rgba(28,25,23,0.5)] hover:[--lift:-8px]",
        "dark:hover:shadow-[0_34px_70px_-32px_rgba(0,0,0,0.95)]",
        accent.hoverRing,
        visible && "is-in"
      )}>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(340px circle at var(--mx, 50%) var(--my, 0%), rgba(255,255,255,0.16), transparent 62%)",
        }} />

      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -top-16 -right-14 size-44 rounded-full opacity-0 blur-3xl transition-all duration-700",
          "group-hover:-translate-y-1 group-hover:opacity-100",
          accent.glow
        )}
      />

      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r to-transparent opacity-0 transition-opacity duration-500",
          "group-hover:opacity-100",
          accent.hairline
        )}
      />

      <div className="relative flex items-start justify-between gap-4">
        <span
          className={cn(
            "inline-flex size-14 shrink-0 items-center justify-center rounded-2xl ring-1",
            "transition-transform duration-500 ease-out group-hover:scale-105 group-hover:-rotate-6 motion-reduce:transition-none",
            accent.tile
          )}>
          <Icon className="size-6" strokeWidth={2.1} aria-hidden="true" />
        </span>

        <span className="pointer-events-none text-right select-none">
          <span
            className={cn(
              "block bg-gradient-to-br bg-clip-text text-3xl font-extrabold text-transparent tabular-nums sm:text-[2rem]",
              accent.metric
            )}>
            {count}
            {metric.suffix}
          </span>
          <span className="mt-0.5 block text-[10px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
            {metric.label}
          </span>
        </span>
      </div>

      <h3 className="relative mt-6 text-lg font-bold tracking-tight text-foreground sm:text-xl">
        {title}
      </h3>

      <p className="relative mt-2.5 text-[13.5px] leading-relaxed text-muted-foreground sm:text-sm">
        {description}
      </p>

      <div className="relative mt-auto flex items-center pt-6">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold tracking-wide uppercase ring-1",
            accent.badge
          )}>
          <BadgeIcon className="size-3.5" aria-hidden="true" />
          {badge.text}
        </span>
      </div>
    </article>
  )
}

export function StandardSection() {
  const [headerRef, headerVisible] = useInView<HTMLDivElement>(0.25)
  const [gridRef, gridVisible] = useInView<HTMLDivElement>(0.12)

  return (
    <section
      aria-labelledby="standard-heading"
      className="relative isolate overflow-hidden border-t border-border/60 bg-[#fffaf5] py-16 sm:py-20 lg:py-24 dark:bg-[#0b0a09]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 -z-10 size-[34rem] -translate-x-1/2 rounded-full bg-[#f4574a]/12 blur-3xl"/>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-24 -z-10 size-96 rounded-full bg-[#ff9740]/12 blur-3xl dark:bg-[#ff9740]/10"/>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 -right-20 -z-10 size-80 rounded-full bg-[#14b8a6]/10 blur-3xl"/>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,black,transparent)] opacity-[0.45]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(28,25,23,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(28,25,23,0.06) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}/>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div ref={headerRef} className="mx-auto max-w-4xl text-center">
          <span
            className={cn(
              "standard-reveal inline-flex items-center gap-3 text-[11px] font-extrabold tracking-[0.3em] text-[#e63329] uppercase dark:text-[#ff7d68]",
              headerVisible && "is-in"
            )}>
            <span
              aria-hidden="true"
              className="h-px w-8 bg-gradient-to-r from-transparent to-[#f4574a]/70"/>
            The PizzaHub Standard
            <span
              aria-hidden="true"
              className="h-px w-8 bg-gradient-to-l from-transparent to-[#f4574a]/70"/>
          </span>

          <h2
            id="standard-heading"
            style={{ animationDelay: "80ms" }}
            className={cn(
              "standard-reveal mt-4 text-[clamp(1.75rem,1.1rem+2.4vw,2.75rem)] leading-[1.08] font-extrabold tracking-tight text-foreground",
              headerVisible && "is-in"
            )}>
            Why Discerning Foodies{" "}
            <span className="bg-gradient-to-r from-[#e63329] via-[#f4574a] to-[#ff8a5c] bg-clip-text text-transparent">
              Choose Us
            </span>
          </h2>

          <p
            style={{ animationDelay: "160ms" }}
            className={cn(
              "standard-reveal mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base",
              headerVisible && "is-in"
            )}>
            We rebuilt pizza delivery from fermentation to fulfillment so you
            experience pizzeria quality at your dining table.
          </p>
        </div>

        <div
          ref={gridRef}
          className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 xl:mt-14 xl:grid-cols-4">
          {FEATURES.map((feature, index) => (
            <FeatureCard
              key={feature.id}
              feature={feature}
              index={index}
              visible={gridVisible}/>
          ))}
        </div>

        <div
          style={{ animationDelay: "520ms" }}
          className={cn(
            "standard-reveal mx-auto mt-10 flex max-w-3xl flex-wrap items-center justify-center gap-x-8 gap-y-3 text-center xl:mt-12",
            gridVisible && "is-in"
          )}>
          {[
            { icon: Zap, label: "99.2% On-Time Arrivals" },
            { icon: Award, label: "4.9/5 Average Rating" },
            { icon: TrendingUp, label: "120k+ Pizzas Tracked" },
          ].map(({ icon: StatIcon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide text-muted-foreground">
              <StatIcon className="size-4 text-[#f4574a]" aria-hidden="true" />
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
