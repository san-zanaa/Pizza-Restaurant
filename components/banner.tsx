"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import {
  ArrowRight,
  Bike,
  Flame,
  Headphones,
  Leaf,
  ShieldCheck,
  Store,
} from "lucide-react"

const ROTATING_WORDS = ["Delicious", "Cheesy", "Tasty", "Crispy"]

const FEATURES = [
  { icon: Leaf, title: "Fresh", subtitle: "Ingredients" },
  { icon: Bike, title: "Fast", subtitle: "Delivery" },
  { icon: ShieldCheck, title: "Trusted", subtitle: "Restaurants" },
  { icon: Headphones, title: "24/7", subtitle: "Support" },
] as const

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)"

function enter(delayMs: number) {
  return {
    animation: `banner-fade-up 0.7s ${EASE} both`,
    animationDelay: `${delayMs}ms`,
  } as const
}

export function Banner() {
  const [wordIndex, setWordIndex] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const id = setInterval(
      () => setWordIndex((i) => (i + 1) % ROTATING_WORDS.length),
      2600
    )
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    const bg = bgRef.current
    if (!section || !bg) return

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (!fine || calm) return

    const onMove = (event: PointerEvent) => {
      const rect = section.getBoundingClientRect()
      const x = (event.clientX - rect.left) / rect.width - 0.5
      const y = (event.clientY - rect.top) / rect.height - 0.5
      bg.style.setProperty("--bx", `${(-x * 14).toFixed(1)}px`)
      bg.style.setProperty("--by", `${(-y * 10).toFixed(1)}px`)
    }
    const onLeave = () => {
      bg.style.setProperty("--bx", "0px")
      bg.style.setProperty("--by", "0px")
    }

    section.addEventListener("pointermove", onMove)
    section.addEventListener("pointerleave", onLeave)
    return () => {
      section.removeEventListener("pointermove", onMove)
      section.removeEventListener("pointerleave", onLeave)
    }
  }, [])

  const word = ROTATING_WORDS[wordIndex]

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-hidden bg-[#e8cfb0]"
      aria-label="Pizza delivery promotion">
      <div
        ref={bgRef}
        className="absolute inset-0 -z-10 transition-transform duration-500 ease-out will-change-transform"
        style={{
          transform: "translate(var(--bx, 0px), var(--by, 0px)) scale(1.06)",
        }}>
        <Image
          src="/assets/pizzabanner.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[80%_center] animate-[banner-fade_1.2s_ease-out_both] md:object-right"
        />
      </div>

      <div
        className="absolute inset-0 -z-10 md:hidden"
        style={{
          background: `linear-gradient(180deg, rgba(247,231,211,0.85) 0%, rgba(247,231,211,0.8) 45%, rgba(247,231,211,0.5) 75%, rgba(247,231,211,0.2) 100%)`,
        }}
      />
      <div
        className="absolute inset-0 -z-10 hidden md:block"
        style={{
          background: `linear-gradient(90deg, rgba(247,231,211,0.88) 0%, rgba(247,231,211,0.82) 40%, rgba(247,231,211,0.55) 60%, rgba(247,231,211,0.15) 80%, transparent 100%)`,
        }}
      />

      <div
        className="absolute -left-16 top-6 -z-10 size-56 rounded-full bg-[#ff8a5c]/25 blur-3xl motion-reduce:animate-none"
        style={{ animation: "banner-float 7s ease-in-out infinite" }}
      />
      <div
        className="absolute bottom-24 left-[6%] -z-10 size-36 rounded-full bg-[#e63329]/15 blur-3xl motion-reduce:animate-none"
        style={{ animation: "banner-float 9s ease-in-out 1.2s infinite" }}
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 md:py-16 lg:px-8 lg:py-20">
        <div className="flex min-h-[540px] flex-col justify-center md:min-h-[560px]">
          <div className="w-full max-w-[600px] md:max-w-[55%] lg:max-w-[640px]">
            <span
              className="inline-flex items-center gap-2 rounded-full border border-[#e63329]/20 bg-white/70 px-4 py-1.5 text-[13px] font-semibold tracking-wide text-[#c2410c] shadow-sm backdrop-blur-sm motion-reduce:animate-none"
              style={enter(0)}>
              <span
                className="size-2 rounded-full bg-[#f4574a] motion-reduce:animate-none"
                style={{ animation: "banner-dot 2s ease-out infinite" }} />
              Eat &middot; Order &middot; Enjoy
            </span>

            <h1
              className="mt-5 text-[2.5rem] leading-[1.05] font-extrabold tracking-tight text-[#1c1917] sm:text-5xl lg:text-6xl motion-reduce:animate-none"
              style={enter(90)}>
              <span className="block">Hot, Fresh &amp;</span>
              <span
                key={word}
                className="mt-1 block bg-gradient-to-r from-[#e63329] via-[#f4574a] to-[#ff7d68] bg-clip-text text-transparent motion-reduce:animate-none"
                style={{ animation: "banner-word 0.45s cubic-bezier(0.22, 1, 0.36, 1) both" }}>
                {word} Pizza
              </span>
              <span className="relative mt-1 block">
                Delivered to Your Door.
                <svg
                  viewBox="0 0 300 18"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                  className="absolute -bottom-2.5 left-0 h-3 w-[min(100%,26rem)] text-[#f4574a]">
                  <path
                    d="M4 13 C 70 2, 200 2, 296 10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            <p
              className="mt-7 max-w-lg text-base leading-relaxed text-[#57534e] sm:text-lg motion-reduce:animate-none"
              style={enter(280)}>
              Discover your favorite pizzas from local restaurants and get them
              delivered fast and fresh!
            </p>

            <div
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center motion-reduce:animate-none"
              style={enter(380)}>
              <Link
                href="/menu"
                className="group relative inline-flex h-12 items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-[#e63329] to-[#f4574a] px-7 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(230,51,41,0.35)] transition hover:shadow-[0_10px_30px_rgba(230,51,41,0.45)] focus-visible:ring-3 focus-visible:ring-[#e63329]/50 focus-visible:outline-none motion-reduce:transition-none">
                <span className="relative z-10">Explore Menu</span>
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
                <span className="absolute inset-y-0 -left-full w-1/2 -skew-x-12 bg-white/25 transition-all duration-700 group-hover:left-[110%]" />
              </Link>
              <Link
                href="/partner"
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-full border-2 border-[#e63329]/80 bg-white/80 px-7 text-sm font-semibold text-[#e63329] backdrop-blur-sm transition hover:bg-white hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] focus-visible:ring-3 focus-visible:ring-[#e63329]/40 focus-visible:outline-none motion-reduce:transition-none">
                <Store className="size-4" />
                Become a Partner
              </Link>
            </div>

            <ul
              className="mt-10 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-black/10 pt-7 sm:flex sm:flex-wrap sm:items-center sm:gap-x-5 sm:border-t-0 sm:pt-0 motion-reduce:animate-none [&>li+li]:sm:border-l [&>li+li]:sm:border-black/10 [&>li+li]:sm:pl-5"
              style={enter(480)}>
              {FEATURES.map(({ icon: Icon, title, subtitle }) => (
                <li key={title} className="flex items-center gap-2.5">
                  <Icon className="size-5 shrink-0 text-[#e63329]" strokeWidth={2.2} />
                  <span className="text-[13px] leading-tight">
                    <span className="block font-semibold text-[#1c1917]">
                      {title}
                    </span>
                    <span className="block text-[#57534e]">{subtitle}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <Flame
        aria-hidden="true"
        className="absolute right-[6%] top-[14%] -z-10 hidden size-8 text-[#f4574a]/40 lg:block motion-reduce:animate-none"
        style={{ animation: "banner-float 6s ease-in-out 0.5s infinite" }}
      />
    </section>
  )
}
