"use client"

import { useRouter } from "next/navigation"
import { Crown, LoaderCircle, Mail, ShieldCheck, UserRound } from "lucide-react"
import { useState } from "react"
import { toast } from "react-toastify"
import { apiSend } from "@/lib/client-fetch"
import {
  Alert,
  Btn,
  Field,
  PageHeader,
  StatusBadge,
  inputClass,
} from "@/components/dashboard/ui"
import { authClient } from "@/lib/auth-client"
import { clearAuthToken } from "@/lib/client-fetch"
import type { AppUser } from "@/lib/types"


export function SettingsForm({ user }: { user: AppUser }) {
  const router = useRouter()
  return (
    <>
      <PageHeader title="Profile Settings" subtitle="Your PizzaHub account details." />
      <div className="max-w-xl rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <span className="grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-[#f4574a] to-[#ff7d68] text-lg font-extrabold text-white">
            {(user.name || user.email).slice(0, 2).toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="truncate text-lg font-extrabold text-foreground">
              {user.name || "Signed in"}
            </p>
            <p className="flex items-center gap-1.5 truncate text-[13px] text-muted-foreground">
              <Mail className="size-3.5" />
              {user.email}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-muted/30 p-3.5">
            <p className="flex items-center gap-1.5 text-[11px] font-extrabold tracking-wider text-muted-foreground uppercase">
              <UserRound className="size-3.5" /> Role
            </p>
            <p className="mt-1.5 text-sm font-bold text-foreground capitalize">
              {user.role}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-muted/30 p-3.5">
            <p className="flex items-center gap-1.5 text-[11px] font-extrabold tracking-wider text-muted-foreground uppercase">
              <Crown className="size-3.5" /> Plan
            </p>
            <p className="mt-1.5 text-sm font-bold text-foreground capitalize">
              {user.role === "vendor" ? user.plan : "—"}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-muted/30 p-3.5">
            <p className="flex items-center gap-1.5 text-[11px] font-extrabold tracking-wider text-muted-foreground uppercase">
              <ShieldCheck className="size-3.5" /> Status
            </p>
            <div className="mt-1.5">
              {user.blocked ? (
                <StatusBadge status="Blocked" />
              ) : (
                <StatusBadge status="Active" />
              )}
            </div>
          </div>
        </div>

        <ProfileEditor user={user} />

        <p className="mt-5 text-[12.5px] leading-snug text-muted-foreground">
          Credentials live with PizzaHub&apos;s secure auth flow — if you need to
          change your email or password, use the sign-in page&apos;s recovery
          options.
        </p>

        <div className="mt-6">
          <button
            type="button"
            onClick={async () => {
              clearAuthToken()
              await authClient.signOut()
              router.push("/sign-in")
              router.refresh()
            }}
            className="inline-flex h-9 items-center justify-center rounded-full border border-rose-500/40 bg-rose-500/10 px-4 text-sm font-semibold text-rose-600 transition hover:bg-rose-500/20 focus-visible:ring-2 focus-visible:ring-rose-500/40 focus-visible:outline-none">
            Sign out
          </button>
        </div>
      </div>
    </>
  )
}

function ProfileEditor({ user }: { user: AppUser }) {
  const [name, setName] = useState(user.name)
  const [image, setImage] = useState(user.image ?? "")
  const [businessName, setBusinessName] = useState(
    user.role === "vendor" ? ((user as { businessName?: string }).businessName ?? "") : ""
  )
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (busy) return
    setBusy(true)
    setError(null)
    setSuccess(null)

    const payload: Record<string, unknown> = { name: name.trim() }
    if (image.trim()) payload.image = image.trim()
    if (user.role === "vendor" && businessName.trim()) {
      payload.businessName = businessName.trim()
    }

    const { error: err } = await apiSend<{ user: AppUser }>(
      "/api/profile",
      "PATCH",
      payload
    )
    setBusy(false)
    if (err) {
      setError(err)
      toast.error(err)
      return
    }
    setSuccess("Profile updated.")
    toast.success("Profile updated.")
    router.refresh()
  }

  return (
    <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
      <Field label="Name" htmlFor="profile-name" hint="Shown on orders and cards.">
        <input
          id="profile-name"
          className={inputClass}
          value={name}
          onChange={(event) => setName(event.target.value)}
          maxLength={80}
        />
      </Field>

      <Field
        label="Profile Image"
        htmlFor="profile-image"
        hint="Direct https/http image link. Optional."
      >
        <input
          id="profile-image"
          type="url"
          className={inputClass}
          value={image}
          placeholder="https://example.com/your-avatar.png"
          onChange={(event) => setImage(event.target.value)}
        />
      </Field>

      {user.role === "vendor" ? (
        <Field
          label="Business Name"
          htmlFor="profile-business"
          hint="Displayed next to your items on the menu and in orders."
        >
          <input
            id="profile-business"
            className={inputClass}
            value={businessName}
            onChange={(event) => setBusinessName(event.target.value)}
            placeholder="Your pizzeria name"
            maxLength={80}
          />
        </Field>
      ) : null}

      {error ? <Alert kind="error">{error}</Alert> : null}
      {success ? <Alert kind="success">{success}</Alert> : null}

      <div>
        <Btn type="submit" disabled={busy}>
          {busy ? <LoaderCircle className="size-4 animate-spin" /> : null}
          {busy ? "Saving…" : "Save Profile"}
        </Btn>
      </div>
    </form>
  )
}
