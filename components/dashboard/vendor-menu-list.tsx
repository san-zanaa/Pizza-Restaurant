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
import { primaryImage, type MenuItem } from "@/lib/types"

function money(value: number) {
  return `৳${value.toFixed(0)}`
}

const canToggle = (item: MenuItem) =>
  item.status === "approved" || item.status === "inactive"

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
    if (!canToggle(item)) return
    setBusyId(item._id)
    const next = item.status === "approved" ? "inactive" : "approved"
    const { error: err } = await apiSend<{ item: MenuItem }>(
      `/api/menu/${item._id}`,
      "PATCH",
      { status: next }
    )
    setBusyId(null)
    if (err) {
      setError(err)
      toast.error(err)
      return
    }
    setError(null)
    toast.success(
      next === "approved"
        ? `"${item.itemName}" is now visible to customers.`
        : `"${item.itemName}" is now hidden from customers.`
    )
    load()
  }

  const remove = async (item: MenuItem) => {
    setBusyId(item._id)
    const { error: err } = await apiSend(`/api/menu/${item._id}`, "DELETE")
    setBusyId(null)
    setConfirmId(null)
    if (err) {
      setError(err)
      toast.error(err)
      return
    }
    toast.success(`"${item.itemName}" deleted.`)
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
              <Th>Location</Th>
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
                    <img
                      src={primaryImage(item)}
                      alt={item.itemName}
                      className="size-11 shrink-0 rounded-lg border border-border object-cover"
                    />
                    <div className="min-w-0">
                      <p className="max-w-[220px] truncate font-semibold">
                        {item.itemName}
                      </p>
                      <p className="max-w-[220px] truncate text-xs text-muted-foreground">
                        {item.location || "—"}
                      </p>
                    </div>
                  </div>
                </Td>
                <Td>
                  <span className="text-[13px] text-muted-foreground">
                    {item.category}
                  </span>
                </Td>
                <Td className="text-[13px] text-muted-foreground">
                  {item.location || "—"}
                </Td>
                <Td className="font-semibold">{money(item.price)}</Td>
                <Td>
                  <StatusBadge status={item.status} />
                </Td>
                <Td>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={item.status === "approved"}
                      onCheckedChange={() => toggleAvailability(item)}
                      disabled={busyId === item._id || !canToggle(item)}
                      aria-label={`${item.status === "approved" ? "Hide" : "Show"} ${item.itemName}`}
                    />
                    <span className="text-xs text-muted-foreground">
                      {item.status === "approved" ? "On" : item.status === "inactive" ? "Off" : "—"}
                    </span>
                  </div>
                </Td>
                <Td className="text-right">
                  <div className="inline-flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      nativeButton={false}
                      render={
                        <Link
                          href={`/dashboard/menu/${item._id}`}
                          aria-label={`View ${item.itemName}`}
                        />
                      }
                    >
                      <Eye className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      nativeButton={false}
                      render={
                        <Link
                          href={`/dashboard/menu/${item._id}`}
                          aria-label={`Edit ${item.itemName}`}
                        />
                      }
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <AlertDialog
                      open={confirmId === item._id}
                      onOpenChange={(open) =>
                        setConfirmId(open ? item._id : null)
                      }
                    >
                      <AlertDialogTrigger
                        render={
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`Delete ${item.itemName}`}
                            className="text-muted-foreground hover:text-destructive"
                          />
                        }
                      >
                        <Trash2 className="size-4" />
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Delete &quot;{item.itemName}&quot;?
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
