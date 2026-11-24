"use client"

import Link from "next/link"
import {
  Calendar,
  ClipboardList,
  MapPin,
  MessageSquare,
  Pizza,
  Store,
  XCircle,
} from "lucide-react"
import { Fragment, useEffect, useState } from "react"
import { toast } from "react-toastify"
import { apiGet, apiSend } from "@/lib/client-fetch"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
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
import { OrderTimeline } from "@/components/dashboard/order-timeline"
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


export function CustomerOrders() {
  const [orders, setOrders] = useState<Order[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const load = () => {
    apiGet<{ orders: Order[] }>("/api/orders").then(({ data, error: err }) => {
      setOrders(data?.orders ?? null)
      setError(err)
    })
  }

  useEffect(load, [])

  const cancel = async (order: Order) => {
    setBusyId(order._id)
    const { error: err } = await apiSend<{ order: Order }>(
      `/api/orders/${order._id}`,
      "PATCH",
      { status: "cancelled" }
    )
    setBusyId(null)
    setConfirmId(null)
    if (err) {
      setError(err)
      toast.error(err)
      return
    }
    setError(null)
    toast.success("Order cancelled.")
    load()
  }

  return (
    <>
      <PageHeader
        title="My Orders"
        subtitle="Track every order you've placed — and cancel any that are still pending."
        actions={
          <Btn render={<Link href="/menu" />}>
            <Pizza className="size-4" />
            Browse the menu
          </Btn>
        }
      />

      {error ? (
        <div className="mb-4">
          <Alert kind="error">{error}</Alert>
        </div>
      ) : null}

      {!orders ? (
        <Loading label="Loading your orders…" />
      ) : orders.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No orders yet"
          hint="When you place an order it shows up here with live status."
          action={
            <Btn render={<Link href="/menu" />}>
              <Pizza className="size-4" />
              Find something delicious
            </Btn>
          }
        />
      ) : (
        <TableShell minWidth={920}>
          <THead>
            <Tr>
              <Th>Item</Th>
              <Th>Vendor</Th>
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
                          ৳{order.itemPrice.toFixed(0)}
                        </p>
                      </div>
                    </div>
                  </Td>
                  <Td className="text-[13px] text-muted-foreground">
                    {order.vendorName}
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
                      {order.status === "pending" ? (
                        <AlertDialog
                          open={confirmId === order._id}
                          onOpenChange={(open) => {
                            if (!open) setConfirmId(null)
                          }}
                        >
                          <AlertDialogTrigger
                            render={
                              <Btn size="sm" variant="danger">
                                <XCircle className="size-3.5" />
                                Cancel
                              </Btn>
                            }
                          >
                            <span className="sr-only">
                              Cancel order for {order.itemName}
                            </span>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Cancel your order?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This cancels the pending order for{" "}
                                <strong>{order.itemName}</strong>. The vendor
                                will be notified and you can&apos;t undo this.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>
                                Keep my order
                              </AlertDialogCancel>
                              <AlertDialogAction
                                variant="destructive"
                                onClick={() => cancel(order)}
                                disabled={busyId === order._id}
                              >
                                {busyId === order._id
                                  ? "Cancelling…"
                                  : "Yes, cancel it"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
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
                            <Store className="size-3.5" /> Vendor
                          </p>
                          <p className="mt-1 text-[13px] font-semibold">
                            {order.vendorName}
                          </p>
                          <p className="text-[12.5px] text-muted-foreground">
                            Placed {formatDate(order.createdAt)}
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
                            Requested delivery {formatDate(order.deliveryDate)}
                          </p>
                        </div>
                        <div>
                          <p className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                            <MessageSquare className="size-3.5" /> Your
                            instructions
                          </p>
                          <p className="mt-1 text-[13px] whitespace-pre-wrap">
                            {order.message || "No special instructions."}
                          </p>
                        </div>
                      </div>
                      <OrderTimeline order={order} />
                    </Td>
                  </Tr>
                ) : null}
              </Fragment>
            ))}
          </TBody>
        </TableShell>
      )}

      <p className="mt-4 text-xs text-muted-foreground">
        Only <strong>Pending</strong> orders can be cancelled. Once a vendor
        accepts or rejects an order, it&apos;s final.
      </p>
    </>
  )
}
