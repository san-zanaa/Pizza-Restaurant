"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import type { LucideIcon } from "lucide-react"
import {
  ArrowRight,
  Check,
  CheckCheck,
  ChefHat,
  CircleX,
  CreditCard,
  Eye,
  EyeOff,
  Lock,
  LoaderCircle,
  Mail,
  Pizza,
  Send,
  Shield,
  ShieldCheck,
  Sparkles,
  Ticket,
  UserRound,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useInView } from "@/hooks/use-in-view"
import { authClient } from "@/lib/auth-client"

type Mode = "signin" | "signup" | "forgot"
type RoleId = "customer" | "vendor" | "admin"
type Status = "idle" | "error" | "submitting" | "success"
type FieldName = "name" | "email" | "password"

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/


export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
}

export function passwordStrength(value: string) {
  if (!value) return 0
  let score = 0
  if (value.length >= 8) score++
  if (value.length >= 12) score++
  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score++
  if (/\d/.test(value)) score++
  if (/[^\w\s]/.test(value)) score++
  return Math.min(score, 4)
}

const STRENGTH = [
  { label: "Too weak", bar: "bg-rose-400/70", text: "text-rose-300" },
  { label: "Weak", bar: "bg-rose-400", text: "text-rose-300" },
  { label: "Fair", bar: "bg-amber-400", text: "text-amber-300" },
  { label: "Strong", bar: "bg-emerald-400/80", text: "text-emerald-300" },
  { label: "Excellent", bar: "bg-emerald-400", text: "text-emerald-300" },
] as const

export function messageFrom(error: unknown, fallback: string) {
  if (error && typeof error === "object" && "message" in error) {
    const value = (error as { message?: unknown }).message
    if (typeof value === "string" && value.trim()) return value
  }
  return fallback
}

export function shake(node: HTMLElement | null) {
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

export function StrengthMeter({ value }: { value: string }) {
  if (!value) return null
  const score = passwordStrength(value)
  const meta = STRENGTH[score]
  return (
    <div className="mt-2.5">
      <div className="flex gap-1.5">
        {[0, 1, 2, 3].map((index) => (
          <span
            key={index}
            aria-hidden="true"
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors duration-300",
              index < score ? meta.bar : "bg-white/10"
            )}
          />
        ))}
      </div>
      <p className="mt-1.5 text-[11.5px] text-white/40">
        Password strength:{" "}
        <span className={cn("font-bold", meta.text)}>{meta.label}</span>
        {score < 3 ? " — mix letters, numbers & symbols" : " — you're all set"}
      </p>
    </div>
  )
}

function GoogleGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.3h6.44c-.28 1.5-1.12 2.77-2.39 3.62v3h3.86c2.26-2.08 3.58-5.15 3.58-8.65z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29A11.86 11.86 0 0 0 0 12c0 1.94.46 3.77 1.29 5.38l3.98-3.09z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z"
      />
    </svg>
  )
}

function AppleGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
    </svg>
  )
}


const GRID_TEXTURE = {
  backgroundImage:
    "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
  backgroundSize: "48px 48px",
}

export function AuthFrame({
  labelledBy,
  children,
}: {
  labelledBy: string
  children: React.ReactNode
}) {
  const [ringRef, visible] = useInView<HTMLDivElement>(0.12)

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

  return (
    <section
      aria-labelledby={labelledBy}
      className="relative isolate flex min-h-[calc(100svh-4rem)] items-center justify-center overflow-hidden px-4 py-10 sm:px-6 sm:py-14">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -left-24 -z-10 size-96 rounded-full bg-[#f4574a]/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -bottom-24 -z-10 size-96 rounded-full bg-[#ff9e2c]/12 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(75%_65%_at_50%_45%,black,transparent)] opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(127,127,127,0.09) 1px, transparent 1px), linear-gradient(to bottom, rgba(127,127,127,0.09) 1px, transparent 1px)",
          backgroundSize: "54px 54px",
        }}
      />
      <Ticket
        aria-hidden="true"
        className="absolute top-10 left-5 hidden size-6 text-white/10 motion-reduce:animate-none lg:block"
        style={{ animation: "banner-float 8s ease-in-out infinite" }}
      />
      <Sparkles
        aria-hidden="true"
        className="absolute right-7 bottom-14 hidden size-5 text-[#ff9e2c]/25 motion-reduce:animate-none lg:block"
        style={{ animation: "banner-float 10s ease-in-out 1.6s infinite" }}
      />

      <div
        ref={ringRef}
        className="offer-ring relative w-full max-w-[540px] rounded-[30px] p-px [--offer-angle:0deg]">
        <div
          onPointerMove={handlePointerMove}
          style={{ animationDelay: "60ms" }}
          className={cn(
            "standard-reveal group relative overflow-hidden rounded-[29px] bg-[#141312] shadow-[0_50px_110px_-60px_rgba(0,0,0,0.9)]",
            visible && "is-in"
          )}>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -left-20 size-64 rounded-full bg-[#f4574a]/25 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -bottom-28 size-72 rounded-full bg-[#ff9e2c]/15 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(85%_70%_at_30%_10%,black,transparent)] opacity-40"
            style={GRID_TEXTURE}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(380px circle at var(--mx, 50%) var(--my, 0%), rgba(255,255,255,0.07), transparent 60%)",
            }}
          />

          <div className="relative p-5 sm:p-7">{children}</div>
        </div>
      </div>
    </section>
  )
}

type AuthFieldProps = {
  id: string
  label: string
  icon: LucideIcon
  value: string
  onChange: (value: string) => void
  type?: "text" | "email" | "password"
  placeholder?: string
  autoComplete?: string
  invalid?: boolean
  disabled?: boolean
  inputRef?: React.Ref<HTMLInputElement>
  onKeyUp?: React.KeyboardEventHandler<HTMLInputElement>
  action?: React.ReactNode
  trailing?: React.ReactNode
  hint?: React.ReactNode
}

export function AuthField({
  id,
  label,
  icon: Icon,
  value,
  onChange,
  type = "text",
  placeholder,
  autoComplete,
  invalid = false,
  disabled = false,
  inputRef,
  onKeyUp,
  action,
  trailing,
  hint,
}: AuthFieldProps) {
  return (
    <div className="mt-4 first:mt-0">
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={id} className="text-[13px] font-semibold text-white/70">
          {label}
        </label>
        {action}
      </div>
      <div className="relative mt-1.5">
        <Icon
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-white/30"
        />
        <input
          id={id}
          ref={inputRef}
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyUp={onKeyUp}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          aria-invalid={invalid || undefined}
          className={cn(
            "h-12 w-full rounded-xl border bg-white/[0.04] pr-4 pl-10 text-sm text-white transition outline-none placeholder:text-white/30 focus:border-[#ff9e2c]/60 focus:bg-white/[0.07] focus:ring-4 focus:ring-[#ff9e2c]/12 disabled:cursor-not-allowed disabled:opacity-60",
            invalid
              ? "border-[#f43f5e]/70 ring-4 ring-[#f43f5e]/12"
              : "border-white/10",
            trailing && "pr-12"
          )}
        />
        {trailing ? (
          <div className="absolute top-1/2 right-2 -translate-y-1/2">
            {trailing}
          </div>
        ) : null}
      </div>
      {hint}
    </div>
  )
}

const ROLES: {
  id: RoleId
  label: string
  icon: LucideIcon
  accent: string
  helper: string
}[] = [
  {
    id: "customer",
    label: "Customer",
    icon: Pizza,
    accent: "#ff9e2c",
    helper:
      "Access your saved epicurean orders, reservations & tasting points.",
  },
  {
    id: "vendor",
    label: "Vendor",
    icon: ChefHat,
    accent: "#4ade80",
    helper: "Run your pizzeria storefront, payouts and kitchen analytics.",
  },
  {
    id: "admin",
    label: "Admin",
    icon: Shield,
    accent: "#60a5fa",
    helper: "Moderate partners, disputes and platform-wide health.",
  },
]

const COPY: Record<
  Mode,
  {
    pre: string
    hot: string
    post: string
    sub: string
    cta: string
    busy: string
    idle: string
  }
> = {
  signin: {
    pre: "Welcome ",
    hot: "back",
    post: ".",
    sub: "Sign in to continue your epicurean journey.",
    cta: "Sign In to PizzaHub",
    busy: "Signing you in…",
    idle: "Protected by 256-bit TLS encryption.",
  },
  signup: {
    pre: "Join the ",
    hot: "table",
    post: ".",
    sub: "Create your account and unlock your $10 welcome coupon.",
    cta: "Create My Account",
    busy: "Preparing your table…",
    idle: "No spam — unsubscribe from anything, anytime.",
  },
  forgot: {
    pre: "Recover your ",
    hot: "access",
    post: ".",
    sub: "We'll email a secure, single-use reset link.",
    cta: "Email Me a Reset Link",
    busy: "Sending secure link…",
    idle: "Links expire after 60 minutes for your safety.",
  },
}

type SocialId = "google" | "apple"

const SOCIALS: {
  id: SocialId
  label: string
  glyph: (p: { className?: string }) => React.JSX.Element
}[] = [
  { id: "google", label: "Google", glyph: GoogleGlyph },
  { id: "apple", label: "Apple ID", glyph: AppleGlyph },
]

export function AuthSection() {
  const router = useRouter()

  const [mode, setMode] = useState<Mode>("signin")
  const [role, setRole] = useState<RoleId>("customer")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(true)
  const [status, setStatus] = useState<Status>("idle")
  const [message, setMessage] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [capsLock, setCapsLock] = useState(false)
  const [socialBusy, setSocialBusy] = useState<SocialId | null>(null)
  const [failedField, setFailedField] = useState<FieldName | null>(null)

  const formRef = useRef<HTMLFormElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const redirectTimer = useRef<number | null>(null)

  useEffect(
    () => () => {
      if (redirectTimer.current) window.clearTimeout(redirectTimer.current)
    },
    []
  )

  const copy = COPY[mode]
  const activeRole = ROLES.find((item) => item.id === role) ?? ROLES[0]
  const busy = status === "submitting"
  const succeeded = status === "success"

  const switchMode = (next: Mode) => {
    if (next === mode) return
    setMode(next)
    setStatus("idle")
    setMessage("")
    setFailedField(null)
    setShowPassword(false)
    setCapsLock(false)
    setPassword("")
  }

  const editField =
    (field: FieldName, apply: (value: string) => void) => (value: string) => {
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

  const fail = (field: FieldName | null, text: string) => {
    setStatus("error")
    setMessage(text)
    setFailedField(field)
    shake(formRef.current)
    if (field === "name") nameRef.current?.focus()
    if (field === "email") emailRef.current?.focus()
    if (field === "password") passwordRef.current?.focus()
  }

  const validate = (): { field: FieldName; text: string } | null => {
    if (mode === "signup" && name.trim().length < 2) {
      return { field: "name", text: "Please tell us your full name." }
    }
    if (!EMAIL_PATTERN.test(email.trim())) {
      return {
        field: "email",
        text: "Hmm, that email doesn't look right — try again.",
      }
    }
    if (mode !== "forgot") {
      if (!password)
        return { field: "password", text: "Enter your password to continue." }
      if (mode === "signup" && password.length < 8) {
        return {
          field: "password",
          text: "Use at least 8 characters for your password.",
        }
      }
    }
    return null
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (busy || succeeded) return

    const invalid = validate()
    if (invalid) {
      fail(invalid.field, invalid.text)
      return
    }

    setStatus("submitting")
    setMessage("")
    setFailedField(null)

    try {
      if (mode === "signin") {
        const res = await authClient.signIn.email({
          email: email.trim(),
          password,
          rememberMe,
        })
        if (res?.error) {
          throw new Error(
            messageFrom(
              res.error,
              "We couldn't sign you in. Check your details and try again."
            )
          )
        }
        setMessage("Welcome back — taking you to the kitchen…")
        setStatus("success")
        redirectTimer.current = window.setTimeout(() => router.push("/"), 900)
      } else if (mode === "signup") {
        const res = await authClient.signUp.email({
          name: name.trim(),
          email: email.trim(),
          password,
          // "Designate access role" — customer, vendor or admin.
          role,
        })
        if (res?.error) {
          throw new Error(
            messageFrom(
              res.error,
              "We couldn't create your account. Try again."
            )
          )
        }
        try {
          const signInRes = await authClient.signIn.email({
            email: email.trim(),
            password,
            rememberMe: false,
          })
          if (signInRes?.error) {
            
            setMessage("Account created — please sign in to continue.")
          } else {
            setMessage("Account created — welcome aboard!")
          }
        } catch {
          setMessage("Account created — please sign in to continue.")
        }
        setStatus("success")
        redirectTimer.current = window.setTimeout(() => router.push("/"), 1000)
      } else {
        const res = await authClient.requestPasswordReset({
          email: email.trim(),
          redirectTo: `${window.location.origin}/reset-password`,
        })
        if (res?.error) {
          throw new Error(
            messageFrom(
              res.error,
              "We couldn't send the reset link. Try again."
            )
          )
        }
        setMessage("Reset link sent.")
        setStatus("success")
      }
    } catch (error) {
      fail(
        null,
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      )
    }
  }

  const handleSocial = async (provider: SocialId) => {
    if (busy || socialBusy) return
    const meta = SOCIALS.find((item) => item.id === provider)
    const label = meta?.label ?? "social"
    setSocialBusy(provider)
    setStatus("idle")
    setMessage("")
    try {
      const res = await authClient.signIn.social({ provider, callbackURL: "/" })
      if (res?.error) {
        const code = (res.error as { code?: string }).code
        throw new Error(
          code === "PROVIDER_NOT_FOUND"
            ? `${label} sign-in isn't enabled on this deployment yet — continue with email instead.`
            : messageFrom(
                res.error,
                `We couldn't start ${label} sign-in. Try again.`
              )
        )
      }
      const url = (res.data as { url?: string } | null | undefined)?.url
      if (url) {
        window.location.assign(url)
        return
      }
      throw new Error(`The ${label} sign-in didn't redirect. Please try again.`)
    } catch (error) {
      setStatus("error")
      setMessage(
        error instanceof Error
          ? error.message
          : "Social sign-in failed. Please try again."
      )
    } finally {
      setSocialBusy(null)
    }
  }

  const trackCapsLock = (event: React.KeyboardEvent<HTMLInputElement>) => {
    setCapsLock(event.getModifierState("CapsLock"))
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

  const forgotAction =
    mode === "signin" ? (
      <button
        type="button"
        onClick={() => switchMode("forgot")}
        className="text-[12.5px] font-bold text-[#ffb454] underline-offset-4 transition hover:text-[#ffd9a0] hover:underline focus-visible:ring-2 focus-visible:ring-[#ff9e2c]/60 focus-visible:outline-none"
      >
        Forgot password?
      </button>
    ) : undefined

  const statusLine = (
    <p
      role="status"
      aria-live="polite"
      className={cn(
        "mt-3 flex min-h-[1.3rem] items-start justify-center gap-1.5 text-center text-[12.5px] leading-snug",
        status === "error"
          ? "text-[#fb7185]"
          : status === "success"
            ? "text-emerald-300"
            : "text-white/35"
      )}>
      {status === "error" ? (
        <>
          <CircleX aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
          {message}
        </>
      ) : status === "success" && mode !== "forgot" ? (
        <>
          <CheckCheck aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
          {message}
        </>
      ) : (
        copy.idle
      )}
    </p>
  )

  const ctaLabel = busy
    ? copy.busy
    : succeeded && mode !== "forgot"
      ? "Success — redirecting…"
      : copy.cta

  return (
    <AuthFrame labelledBy="auth-heading">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative grid grid-cols-2 gap-1 rounded-full border border-white/10 bg-black/40 p-1">
          <span
            aria-hidden="true"
            className={cn(
              "absolute inset-y-1 left-1 w-[calc(50%_-_6px)] rounded-full bg-gradient-to-r from-[#f4574a] to-[#ff7d68] shadow-[0_8px_20px_-10px_rgba(244,87,74,0.95)] transition-transform duration-500 ease-out motion-reduce:transition-none",
              mode === "signup" && "translate-x-[calc(100%_+_4px)]"
            )}
          />
          <button
            type="button"
            aria-current={mode !== "signup"}
            onClick={() => switchMode("signin")}
            className={cn(
              "relative z-10 rounded-full px-3 py-2 text-[13px] font-bold transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-[#ff9e2c]/60 focus-visible:outline-none sm:px-4",
              mode !== "signup"
                ? "text-white"
                : "text-white/45 hover:text-white/75"
            )}>
            Sign In
          </button>
          <button
            type="button"
            aria-current={mode === "signup"}
            onClick={() => switchMode("signup")}
            className={cn(
              "relative z-10 rounded-full px-3 py-2 text-[13px] font-bold transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-[#ff9e2c]/60 focus-visible:outline-none sm:px-4",
              mode === "signup"
                ? "text-white"
                : "text-white/45 hover:text-white/75"
            )}>
            Create Account
          </button>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1.5 text-[10px] font-extrabold tracking-[0.14em] text-emerald-300 uppercase">
          <ShieldCheck aria-hidden="true" className="size-3.5" />
          Encrypted Session
        </span>
      </div>

      <div className="mt-6">
        <h1
          id="auth-heading"
          className="text-[22px] leading-tight font-extrabold tracking-tight text-white sm:text-[26px]">
          {copy.pre}
          <span className="bg-gradient-to-r from-[#ff9e2c] via-[#ffc163] to-[#ff7d68] bg-clip-text text-transparent">
            {copy.hot}
          </span>
          {copy.post}
        </h1>
        <p className="mt-1.5 text-[13.5px] leading-relaxed text-white/50">
          {copy.sub}
        </p>
      </div>

      {mode === "forgot" ? (
        succeeded ? (
          <div className="offer-pop mt-6">
            <div className="flex items-start gap-3.5">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#34d399] to-[#10b981] text-emerald-950 shadow-[0_8px_24px_-10px_rgba(16,185,129,0.9)]">
                <Send aria-hidden="true" className="size-5" strokeWidth={2.5} />
              </span>
              <div className="min-w-0">
                <p className="text-[15px] leading-snug font-bold text-white">
                  Check your inbox
                </p>
                <p className="mt-1 text-[13px] leading-relaxed break-words text-white/50">
                  If an account exists for{" "}
                  <span className="font-semibold text-white/75">{email}</span>,
                  a secure reset link is on its way. It expires in 60 minutes.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => switchMode("signin")}
              className="offer-btn group/btn relative mt-5 inline-flex h-11 w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-[#f4574a] to-[#ff8a3d] text-sm font-bold text-white shadow-[0_16px_40px_-16px_rgba(244,87,74,0.95)] transition focus-visible:ring-2 focus-visible:ring-[#ffb454] focus-visible:ring-offset-2 focus-visible:ring-offset-[#141312] focus-visible:outline-none active:scale-[0.98]">
              <span
                aria-hidden="true"
                className="offer-shine absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/45 to-transparent"
              />
              <span className="relative z-10 flex items-center gap-2">
                Back to Sign In
                <ArrowRight
                  aria-hidden="true"
                  className="size-4 transition-transform group-hover/btn:translate-x-1 motion-reduce:transition-none"
                />
              </span>
            </button>
          </div>
        ) : (
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            noValidate
            className="mt-6">
            <AuthField
              id="auth-reset-email"
              label="Email Address"
              icon={Mail}
              type="email"
              value={email}
              onChange={editField("email", setEmail)}
              placeholder="pizzaiolo@sanctuary.hub"
              autoComplete="email"
              invalid={failedField === "email"}
              disabled={busy}
              inputRef={emailRef}
            />
            <button
              type="submit"
              disabled={busy}
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
                {busy ? copy.busy : copy.cta}
                {!busy ? (
                  <ArrowRight
                    aria-hidden="true"
                    className="size-4 transition-transform group-hover/btn:translate-x-1 motion-reduce:transition-none"
                  />
                ) : null}
              </span>
            </button>
            {statusLine}
            <button
              type="button"
              onClick={() => switchMode("signin")}
              className="mt-3 flex w-full items-center justify-center gap-1.5 text-[13px] font-semibold text-white/45 transition hover:text-white focus-visible:ring-2 focus-visible:ring-[#ff9e2c]/60 focus-visible:outline-none">
              <ArrowRight aria-hidden="true" className="size-3.5 rotate-180" />
              Back to Sign In
            </button>
          </form>
        )
      ) : (
        <>
          <div className="mt-6">
            <p className="text-[10.5px] font-extrabold tracking-[0.22em] text-white/40 uppercase">
              Designate access role
            </p>
            <div
              role="group"
              aria-label="Designate access role"
              className="mt-2.5 grid grid-cols-3 gap-1.5 rounded-2xl border border-white/10 bg-black/30 p-1.5">
              {ROLES.map((item) => {
                const active = item.id === role
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setRole(item.id)}
                    className={cn(
                      "flex items-center justify-center gap-1.5 rounded-xl px-1.5 py-2.5 text-[12.5px] font-bold transition-all duration-300 focus-visible:ring-2 focus-visible:ring-[#ff9e2c]/60 focus-visible:outline-none",
                      active
                        ? "bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] ring-1 ring-white/10"
                        : "text-white/45 hover:bg-white/[0.04] hover:text-white/80"
                    )}>
                    <Icon
                      aria-hidden="true"
                      className="size-4 shrink-0"
                      style={active ? { color: item.accent } : undefined}
                    />
                    <span className="truncate">{item.label}</span>
                  </button>
                )
              })}
            </div>
            <p
              key={`${role}-${mode}`}
              className="offer-pop mt-3 text-[12.5px] leading-relaxed text-[#ffb454]/85">
              {activeRole.helper}
            </p>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            {SOCIALS.map((item) => {
              const Glyph = item.glyph
              const active = socialBusy === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSocial(item.id)}
                  disabled={busy || socialBusy !== null}
                  className="flex h-11 items-center justify-center gap-2.5 rounded-xl border border-white/12 bg-white/[0.04] text-[13.5px] font-semibold text-white/75 transition-all hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.08] hover:text-white focus-visible:ring-2 focus-visible:ring-[#ff9e2c]/60 focus-visible:outline-none active:translate-y-0 disabled:cursor-wait disabled:opacity-60 motion-reduce:hover:translate-y-0">
                  {active ? (
                    <LoaderCircle
                      aria-hidden="true"
                      className="size-4 animate-spin text-white/60 motion-reduce:animate-none"
                    />
                  ) : (
                    <Glyph className="size-[18px]" />
                  )}
                  {item.label}
                </button>
              )
            })}
          </div>

          <div className="my-5 flex items-center gap-3" aria-hidden="true">
            <span className="h-px flex-1 bg-white/10" />
            <span className="text-[10px] font-bold tracking-[0.2em] text-white/35 uppercase">
              or continue with email
            </span>
            <span className="h-px flex-1 bg-white/10" />
          </div>

          <form ref={formRef} onSubmit={handleSubmit} noValidate>
            {mode === "signup" ? (
              <AuthField
                id="auth-name"
                label="Full name"
                icon={UserRound}
                value={name}
                onChange={editField("name", setName)}
                placeholder="Maria Marinara"
                autoComplete="name"
                invalid={failedField === "name"}
                disabled={busy}
                inputRef={nameRef}
              />
            ) : null}

            <AuthField
              id="auth-email"
              label={
                mode === "signup"
                  ? "Email address"
                  : "Email Address or Member Handle"
              }
              icon={Mail}
              type="email"
              value={email}
              onChange={editField("email", setEmail)}
              placeholder="pizzaiolo@sanctuary.hub"
              autoComplete="email"
              invalid={failedField === "email"}
              disabled={busy}
              inputRef={emailRef}
            />

            <AuthField
              id="auth-password"
              label="Password"
              icon={Lock}
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={editField("password", setPassword)}
              placeholder="••••••••"
              autoComplete={
                mode === "signup" ? "new-password" : "current-password"
              }
              invalid={failedField === "password"}
              disabled={busy}
              inputRef={passwordRef}
              onKeyUp={trackCapsLock}
              action={forgotAction}
              trailing={passwordToggle}
              hint={
                capsLock ? (
                  <p className="mt-1.5 text-[11.5px] font-semibold text-amber-300/90">
                    Caps Lock is on
                  </p>
                ) : null
              }
            />

            {mode === "signup" ? <StrengthMeter value={password} /> : null}

            {mode === "signin" ? (
              <div className="mt-4 flex items-center justify-between gap-3">
                <label className="inline-flex cursor-pointer items-center gap-2.5 text-[13px] text-white/55 select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                    className="peer sr-only"
                  />
                  <span
                    aria-hidden="true"
                    className={cn(
                      "grid size-5 place-items-center rounded-md border transition-all duration-200 peer-focus-visible:ring-2 peer-focus-visible:ring-[#ff9e2c]/60 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[#141312]",
                      rememberMe
                        ? "border-[#f4574a] bg-[#f4574a] shadow-[0_0_14px_-4px_rgba(244,87,74,0.9)]"
                        : "border-white/25 bg-white/[0.04]"
                    )}>
                    <Check
                      aria-hidden="true"
                      strokeWidth={3}
                      className={cn(
                        "size-3.5 text-white transition-transform duration-200",
                        rememberMe ? "scale-100" : "scale-0"
                      )}
                    />
                  </span>
                  Stay signed in for 30 days
                </label>
              </div>
            ) : null}

            {mode === "signup" ? (
              <p className="mt-3.5 text-center text-[11.5px] leading-relaxed text-white/35">
                By creating an account you agree to our Terms of Service and
                Privacy Policy.
              </p>
            ) : null}

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
                {ctaLabel}
                {!busy && !succeeded ? (
                  <ArrowRight
                    aria-hidden="true"
                    className="size-4 transition-transform group-hover/btn:translate-x-1 motion-reduce:transition-none"
                  />
                ) : null}
              </span>
            </button>

            {statusLine}
          </form>
        </>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 border-t border-white/10 pt-5 text-center text-[11px] text-white/40">
        <span className="inline-flex items-center gap-1.5">
          <ShieldCheck
            aria-hidden="true"
            className="size-3.5 text-emerald-400/80"
          />
          Enterprise reCAPTCHA Protected
        </span>
        <span
          aria-hidden="true"
          className="hidden size-1 rounded-full bg-white/20 sm:block"
        />
        <span className="inline-flex items-center gap-1.5">
          <CreditCard aria-hidden="true" className="size-3.5 text-[#ff9e2c]" />
          Stripe Payout Compliant
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
