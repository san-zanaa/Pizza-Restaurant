"use client"

import Link from "next/link"
import { CheckCheck, CircleX, Clock, ClipboardList, Pizza } from "lucide-react"
import { useEffect, useState } from "react"
import { apiGet } from "@/lib/client-fetch"
import { Btn, Loading, PageHeader, StatCard } from "@/components/dashboard/ui"
import type { AppUser } from "@/lib/types"

type Overview = {
  totalOrders: number
  pendingOrders: number
  acceptedOrders: number
  rejectedOrders: number
  cancelledOrders: number
}

/** Customer overview: totals across the order pipeline. */
export function CustomerOverview({ user }: { user: AppUser }) {
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
        title={`Ciao, ${user.name.split(" ")[0] || "foodie"}`}
        subtitle="Track every order you've placed across PizzaHub."
        actions={
          <Btn render={<Link href="/menu" />}>
            <Pizza className="size-4" />
            Browse the menu
          </Btn>
        }
      />

      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      {!data && !error ? <Loading label="Fetching your orders…" /> : null}

      {data ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-5">
          <StatCard
            label="Total orders"
            value={data.totalOrders}
            icon={ClipboardList}
            tone="ember"
          />
          <StatCard
            label="Pending"
            value={data.pendingOrders}
            icon={Clock}
            tone="amber"
          />
          <StatCard
            label="Accepted"
            value={data.acceptedOrders}
            icon={CheckCheck}
            tone="emerald"
          />
          <StatCard
            label="Rejected"
            value={data.rejectedOrders}
            icon={CircleX}
            tone="rose"
          />
          <StatCard
            label="Cancelled"
            value={data.cancelledOrders}
            icon={CircleX}
            tone="sky"
          />
        </div>
      ) : null}
    </>
  )
}
