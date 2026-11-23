"use client"

import { Banknote, Receipt, ShieldCheck, Store } from "lucide-react"
import { useEffect, useState } from "react"
import { apiGet } from "@/lib/client-fetch"
import {
  Alert,
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
import type { Transaction } from "@/lib/types"

function formatDate(iso: string) {
  const date = new Date(iso)
  return Number.isNaN(date.getTime())
    ? iso
    : date.toLocaleString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
}

/** Admin → Transactions: read-only ledger of verified Stripe payments. */
export function AdminTransactions() {
  const [transactions, setTransactions] = useState<Transaction[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    apiGet<{ transactions: Transaction[] }>("/api/transactions").then(
      ({ data, error: err }) => {
        setTransactions(data?.transactions ?? null)
        setError(err)
      }
    )
  }, [])

  return (
    <>
      <PageHeader
        title="Transactions"
        subtitle="Every verified Stripe payment — written by Stripe confirmations, never by hand."
      />

      {error ? (
        <div className="mb-4">
          <Alert kind="error">{error}</Alert>
        </div>
      ) : null}

      {!transactions ? (
        <Loading label="Loading payment ledger…" />
      ) : transactions.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="No transactions yet"
          hint="Once a vendor completes a Premium upgrade, the verified payment lands here."
        />
      ) : (
        <TableShell minWidth={880}>
          <THead>
            <Tr>
              <Th>Vendor</Th>
              <Th>Plan</Th>
              <Th>Amount</Th>
              <Th>Status</Th>
              <Th>Transaction date</Th>
            </Tr>
          </THead>
          <TBody>
            {transactions.map((tx) => (
              <Tr key={tx._id}>
                <Td>
                  <p className="flex items-center gap-1.5 font-semibold">
                    <Store className="size-3.5 text-muted-foreground" />
                    {tx.vendorName || "—"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {tx.vendorEmail}
                  </p>
                </Td>
                <Td className="font-medium capitalize">{tx.plan}</Td>
                <Td className="font-semibold">
                  <span className="flex items-center gap-1.5">
                    <Banknote className="size-4 text-muted-foreground" />
                    ${(tx.amount / 100).toFixed(2)}
                    <span className="text-[11px] font-medium text-muted-foreground uppercase">
                      {tx.currency}
                    </span>
                  </span>
                </Td>
                <Td>
                  <StatusBadge status={tx.status} />
                </Td>
                <Td className="text-[13px] text-muted-foreground">
                  {formatDate(tx.createdAt)}
                </Td>
              </Tr>
            ))}
          </TBody>
        </TableShell>
      )}

      <p className="mt-4 flex items-start gap-2 rounded-xl border border-border bg-card px-4 py-3 text-xs leading-snug text-muted-foreground">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-500" />
        Payment records are read-only. No admin action can edit a transaction —
        so a failed payment can never be flipped to successful — records are
        created exclusively when Stripe confirms payment.
      </p>
    </>
  )
}
