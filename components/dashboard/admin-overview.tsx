"use client"

import {
  BadgeCheck,
  ClipboardList,
  Crown,
  Pizza,
  Receipt,
  Users,
} from "lucide-react"
import { useEffect, useState } from "react"
import { apiGet } from "@/lib/client-fetch"
import { Card } from "@/components/ui/card"
import { Loading, PageHeader, StatCard } from "@/components/dashboard/ui"
import type { AppUser } from "@/lib/types"

type Overview = {
  totalUsers: number
  totalVendors: number
  totalCustomers: number
  totalMenuItems: number
  pendingMenuItems: number
  totalTransactions: number
}

/** Admin overview: platform-wide totals. */
export function AdminOverview({ user }: { user: AppUser }) {
  const [data, setData] = useState<Overview | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let alive = true
    apiGet<Overview>("/api/overview").then(({ data: result, error: err }) => {
      if (!alive) return
      setData(result)
      setError(err)
    })
    return () => {
      alive = false
    }
  }, [])

  return (
    <>
      <PageHeader
        title="Admin control room"
        subtitle={`Signed in as ${user.email}.`}
      />

      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      {!data && !error ? <Loading label="Loading platform totals…" /> : null}

      {data ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-3">
          <StatCard
            label="Total registered users"
            value={data.totalUsers}
            icon={Users}
            tone="ember"
          />
          <StatCard
            label="Total vendors"
            value={data.totalVendors}
            icon={Users}
            tone="sky"
          />
          <StatCard
            label="Total customers"
            value={data.totalCustomers}
            icon={Users}
            tone="emerald"
          />
          <StatCard
            label="Total menu items"
            value={data.totalMenuItems}
            icon={Pizza}
            tone="amber"
          />
          <StatCard
            label="Pending menu items"
            value={data.pendingMenuItems}
            hint="Needs review"
            icon={ClipboardList}
            tone="rose"
          />
          <StatCard
            label="Total transactions"
            value={data.totalTransactions}
            icon={Receipt}
            tone="ember"
          />
        </div>
      ) : null}

      <Card className="mt-4 flex flex-wrap items-center gap-2 px-4 py-3 text-[13px] text-muted-foreground">
        <Crown className="size-4 text-primary" />
        Payment records are read-only — only verified Stripe confirmations write
        them, so failed payments can&apos;t be flipped to successful.
        <BadgeCheck className="size-4 text-emerald-500" />
      </Card>
    </>
  )
}
