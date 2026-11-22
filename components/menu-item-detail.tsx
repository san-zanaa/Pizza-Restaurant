"use client"

import Image from "next/image"
import Link from "next/link"
import {
  Calendar,
  Check,
  CircleCheckBig,
  LoaderCircle,
  MapPin,
  MessageSquare,
  Pizza,
  Store,
  UserRound,
} from "lucide-react"
import { useEffect, useState } from "react"
import { apiGet, apiSend } from "@/lib/client-fetch"
import {
  Alert,
  Btn,
  Field,
  inputClass,
  StatusBadge,
} from "@/components/dashboard/ui-custom"
import type { AppUser, MenuItem } from "@/lib/types"


export function MenuItemDetail({
  id,
  user,
}: {
  id: string
  user: AppUser | null
}) {
  const [item, setItem] = useState<MenuItem | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [formOpen, setFormOpen] = useState(false)

  useEffect(() => {
    apiGet<{ item: MenuItem }>(`/api/menu/${id}`).then(({ data, error }) => {
      if (error || !data?.item) {
        setNotFound(true)
        return
      }
      setItem(data.item)
    })
  }, [id])

  if (notFound) {
    return (
      <div className="mx-auto max-w-xl px-4 pt-16 text-center">
        <EmptyIcon />
        <h1 className="mt-4 text-2xl font-extrabold text-foreground">
          This dish isn&apos;t on the menu
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          It may have been removed or is waiting for admin approval.
        </p>
        <Link
          href="/menu"
          className="mt-6 inline-flex h-10 items-center rounded-full bg-gradient-to-r from-[#f4574a] to-[#ff7d68] px-5 text-sm font-semibold text-white transition hover:brightness-110"
        >
          Back to Browse Menu
        </Link>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
          <div className="aspect-[4/3] animate-pulse rounded-3xl bg-muted" />
          <div className="flex flex-col gap-4 pt-2">
            <div className="h-8 w-2/3 animate-pulse rounded-lg bg-muted" />
            <div className="h-4 w-full animate-pulse rounded-lg bg-muted" />
            <div className="h-4 w-4/5 animate-pulse rounded-lg bg-muted" />
            <div className="h-12 w-40 animate-pulse rounded-full bg-muted" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pt-8 pb-16 sm:px-6 lg:px-8">
      <nav
        aria-label="Breadcrumb"
        className="mb-5 text-[12.5px] font-semibold text-muted-foreground"
      >
        <Link href="/menu" className="transition hover:text-[#f4574a]">
          Browse Menu
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{item.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1.05fr_1fr]">
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border bg-muted shadow-sm">
          <img
            src={item.image}
            alt={item.name}
            className="size-full object-cover"
          />
          <span className="absolute top-4 left-4 rounded-full bg-black/55 px-3 py-1 text-[11px] font-extrabold tracking-wider text-white uppercase backdrop-blur">
            {item.category}
          </span>
        </div>

        <div className="flex flex-col">
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
              {item.name}
            </h1>
            <span className="shrink-0 rounded-full bg-[#f4574a]/10 px-3.5 py-1.5 text-lg font-extrabold text-[#f4574a]">
              BDT {item.price}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-[13px] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <span className="rounded-full bg-[#f4574a]/10 px-2.5 py-0.5 text-[11px] font-bold tracking-wide text-[#f4574a] uppercase">
                {item.category}
              </span>
            </span>
          </div>

          <p className="mt-5 text-[14.5px] leading-relaxed whitespace-pre-wrap text-foreground/90">
            {item.description}
          </p>

          {item.details ? (
            <p className="mt-3 text-[13.5px] leading-relaxed text-muted-foreground">
              {item.details}
            </p>
          ) : null}

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {item.rating ? (
              <div className="rounded-xl border border-border bg-muted/30 px-3.5 py-2.5">
                <p className="text-[10.5px] font-extrabold tracking-wider text-muted-foreground uppercase">
                  Rating
                </p>
                <p className="mt-0.5 text-[14px] font-bold text-foreground">
                  ★ {item.rating}{" "}
                  <span className="text-[12px] font-medium text-muted-foreground">
                    ({item.reviewCount ?? 0} reviews)
                  </span>
                </p>
              </div>
            ) : null}
            {item.preparationTime ? (
              <div className="rounded-xl border border-border bg-muted/30 px-3.5 py-2.5">
                <p className="text-[10.5px] font-extrabold tracking-wider text-muted-foreground uppercase">
                  Prep time
                </p>
                <p className="mt-0.5 text-[14px] font-bold text-foreground">
                  {item.preparationTime}
                </p>
              </div>
            ) : null}
            {item.spiceLevel && item.spiceLevel !== "None" ? (
              <div className="rounded-xl border border-border bg-muted/30 px-3.5 py-2.5">
                <p className="text-[10.5px] font-extrabold tracking-wider text-muted-foreground uppercase">
                  Spice level
                </p>
                <p className="mt-0.5 text-[14px] font-bold text-foreground">
                  {item.spiceLevel}
                </p>
              </div>
            ) : null}
            {item.dietary && item.dietary.length ? (
              <div className="rounded-xl border border-border bg-muted/30 px-3.5 py-2.5">
                <p className="text-[10.5px] font-extrabold tracking-wider text-muted-foreground uppercase">
                  Dietary
                </p>
                <p className="mt-0.5 text-[14px] font-bold text-foreground">
                  {item.dietary.join(", ")}
                </p>
              </div>
            ) : null}
          </div>

          {item.sizes && item.sizes.length ? (
            <div className="mt-5">
              <p className="text-[12.5px] font-extrabold tracking-wider text-muted-foreground uppercase">
                Sizes &amp; prices
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {item.sizes.map((size) => (
                  <span
                    key={size.name}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-[12.5px] font-semibold text-foreground"
                  >
                    {size.name}
                    {size.diameter ? (
                      <span className="text-muted-foreground">
                        ({size.diameter})
                      </span>
                    ) : null}
                    <span className="font-extrabold text-[#f4574a]">
                      {item.currency} {size.price}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {item.ingredients && item.ingredients.length ? (
            <div className="mt-5">
              <p className="text-[12.5px] font-extrabold tracking-wider text-muted-foreground uppercase">
                Ingredients
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {item.ingredients.map((ing) => (
                  <span
                    key={ing}
                    className="rounded-full bg-muted px-3 py-1 text-[12px] font-medium text-foreground"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {item.allergens && item.allergens.length ? (
            <div className="mt-4">
              <p className="text-[12.5px] font-extrabold tracking-wider text-muted-foreground uppercase">
                Allergens
              </p>
              <p className="mt-1 text-[13px] text-rose-600 dark:text-rose-400">
                {item.allergens.join(", ")}
              </p>
            </div>
          ) : null}

          <div className="mt-7">
            {formOpen ? (
              <OrderForm
                user={user}
                item={item}
                onDone={() => {
                  setFormOpen(false)
                }}
              />
            ) : (
              <Btn
                onClick={() => setFormOpen(true)}
                className="h-12 w-full text-[15px] sm:w-auto sm:px-10"
              >
                <Pizza className="size-5" />
                Order this dish
              </Btn>
            )}
          </div>

          <p className="mt-4 text-[12.5px] text-muted-foreground">
            Orders start as <strong>Pending</strong> — the vendor accepts or
            rejects them, and you can cancel while they&apos;re pending.
          </p>
        </div>
      </div>
    </div>
  )
}

function EmptyIcon() {
  return (
    <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-muted text-muted-foreground">
      <Pizza className="size-7" />
    </span>
  )
}

function OrderForm({
  user,
  item,
  onDone,
}: {
  user: AppUser | null
  item: MenuItem
  onDone: () => void
}) {
  const today = new Date().toISOString().slice(0, 10)
  const [deliveryDate, setDeliveryDate] = useState("")
  const [deliveryAddress, setDeliveryAddress] = useState("")
  const [message, setMessage] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (submitting) return

    if (!deliveryDate) {
      setError("Choose a delivery date.")
      return
    }
    if (deliveryDate < today) {
      setError("Delivery date can't be in the past.")
      return
    }
    if (deliveryAddress.trim().length < 5) {
      setError("Enter a delivery address (at least 5 characters).")
      return
    }

    setSubmitting(true)
    setError(null)

    const { data, error: err } = await apiSend<{ order: { _id: string } }>(
      "/api/orders",
      "POST",
      {
        itemId: item._id,
        deliveryDate,
        deliveryAddress: deliveryAddress.trim(),
        message: message.trim(),
      }
    )

    setSubmitting(false)

    if (err) {
      if (err.toLowerCase().includes("signed in")) {
        setError(
          <>
            {err}{" "}
            <Link href="/sign-in" className="font-bold underline">
              Sign in
            </Link>{" "}
            to place your order.
          </>
        )
      } else {
        setError(err)
      }
      return
    }

    setSuccess(
      "Order placed! It's pending — the vendor will accept or reject it shortly."
    )
  }

  if (success) {
    return (
      <div className="rounded-3xl border border-emerald-500/40 bg-emerald-500/10 p-6">
        <p className="flex items-center gap-2 text-[15px] font-extrabold text-emerald-700 dark:text-emerald-300">
          <CircleCheckBig className="size-5" />
          Order placed successfully
        </p>
        <p className="mt-2 text-[13.5px] leading-snug text-emerald-800/80 dark:text-emerald-200/80">
          {success} Track it any time from your dashboard.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link
            href="/dashboard/orders"
            className="inline-flex h-10 items-center gap-2 rounded-full bg-gradient-to-r from-[#f4574a] to-[#ff7d68] px-5 text-sm font-semibold text-white transition hover:brightness-110"
          >
            <Check className="size-4" />
            View my orders
          </Link>
          <Btn variant="outline" onClick={onDone}>
            Close
          </Btn>
        </div>
      </div>
    )
  }

  return (
    <form
      onSubmit={submit}
      noValidate
      className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6"
    >
      <p className="text-[15px] font-extrabold text-foreground">
        Place your order
      </p>
      <p className="mt-1 text-[12.5px] text-muted-foreground">
        Detected automatically — no need to type them.
      </p>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <DetectedChip
          icon={UserRound}
          label="Customer"
          value={user ? user.email : "Sign in required"}
        />
        
        <DetectedChip icon={Pizza} label="Item" value={item.name} />
        <DetectedChip
          icon={Calendar}
          label="Delivery"
          value={deliveryDate || "Pick a date"}
        />
      </div>

      {error ? (
        <div className="mt-4">
          <Alert kind="error">{error}</Alert>
        </div>
      ) : null}

      <div className="mt-5 grid gap-4">
        <Field label="Delivery Date" required htmlFor="order-date">
          <input
            id="order-date"
            type="date"
            min={today}
            className={inputClass}
            value={deliveryDate}
            onChange={(event) => setDeliveryDate(event.target.value)}
          />
        </Field>
        <Field label="Delivery Address" required htmlFor="order-address">
          <textarea
            id="order-address"
            rows={2}
            className={`${inputClass} h-auto resize-none py-3`}
            placeholder="House, street, area, city"
            value={deliveryAddress}
            onChange={(event) => setDeliveryAddress(event.target.value)}
            maxLength={300}
          />
        </Field>
        <Field
          label="Additional Message / Special Instructions"
          htmlFor="order-message"
          hint="Optional — allergies, extra toppings, delivery notes…"
        >
          <textarea
            id="order-message"
            rows={2}
            className={`${inputClass} h-auto resize-none py-3`}
            placeholder="No onion, ring the bell twice…"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            maxLength={1000}
          />
        </Field>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <Btn type="submit" disabled={submitting}>
          {submitting ? (
            <LoaderCircle className="size-4 animate-spin motion-reduce:animate-none" />
          ) : (
            <MessageSquare className="size-4" />
          )}
          {submitting ? "Placing order…" : "Place Order"}
        </Btn>
        <Btn type="button" variant="ghost" onClick={onDone}>
          Cancel
        </Btn>
      </div>
    </form>
  )
}

function DetectedChip({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/30 px-3 py-2">
      <Icon className="size-4 shrink-0 text-[#f4574a]" />
      <div className="min-w-0">
        <p className="text-[10.5px] font-extrabold tracking-wider text-muted-foreground uppercase">
          {label}
        </p>
        <p className="truncate text-[12.5px] font-bold text-foreground">
          {value}
        </p>
      </div>
    </div>
  )
}
