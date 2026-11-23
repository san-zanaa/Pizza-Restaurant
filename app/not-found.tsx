import Image from "next/image"
import Link from "next/link"
import { MapPin, Pizza } from "lucide-react"

export const metadata = { title: "Not Found · PizzaHub" }

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100svh-4rem)] flex-col items-center justify-center px-4 text-center">
      <div className="grid size-20 place-items-center rounded-3xl bg-gradient-to-br from-[#f4574a] to-[#ff9e2c] text-white shadow-[0_16px_40px_-16px_rgba(244,87,74,0.6)]">
        <Pizza className="size-8" />
      </div>
      <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
        Page not found
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist — or the dish has
        already left the menu. Everything else is still warm and ready.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        <Link
          href="/"
          className="inline-flex h-11 items-center rounded-full bg-gradient-to-r from-[#f4574a] to-[#ff7d68] px-6 text-sm font-semibold text-white transition hover:brightness-110">
          Back to PizzaHub
        </Link>
        <Link
          href="/menu"
          className="inline-flex h-11 items-center gap-2 rounded-full border border-border bg-background px-6 text-sm font-semibold text-foreground transition hover:border-[#f4574a]/50 hover:text-[#f4574a]">
          <MapPin className="size-4" /> Browse the menu
        </Link>
      </div>
      <p className="mt-10 inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground">
        <Image
          src="/assets/logo.png"
          alt=""
          width={48}
          height={32}
          className="h-6 w-auto opacity-60"
          aria-hidden="true"
        />
        PizzaHub — Wood-fired pizzas, delivered while they&apos;re still hot.
      </p>
    </div>
  )
}
