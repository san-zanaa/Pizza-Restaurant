"use client"

import Link from "next/link"
import {
  Calendar,
  ClipboardList,
  Mail,
  MapPin,
  MessageSquare,
  ThumbsDown,
  ThumbsUp,
  UserRound,
} from "lucide-react"
import { Fragment, useEffect, useState } from "react"
import { apiGet, apiSend } from "@/lib/client-fetch"
import {
  Alert,
  Btn,
  EmptyState,
  Loading,
  PageHeader,
  StatusBadge,
  TableShell,
  TBody,
  Td,
  Th,
  THead,
  Tr,
} from "@/components/dashboard/ui"
import type { Order } from "@/lib/types"

function formatDate(iso: string) {
  const date = new Date(iso)
  return Number.isNaN(date.getTime())
    ? iso
    : date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
}

/**
 * Vendor → Customer Orders: every order placed against this vendor's items.
 * Only Pending orders can be accepted or rejected, and only once (the API
 * enforces both; the buttons disappear once decided).
 */
export function VendorOrders() {
  const [orders, setOrders] = useState<Order[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const load = () => {
    apiGet<{ orders: Order[] }>("/api/orders?scope=vendor").then(
      ({ data, error: err }) => {
        setOrders(data?.orders ?? null)
        setError(err)
      }
    )
  }

  useEffect(load, [])

  const decide = async (order: Order, action: "accept" | "reject") => {
    setBusyId(order._id)
    const { error: err } = await apiSend<{ order: Order }>(
      `/api/orders/${order._id}`,
      "PATCH",
      { action }
    )
    setBusyId(null)
    if (err) {
      setError(err)
      return
    }
    setError(null)
    load()
  }

  return (
    <>
      <PageHeader
        title="Customer Orders"
        subtitle="Accept or reject incoming requests — only pending ones can be decided."
      />

      {error ? (
        <div className="mb-4">
          <Alert kind="error">{error}</Alert>
        </div>
      ) : null}

      {!orders ? (
        <Loading label="Loading incoming orders…" />
      ) : orders.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No orders yet"
          hint="When customers order your dishes, the requests land here."
        />
      ) : (
        <TableShell minWidth={980}>
          <THead>
            <Tr>
              <Th>Customer</Th>
              <Th>Item</Th>
              <Th>Delivery</Th>
              <Th>Status</Th>
              <Th className="text-right">Actions</Th>
            </Tr>
          </THead>
          <TBody>
            {orders.map((order) => (
              <Fragment key={order._id}>
                <Tr>
                  <Td>
                    <div className="flex items-center gap-2.5">
                      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground">
                        <UserRound className="size-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-[13.5px] font-semibold">
                          {order.customerName}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {order.customerEmail}
                        </p>
                      </div>
                    </div>
                  </Td>
                  <Td>
                    <div className="flex items-center gap-2.5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={order.itemImage}
                        alt={order.itemName}
                        className="size-10 shrink-0 rounded-lg border border-border object-cover"
                      />
                      <div className="min-w-0">
                        <p className="max-w-[180px] truncate text-[13.5px] font-semibold">
                          {order.itemName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          ${order.itemPrice.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </Td>
                  <Td>
                    <p className="flex items-center gap-1.5 text-[13px] font-medium">
                      <Calendar className="size-3.5 text-muted-foreground" />
                      {formatDate(order.deliveryDate)}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="size-3.5" />
                      <span className="max-w-[180px] truncate">
                        {order.deliveryAddress}
                      </span>
                    </p>
                  </Td>
                  <Td>
                    <StatusBadge status={order.status} />
                  </Td>
                  <Td className="text-right">
                    <div className="inline-flex items-center gap-1.5">
                      {order.status === "Pending" ? (
                        <>
                          <Btn
                            size="sm"
                            onClick={() => decide(order, "accept")}
                            disabled={busyId === order._id}
                          >
                            <ThumbsUp className="size-3.5" />
                            Accept
                          </Btn>
                          <Btn
                            size="sm"
                            variant="danger"
                            onClick={() => decide(order, "reject")}
                            disabled={busyId === order._id}
                          >
                            <ThumbsDown className="size-3.5" />
                            Reject
                          </Btn>
                        </>
                      ) : null}
                      <Btn
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          setExpandedId((current) =>
                            current === order._id ? null : order._id
                          )
                        }
                        aria-expanded={expandedId === order._id}
                      >
                        {expandedId === order._id ? "Hide" : "Details"}
                      </Btn>
                    </div>
                  </Td>
                </Tr>
                {expandedId === order._id ? (
                  <Tr className="bg-muted/40 hover:bg-muted/40">
                    <Td colSpan={5} className="!py-4">
                      <div className="grid gap-4 sm:grid-cols-3">
                        <div>
                          <p className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                            <UserRound className="size-3.5" /> Customer
                          </p>
                          <p className="mt-1 text-[13px] font-semibold">
                            {order.customerName}
                          </p>
                          <p className="flex items-center gap-1 text-[12.5px] text-muted-foreground">
                            <Mail className="size-3.5" /> {order.customerEmail}
                          </p>
                        </div>
                        <div>
                          <p className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                            <MapPin className="size-3.5" /> Delivery address
                          </p>
                          <p className="mt-1 text-[13px]">
                            {order.deliveryAddress}
                          </p>
                          <p className="text-[12.5px] text-muted-foreground">
                            Requested {formatDate(order.createdAt)} · Delivery{" "}
                            {formatDate(order.deliveryDate)}
                          </p>
                        </div>
                        <div>
                          <p className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                            <MessageSquare className="size-3.5" /> Customer
                            message
                          </p>
                          <p className="mt-1 text-[13px] whitespace-pre-wrap">
                            {order.message || "No special instructions."}
                          </p>
                        </div>
                      </div>
                    </Td>
                  </Tr>
                ) : null}
              </Fragment>
            ))}
          </TBody>
        </TableShell>
      )}

      <p className="mt-4 text-xs text-muted-foreground">
        Orders that belong to other vendors can&apos;t be seen or modified here
        — the API rejects them.
        <Link
          href="/dashboard/menu"
          className="ml-1 font-semibold text-primary hover:underline"
        >
          Manage my items
        </Link>
      </p>
    </>
  )
}
