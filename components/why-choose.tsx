"use client"

import { type LucideIcon } from "lucide-react"
import {
  BadgeCheck,
  CreditCard,
  Headphones,
  Star,
  Timer,
  Truck,
} from "lucide-react"
import { useInView } from "@/hooks/use-in-view"
import { cn } from "@/lib/utils"

type Benefit = {
  icon: LucideIcon
  title: string
  description: string
}

/** The PizzaHub promise — what every customer gets, on every order. */
const BENEFITS: Benefit[] = [
  {
    icon: BadgeCheck,
    title: "Every vendor vetted",
    description:
      "Each pizzeria is inspected, rated and continuously monitored before it ever reaches your screen.",
  },
  {
    icon: Timer,
    title: "Freshness guarantee",
    description:
      "Not hot, not fresh? We remake it or refund it — no forms, no fine print, no hassle.",
  },
  {
    icon: Truck,
    title: "Live order tracking",
    description:
      "Follow every order from the oven to your doorstep with real-time status updates.",
  },
  {
    icon: CreditCard,
    title: "Secure, honest pricing",
    description:
      "Stripe-protected checkout with the price you see as the price you pay — zero hidden fees.",
  },
  {
    icon: Headphones,
    title: "Real human support",
    description:
      "24/7 help from actual people who can fix an order in minutes, not ticket queues.",
  },
  {
    icon: Star,
    title: "Verified reviews",
    description:
      "Only customers who actually ordered can rate a dish, so what you read here is real.",
  },
]

export function WhyChoose() {
  const [headerRef, headerVisible] = useInView<HTMLDivElement>(0.25)
  const [listRef, listVisible] = useInView<HTMLDivElement>(0.12)

  return (
    <section
      aria-labelledby="why-heading"
      className="relative isolate overflow-hidden border-t border-border/60 bg-background py-16 sm:py-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-28 left-1/4 -z-10 size-[26rem] -translate-x-1/2 rounded-full bg-[#14b8a6]/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 right-0 -z-10 size-80 rounded-full bg-[#f4574a]/10 blur-3xl"
      />

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
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
            The PizzaHub promise
            <span
              aria-hidden="true"
              className="h-px w-8 bg-gradient-to-l from-transparent to-[#f4574a]/70"
            />
          </span>

          <h2
            id="why-heading"
            style={{ animationDelay: "80ms" }}
            className={cn(
              "standard-reveal mt-4 text-[clamp(1.75rem,1.1rem+2.4vw,2.75rem)] leading-[1.08] font-extrabold tracking-tight text-foreground",
              headerVisible && "is-in"
            )}>
            Why Choose{" "}
            <span className="bg-gradient-to-r from-[#e63329] via-[#f4574a] to-[#ff8a5c] bg-clip-text text-transparent">
              PizzaHub?
            </span>
          </h2>

          <p
            style={{ animationDelay: "160ms" }}
            className={cn(
              "standard-reveal mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground",
              headerVisible && "is-in"
            )}>
            Great pizza is the easy part. Everything around it — who made it,
            how it travelled, what happens if something&apos;s off — is where we
            obsess.
          </p>
        </div>

        <div
          ref={listRef}
          className="mt-10 grid grid-cols-1 gap-x-10 md:grid-cols-2 lg:mt-14">
          {BENEFITS.map((benefit, index) => {
            const { icon: Icon, title, description } = benefit
            return (
              <div
                key={title}
                style={{ animationDelay: `${index * 60}ms` }}
                className={cn(
                  "standard-reveal flex items-start gap-4 border-b border-border py-5",
                  listVisible && "is-in"
                )}>
                <span
                  aria-hidden="true"
                  className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/25 dark:text-emerald-400">
                  <Icon className="size-4.5" strokeWidth={2.2} />
                </span>
                <div className="min-w-0">
                  <h3 className="text-[15px] font-extrabold text-foreground">
                    {title}
                  </h3>
                  <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                    {description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        <p
          style={{ animationDelay: "420ms" }}
          className={cn(
            "standard-reveal mx-auto mt-8 max-w-2xl text-center text-[13px] font-semibold text-muted-foreground",
            listVisible && "is-in"
          )}>
          Backed by a 4.9/5 average rating from thousands of hungry customers —
          and a team that actually answers.
        </p>
      </div>
    </section>
  )
}
