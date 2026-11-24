import { Mail, MapPin, Phone } from "lucide-react"
import { Btn } from "@/components/dashboard/ui"
import Link from "next/link"

export const metadata = { title: "Contact · PizzaHub" }

const CONTACTS = [
  { icon: Phone, label: "+880 1234 567890", href: "tel:+8801234567890" },
  { icon: Mail, label: "hello@pizzahub.com", href: "mailto:hello@pizzahub.com" },
  { icon: MapPin, label: "Dhaka, Bangladesh", href: null },
] as const

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <p className="text-[11px] font-extrabold tracking-[0.24em] text-[#f4574a] uppercase">
          Contact PizzaHub
        </p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          We&apos;d love to hear from you
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
          Have questions about orders, vendors or how PizzaHub works? Say hello and we&apos;ll get back to you soon.
        </p>
      </div>

      <div className="mt-10 grid gap-4 rounded-3xl border border-border bg-card p-6 sm:grid-cols-3">
        {CONTACTS.map((contact) => (
          <div
            key={contact.label}
            className="flex items-center justify-center gap-3 rounded-2xl border border-border bg-muted/30 p-3 text-sm font-semibold text-muted-foreground">
            <contact.icon className="size-4 shrink-0 text-[#f4574a]" />
            <span className="truncate text-[14px] font-bold text-foreground">
              {contact.label}
            </span>
            {contact.href ? <Link href={contact.href} className="text-[#f4574a] underline">reach</Link> : null}
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Btn render={<Link href="/menu" />}>Browse the menu</Btn>
      </div>
    </div>
  )
}
