"use client"

import {
  BadgeCheck,
  Check,
  CircleX,
  ListFilter,
  Pizza,
  Search,
  Trash2,
} from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { apiGet, apiSend } from "@/lib/client-fetch"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import { MENU_CATEGORIES, MENU_STATUSES, primaryImage, type MenuItem } from "@/lib/types"

/** Admin → Manage Menu Items: search, filter, review, status changes, delete. */
export function AdminMenuItems() {
  const [items, setItems] = useState<MenuItem[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState("all")
  const [category, setCategory] = useState("all")
  const [busyId, setBusyId] = useState<string | null>(null)
  const [confirmId, setConfirmId] = useState<string | null>(null)

  const load = () => {
    const params = new URLSearchParams({ scope: "admin" })
    if (query) params.set("q", query)
    if (status !== "all") params.set("status", status)
    if (category !== "all") params.set("category", category)
    apiGet<{ items: MenuItem[] }>(`/api/menu?${params.toString()}`).then(
      ({ data, error: err }) => {
        setItems(data?.items ?? null)
        setError(err)
      }
    )
  }

  useEffect(load, [query, status, category])

  const setStatusOf = async (item: MenuItem, next: MenuItem["status"]) => {
    setBusyId(item._id)
    const { error: err } = await apiSend<{ item: MenuItem }>(
      `/api/menu/${item._id}`,
      "PATCH",
      {
        status: next,
      }
    )
    setBusyId(null)
    if (err) {
      setError(err)
      toast.error(err)
      return
    }
    setError(null)
    toast.success(`"${item.itemName}" is now ${next}.`)
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
        title="Manage Menu Items"
        subtitle="Review pending submissions, approve or reject them, and curate what's live."
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative min-w-56 flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search item name…"
            aria-label="Search menu items"
            className="pl-9"
          />
        </div>
        <Select value={status} onValueChange={(value) => setStatus(value!)}>
          <SelectTrigger className="w-36" aria-label="Filter by status">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {MENU_STATUSES.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={category} onValueChange={(value) => setCategory(value!)}>
          <SelectTrigger className="w-36" aria-label="Filter by category">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {MENU_CATEGORIES.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <ListFilter className="size-4" />
          {items ? `${items.length} item${items.length === 1 ? "" : "s"}` : ""}
        </span>
      </div>

      {error ? (
        <div className="mb-4">
          <Alert kind="error">{error}</Alert>
        </div>
      ) : null}

      {!items ? (
        <Loading label="Loading menu items…" />
      ) : items.length === 0 ? (
        <EmptyState
          icon={Pizza}
          title="No items match"
          hint="Try clearing the filters or search."
        />
      ) : (
        <TableShell minWidth={1020}>
          <THead>
            <Tr>
              <Th>Item</Th>
              <Th>Vendor</Th>
              <Th>Category</Th>
              <Th>Price</Th>
              <Th>Status</Th>
              <Th>Live?</Th>
              <Th className="text-right">Review</Th>
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
                        {item.vendorName}
                      </p>
                    </div>
                  </div>
                </Td>
                <Td className="text-[13px] font-medium">{item.vendorName}</Td>
                <Td>
                  <span className="text-[13px] text-muted-foreground">
                    {item.category}
                  </span>
                </Td>
                <Td className="font-semibold">৳{item.price.toFixed(0)}</Td>
                <Td>
                  <StatusBadge status={item.status ?? ""} />
                </Td>
                <Td>
                  {item.status === "approved" ? (
                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      Live
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-muted-foreground">
                      Hidden
                    </span>
                  )}
                </Td>
                <Td className="text-right">
                  <div className="inline-flex items-center justify-end gap-1.5">
                    {item.status === "pending" ? (
                      <>
                        <Btn
                          size="sm"
                          onClick={() => setStatusOf(item, "approved")}
                          disabled={busyId === item._id}
                        >
                          <Check className="size-3.5" />
                          Approve
                        </Btn>
                        <Btn
                          size="sm"
                          variant="danger"
                          onClick={() => setStatusOf(item, "rejected")}
                          disabled={busyId === item._id}
                        >
                          <CircleX className="size-3.5" />
                          Reject
                        </Btn>
                      </>
                    ) : item.status === "approved" ? (
                      <Btn
                        size="sm"
                        variant="danger"
                        onClick={() => setStatusOf(item, "rejected")}
                        disabled={busyId === item._id}
                      >
                        <CircleX className="size-3.5" />
                        Unpublish
                      </Btn>
                    ) : (
                      <Btn
                        size="sm"
                        variant="outline"
                        onClick={() => setStatusOf(item, "approved")}
                        disabled={busyId === item._id}
                      >
                        <BadgeCheck className="size-3.5" />
                        Reinstate
                      </Btn>
                    )}
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
                            This permanently removes the item for{" "}
                            {item.vendorName}. This can&apos;t be undone.
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

      <p className="mt-4 text-xs text-muted-foreground">
        Only <strong>Approved + Active</strong> items are shown on the public
        Browse Menu — rejected or inactive items stay hidden from customers.
      </p>
    </>
  )
}
