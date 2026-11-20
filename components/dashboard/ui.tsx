"use client"

/**
 * Dashboard UI kit.
 *
 * Every primitive here is composed from shadcn/ui components
 * (`@/components/ui/*`) so the Customer / Vendor / Admin dashboards share one
 * consistent, accessible design system. The storefront keeps its own bespoke
 * kit in `ui-custom.tsx`.
 */

import {
  AlertCircle,
  CheckCircle2,
  Info,
  LoaderCircle,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

/* ------------------------------------------------------------------ */
/* Button                                                              */
/* ------------------------------------------------------------------ */

type BtnProps = Omit<
  React.ComponentProps<typeof Button>,
  "variant" | "size"
> & {
  variant?: "primary" | "outline" | "danger" | "ghost"
  size?: "sm" | "md"
}

const BTN_VARIANT = {
  primary: "default",
  outline: "outline",
  danger: "destructive",
  ghost: "ghost",
} as const

const BTN_SIZE = { sm: "sm", md: "lg" } as const

export function Btn({
  variant = "primary",
  size = "md",
  className,
  type = "button",
  render,
  nativeButton,
  ...props
}: BtnProps) {
  return (
    <Button
      type={type}
      variant={BTN_VARIANT[variant]}
      size={BTN_SIZE[size]}
      className={cn("cursor-pointer", className)}
      nativeButton={render ? false : nativeButton}
      {...(render ? { render } : {})}
      {...props}
    />
  )
}

/* ------------------------------------------------------------------ */
/* Status badge                                                        */
/* ------------------------------------------------------------------ */

const STATUS_TONES: Record<string, string> = {
  Pending:
    "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400",
  Accepted:
    "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  Approved:
    "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  Rejected:
    "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-400",
  Cancelled:
    "border-slate-500/30 bg-slate-500/10 text-slate-600 dark:text-slate-400",
  paid: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  failed: "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-400",
  Active: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  Inactive:
    "border-slate-500/30 bg-slate-500/10 text-slate-600 dark:text-slate-400",
  Blocked: "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-400",
  premium:
    "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400",
  free: "border-slate-500/30 bg-slate-500/10 text-slate-600 dark:text-slate-400",
}

export function StatusBadge({
  status,
  className,
}: {
  status: string
  className?: string
}) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "h-5 shrink-0 px-2 text-[11px] font-bold tracking-wide uppercase",
        STATUS_TONES[status] ??
          "border-border bg-muted text-muted-foreground",
        className
      )}
    >
      {status}
    </Badge>
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
      <div className="min-w-0">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
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

const STAT_TONES = {
  ember: "bg-primary/10 text-primary",
  amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  rose: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  sky: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
} as const

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
  tone?: keyof typeof STAT_TONES
}) {
  return (
    <Card className="gap-0 p-5">
      <div className="flex items-start justify-between gap-3">
        <span
          className={cn(
            "grid size-10 shrink-0 place-items-center rounded-lg",
            STAT_TONES[tone]
          )}
        >
          <Icon className="size-5" />
        </span>
        {hint ? (
          <Badge
            variant="secondary"
            className="h-5 px-2 text-[10.5px] font-bold tracking-wide uppercase"
          >
            {hint}
          </Badge>
        ) : null}
      </div>
      <p className="mt-4 text-2xl font-bold tracking-tight text-foreground">
        {value}
      </p>
      <p className="mt-1 text-[13px] text-muted-foreground">{label}</p>
    </Card>
  )
}

/* ------------------------------------------------------------------ */
/* Feedback                                                            */
/* ------------------------------------------------------------------ */

const ALERT_TONES = {
  error:
    "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300",
  success:
    "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  info: "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300",
} as const

export function Alert({
  kind = "error",
  children,
}: {
  kind?: keyof typeof ALERT_TONES
  children: React.ReactNode
}) {
  const Icon =
    kind === "error" ? AlertCircle : kind === "success" ? CheckCircle2 : Info
  return (
    <div
      role="status"
      className={cn(
        "flex items-start gap-2.5 rounded-lg border px-3.5 py-3 text-sm",
        ALERT_TONES[kind]
      )}
    >
      <Icon className="mt-0.5 size-4 shrink-0" />
      <div className="min-w-0 flex-1">{children}</div>
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
    <Card className="flex flex-col items-center justify-center border-dashed px-6 py-14 text-center">
      <span className="grid size-12 place-items-center rounded-full bg-muted text-muted-foreground">
        <Icon className="size-6" />
      </span>
      <p className="mt-4 text-base font-semibold text-foreground">{title}</p>
      {hint ? (
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">{hint}</p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </Card>
  )
}

export function Loading({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2.5 rounded-xl border border-border bg-card px-6 py-14 text-sm text-muted-foreground">
      <LoaderCircle className="size-4 animate-spin text-primary motion-reduce:animate-none" />
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
    <div className="w-full overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
      <Table className="text-sm" style={{ minWidth }}>
        {children}
      </Table>
    </div>
  )
}

export {
  TableBody as TBody,
  TableCell as Td,
  TableHead as Th,
  TableHeader as THead,
  TableRow as Tr,
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
    <div className="grid gap-1.5">
      <Label
        htmlFor={htmlFor}
        className="text-[13px] font-medium text-foreground"
      >
        {label}
        {required ? <span className="ml-0.5 text-destructive">*</span> : null}
      </Label>
      {children}
      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  )
}

export const inputClass =
  "flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/60 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20"
