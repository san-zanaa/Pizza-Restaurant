"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Check,
  CircleCheckBig,
  Eye,
  LoaderCircle,
  Trash2,
  Upload,
  UtensilsCrossed,
} from "lucide-react"
import { useRef, useState } from "react"
import { toast } from "react-toastify"
import { apiSend } from "@/lib/client-fetch"
import {
  Alert,
  Btn,
  Field,
  inputClass,
  StatusBadge,
} from "@/components/dashboard/ui"
import { MENU_CATEGORIES, primaryImage, type MenuItem } from "@/lib/types"

type FormState = {
  itemName: string
  category: string
  description: string
  price: string
  location: string
}

const EMPTY: FormState = {
  itemName: "",
  category: "",
  description: "",
  price: "",
  location: "",
}

function toState(item: MenuItem): FormState {
  return {
    itemName: item.itemName,
    category: item.category,
    description: item.description,
    price: String(item.price),
    location: item.location ?? "",
  }
}

function validate(state: FormState, imageUrl: string, requireImage: boolean) {
  if (state.itemName.trim().length < 2)
    return "Item name must be at least 2 characters."
  if (!state.category) return "Pick a category."
  if (state.description.trim().length < 10)
    return "Description must be at least 10 characters."
  const price = Number(state.price)
  if (!Number.isFinite(price) || price <= 0)
    return "Price must be greater than 0."
  if (state.location.trim().length < 2)
    return "Location (area / city) is required."
  if (requireImage && !imageUrl) return "An item image link is required."
  if (imageUrl) {
    try {
      const url = new URL(imageUrl)
      if (url.protocol !== "http:" && url.protocol !== "https:")
        return "Enter a valid image link (http/https)."
    } catch {
      return "Enter a valid image link."
    }
  }
  return null
}


function ImageUploader({
  imageUrl,
  setImageUrl,
  error,
}: {
  imageUrl: string
  setImageUrl: (value: string) => void
  error?: string
}) {
  const imgbbKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const uploadWithImgbb = async (file: File) => {
    setUploading(true)
    setUploadError(null)
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () =>
          resolve(String(reader.result ?? "").split(",")[1] ?? "")
        reader.onerror = () =>
          reject(new Error("The image could not be read."))
        reader.readAsDataURL(file)
      })

      const form = new FormData()
      form.append("key", imgbbKey ?? "")
      form.append("image", base64)

      const res = await fetch("https://api.imgbb.com/1/upload", {
        method: "POST",
        body: form,
      })
      const data = (await res.json().catch(() => null)) as {
        success?: boolean
        data?: { url?: string }
      } | null

      if (!res.ok || data?.success !== true || !data?.data?.url) {
        throw new Error(
          "ImgBB upload failed. Please retry, or paste an image link instead."
        )
      }

      setImageUrl(data.data.url)
      toast.success("Image uploaded to ImgBB.")
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : "ImgBB upload failed."
      )
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-3">
      <input
        type="url"
        className={inputClass}
        value={imageUrl}
        onChange={(event) => setImageUrl(event.target.value)}
        placeholder="https://example.com/item-image.jpg"
        aria-label="Item image link"
      />

      {imgbbKey ? (
        <div className="flex items-center justify-center gap-3">
          <Btn
            type="button"
            variant="outline"
            size="sm"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
          >
            {uploading ? (
              <LoaderCircle className="size-3.5 animate-spin motion-reduce:animate-none" />
            ) : (
              <Upload className="size-3.5" />
            )}
            {uploading ? "Uploading…" : "Upload with ImgBB"}
          </Btn>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
            className="hidden"
            aria-label="Upload item image with ImgBB"
            onChange={(event) => {
              const file = event.target.files?.[0]
              if (file) void uploadWithImgbb(file)
              event.target.value = ""
            }}
          />
        </div>
      ) : null}
      {uploadError ? (
        <p className="text-[12.5px] font-medium text-rose-500 dark:text-rose-400">
          {uploadError}
        </p>
      ) : null}

      {imageUrl ? (
        <div className="flex items-center gap-4 rounded-2xl border border-border bg-muted/30 p-3">
          <img
            src={imageUrl}
            alt="Item preview"
            className="size-24 rounded-xl border border-border object-cover"
            onError={(event) => {
              ;(event.currentTarget as HTMLImageElement).style.opacity = "0.4"
            }}
          />
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1.5 text-[13px] font-bold text-emerald-600 dark:text-emerald-400">
              <Check className="size-4" />
              Image link added
            </p>
            <p className="mt-0.5 truncate text-[12px] text-muted-foreground">
              {imageUrl}
            </p>
          </div>
          <Btn
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setImageUrl("")}
          >
            <Trash2 className="size-3.5" />
            Remove
          </Btn>
        </div>
      ) : (
        <p className="text-[12px] text-muted-foreground">
          Paste a direct image link (any format) — required for new items.
        </p>
      )}
      {error ? (
        <p className="text-[12.5px] font-medium text-rose-500 dark:text-rose-400">
          {error}
        </p>
      ) : null}
    </div>
  )
}

export function VendorMenuItemForm({ item }: { item?: MenuItem }) {
  const editing = Boolean(item)
  const [state, setState] = useState<FormState>(item ? toState(item) : EMPTY)
  const [imageUrl, setImageUrl] = useState(() => (item ? primaryImage(item) : ""))
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
      itemName: state.itemName.trim(),
      category: state.category,
      description: state.description.trim(),
      price: Number(state.price),
      location: state.location.trim(),
      images: [imageUrl],
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
      toast.error(result.error)
      return
    }
    const message = editing
      ? "Changes saved."
      : "Submitted! An admin will review it before it goes live."
    setDone(message)
    toast.success(message)
  }

  return (
    <form onSubmit={submit} noValidate className="mx-auto max-w-3xl">
      {editing ? (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <StatusBadge status={item!.status} />
            <span
              className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold tracking-wide uppercase ${
                item!.status === "approved"
                  ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-600 dark:text-emerald-300"
                  : item!.status === "pending"
                    ? "border-amber-400/40 bg-amber-400/10 text-amber-600 dark:text-amber-300"
                    : item!.status === "rejected"
                      ? "border-rose-400/40 bg-rose-400/10 text-rose-600 dark:text-rose-300"
                      : "border-slate-400/40 bg-slate-400/10 text-slate-500 dark:text-slate-300"
              }`}>
              {item!.status === "approved"
                ? "Live"
                : item!.status === "inactive"
                  ? "Hidden"
                  : item!.status}
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
              value={state.itemName}
              onChange={(event) => set("itemName")(event.target.value)}
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
            <Field label="Price (BDT)" required htmlFor="item-price">
              <input
                id="item-price"
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                className={inputClass}
                value={state.price}
                onChange={(event) => set("price")(event.target.value)}
                placeholder="450"
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
            hint="Paste a direct image link — required for new items."
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
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const remove = async () => {
    setBusy(true)
    const { error: err } = await apiSend(`/api/menu/${item._id}`, "DELETE")
    setBusy(false)
    if (err) {
      setError(err)
      toast.error(err)
      setConfirming(false)
      return
    }
    toast.success(`"${item.itemName}" deleted.`)
    router.push("/dashboard/menu")
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
