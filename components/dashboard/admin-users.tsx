"use client"

import { Ban, CircleCheckBig, Search, Users } from "lucide-react"
import { useEffect, useState } from "react"
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

type AdminUser = {
  id: string
  name: string
  email: string
  role: string
  blocked: boolean
  plan: string
  createdAt: string
}

const ROLE_OPTIONS = [
  { value: "all", label: "All roles" },
  { value: "customer", label: "Customers" },
  { value: "vendor", label: "Vendors" },
  { value: "admin", label: "Admins" },
]

function formatDate(iso: string) {
  if (!iso) return "—"
  const date = new Date(iso)
  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
}

/** Admin → Manage Users: search, role filter, block / unblock. */
export function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState("")
  const [role, setRole] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)

  const load = () => {
    const params = new URLSearchParams()
    if (query) params.set("q", query)
    if (role) params.set("role", role)
    apiGet<{ users: AdminUser[] }>(
      `/api/admin/users?${params.toString()}`
    ).then(({ data, error: err }) => {
      setUsers(data?.users ?? null)
      setError(err)
    })
  }

  useEffect(load, [query, role])

  const toggleBlock = async (target: AdminUser) => {
    setBusyId(target.id)
    const { error: err } = await apiSend(
      `/api/admin/users/${target.id}`,
      "PATCH",
      {
        action: target.blocked ? "unblock" : "block",
      }
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
        title="Manage Users"
        subtitle="Search by name or email, filter by role, and block accounts that break the rules."
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative min-w-56 flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search name or email…"
            aria-label="Search users"
            className="pl-9"
          />
        </div>
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger className="w-40" aria-label="Filter by role">
            <SelectValue placeholder="All roles" />
          </SelectTrigger>
          <SelectContent>
            {ROLE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {error ? (
        <div className="mb-4">
          <Alert kind="error">{error}</Alert>
        </div>
      ) : null}

      {!users ? (
        <Loading label="Loading users…" />
      ) : users.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No users match"
          hint="Try a different search or role filter."
        />
      ) : (
        <TableShell minWidth={760}>
          <THead>
            <Tr>
              <Th>User</Th>
              <Th>Role</Th>
              <Th>Plan</Th>
              <Th>Joined</Th>
              <Th>Status</Th>
              <Th className="text-right">Actions</Th>
            </Tr>
          </THead>
          <TBody>
            {users.map((row) => (
              <Tr key={row.id}>
                <Td>
                  <p className="font-semibold">{row.name || "—"}</p>
                  <p className="text-xs text-muted-foreground">{row.email}</p>
                </Td>
                <Td>
                  <span className="text-[13px] text-muted-foreground capitalize">
                    {row.role}
                  </span>
                </Td>
                <Td className="font-medium capitalize">{row.plan}</Td>
                <Td className="text-[13px] text-muted-foreground">
                  {formatDate(row.createdAt)}
                </Td>
                <Td>
                  {row.blocked ? (
                    <StatusBadge status="Blocked" />
                  ) : (
                    <StatusBadge status="Active" />
                  )}
                </Td>
                <Td className="text-right">
                  <Btn
                    size="sm"
                    variant={row.blocked ? "outline" : "danger"}
                    disabled={busyId === row.id}
                    onClick={() => toggleBlock(row)}
                  >
                    {row.blocked ? (
                      <CircleCheckBig className="size-3.5" />
                    ) : (
                      <Ban className="size-3.5" />
                    )}
                    {busyId === row.id
                      ? "Working…"
                      : row.blocked
                        ? "Unblock"
                        : "Block"}
                  </Btn>
                </Td>
              </Tr>
            ))}
          </TBody>
        </TableShell>
      )}
    </>
  )
}
