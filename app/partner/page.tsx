import { Pizza, Store, Utensils } from "lucide-react"
import { Btn, PageHeader } from "@/components/dashboard/ui"
import Link from "next/link"

export const metadata = { title: "Partner · PizzaHub" }

const STEPS = [
  { icon: Store, title: "Apply", body: "Share your restaurant name, location and menu highlights." },
  { icon: Utensils, title: "Create", body: "Add your dishes and wait for the admin to approve them." },
  { icon: Pizza, title: "Sell", body: "Receive customer orders in your dashboard and start earning." },
] as const

export default function PartnerPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <PageHeader
        title="Become a PizzaHub Partner"
        subtitle="Join the restaurants that deliver the tastiest pizzas from their own kitchen."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        {STEPS.map((step) => (
          <div
            key={step.title}
            className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <span className="inline-flex h-9 w-9 place-items-center rounded-full bg-[#f4574a]/10 text-[#f4574a]">
              <step.icon className="size-4.5" />
            </span>
            <h3 className="mt-4 text-base font-extrabold text-foreground">
              {step.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {step.body}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Btn
          render={
            <a
              href="mailto:hello@pizzahub.com?subject=Partner%20inquiry"
              target="_blank"
              rel="noreferrer"
            />
          }>
          Contact to become a partner
        </Btn>
        <Btn render={<Link href="/menu" />} variant="outline">
          Browse the menu
        </Btn>
      </div>
    </div>
  )
}
