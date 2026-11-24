"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Calendar,
  Check,
  CircleCheckBig,
  LoaderCircle,
  Lock,
  MapPin,
  MessageSquare,
  Pizza,
  Store,
} from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { apiGet, apiSend } from "@/lib/client-fetch"
import {
  Alert,
  Btn,
  Field,
  inputClass,
} from "@/components/dashboard/ui-custom"
import { FavoriteToggle } from "@/components/favorite-toggle"
import { primaryImage, type AppUser, type MenuItem } from "@/lib/types"

export function MenuItemDetail({
  id,
  user,
}: {
  id: string
  user: AppUser | null
}) {
  const router = useRouter()
  const [item, setItem] = useState<MenuItem | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [activeImage, setActiveImage] = useState(0)

  useEffect(() => {
    let alive = true
    apiGet<{ item: MenuItem }>(`/api/menu/${id}`).then(({ data, error }) => {
      if (!alive) return
      if (error || !data?.item) {
        setNotFound(true)
        return
      }
      setItem(data.item)
      setActiveImage(0)
    })
    return () => {
      alive = false
    }
  }, [id])

  const startOrdering = () => {
    if (!user) {
      toast.info("Sign in to place your order.")
      router.push(`/sign-in?callbackUrl=${encodeURIComponent(`/menu/${id}`)}`)
      return
    }
    if (user.blocked) {
      toast.error("Your account has been blocked by an administrator.")
      return
    }
    if (user.role === "admin") {
      toast.error("Admin accounts can't place customer orders.")
      return
    }
    if (user.role === "vendor" && item && item.vendorId === user.id) {
      toast.error("You can't order an item from your own menu.")
      return
    }
    if (item && item.status !== "approved") {
      toast.error("This dish isn't available for ordering right now.")
      return
    }
    setFormOpen(true)
  }

  if (notFound) {
    return (
      <div className="mx-auto max-w-xl px-4 pt-16 text-center">
        <EmptyIcon />
        <h1 className="mt-4 text-2xl font-extrabold text-foreground">
          This dish isn&apos;t on the menu
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The item ID may be invalid, or the dish was removed, rejected or is
          still waiting for admin approval.
        </p>
        <Link
          href="/menu"
          className="mt-6 inline-flex h-10 items-center rounded-full bg-gradient-to-r from-[#f4574a] to-[#ff7d68] px-5 text-sm font-semibold text-white transition hover:brightness-110">
          Back to Browse Menu
        </Link>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 lg:px-8">
        <p className="sr-only" role="status">
          Loading dish details…
        </p>
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

  const images = item.images?.length ? item.images : [primaryImage(item)]
  const orderable = item.status === "approved"

  return (
    <div className="mx-auto max-w-6xl px-4 pt-8 pb-16 sm:px-6 lg:px-8">
      <nav
        aria-label="Breadcrumb"
        className="mb-5 text-[12.5px] font-semibold text-muted-foreground">
        <Link href="/menu" className="transition hover:text-[#f4574a]">
          Browse Menu
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{item.itemName}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border bg-muted shadow-sm">
            <img
              src={images[activeImage] ?? ""}
              alt={item.itemName}
              className="size-full object-cover"
            />
            <span className="absolute top-4 left-4 rounded-full bg-black/55 px-3 py-1 text-[11px] font-extrabold tracking-wider text-white uppercase backdrop-blur">
              {item.category}
            </span>
            {!orderable ? (
              <span className="absolute right-4 bottom-4 rounded-full bg-amber-500 px-3 py-1 text-[11px] font-extrabold tracking-wider text-black uppercase">
                {item.status}
              </span>
            ) : null}
          </div>

          {images.length > 1 ? (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {images.map((src, index) => (
                <button
                  key={`${src}-${index}`}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  aria-label={`View image ${index + 1}`}
                  aria-pressed={index === activeImage}
                  className={`size-16 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                    index === activeImage
                      ? "border-[#f4574a]"
                      : "border-border opacity-70 hover:opacity-100"
                  }`}>
                  <img src={src} alt="" className="size-full object-cover" />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex flex-col">
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
              {item.itemName}
            </h1>
            <span className="shrink-0 rounded-full bg-[#f4574a]/10 px-3.5 py-1.5 text-lg font-extrabold text-[#f4574a]">
              ৳{item.price}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-[13px] text-muted-foreground">
            <span className="rounded-full bg-[#f4574a]/10 px-2.5 py-0.5 text-[11px] font-bold tracking-wide text-[#f4574a] uppercase">
              {item.category}
            </span>
            <FavoriteToggle itemId={item._id} />
          </div>

          <p className="mt-5 text-[14.5px] leading-relaxed whitespace-pre-wrap text-foreground/90">
            {item.description}
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <InfoTile
              icon={<MapPin className="size-4" />}
              label="Location"
              value={item.location || "—"}
            />
            <InfoTile
              icon={<Store className="size-4" />}
              label="Vendor"
              value={item.vendorName || "PizzaHub vendor"}
            />
          </div>

          <div className="mt-7">
            {formOpen && orderable ? (
              <OrderForm
                user={user}
                item={item}
                onDone={() => setFormOpen(false)}
              />
            ) : (
              <Btn
                onClick={startOrdering}
                disabled={!orderable}
                className="h-12 w-full text-[15px] sm:w-auto sm:px-10">
                {!user ? <Lock className="size-5" /> : <Pizza className="size-5" />}
                {!user
                  ? "Sign in to Order"
                  : orderable
                    ? "Order this dish"
                    : "Currently unavailable"}
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

function InfoTile({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="rounded-xl border border-border bg-muted/30 px-3.5 py-2.5">
      <p className="flex items-center gap-1.5 text-[10.5px] font-extrabold tracking-wider text-muted-foreground uppercase">
        <span className="text-[#f4574a]">{icon}</span>
        {label}
      </p>
      <p className="mt-0.5 truncate text-[14px] font-bold text-foreground">
        {value}
      </p>
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

    const { error: err } = await apiSend<{ order: { _id: string } }>(
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
      setError(err)
      toast.error(err)
      return
    }

    setSuccess(
      "Order placed! It's pending — the vendor will accept or reject it shortly."
    )
    toast.success("Order placed successfully.")
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
            className="inline-flex h-10 items-center gap-2 rounded-full bg-gradient-to-r from-[#f4574a] to-[#ff7d68] px-5 text-sm font-semibold text-white transition hover:brightness-110">
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
      className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <p className="text-[15px] font-extrabold text-foreground">
        Place your order
      </p>
      <p className="mt-1 text-[12.5px] text-muted-foreground">
        Customer, vendor and item are detected automatically.
      </p>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <DetectedChip label="Customer" value={user?.email || "Sign in required"} />
        <DetectedChip label="Vendor" value={item.vendorName || "—"} />
        <DetectedChip label="Item" value={item.itemName} />
        <DetectedChip
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
          hint="Optional — allergies, extra toppings, delivery notes…">
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

function DetectedChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/30 px-3 py-2">
      <Calendar className="size-4 shrink-0 text-[#f4574a]" />
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
