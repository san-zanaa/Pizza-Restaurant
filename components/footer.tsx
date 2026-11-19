"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import type { LucideIcon } from "lucide-react"
import { ArrowUp, Clock, Heart, Mail, MapPin, Phone } from "lucide-react"
import { cn } from "@/lib/utils"
import { useInView } from "@/hooks/use-in-view"

type IconProps = { className?: string }

function FacebookIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}>
      <path d="M9.101 23.694v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.646Z" />
    </svg>
  )
}

function InstagramIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}>
      <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.741 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.741 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.259 0 12 0Zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03Zm0 3.678a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 1 0 0-12.324ZM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4Zm7.846-10.405a1.441 1.441 0 0 1-2.88 0 1.44 1.44 0 0 1 2.88 0Z" />
    </svg>
  )
}

function XIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}>
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
  )
}

const QUICK_LINKS = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Browse Menu" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const

const SERVICES = [
  "Fast Delivery",
  "Restaurant Partner",
  "Premium Subscription",
  "Customer Support",
] as const

const CONTACTS: { icon: LucideIcon; label: string; href?: string }[] = [
  { icon: Phone, label: "+880 1234 567890", href: "tel:+8801234567890" },
  {
    icon: Mail,
    label: "hello@pizzahub.com",
    href: "mailto:hello@pizzahub.com",
  },
  { icon: MapPin, label: "Dhaka, Bangladesh" },
]

const SOCIALS = [
  {
    label: "Facebook",
    href: "https://www.facebook.com",
    icon: FacebookIcon,
    hover:
      "hover:border-[#1877f2] hover:bg-[#1877f2] hover:shadow-[0_10px_24px_-10px_rgba(24,119,242,0.95)]",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com",
    icon: InstagramIcon,
    hover:
      "hover:border-[#ee2a7b] hover:bg-[#ee2a7b] hover:shadow-[0_10px_24px_-10px_rgba(238,42,123,0.9)]",
  },
  {
    label: "X",
    href: "https://x.com",
    icon: XIcon,
    hover:
      "hover:border-white hover:bg-white hover:text-black hover:shadow-[0_10px_24px_-10px_rgba(255,255,255,0.5)]",
  },
] as const

function ColumnHeading({ title }: { title: string }) {
  return (
    <>
      <h3 className="text-[11px] font-extrabold tracking-[0.22em] text-white/40 uppercase">
        {title}
      </h3>
      <span
        aria-hidden="true"
        className="mt-3 block h-px w-10 bg-gradient-to-r from-[#f4574a] to-transparent transition-all duration-500 group-hover/col:w-16"
      />
    </>
  )
}

export function Footer() {
  const [ref, visible] = useInView<HTMLDivElement>(0.08)
  const [showTop, setShowTop] = useState(false)
  const year = new Date().getFullYear()

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 480)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const scrollToTop = () => {
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches
    window.scrollTo({ top: 0, behavior: smooth ? "smooth" : "auto" })
  }

  return (
    <>
      <footer className="relative isolate overflow-hidden bg-[#0d0c0b] text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 -left-28 -z-10 size-80 rounded-full bg-[#e63329]/25 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-28 bottom-0 -z-10 size-80 rounded-full bg-[#22c55e]/15 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-40 bg-[radial-gradient(60%_100%_at_50%_0%,rgba(244,87,74,0.18),transparent_70%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#f4574a]/70 to-transparent"
        />

        <div
          ref={ref}
          className="relative mx-auto w-full max-w-7xl px-4 pt-14 pb-8 sm:px-6 sm:pt-16 lg:px-8">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-[1.45fr_1fr_1.05fr_1.15fr_1.25fr] xl:gap-7">
            <div
              style={{ animationDelay: "0ms" }}
              className={cn(
                "standard-reveal sm:col-span-2 lg:col-span-2 xl:col-span-1",
                visible && "is-in"
              )}>
              <Link
                href="/"
                aria-label="PizzaHub home"
                className="inline-block focus-visible:ring-2 focus-visible:ring-[#f4574a]/60 focus-visible:outline-none">
                <Image
                  src="/assets/logo.png"
                  alt="PizzaHub"
                  width={1536}
                  height={1024}
                  className="h-12 w-auto sm:h-14"
                />
              </Link>

              <p className="mt-4 text-[11px] font-bold tracking-[0.3em] text-white/45 uppercase">
                Eat &middot; Order &middot; Enjoy
              </p>

              <p className="mt-4 max-w-md text-sm leading-relaxed text-white/50">
                Wood-fired, 48-hour cold-fermented pizza from the city&apos;s
                best independent pizzaiolos — stretched, baked and biked to your
                table while the crust still crackles.
              </p>

              <span className="mt-6 inline-flex items-center gap-2.5 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3.5 py-2 text-[11px] font-bold tracking-[0.14em] text-emerald-300 uppercase">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-70 motion-reduce:animate-none" />
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
                </span>
                Kitchen open &middot; 28 min avg
              </span>
            </div>

            <nav
              aria-label="Quick links"
              style={{ animationDelay: "70ms" }}
              className={cn("standard-reveal group/col", visible && "is-in")}>
              <ColumnHeading title="Quick Links" />
              <ul className="mt-5 space-y-3">
                {QUICK_LINKS.map(({ href, label }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="relative inline-block text-sm text-white/55 transition-colors duration-300 after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-gradient-to-r after:from-[#f4574a] after:to-[#ff9e2c] after:transition-transform after:duration-300 hover:text-white hover:after:scale-x-100 focus-visible:ring-2 focus-visible:ring-[#f4574a]/60 focus-visible:outline-none">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div
              style={{ animationDelay: "140ms" }}
              className={cn("standard-reveal group/col", visible && "is-in")}>
              <ColumnHeading title="Our Services" />
              <ul className="mt-5 space-y-3">
                {SERVICES.map((label) => (
                  <li
                    key={label}
                    className="group/item flex cursor-default items-center gap-2 text-sm text-white/55 transition-colors duration-300 hover:text-white">
                    <span className="size-1.5 rounded-full bg-[#f4574a]/50 transition-all duration-300 group-hover/item:size-2 group-hover/item:bg-[#ff9e2c]" />
                    {label}
                  </li>
                ))}
              </ul>
            </div>

            <div
              style={{ animationDelay: "210ms" }}
              className={cn("standard-reveal group/col", visible && "is-in")}>
              <ColumnHeading title="Contact Us" />
              <ul className="mt-5 space-y-3.5">
                {CONTACTS.map(({ icon: Icon, label, href }) => {
                  const row = (
                    <>
                      <span className="grid size-9 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-white/50 transition-all duration-300 group-hover/item:border-[#f4574a]/50 group-hover/item:bg-[#f4574a]/15 group-hover/item:text-[#ff8a5c]">
                        <Icon className="size-4" aria-hidden="true" />
                      </span>
                      <span className="text-sm text-white/55 transition-colors duration-300 group-hover/item:text-white">
                        {label}
                      </span>
                    </>
                  )

                  return (
                    <li key={label}>
                      {href ? (
                        <a
                          href={href}
                          className="group/item flex items-center gap-3 focus-visible:ring-2 focus-visible:ring-[#f4574a]/60 focus-visible:outline-none">
                          {row}
                        </a>
                      ) : (
                        <div className="group/item flex items-center gap-3">
                          {row}
                        </div>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>

            <div
              style={{ animationDelay: "280ms" }}
              className={cn(
                "standard-reveal group/col sm:col-span-2 lg:col-span-1",
                visible && "is-in"
              )}>
              <ColumnHeading title="Follow Us" />
              <ul className="mt-5 flex flex-wrap gap-3">
                {SOCIALS.map(({ label, href, icon: Icon, hover }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={label}
                      className={cn(
                        "grid size-11 place-items-center rounded-full border border-white/12 bg-white/[0.04] text-white/60 transition-all duration-300 hover:-translate-y-1 hover:text-white focus-visible:ring-2 focus-visible:ring-[#f4574a]/60 focus-visible:outline-none",
                        hover
                      )}>
                      <Icon className="size-[18px]" />
                    </a>
                  </li>
                ))}
              </ul>

              <p className="mt-5 flex items-center gap-2 text-[12.5px] text-white/40">
                <Clock className="size-5 text-[#a75900]" aria-hidden="true" />
                Sun – Thu 11:00 – 23:00 <br />Fri – Sat 11:00 – 01:00
              </p>
            </div>
          </div>

          <div
            style={{ animationDelay: "340ms" }}
            className={cn(
              "standard-reveal mt-12 border-t border-white/10 pt-6",
              visible && "is-in"
            )}>
            <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
              <p className="text-[13px] text-white/40">
                © {year} PizzaHub. All rights reserved.
              </p>

              <p className="flex items-center gap-1.5 text-[13px] text-white/40">
                Made with
                <Heart
                  className="footer-heart size-3.5 fill-[#f4574a] text-[#f4574a]"
                  aria-hidden="true"
                />
                for pizza lovers
              </p>
            </div>
          </div>
        </div>
      </footer>

      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Back to top"
        tabIndex={showTop ? 0 : -1}
        className={cn(
          "fixed right-4 bottom-4 z-40 grid size-11 place-items-center rounded-full border border-white/12 bg-[#141312]/90 text-white/70 shadow-[0_16px_40px_-16px_rgba(0,0,0,0.9)] backdrop-blur transition-all duration-500 hover:-translate-y-0.5 hover:border-[#f4574a]/60 hover:text-white focus-visible:ring-2 focus-visible:ring-[#f4574a]/60 focus-visible:outline-none sm:right-6 sm:bottom-6",
          showTop
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0"
        )}>
        <ArrowUp className="size-5" />
      </button>
    </>
  )
}
