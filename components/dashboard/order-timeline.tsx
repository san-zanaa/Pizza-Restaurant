"use client"

import type { Order } from "@/lib/types"
import { cn } from "@/lib/utils"

function formatWhen(iso?: string) {
  const date = new Date(iso ?? "")
  if (Number.isNaN(date.getTime())) return "—"
  return date.toLocaleString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

type TimelineStep = { label: string; when?: string; active: boolean }

export function buildTimeline(order: Order): TimelineStep[] {
  const steps: TimelineStep[] = [
    { label: "Order placed", when: order.createdAt, active: true },
  ]

  const label =
    order.status === "accepted"
      ? "Accepted by the vendor"
      : order.status === "rejected"
        ? "Rejected by the vendor"
        : order.status === "cancelled"
          ? "Cancelled"
          : "Still pending — the vendor hasn't decided yet."

  steps.push({ label, when: order.updatedAt, active: order.status !== "pending" })
  return steps
}

export function OrderTimeline({ order }: { order: Order }) {
  const steps = buildTimeline(order)
  return (
    <div className="mt-4">
      <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
        Status timeline
      </p>
      <div className="ml-1 border-l-2 border-border">
        {steps.map((step, index) => (
          <div key={index} className="relative pb-4 pl-6 last:pb-0">
            <span
              className={cn(
                "absolute -left-2.5 top-0 size-2.5 rounded-full border-2",
                step.active
                  ? "border-[#f4574a] bg-[#f4574a]"
                  : "border-border bg-transparent"
              )}
            />
            <p className="text-[13.5px] font-semibold text-foreground">
              {step.label}
            </p>
            <p className="mt-0.5 text-[12px] text-muted-foreground">
              {formatWhen(step.when)}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
