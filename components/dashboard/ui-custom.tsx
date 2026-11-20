"use client"

import { cn } from "@/lib/utils"

/* ------------------------------------------------------------------ */
/* Buttons                                                             */
/* ------------------------------------------------------------------ */

type BtnProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "danger" | "ghost"
  size?: "sm" | "md"
}

export function Btn({
  variant = "primary",
  size = "md",
  className,
  ...props
}: BtnProps) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all outline-none focus-visible:ring-2 focus-visible:ring-[#f4574a]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60",
        size === "sm" ? "h-8 px-3.5 text-[12.5px]" : "h-10 px-5 text-sm",
        variant === "primary" &&
          "bg-gradient-to-r from-[#f4574a] to-[#ff7d68] text-white shadow-[0_10px_26px_-14px_rgba(244,87,74,0.9)] hover:brightness-110 active:scale-[0.98]",
        variant === "outline" &&
          "border border-border bg-background text-foreground hover:border-[#f4574a]/50 hover:text-[#f4574a]",
        variant === "danger" &&
          "border border-rose-500/40 bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 dark:text-rose-400",
        variant === "ghost" &&
          "text-muted-foreground hover:bg-muted hover:text-foreground",
        className
      )}
    />
  )
}

/* ------------------------------------------------------------------ */
/* Status badges                                                       */
/* ------------------------------------------------------------------ */

const BADGE_TONES: Record<string, string> = {
  Pending:
    "border-amber-400/40 bg-amber-400/10 text-amber-600 dark:text-amber-300",
  Accepted:
    "border-emerald-400/40 bg-emerald-400/10 text-emerald-600 dark:text-emerald-300",
  Approved:
    "border-emerald-400/40 bg-emerald-400/10 text-emerald-600 dark:text-emerald-300",
  Rejected:
    "border-rose-400/40 bg-rose-400/10 text-rose-600 dark:text-rose-300",
  Cancelled:
    "border-slate-400/40 bg-slate-400/10 text-slate-500 dark:text-slate-300",
  paid: "border-emerald-400/40 bg-emerald-400/10 text-emerald-600 dark:text-emerald-300",
  failed: "border-rose-400/40 bg-rose-400/10 text-rose-600 dark:text-rose-300",
  Active:
    "border-emerald-400/40 bg-emerald-400/10 text-emerald-600 dark:text-emerald-300",
  Inactive:
    "border-slate-400/40 bg-slate-400/10 text-slate-500 dark:text-slate-300",
  Blocked: "border-rose-400/40 bg-rose-400/10 text-rose-600 dark:text-rose-400",
}

export function StatusBadge({
  status,
  className,
}: {
  status: string
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold tracking-wide uppercase",
        BADGE_TONES[status] ?? "border-border bg-muted text-muted-foreground",
        className
      )}
    >
      {status}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/* Page header                                                         */
/* ------------------------------------------------------------------ */

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string
  subtitle?: string
  actions?: React.ReactNode
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-[26px]">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex flex-wrap items-center gap-2">{actions}</div>
      ) : null}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Stat card                                                           */
/* ------------------------------------------------------------------ */

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "ember",
}: {
  label: string
  value: string | number
  hint?: string
  icon: React.ComponentType<{ className?: string }>
  tone?: "ember" | "amber" | "emerald" | "rose" | "sky"
}) {
  const tones = {
    ember: "from-[#f4574a]/18 to-[#ff7d68]/8 text-[#f4574a]",
    amber:
      "from-[#ff9e2c]/18 to-[#ff9e2c]/6 text-[#e07f00] dark:text-[#ffb454]",
    emerald:
      "from-emerald-500/18 to-emerald-500/6 text-emerald-600 dark:text-emerald-400",
    rose: "from-rose-500/18 to-rose-500/6 text-rose-600 dark:text-rose-400",
    sky: "from-sky-500/18 to-sky-500/6 text-sky-600 dark:text-sky-400",
  }
  return (
    <div className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <span
          className={cn(
            "grid size-10 place-items-center rounded-xl bg-gradient-to-br",
            tones[tone]
          )}
        >
          <Icon className="size-5" />
        </span>
        {hint ? (
          <span className="rounded-full bg-muted px-2 py-0.5 text-[10.5px] font-bold tracking-wide text-muted-foreground uppercase">
            {hint}
          </span>
        ) : null}
      </div>
      <p className="mt-4 text-[26px] leading-none font-extrabold tracking-tight text-foreground">
        {value}
      </p>
      <p className="mt-1.5 text-[13px] font-medium text-muted-foreground">
        {label}
      </p>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Feedback                                                            */
/* ------------------------------------------------------------------ */

export function Alert({
  kind = "error",
  children,
}: {
  kind?: "error" | "success" | "info"
  children: React.ReactNode
}) {
  const tones = {
    error: "border-rose-500/40 bg-rose-500/10 text-rose-600 dark:text-rose-300",
    success:
      "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    info: "border-sky-500/40 bg-sky-500/10 text-sky-700 dark:text-sky-300",
  }
  return (
    <div
      role="status"
      className={cn(
        "flex items-start gap-2 rounded-xl border px-4 py-3 text-[13px] leading-snug font-medium",
        tones[kind]
      )}
    >
      {children}
    </div>
  )
}

export function EmptyState({
  icon: Icon,
  title,
  hint,
  action,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  hint?: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 px-6 py-14 text-center">
      <span className="grid size-12 place-items-center rounded-2xl bg-muted text-muted-foreground">
        <Icon className="size-6" />
      </span>
      <p className="mt-4 text-[15px] font-bold text-foreground">{title}</p>
      {hint ? (
        <p className="mt-1 max-w-sm text-[13px] text-muted-foreground">
          {hint}
        </p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  )
}

export function Loading({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2.5 rounded-2xl border border-border bg-card px-6 py-14 text-sm text-muted-foreground">
      <span className="size-4 animate-spin rounded-full border-2 border-[#f4574a] border-t-transparent motion-reduce:animate-none" />
      {label}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Table                                                               */
/* ------------------------------------------------------------------ */

export function TableShell({
  children,
  minWidth = 760,
}: {
  children: React.ReactNode
  minWidth?: number
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
      <table className="w-full text-left text-sm" style={{ minWidth }}>
        {children}
      </table>
    </div>
  )
}

export function Th({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <th
      className={cn(
        "bg-muted/60 px-4 py-3 text-[11px] font-extrabold tracking-wider text-muted-foreground uppercase",
        className
      )}
    >
      {children}
    </th>
  )
}

export function Td({
  children,
  className,
  ...rest
}: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      {...rest}
      className={cn("px-4 py-3.5 align-middle text-foreground", className)}
    >
      {children}
    </td>
  )
}

/* ------------------------------------------------------------------ */
/* Form field                                                          */
/* ------------------------------------------------------------------ */

export function Field({
  label,
  hint,
  error,
  required,
  children,
  htmlFor,
}: {
  label: string
  hint?: string
  error?: string
  required?: boolean
  children: React.ReactNode
  htmlFor?: string
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-[13px] font-bold text-foreground"
      >
        {label}
        {required ? <span className="ml-0.5 text-[#f4574a]">*</span> : null}
      </label>
      {children}
      {error ? (
        <p className="mt-1.5 text-[12.5px] font-medium text-rose-500 dark:text-rose-400">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-[12px] text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  )
}

export const inputClass =
  "h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/60 focus:border-[#f4574a]/60 focus:ring-4 focus:ring-[#f4574a]/12 aria-invalid:border-rose-500 aria-invalid:ring-4 aria-invalid:ring-rose-500/10"
