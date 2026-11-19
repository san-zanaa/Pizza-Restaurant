"use client"

import { useEffect, useRef, useState } from "react"
import type { LucideIcon } from "lucide-react"
import {
  ArrowRight,
  Check,
  CheckCheck,
  CircleX,
  Clock,
  Copy,
  Gift,
  LoaderCircle,
  Mail,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useInView } from "@/hooks/use-in-view"

const COUPON_CODE = "WELCOME10"
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type Status = "idle" | "error" | "submitting" | "success"

const TRUST: { icon: LucideIcon; label: string }[] = [
  { icon: ShieldCheck, label: "No spam, ever" },
  { icon: Users, label: "21k+ foodies" },
  { icon: Sparkles, label: "Weekly secret drops" },
]

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
}

function msUntilMidnight() {
  const now = new Date()
  const midnight = new Date(now)
  midnight.setHours(24, 0, 0, 0)
  return midnight.getTime() - now.getTime()
}

function formatRemaining(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000))
  const hours = Math.floor(total / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const seconds = total % 60
  return [hours, minutes, seconds]
    .map((n) => String(n).padStart(2, "0"))
    .join(":")
}

export function OfferSection() {
  const [ringRef, sectionVisible] = useInView<HTMLDivElement>(0.2)

  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<Status>("idle")
  const [copied, setCopied] = useState(false)
  const [remaining, setRemaining] = useState("00:00:00")

  const inputRef = useRef<HTMLInputElement>(null)
  const submitTimer = useRef<number | null>(null)
  const copyTimer = useRef<number | null>(null)

  useEffect(() => {
    const tick = () => setRemaining(formatRemaining(msUntilMidnight()))
    const initial = window.setTimeout(tick, 0)
    const interval = window.setInterval(tick, 1000)
    return () => {
      window.clearTimeout(initial)
      window.clearInterval(interval)
    }
  }, [])

  useEffect(
    () => () => {
      if (submitTimer.current) window.clearTimeout(submitTimer.current)
      if (copyTimer.current) window.clearTimeout(copyTimer.current)
    },
    []
  )

  const shakeInput = () => {
    const node = inputRef.current
    if (!node || prefersReducedMotion() || typeof node.animate !== "function")
      return
    node.animate(
      [
        { transform: "translateX(0)" },
        { transform: "translateX(-7px)" },
        { transform: "translateX(6px)" },
        { transform: "translateX(-4px)" },
        { transform: "translateX(0)" },
      ],
      { duration: 420, easing: "ease-in-out" }
    )
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (status === "submitting" || status === "success") return

    if (!EMAIL_PATTERN.test(email.trim())) {
      setStatus("error")
      shakeInput()
      inputRef.current?.focus()
      return
    }

    setStatus("submitting")
    submitTimer.current = window.setTimeout(() => setStatus("success"), 1100)
  }

  const copyCode = async () => {
    let ok = false
    try {
      await navigator.clipboard.writeText(COUPON_CODE)
      ok = true
    } catch {
      try {
        const helper = document.createElement("textarea")
        helper.value = COUPON_CODE
        helper.setAttribute("readonly", "")
        helper.style.position = "fixed"
        helper.style.opacity = "0"
        document.body.appendChild(helper)
        helper.select()
        ok = document.execCommand("copy")
        document.body.removeChild(helper)
      } catch {
        ok = false
      }
    }

    if (!ok) return
    setCopied(true)
    copyTimer.current = window.setTimeout(() => setCopied(false), 1900)
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const node = event.currentTarget
    if (
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches ||
      prefersReducedMotion()
    ) {
      return
    }
    const rect = node.getBoundingClientRect()
    node.style.setProperty(
      "--mx",
      `${(((event.clientX - rect.left) / rect.width) * 100).toFixed(1)}%`
    )
    node.style.setProperty(
      "--my",
      `${(((event.clientY - rect.top) / rect.height) * 100).toFixed(1)}%`
    )
  }

  const submitting = status === "submitting"
  const success = status === "success"

  return (
    <section
      aria-labelledby="offer-heading"
      className="relative isolate overflow-hidden pt-8 pb-16 sm:pt-10 sm:pb-20 lg:pt-12 lg:pb-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 mx-auto h-64 max-w-6xl bg-[radial-gradient(60%_100%_at_50%_0%,rgba(244,87,74,0.14),transparent_70%)] blur-2xl"
      />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          ref={ringRef}
          className="offer-ring relative rounded-[30px] p-px [--offer-angle:0deg]">
          <div
            onPointerMove={handlePointerMove}
            style={{
              animationDelay: "90ms",
            }}
            className={cn(
              "standard-reveal group relative overflow-hidden rounded-[29px] bg-[#141312] shadow-[0_50px_100px_-55px_rgba(0,0,0,0.85)]",
              sectionVisible && "is-in"
            )}>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-28 -left-24 size-72 rounded-full bg-[#f4574a]/30 blur-3xl"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -bottom-32 size-80 rounded-full bg-[#ff9e2c]/20 blur-3xl"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(80%_70%_at_30%_20%,black,transparent)] opacity-[0.5]"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
                backgroundSize: "48px 48px",
              }}
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{
                background:
                  "radial-gradient(420px circle at var(--mx, 50%) var(--my, 0%), rgba(255,255,255,0.09), transparent 60%)",
              }}
            />
            <Sparkles
              aria-hidden="true"
              className="absolute top-6 right-6 hidden size-7 text-[#ff9e2c]/40 motion-reduce:animate-none lg:block"
              style={{ animation: "banner-float 7s ease-in-out infinite" }}
            />

            <div className="relative grid gap-8 p-6 sm:p-9 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:items-center lg:gap-12 lg:p-11">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#ff9e2c]/30 bg-[#ff9e2c]/10 px-3.5 py-1.5 text-[10.5px] font-extrabold tracking-[0.24em] text-[#ffb454] uppercase">
                  <Gift className="size-3.5" aria-hidden="true" />
                  Welcome Offer
                </span>

                <h2
                  id="offer-heading"
                  className="mt-5 text-[clamp(1.6rem,1.05rem+2vw,2.45rem)] leading-[1.08] font-extrabold tracking-tight text-white">
                  Get{" "}
                  <span className="bg-gradient-to-r from-[#ff9e2c] via-[#ffc163] to-[#ff7d68] bg-clip-text text-transparent">
                    $10&nbsp;Off
                  </span>{" "}
                  Your First Artisanal Order
                </h2>

                <p className="mt-4 max-w-md text-sm leading-relaxed text-white/55 sm:text-[15px]">
                  Subscribe to our culinary dispatches for secret pizza drops,
                  seasonal white truffle debuts, and exclusive member tastings.
                </p>

                <div className="mt-6 inline-flex flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3">
                  <span className="flex items-center gap-2 text-[11px] font-bold tracking-[0.16em] text-white/45 uppercase">
                    <Clock
                      className="size-3.5 text-[#ff9e2c]"
                      aria-hidden="true"
                    />
                    Offer held for
                  </span>
                  <span
                    className="text-lg leading-none font-extrabold text-[#ffb454] tabular-nums"
                    aria-live="off">
                    {remaining}
                  </span>
                </div>

                <ul className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2.5">
                  {TRUST.map(({ icon: Icon, label }) => (
                    <li
                      key={label}
                      className="flex items-center gap-1.5 text-[12px] font-medium text-white/45">
                      <Icon
                        className="size-3.5 text-white/35"
                        aria-hidden="true"
                      />
                      {label}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative rounded-2xl border border-white/10 bg-black/35 p-5 sm:p-6">
                <span
                  aria-hidden="true"
                  className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-[#ff9e2c]/60 to-transparent"
                />

                <p className="text-[10.5px] font-extrabold tracking-[0.22em] text-white/40 uppercase">
                  {success ? "Coupon unlocked" : "Claim your welcome coupon"}
                </p>

                {success ? (
                  <div className="offer-pop">
                    <div className="mt-3.5 flex items-start gap-3.5">
                      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#34d399] to-[#10b981] text-emerald-950 shadow-[0_8px_24px_-10px_rgba(16,185,129,0.9)]">
                        <CheckCheck
                          className="size-5"
                          strokeWidth={2.6}
                          aria-hidden="true"
                        />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[15px] leading-snug font-bold text-white">
                          $10 code on its way
                        </p>
                        <p className="mt-1 truncate text-[13px] text-white/50">
                          Sent to <span className="text-white/75">{email}</span>
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-dashed border-[#ff9e2c]/45 bg-[#ff9e2c]/10 px-4 py-3">
                      <span className="truncate font-mono text-[15px] font-extrabold tracking-[0.18em] text-[#ffb454]">
                        {COUPON_CODE}
                      </span>
                      <button
                        type="button"
                        onClick={copyCode}
                        className={cn(
                          "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold tracking-wide uppercase transition",
                          copied
                            ? "bg-emerald-400/15 text-emerald-300 ring-1 ring-emerald-400/40"
                            : "bg-white/10 text-white/70 ring-1 ring-white/15 hover:bg-white/15 hover:text-white focus-visible:ring-2 focus-visible:ring-[#ff9e2c]/60 focus-visible:outline-none"
                        )}>
                        {copied ? (
                          <Check className="size-3.5" aria-hidden="true" />
                        ) : (
                          <Copy className="size-3.5" aria-hidden="true" />
                        )}
                        {copied ? "Copied" : "Copy"}
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setStatus("idle")
                        setEmail("")
                        setCopied(false)
                        requestAnimationFrame(() => inputRef.current?.focus())
                      }}
                      className="mt-4 text-xs text-white/40 underline-offset-4 transition hover:text-white/75 hover:underline focus-visible:ring-2 focus-visible:ring-[#ff9e2c]/60 focus-visible:outline-none">
                      Use a different email
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="mt-3.5">
                    <div className="flex flex-col gap-3 xl:flex-row">
                      <div className="relative min-w-0 xl:flex-1">
                        <Mail
                          aria-hidden="true"
                          className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-white/30"
                        />
                        <input
                          ref={inputRef}
                          type="email"
                          name="email"
                          autoComplete="email"
                          value={email}
                          disabled={submitting}
                          aria-invalid={status === "error"}
                          aria-describedby="offer-status"
                          onChange={(event) => {
                            setEmail(event.target.value)
                            if (status === "error") setStatus("idle")
                          }}
                          placeholder="Enter your email address..."
                          className={cn(
                            "h-12 w-full rounded-full border bg-white/[0.06] pr-4 pl-11 text-sm text-white transition outline-none",
                            "placeholder:text-white/30",
                            "disabled:cursor-not-allowed disabled:opacity-60",
                            "focus:border-[#ff9e2c]/70 focus:bg-white/10 focus:ring-4 focus:ring-[#ff9e2c]/15",
                            status === "error"
                              ? "border-[#f43f5e]/70 ring-4 ring-[#f43f5e]/12"
                              : "border-white/12"
                          )}
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={submitting}
                        className="offer-btn group/btn relative inline-flex h-12 w-full shrink-0 items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-[#f4574a] to-[#ff8a3d] px-6 text-sm font-bold whitespace-nowrap text-white shadow-[0_14px_34px_-14px_rgba(244,87,74,0.95)] transition focus-visible:ring-2 focus-visible:ring-[#ffb454] focus-visible:ring-offset-2 focus-visible:ring-offset-[#141312] focus-visible:outline-none active:scale-[0.98] disabled:cursor-wait xl:w-auto xl:px-7">
                        <span
                          aria-hidden="true"
                          className="offer-shine absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/45 to-transparent"
                        />
                        <span className="relative z-10 flex items-center gap-2">
                          {submitting ? (
                            <>
                              <LoaderCircle
                                className="size-4 animate-spin motion-reduce:animate-none"
                                aria-hidden="true"
                              />
                              Securing code…
                            </>
                          ) : (
                            <>
                              Claim $10 Coupon
                              <ArrowRight
                                className="size-4 transition-transform group-hover/btn:translate-x-1 motion-reduce:transition-none"
                                aria-hidden="true"
                              />
                            </>
                          )}
                        </span>
                      </button>
                    </div>

                    <p
                      id="offer-status"
                      role="status"
                      aria-live="polite"
                      className={cn(
                        "mt-3 flex items-center gap-1.5 text-[12.5px] transition-opacity duration-200",
                        status === "error"
                          ? "text-[#fb7185] opacity-100"
                          : "text-white/35 opacity-100"
                      )}>
                      {status === "error" ? (
                        <>
                          <CircleX
                            className="size-3.5 shrink-0"
                            aria-hidden="true"
                          />
                          Hmm, that email doesn’t look right — try again.
                        </>
                      ) : (
                        <>One click. No spam. Unsubscribe whenever you like.</>
                      )}
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
