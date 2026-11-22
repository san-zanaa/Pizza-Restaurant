"use client"

import Image from "next/image"
import Link from "next/link"
import {
  Check,
  CircleCheckBig,
  Eye,
  LoaderCircle,
  MapPin,
  Pencil,
  Plus,
  Trash2,
  UtensilsCrossed,
} from "lucide-react"
import { useRef, useState } from "react"
import { apiSend } from "@/lib/client-fetch"
import {
  Alert,
  Btn,
  Field,
  inputClass,
  StatusBadge,
} from "@/components/dashboard/ui"
import { MENU_CATEGORIES, type MenuItem } from "@/lib/types"

type FormState = {
  name: string
  category: string
  description: string
  price: string
  location: string
}

const EMPTY: FormState = {
  name: "",
  category: "",
  description: "",
  price: "",
  location: "",
}

function toState(item: MenuItem): FormState {
  return {
    name: item.name,
    category: item.category,
    description: item.description,
    price: String(item.price),
    location: "",
  }
}

function validate(state: FormState, imageUrl: string, requireImage: boolean) {
  if (state.name.trim().length < 2)
    return "Item name must be at least 2 characters."
  if (!state.category) return "Pick a category."
  if (state.description.trim().length < 10)
    return "Description must be at least 10 characters."
  const price = Number(state.price)
  if (!Number.isFinite(price) || price <= 0)
    return "Price must be greater than 0."
  if (state.location.trim().length < 2)
    return "Location (area / city) is required."
  if (requireImage && !imageUrl) return "Upload an item image (required)."
  return null
}

/* ------------------------------------------------------------------ */
/* ImgBB file uploader                                                 */
/* ------------------------------------------------------------------ */

function ImageUploader({
  imageUrl,
  setImageUrl,
  error,
}: {
  imageUrl: string
  setImageUrl: (value: string) => void
  error?: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const pick = async (file: File) => {
    setUploading(true)
    setUploadError(null)
    try {
      const form = new FormData()
      form.append("file", file)
      const res = await fetch("/api/upload", { method: "POST", body: form })
      const body = (await res.json().catch(() => ({}))) as {
        url?: string
        error?: string
      }
      if (!res.ok || !body.url) {
        setUploadError(body.error ?? "Upload failed — try a different image.")
        return
      }
      setImageUrl(body.url)
    } catch {
      setUploadError("Network error — the image couldn't be uploaded.")
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        aria-label="Upload item image"
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file) void pick(file)
        }}
      />
      {imageUrl ? (
        <div className="flex items-center gap-4 rounded-2xl border border-border bg-muted/30 p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt="Item preview"
            className="size-24 rounded-xl border border-border object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1.5 text-[13px] font-bold text-emerald-600 dark:text-emerald-400">
              <Check className="size-4" />
              Image uploaded via ImgBB
            </p>
            <p className="mt-0.5 truncate text-[12px] text-muted-foreground">
              {imageUrl}
            </p>
          </div>
          <Btn
            type="button"
            variant="outline"
            size="sm"
            onClick={() => inputRef.current?.click()}
          >
            {uploading ? (
              <LoaderCircle className="size-3.5 animate-spin" />
            ) : (
              <Pencil className="size-3.5" />
            )}
            Replace
          </Btn>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex h-36 w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border bg-muted/20 text-center transition hover:border-[#f4574a]/50 hover:bg-[#f4574a]/5 focus-visible:ring-2 focus-visible:ring-[#f4574a]/50 focus-visible:outline-none"
        >
          {uploading ? (
            <LoaderCircle className="size-6 animate-spin text-[#f4574a]" />
          ) : (
            <span className="grid size-10 place-items-center rounded-full bg-[#f4574a]/10 text-[#f4574a]">
              <Plus className="size-5" />
            </span>
          )}
          <span className="text-[13px] font-bold text-foreground">
            {uploading
              ? "Uploading to ImgBB…"
              : "Click to upload the item image"}
          </span>
          <span className="text-[12px] text-muted-foreground">
            PNG, JPG or WebP · max 5 MB · required
          </span>
        </button>
      )}
      {uploadError ? (
        <p className="mt-1.5 text-[12.5px] font-medium text-rose-500 dark:text-rose-400">
          {uploadError}
        </p>
      ) : null}
      {error ? (
        <p className="mt-1.5 text-[12.5px] font-medium text-rose-500 dark:text-rose-400">
          {error}
        </p>
      ) : null}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Create / edit form                                                  */
/* ------------------------------------------------------------------ */

export function VendorMenuItemForm({ item }: { item?: MenuItem }) {
  const editing = Boolean(item)
  const [state, setState] = useState<FormState>(item ? toState(item) : EMPTY)
  const [imageUrl, setImageUrl] = useState(item?.image ?? "")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imageError, setImageError] = useState<string | null>(null)
  const [done, setDone] = useState<string | null>(null)

  const set = (key: keyof FormState) => (value: string) =>
    setState((prev) => ({ ...prev, [key]: value }))

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (submitting) return

    const validationError = validate(state, imageUrl, !editing)
    if (validationError) {
      setError(validationError)
      if (validationError.includes("image")) setImageError(validationError)
      return
    }

    setSubmitting(true)
    setError(null)
    setImageError(null)

    const payload = {
      name: state.name.trim(),
      category: state.category,
      description: state.description.trim(),
      price: Number(state.price),
      location: state.location.trim(),
      imageUrl,
    }

    const result = editing
      ? await apiSend<{ item: MenuItem }>(
          `/api/menu/${item!._id}`,
          "PATCH",
          payload
        )
      : await apiSend<{ item: MenuItem }>("/api/menu", "POST", payload)

    setSubmitting(false)
    if (result.error) {
      setError(result.error)
      return
    }
    setDone(
      editing
        ? "Changes saved."
        : "Submitted! An admin will review it before it goes live."
    )
  }

  return (
    <form onSubmit={submit} noValidate className="mx-auto max-w-3xl">
      {editing ? (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <StatusBadge status={item!.isAvailable ? "Active" : "Inactive"} />
            <span
              className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold tracking-wide uppercase ${
                item!.isAvailable
                  ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-600 dark:text-emerald-300"
                  : "border-slate-400/40 bg-slate-400/10 text-slate-500 dark:text-slate-300"
              }`}
            >
              {item!.isAvailable ? "Active" : "Inactive"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/menu/${item!._id}`}
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border bg-background px-4 text-[12.5px] font-semibold text-foreground transition hover:border-[#f4574a]/50 hover:text-[#f4574a] focus-visible:ring-2 focus-visible:ring-[#f4574a]/50 focus-visible:outline-none"
            >
              <Eye className="size-3.5" />
              Public page
            </Link>
          </div>
        </div>
      ) : null}

      {done ? (
        <div className="mb-5">
          <Alert kind="success">
            <span className="flex items-center gap-2">
              <CircleCheckBig className="size-4" />
              {done}
            </span>
          </Alert>
        </div>
      ) : null}
      {error ? (
        <div className="mb-5">
          <Alert kind="error">{error}</Alert>
        </div>
      ) : null}

      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="grid gap-5">
          <Field label="Item Name" required htmlFor="item-name">
            <input
              id="item-name"
              className={inputClass}
              value={state.name}
              onChange={(event) => set("name")(event.target.value)}
              placeholder="Margherita Classica"
              maxLength={80}
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Category" required htmlFor="item-category">
              <select
                id="item-category"
                className={inputClass}
                value={state.category}
                onChange={(event) => set("category")(event.target.value)}
              >
                <option value="" disabled>
                  Pick a category
                </option>
                {MENU_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Price (USD)" required htmlFor="item-price">
              <input
                id="item-price"
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                className={inputClass}
                value={state.price}
                onChange={(event) => set("price")(event.target.value)}
                placeholder="12.50"
              />
            </Field>
          </div>

          <Field
            label="Location (area / city)"
            required
            htmlFor="item-location"
          >
            <input
              id="item-location"
              className={inputClass}
              value={state.location}
              onChange={(event) => set("location")(event.target.value)}
              placeholder="Dhanmondi, Dhaka"
              maxLength={120}
            />
          </Field>

          <Field
            label="Description"
            required
            htmlFor="item-description"
            hint="At least 10 characters — sell the flavour."
          >
            <textarea
              id="item-description"
              rows={4}
              className={`${inputClass} h-auto resize-none py-3`}
              value={state.description}
              onChange={(event) => set("description")(event.target.value)}
              placeholder="Wood-fired sourdough, San Marzano tomatoes, fior di latte…"
              maxLength={1000}
            />
          </Field>

          <Field
            label="Item Image"
            required={!editing}
            htmlFor="item-image"
            hint="Uploaded as a file through ImgBB — required for new items."
          >
            <ImageUploader
              imageUrl={imageUrl}
              setImageUrl={(value) => {
                setImageUrl(value)
                setImageError(null)
              }}
              error={imageError ?? undefined}
            />
          </Field>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/dashboard/menu"
          className="text-[13px] font-semibold text-muted-foreground transition hover:text-foreground"
        >
          ← Back to my items
        </Link>
        <div className="flex items-center gap-2">
          {editing ? <ItemDeleter item={item!} /> : null}
          <Btn type="submit" disabled={submitting}>
            {submitting ? (
              <LoaderCircle className="size-4 animate-spin motion-reduce:animate-none" />
            ) : null}
            {submitting
              ? editing
                ? "Saving…"
                : "Submitting…"
              : editing
                ? "Save Changes"
                : "Submit for Review"}
          </Btn>
        </div>
      </div>

      <p className="mt-3 flex items-center gap-2 text-[12.5px] text-muted-foreground">
        <UtensilsCrossed className="size-4" />
        New items are saved as <strong>Pending</strong> and only appear on the
        public Browse Menu after an admin approves them.
      </p>
    </form>
  )
}

function ItemDeleter({ item }: { item: MenuItem }) {
  const [confirming, setConfirming] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const remove = async () => {
    setBusy(true)
    const { error: err } = await apiSend(`/api/menu/${item._id}`, "DELETE")
    setBusy(false)
    if (err) {
      setError(err)
      setConfirming(false)
      return
    }
    window.location.href = "/dashboard/menu"
  }

  if (error) {
    return <Alert kind="error">{error}</Alert>
  }
  if (!confirming) {
    return (
      <Btn type="button" variant="danger" onClick={() => setConfirming(true)}>
        <Trash2 className="size-4" />
        Delete
      </Btn>
    )
  }
  return (
    <>
      <Btn type="button" variant="danger" disabled={busy} onClick={remove}>
        {busy ? (
          <LoaderCircle className="size-4 animate-spin" />
        ) : (
          <Trash2 className="size-4" />
        )}
        {busy ? "Deleting…" : "Confirm delete"}
      </Btn>
      <Btn type="button" variant="ghost" onClick={() => setConfirming(false)}>
        Cancel
      </Btn>
    </>
  )
}
