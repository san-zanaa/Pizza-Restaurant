"use client"

import type { LucideIcon } from "lucide-react"
import { Search, ShoppingCart, ThumbsUp, Truck } from "lucide-react"
import { useInView } from "@/hooks/use-in-view"
import { cn } from "@/lib/utils"

type Step = {
  number: string
  icon: LucideIcon
  title: string
  description: string
}

const STEPS: Step[] = [
  {
    number: "01",
    icon: Search,
    title: "Find your craving",
    description:
      "Browse by category or search by name — every dish shown is approved and in stock right now.",
  },
  {
    number: "02",
    icon: ShoppingCart,
    title: "Order in seconds",
    description:
      "Pick your address, add a note for the kitchen and pay securely with Stripe in a few taps.",
  },
  {
    number: "03",
    icon: Truck,
    title: "Track it live",
    description:
      "Watch your pizza go from stretched dough to oven to doorstep with real-time updates.",
  },
  {
    number: "04",
    icon: ThumbsUp,
    title: "Enjoy & rate",
    description:
      "Dig in while it's hot, then rate the pizzeria so the next foodie knows where to go.",
  },
]

export function HowItWorks() {
  const [headerRef, headerVisible] = useInView<HTMLDivElement>(0.25)
  const [panelRef, panelVisible] = useInView<HTMLDivElement>(0.12)

  return (
    <section
      aria-labelledby="how-heading"
      className="relative isolate overflow-hidden border-t border-border/60 bg-[#fffaf5] py-16 sm:py-20 dark:bg-[#0b0a09]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-1/4 -z-10 size-80 translate-x-1/2 rounded-full bg-[#f4574a]/10 blur-3xl"
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
            Four simple steps
            <span
              aria-hidden="true"
              className="h-px w-8 bg-gradient-to-l from-transparent to-[#f4574a]/70"
            />
          </span>

          <h2
            id="how-heading"
            style={{ animationDelay: "80ms" }}
            className={cn(
              "standard-reveal mt-4 text-[clamp(1.75rem,1.1rem+2.4vw,2.75rem)] leading-[1.08] font-extrabold tracking-tight text-foreground",
              headerVisible && "is-in"
            )}>
            How PizzaHub{" "}
            <span className="bg-gradient-to-r from-[#e63329] via-[#f4574a] to-[#ff8a5c] bg-clip-text text-transparent">
              Works
            </span>
          </h2>

          <p
            style={{ animationDelay: "160ms" }}
            className={cn(
              "standard-reveal mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground",
              headerVisible && "is-in"
            )}>
            From craving to doorstep in four steps — no phone calls, no
            guesswork, no cold pizza.
          </p>
        </div>

        <div
          ref={panelRef}
          className="relative mt-10 overflow-hidden rounded-3xl bg-gradient-to-br from-[#1c1917] via-[#211d1a] to-[#2b2521] p-6 shadow-[0_30px_70px_-40px_rgba(0,0,0,0.9)] sm:p-8 lg:mt-14 lg:p-10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -right-20 size-64 rounded-full bg-[#f4574a]/25 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-28 -left-16 size-64 rounded-full bg-[#ff9740]/20 blur-3xl"
          />

          <ol className="relative grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {STEPS.map((step, index) => {
              const { number, icon: Icon, title, description } = step
              return (
                <li
                  key={number}
                  style={{ animationDelay: `${index * 90}ms` }}
                  className={cn(
                    "standard-reveal relative",
                    panelVisible && "is-in"
                  )}>
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="inline-flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white ring-1 ring-white/15">
                      <Icon className="size-5" strokeWidth={2.1} />
                    </span>
                    <span className="bg-gradient-to-r from-[#ff8a5c] to-[#f4574a] bg-clip-text text-2xl font-extrabold text-transparent tabular-nums">
                      {number}
                    </span>
                  </div>

                  <h3 className="mt-4 text-[15px] font-extrabold text-white sm:text-base">
                    {title}
                  </h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-white/65">
                    {description}
                  </p>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}
