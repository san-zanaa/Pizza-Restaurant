"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import { ArrowRight, Flame, LoaderCircle, Lock, MapPin, MessageSquare, Pizza } from "lucide-react"
import { useEffect, useState } from "react"
import { apiGet, apiSend } from "@/lib/client-fetch"
import { authClient } from "@/lib/auth-client"
import { EmptyState, Loading } from "@/components/dashboard/ui-custom"
import { useInView } from "@/hooks/use-in-view"
import { cn } from "@/lib/utils"
import { primaryImage, type AppUser, type MenuItem } from "@/lib/types"

type Combo = { items: MenuItem[] }

export function PopularCombos() {
  const [headerRef, headerVisible] = useInView<HTMLDivElement>(0.25)
  const [gridRef, gridVisible] = useInView<HTMLDivElement>(0.1)

  const router = useRouter()
  const { data: session } = authClient.useSession()
  const user = (session?.user ?? null) as AppUser | null

  const [combos, setCombos] = useState<Combo[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [ordering, setOrdering] = useState<Combo | null>(null)
  const [deliveryDate, setDeliveryDate] = useState("")
  const [deliveryAddress, setDeliveryAddress] = useState("")
  const [message, setMessage] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    let alive = true
    apiGet<{ items: MenuItem[] }>(`/api/menu?limit=4`).then(
      ({ data, error: err }) => {
        if (!alive) return
        if (err || !data) {
          setError(err)
          setCombos([])
          return
        }
        const items = data.items ?? []
        const paired: Combo[] = []
        for (let i = 0; i + 1 < items.length; i += 2) {
          paired.push({ items: [items[i], items[i + 1]] })
        }
        setCombos(paired.slice(0, 2))
      }
    )
    return () => {
      alive = false
    }
  }, [])

  return (
    <>
    <section
      aria-labelledby="combos-heading"
      className="relative isolate overflow-hidden border-t border-border/60 bg-[#fffaf5] py-16 sm:py-20 dark:bg-[#0b0a09]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 -z-10 size-[30rem] -translate-x-1/2 rounded-full bg-[#ff9740]/12 blur-3xl"
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
            Crowd favourites
            <span
              aria-hidden="true"
              className="h-px w-8 bg-gradient-to-l from-transparent to-[#f4574a]/70"
            />
          </span>

          <h2
            id="combos-heading"
            style={{ animationDelay: "80ms" }}
            className={cn(
              "standard-reveal mt-4 text-[clamp(1.75rem,1.1rem+2.4vw,2.75rem)] leading-[1.08] font-extrabold tracking-tight text-foreground",
              headerVisible && "is-in"
            )}>
            Popular Pizza{" "}
            <span className="bg-gradient-to-r from-[#e63329] via-[#f4574a] to-[#ff8a5c] bg-clip-text text-transparent">
              Combos
            </span>
          </h2>

          <p
            style={{ animationDelay: "160ms" }}
            className={cn(
              "standard-reveal mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground",
              headerVisible && "is-in"
            )}>
            Two of our most-loved dishes paired together — pick a combo and
            order it straight to your door.
          </p>
        </div>

        {error ? (
          <p className="mt-10 text-center text-sm text-rose-500">{error}</p>
        ) : combos === null ? (
          <div className="mt-10">
            <Loading label="Loading popular combos…" />
          </div>
        ) : combos.length === 0 ? (
          <div className="mt-10">
            <EmptyState
              icon={Pizza}
              title="No combos yet"
              hint="Popular dishes will show up here as soon as they're available."
            />
          </div>
        ) : (
          <div
            ref={gridRef}
            className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {combos.map((combo, index) => {
              const [a, b] = combo.items
              const total = a.price + b.price
              return (
                <article
                  key={`${a._id}-${b._id}`}
                  style={{ animationDelay: `${index * 90}ms` }}
                  className={cn(
                    "standard-reveal group flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm",
                    "transition-all duration-300 hover:-translate-y-1 hover:border-[#f4574a]/40 hover:shadow-[0_24px_50px_-30px_rgba(244,87,74,0.6)]",
                    gridVisible && "is-in"
                  )}>
                  <div className="grid grid-cols-2 gap-1 bg-muted">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={primaryImage(a)}
                        alt={a.itemName}
                        loading="lazy"
                        className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={primaryImage(b)}
                        alt={b.itemName}
                        loading="lazy"
                        className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#f4574a]/10 px-3 py-1 text-[10.5px] font-extrabold tracking-wider text-[#f4574a] uppercase">
                      <Flame className="size-3.5" />
                      Combo deal
                    </span>

                    <h3 className="mt-3 text-lg font-extrabold leading-snug text-foreground sm:text-xl">
                      {a.itemName}{" "}
                      <span className="text-[#f4574a]">+</span> {b.itemName}
                    </h3>

                    <p className="mt-2 line-clamp-2 text-[13px] leading-snug text-muted-foreground">
                      {a.description} {b.description}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-3 text-[12px] text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="size-3.5 text-[#f4574a]" />
                        <span className="truncate">{a.category}</span>
                      </span>
                    </div>

                    <div className="mt-auto flex items-end justify-between gap-3 pt-5">
                      <div>
                        <p className="text-[10.5px] font-extrabold tracking-wider text-muted-foreground uppercase">
                          Combo price
                        </p>
                        <p className="mt-0.5 text-2xl font-extrabold text-[#f4574a]">
                          BDT {total - 100}
                        </p>
                        <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                          Save BDT 100
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/menu/${a._id}`}
                          className="inline-flex h-9 items-center gap-1.5 rounded-full border border-[#f4574a]/40 px-4 text-[12.5px] font-bold text-[#f4574a] transition-colors hover:bg-[#f4574a] hover:text-white">
                          {a.itemName}
                          <ArrowRight className="size-3.5" />
                        </Link>
                        <Link
                          href={`/menu/${b._id}`}
                          className="inline-flex h-9 items-center gap-1.5 rounded-full border border-[#f4574a]/40 px-4 text-[12.5px] font-bold text-[#f4574a] transition-colors hover:bg-[#f4574a] hover:text-white">
                          {b.itemName}
                          <ArrowRight className="size-3.5" />
                        </Link>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (!user) {
                          router.push("/sign-in?callbackUrl=/")
                          return
                        }
                        if (user.blocked) {
                          toast.error("Your account has been blocked.")
                          return
                        }
                        if (user.role !== "customer") {
                          toast.error("Only customers can place orders.")
                          return
                        }
                        setOrdering(combo)
                        setDeliveryDate("")
                        setDeliveryAddress("")
                        setMessage("")
                        setFormError(null)
                        setSuccess(null)
                      }}
                      className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#f4574a] to-[#ff7d68] text-sm font-bold text-white shadow-[0_14px_34px_-16px_rgba(244,87,74,0.95)] transition hover:brightness-110">
                      {user ? <Pizza className="size-4" /> : <Lock className="size-4" />}
                      {user ? "Order this combo" : "Sign in to order"}
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </section>

    {ordering ? (
      <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm">
        <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl">
          {success ? (
            <div className="rounded-3xl border border-emerald-500/40 bg-emerald-500/10 p-6">
              <p className="flex items-center gap-2 text-[15px] font-extrabold text-emerald-700 dark:text-emerald-300">
                <Pizza className="size-5" />
                Combo ordered successfully
              </p>
              <p className="mt-2 text-[13.5px] leading-snug text-emerald-800/80 dark:text-emerald-200/80">
                {success} Track it from your dashboard.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Link
                  href="/dashboard/orders"
                  className="inline-flex h-10 items-center gap-2 rounded-full bg-gradient-to-r from-[#f4574a] to-[#ff7d68] px-5 text-sm font-semibold text-white transition hover:brightness-110">
                  View my orders
                </Link>
                <button
                  type="button"
                  onClick={() => setOrdering(null)}
                  className="inline-flex h-10 items-center rounded-full border border-border px-5 text-sm font-semibold text-foreground transition hover:bg-muted">
                  Close
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10.5px] font-extrabold tracking-[0.22em] text-[#e63329] uppercase dark:text-[#ff7d68]">
                    Combo order
                  </p>
                  <h3 className="mt-1 text-xl font-extrabold text-foreground">
                    {ordering.items[0].itemName} + {ordering.items[1].itemName}
                  </h3>
                  <p className="mt-1 text-[13px] text-muted-foreground">
                    BDT {ordering.items[0].price + ordering.items[1].price - 100} (save BDT 100)
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setOrdering(null)}
                  aria-label="Close"
                  className="grid size-9 place-items-center rounded-full border border-border text-muted-foreground transition hover:bg-muted hover:text-foreground">
                  <ArrowRight className="size-4 rotate-45" />
                </button>
              </div>

              {formError ? (
                <div className="mt-4 rounded-xl border border-rose-500/40 bg-rose-500/10 px-3.5 py-2.5 text-[13px] text-rose-600 dark:text-rose-300">
                  {formError}
                </div>
              ) : null}

              <form
                className="mt-5 grid gap-4"
                onSubmit={async (event) => {
                  event.preventDefault()
                  if (submitting) return
                  const today = new Date().toISOString().slice(0, 10)
                  if (!deliveryDate) {
                    setFormError("Choose a delivery date.")
                    return
                  }
                  if (deliveryDate < today) {
                    setFormError("Delivery date can't be in the past.")
                    return
                  }
                  if (deliveryAddress.trim().length < 5) {
                    setFormError("Enter a delivery address (at least 5 characters).")
                    return
                  }
                  setSubmitting(true)
                  setFormError(null)
                  const { error: err } = await apiSend<{ orders: unknown[] }>(
                    "/api/orders/combo",
                    "POST",
                    {
                      itemIds: ordering.items.map((i) => i._id),
                      deliveryDate,
                      deliveryAddress: deliveryAddress.trim(),
                      message: message.trim(),
                    }
                  )
                  setSubmitting(false)
                  if (err) {
                    setFormError(err)
                    toast.error(err)
                    return
                  }
                  setSuccess("Both dishes are on their way — track them from your dashboard.")
                  toast.success("Combo ordered successfully.")
                }}>
                <div>
                  <label className="text-[13px] font-semibold text-foreground">
                    Delivery Date
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().slice(0, 10)}
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="mt-1.5 h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm text-foreground outline-none focus:border-[#ff9e2c]/60 focus:ring-4 focus:ring-[#ff9e2c]/12"
                  />
                </div>
                <div>
                  <label className="text-[13px] font-semibold text-foreground">
                    Delivery Address
                  </label>
                  <textarea
                    rows={2}
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="House, street, area, city"
                    className="mt-1.5 h-auto w-full resize-none rounded-xl border border-border bg-background px-3.5 py-3 text-sm text-foreground outline-none focus:border-[#ff9e2c]/60 focus:ring-4 focus:ring-[#ff9e2c]/12"
                  />
                </div>
                <div>
                  <label className="text-[13px] font-semibold text-foreground">
                    Additional Message
                  </label>
                  <textarea
                    rows={2}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Allergies, delivery notes…"
                    className="mt-1.5 h-auto w-full resize-none rounded-xl border border-border bg-background px-3.5 py-3 text-sm text-foreground outline-none focus:border-[#ff9e2c]/60 focus:ring-4 focus:ring-[#ff9e2c]/12"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex h-11 items-center gap-2 rounded-full bg-gradient-to-r from-[#f4574a] to-[#ff7d68] px-6 text-sm font-bold text-white transition hover:brightness-110 disabled:cursor-wait disabled:opacity-70">
                    {submitting ? <LoaderCircle className="size-4 animate-spin" /> : <MessageSquare className="size-4" />}
                    {submitting ? "Placing…" : "Place combo order"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrdering(null)}
                    className="inline-flex h-11 items-center rounded-full border border-border px-5 text-sm font-semibold text-foreground transition hover:bg-muted">
                    Cancel
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    ) : null}
    </>
  )
}
