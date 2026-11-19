"use client"

import { useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  ArrowRight,
  CheckCheck,
  CircleX,
  Eye,
  EyeOff,
  KeyRound,
  LoaderCircle,
  Lock,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { authClient } from "@/lib/auth-client"
import {
  AuthField,
  AuthFrame,
  StrengthMeter,
  messageFrom,
  shake,
} from "@/components/auth-section"

type Status = "idle" | "error" | "submitting" | "success"

export function ResetPasswordSection() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const linkError = searchParams.get("error")

  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [status, setStatus] = useState<Status>("idle")
  const [message, setMessage] = useState("")
  const [capsLock, setCapsLock] = useState(false)
  const [failedField, setFailedField] = useState<"password" | "confirm" | null>(
    null
  )

  const formRef = useRef<HTMLFormElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const confirmRef = useRef<HTMLInputElement>(null)

  const busy = status === "submitting"
  const succeeded = status === "success"
  const linkInvalid = !token || linkError === "INVALID_TOKEN"

  const fail = (field: "password" | "confirm" | null, text: string) => {
    setStatus("error")
    setMessage(text)
    setFailedField(field)
    shake(formRef.current)
    if (field === "password") passwordRef.current?.focus()
    if (field === "confirm") confirmRef.current?.focus()
  }

  const editField =
    (field: "password" | "confirm", apply: (value: string) => void) =>
    (value: string) => {
      apply(value)
      if (
        status === "error" &&
        (failedField === null || failedField === field)
      ) {
        setStatus("idle")
        setMessage("")
        setFailedField(null)
      }
    }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (busy || succeeded || !token) return

    if (password.length < 8) {
      fail("password", "Use at least 8 characters for your new password.")
      return
    }
    if (password !== confirm) {
      fail("confirm", "Those passwords don't match — try again.")
      return
    }

    setStatus("submitting")
    setMessage("")
    setFailedField(null)
    try {
      const res = await authClient.resetPassword({
        token,
        newPassword: password,
      })
      if (res?.error) {
        throw new Error(
          messageFrom(
            res.error,
            "We couldn't update your password. The link may have expired."
          )
        )
      }
      setMessage("Password updated.")
      setStatus("success")
    } catch (error) {
      fail(
        null,
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      )
    }
  }

  const passwordToggle = (
    <button
      type="button"
      onClick={() => setShowPassword((value) => !value)}
      aria-label={showPassword ? "Hide password" : "Show password"}
      className="grid size-8 place-items-center rounded-lg text-white/40 transition hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-[#ff9e2c]/60 focus-visible:outline-none"
    >
      {showPassword ? (
        <EyeOff className="size-4" />
      ) : (
        <Eye className="size-4" />
      )}
    </button>
  )

  if (linkInvalid) {
    return (
      <AuthFrame labelledBy="reset-heading">
        <div className="offer-pop py-2 text-center">
          <span className="mx-auto grid size-12 place-items-center rounded-full bg-rose-500/15 text-rose-300 ring-1 ring-rose-400/30">
            <CircleX aria-hidden="true" className="size-5" />
          </span>
          <h1
            id="reset-heading"
            className="mt-4 text-[22px] leading-tight font-extrabold tracking-tight text-white sm:text-[25px]">
            Link expired or <span className="text-[#ff8a5c]">invalid</span>
          </h1>
          <p className="mx-auto mt-2 max-w-[36ch] text-[13.5px] leading-relaxed text-white/50">
            Password reset links last 60 minutes for your safety. Request a
            fresh one and we&apos;ll get you back to the table.
          </p>
          <button
            type="button"
            onClick={() => router.push("/sign-in")}
            className="offer-btn group/btn relative mt-6 inline-flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-[#f4574a] to-[#ff8a3d] text-sm font-bold text-white shadow-[0_18px_44px_-16px_rgba(244,87,74,0.95)] transition focus-visible:ring-2 focus-visible:ring-[#ffb454] focus-visible:ring-offset-2 focus-visible:ring-offset-[#141312] focus-visible:outline-none active:scale-[0.98]">
            <span
              aria-hidden="true"
              className="offer-shine absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/45 to-transparent"
            />
            <span className="relative z-10 flex items-center gap-2">
              Request a New Link
              <ArrowRight
                aria-hidden="true"
                className="size-4 transition-transform group-hover/btn:translate-x-1 motion-reduce:transition-none"
              />
            </span>
          </button>
        </div>
      </AuthFrame>
    )
  }

  if (succeeded) {
    return (
      <AuthFrame labelledBy="reset-heading">
        <div className="offer-pop py-2 text-center">
          <span className="mx-auto grid size-12 place-items-center rounded-full bg-gradient-to-br from-[#34d399] to-[#10b981] text-emerald-950 shadow-[0_10px_30px_-12px_rgba(16,185,129,0.95)]">
            <CheckCheck
              aria-hidden="true"
              className="size-5"
              strokeWidth={2.6}
            />
          </span>
          <h1
            id="reset-heading"
            className="mt-4 text-[22px] leading-tight font-extrabold tracking-tight text-white sm:text-[25px]">
            Password <span className="text-emerald-300">updated</span>
          </h1>
          <p className="mx-auto mt-2 max-w-[36ch] text-[13.5px] leading-relaxed text-white/50">
            Your new credentials are live. Sign in to pick up where you left
            off.
          </p>
          <button
            type="button"
            onClick={() => router.push("/sign-in")}
            className="offer-btn group/btn relative mt-6 inline-flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-[#f4574a] to-[#ff8a3d] text-sm font-bold text-white shadow-[0_18px_44px_-16px_rgba(244,87,74,0.95)] transition focus-visible:ring-2 focus-visible:ring-[#ffb454] focus-visible:ring-offset-2 focus-visible:ring-offset-[#141312] focus-visible:outline-none active:scale-[0.98]">
            <span
              aria-hidden="true"
              className="offer-shine absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/45 to-transparent"
            />
            <span className="relative z-10 flex items-center gap-2">
              Sign In to PizzaHub
              <ArrowRight
                aria-hidden="true"
                className="size-4 transition-transform group-hover/btn:translate-x-1 motion-reduce:transition-none"
              />
            </span>
          </button>
        </div>
      </AuthFrame>
    )
  }

  return (
    <AuthFrame labelledBy="reset-heading">
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1.5 text-[10px] font-extrabold tracking-[0.14em] text-emerald-300 uppercase">
          <KeyRound aria-hidden="true" className="size-3.5" />
          Secure Reset
        </span>
        <span className="text-[10px] font-extrabold tracking-[0.16em] text-white/35 uppercase">
          Step 2 of 2
        </span>
      </div>

      <div className="mt-6">
        <h1
          id="reset-heading"
          className="text-[22px] leading-tight font-extrabold tracking-tight text-white sm:text-[26px]">
          Set a{" "}
          <span className="bg-gradient-to-r from-[#ff9e2c] via-[#ffc163] to-[#ff7d68] bg-clip-text text-transparent">
            new password
          </span>
        </h1>
        <p className="mt-1.5 text-[13.5px] leading-relaxed text-white/50">
          Choose something strong — we&apos;ll sign you in right after.
        </p>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} noValidate className="mt-6">
        <AuthField
          id="reset-password"
          label="New password"
          icon={Lock}
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={editField("password", setPassword)}
          placeholder="••••••••"
          autoComplete="new-password"
          invalid={failedField === "password"}
          disabled={busy}
          inputRef={passwordRef}
          onKeyUp={(event) => setCapsLock(event.getModifierState("CapsLock"))}
          trailing={passwordToggle}
          hint={
            capsLock ? (
              <p className="mt-1.5 text-[11.5px] font-semibold text-amber-300/90">
                Caps Lock is on
              </p>
            ) : null
          }
        />
        <StrengthMeter value={password} />

        <div className="mt-4">
          <AuthField
            id="reset-confirm"
            label="Confirm new password"
            icon={Lock}
            type={showPassword ? "text" : "password"}
            value={confirm}
            onChange={editField("confirm", setConfirm)}
            placeholder="••••••••"
            autoComplete="new-password"
            invalid={failedField === "confirm"}
            disabled={busy}
            inputRef={confirmRef}
          />
        </div>

        <button
          type="submit"
          disabled={busy || succeeded}
          className="offer-btn group/btn relative mt-5 h-12 w-full overflow-hidden rounded-full bg-gradient-to-r from-[#f4574a] to-[#ff8a3d] text-sm font-bold text-white shadow-[0_18px_44px_-16px_rgba(244,87,74,0.95)] transition focus-visible:ring-2 focus-visible:ring-[#ffb454] focus-visible:ring-offset-2 focus-visible:ring-offset-[#141312] focus-visible:outline-none active:scale-[0.98] disabled:cursor-wait disabled:opacity-70">
          <span
            aria-hidden="true"
            className="offer-shine absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/45 to-transparent"
          />
          <span className="relative z-10 flex items-center justify-center gap-2">
            {busy ? (
              <LoaderCircle
                aria-hidden="true"
                className="size-4 animate-spin motion-reduce:animate-none"
              />
            ) : null}
            {busy ? "Updating password…" : "Update Password"}
            {!busy ? (
              <ArrowRight
                aria-hidden="true"
                className="size-4 transition-transform group-hover/btn:translate-x-1 motion-reduce:transition-none"
              />
            ) : null}
          </span>
        </button>

        <p
          role="status"
          aria-live="polite"
          className={cn(
            "mt-3 flex min-h-[1.3rem] items-start justify-center gap-1.5 text-center text-[12.5px] leading-snug",
            status === "error" ? "text-[#fb7185]" : "text-white/35"
          )}>
          {status === "error" ? (
            <>
              <CircleX
                aria-hidden="true"
                className="mt-0.5 size-3.5 shrink-0"
              />
              {message}
            </>
          ) : (
            "Encrypted end-to-end · never stored in plain text."
          )}
        </p>
      </form>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 border-t border-white/10 pt-5 text-center text-[11px] text-white/40">
        <span className="inline-flex items-center gap-1.5">
          <KeyRound aria-hidden="true" className="size-3.5 text-[#ff9e2c]" />
          Single-use token
        </span>
        <span
          aria-hidden="true"
          className="hidden size-1 rounded-full bg-white/20 sm:block"
        />
        <span className="inline-flex items-center gap-1.5">
          <Lock aria-hidden="true" className="size-3.5 text-white/50" />
          Haute Privacy Guaranteed
        </span>
      </div>
    </AuthFrame>
  )
}
