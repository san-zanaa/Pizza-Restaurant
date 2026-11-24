"use client"

import Link from "next/link"
import {
  BadgeCheck,
  CheckCheck,
  Clock,
  Crown,
  Plus,
  UtensilsCrossed,
} from "lucide-react"
import { useEffect, useState } from "react"
import { apiGet } from "@/lib/client-fetch"
import { Card } from "@/components/ui/card"
import { Btn, Loading, PageHeader, StatCard } from "@/components/dashboard/ui"
import { OverviewBars } from "@/components/dashboard/overview-bars"
import type { AppUser } from "@/lib/types"

type Overview = {
  totalItems: number
  activeItems: number
  pendingOrders: number
  acceptedOrders: number
  rejectedOrders: number
  plan: string
}

export function VendorOverview({ user }: { user: AppUser }) {
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
        title={`Welcome back, ${(user.name || "Chef").split(" ")[0]}`}
        subtitle="Here's how your pizzeria is performing today."
        actions={
          <>
            <Btn
              variant="outline"
              render={<Link href="/dashboard/menu" />}
            >
              Manage menu
            </Btn>
            <Btn render={<Link href="/dashboard/menu/new" />}>
              <Plus className="size-4" />
              Add Menu Item
            </Btn>
          </>
        }
      />

      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      {!data && !error ? <Loading label="Crunching your numbers…" /> : null}

      {data ? (
        <>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-5">
            <StatCard
              label="Total menu items"
              value={data.totalItems}
              icon={UtensilsCrossed}
              tone="ember"
            />
            <StatCard
              label="Active menu items"
              value={data.activeItems}
              icon={BadgeCheck}
              tone="emerald"
            />
            <StatCard
              label="Pending customer orders"
              value={data.pendingOrders}
              icon={Clock}
              tone="amber"
            />
            <StatCard
              label="Accepted orders"
              value={data.acceptedOrders}
              icon={CheckCheck}
              tone="sky"
            />
            <StatCard
              label="Current subscription plan"
              value={data.plan === "premium" ? "Premium" : "Free"}
              hint={data.plan === "premium" ? "Unlimited" : "Max 3 active"}
              icon={Crown}
              tone={data.plan === "premium" ? "amber" : "rose"}
            />
          </div>

          {data.plan === "free" && data.activeItems >= 3 ? (
            <Card className="mt-4 flex flex-wrap items-center justify-between gap-3 border-primary/20 bg-primary/5 px-5 py-4">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  You&apos;re at the Free plan limit (3 active items)
                </p>
                <p className="mt-0.5 text-[13px] text-muted-foreground">
                  Upgrade to Premium for unlimited active items, the vendor
                  badge and featured placement.
                </p>
              </div>
              <Btn render={<Link href="/dashboard/subscription" />}>
                <Crown className="size-4" />
                Upgrade to Premium
              </Btn>
            </Card>
          ) : null}

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <OverviewBars
              title="Active menu items"
              icon={BadgeCheck}
              series={[
                { label: "Active", value: data.activeItems },
                { label: "Total", value: data.totalItems },
                {
                  label: "Limit",
                  value: data.plan === "premium" ? 0 : 3,
                },
              ]}
              height={56}
            />
            <OverviewBars
              title="Order pipeline"
              icon={Clock}
              series={[
                { label: "Pending", value: data.pendingOrders },
                { label: "Accepted", value: data.acceptedOrders },
                { label: "Rejected", value: data.rejectedOrders },
              ]}
              height={56}
            />
          </div>
        </>
      ) : null}
    </>
  )
}
