import { Flame, Pizza, Store } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Btn } from "@/components/dashboard/ui"
import Link from "next/link"

export const metadata = { title: "About PizzaHub" }

const VALUES: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Flame,
    title: "Hot, fresh pizzas",
    body: "Every dish is prepared daily in each partner pizzeria and sent to you while it is still hot.",
  },
  {
    icon: Store,
    title: "Verified restaurants",
    body: "Vendors sign up, publish a menu and get approved — so only quality, real pizzerias are on the platform.",
  },
  {
    icon: Pizza,
    title: "Simple ordering",
    body: "Browse, pick a date and a delivery address — your order is saved and you can track it from the dashboard.",
  },
]

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <p className="text-[11px] font-extrabold tracking-[0.24em] text-[#f4574a] uppercase">
          About PizzaHub
        </p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Eat · Order · Enjoy
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
          PizzaHub is a pizza ordering and delivery platform connecting customers
          with the best local pizzerias. Explore the menu, order what you love, and
          have it delivered to your door.
        </p>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-3">
        {VALUES.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <span className="inline-flex h-10 w-10 place-items-center rounded-full bg-[#f4574a]/10 text-[#f4574a]">
              <item.icon className="size-5" />
            </span>
            <h3 className="mt-4 text-base font-extrabold text-foreground">
              {item.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {item.body}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-12 flex flex-wrap justify-center gap-3">
        <Btn render={<Link href="/menu" />}>Browse the menu</Btn>
        <Btn render={<Link href="/sign-in" />} variant="outline">
          Sign In
        </Btn>
      </div>
    </div>
  )
}
