"use client"

import type { LucideIcon } from "lucide-react"

type BarSeries = { label: string; value: number }

/**
 * Small inline bar chart (no charting library) — the "charts & graphs"
 * requirement of the dashboard UI spec. Values are normalized to the max so
 * bars are always visible; zero is a flat line.
 */
export function OverviewBars({
  title,
  icon: Icon,
  series,
  valueLabel,
  height = 72,
}: {
  title: string
  icon: LucideIcon
  series: BarSeries[]
  valueLabel?: string
  height?: number
}) {
  const max = Math.max(1, ...series.map((s) => s.value))

  return (
    <div className="min-w-52 flex-1 rounded-2xl border border-border bg-card p-4 shadow-sm">
      <p className="text-[10.5px] font-extrabold tracking-wider text-muted-foreground uppercase">
        {title}
      </p>
      <div className="mt-3 flex items-end justify-around gap-1.5" style={{ height }}>
        {series.map((s) => {
          const fraction = s.value > 0 ? s.value / max : 0
          return (
            <div
              key={s.label}
              title={`${s.label}: ${s.value}${valueLabel ?? ""}`}
              className="flex flex-col items-center gap-1.5">
              <span
                className="w-6 rounded-t-lg bg-gradient-to-b from-[#f4574a] to-[#ff9740] transition-all duration-500"
                style={{ height: `calc(${Math.max(fraction, 0.06) * 100}%)` }}
                aria-label={`${s.label}: ${s.value}${valueLabel ?? ""}`}
                role="img"
              />
              <span className="text-[10px] font-medium text-muted-foreground">
                {s.label}
              </span>
              <span className="text-[10px] font-extrabold text-foreground">
                {s.value}
              </span>
            </div>
          )
        })}
      </div>
      <div className="mt-3 flex items-center gap-1.5">
        <Icon className="size-3.5 text-[#f4574a]" />
        <span className="text-[12px] font-semibold text-foreground">
          {title}
        </span>
      </div>
    </div>
  )
}
