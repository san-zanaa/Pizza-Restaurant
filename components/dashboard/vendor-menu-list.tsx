"use client"

import Link from "next/link"
import {
  ClipboardList,
  Eye,
  Pencil,
  Plus,
  Trash2,
  UtensilsCrossed,
} from "lucide-react"
import { useEffect, useState } from "react"
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
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
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
import type { MenuItem } from "@/lib/types"

function money(value: number) {
  return `$${value.toFixed(2)}`
}

/**
 * Vendor's own menu items — every status (Pending / Approved / Rejected) is
 * visible to the vendor; only Approved + available ones reach customers.
 */
export function VendorMenuList() {
  const [items, setItems] = useState<MenuItem[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [confirmId, setConfirmId] = useState<string | null>(null)

  const load = () => {
    apiGet<{ items: MenuItem[] }>("/api/menu?scope=mine").then(
      ({ data, error: err }) => {
        setItems(data?.items ?? null)
        setError(err)
      }
    )
  }

  useEffect(load, [])

  const toggleAvailability = async (item: MenuItem) => {
    setBusyId(item._id)
    const { error: err } = await apiSend<{ item: MenuItem }>(
      `/api/menu/${item._id}`,
      "PATCH",
      { availability: !item.availability }
    )
    setBusyId(null)
    if (err) {
      setError(err)
      return
    }
    setError(null)
    load()
  }

  const remove = async (item: MenuItem) => {
    setBusyId(item._id)
    const { error: err } = await apiSend(`/api/menu/${item._id}`, "DELETE")
    setBusyId(null)
    setConfirmId(null)
    if (err) {
      setError(err)
      return
    }
    setItems((prev) => (prev ?? []).filter((row) => row._id !== item._id))
  }

  return (
    <>
      <PageHeader
        title="My Menu Items"
        subtitle="Everything you've submitted — and where each item stands with review."
        actions={
          <Btn render={<Link href="/dashboard/menu/new" />}>
            <Plus className="size-4" />
            Add Menu Item
          </Btn>
        }
      />

      {error ? (
        <div className="mb-4">
          <Alert kind="error">{error}</Alert>
        </div>
      ) : null}

      {!items ? (
        <Loading label="Loading your menu…" />
      ) : items.length === 0 ? (
        <EmptyState
          icon={UtensilsCrossed}
          title="No menu items yet"
          hint="Add your first dish — it goes live once an admin approves it."
          action={
            <Btn render={<Link href="/dashboard/menu/new" />}>
              <Plus className="size-4" />
              Add your first item
            </Btn>
          }
        />
      ) : (
        <TableShell minWidth={860}>
          <THead>
            <Tr>
              <Th>Item</Th>
              <Th>Category</Th>
              <Th>Price</Th>
              <Th>Approval</Th>
              <Th>Availability</Th>
              <Th className="text-right">Actions</Th>
            </Tr>
          </THead>
          <TBody>
            {items.map((item) => (
              <Tr key={item._id}>
                <Td>
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="size-11 shrink-0 rounded-lg border border-border object-cover"
                    />
                    <div className="min-w-0">
                      <p className="max-w-[220px] truncate font-semibold">
                        {item.name}
                      </p>
                      <p className="max-w-[220px] truncate text-xs text-muted-foreground">
                        {item.location}
                      </p>
                    </div>
                  </div>
                </Td>
                <Td>
                  <span className="text-[13px] text-muted-foreground">
                    {item.category}
                  </span>
                </Td>
                <Td className="font-semibold">{money(item.price)}</Td>
                <Td>
                  <StatusBadge status={item.status} />
                </Td>
                <Td>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={item.availability}
                      onCheckedChange={() => toggleAvailability(item)}
                      disabled={busyId === item._id}
                      aria-label={`${item.availability ? "Deactivate" : "Activate"} ${item.name}`}
                    />
                    <span className="text-xs text-muted-foreground">
                      {item.availability ? "Active" : "Inactive"}
                    </span>
                  </div>
                </Td>
                <Td className="text-right">
                  <div className="inline-flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      render={
                        <Link
                          href={`/dashboard/menu/${item._id}`}
                          aria-label={`View ${item.name}`}
                        />
                      }
                    >
                      <Eye className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      render={
                        <Link
                          href={`/dashboard/menu/${item._id}`}
                          aria-label={`Edit ${item.name}`}
                        />
                      }
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <AlertDialog
                      open={confirmId === item._id}
                      onOpenChange={(open) => {
                        if (!open) setConfirmId(null)
                      }}
                    >
                      <AlertDialogTrigger
                        render={
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`Delete ${item.name}`}
                            className="text-muted-foreground hover:text-destructive"
                          />
                        }
                      >
                        <Trash2 className="size-4" />
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Delete &quot;{item.name}&quot;?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This permanently removes the item from your menu.
                            Customers will no longer be able to find it.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            variant="destructive"
                            onClick={() => remove(item)}
                            disabled={busyId === item._id}
                          >
                            {busyId === item._id ? "Deleting…" : "Delete"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </Td>
              </Tr>
            ))}
          </TBody>
        </TableShell>
      )}

      <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
        <ClipboardList className="size-4" />
        Rejected items stay visible to you here — but they can never be seen or
        ordered by customers.
      </p>
    </>
  )
}
