import { redirect } from "next/navigation"
import { Crown, Mail, ShieldCheck, UserRound } from "lucide-react"
import { getSessionUser } from "@/lib/session"
import { PageHeader, StatusBadge } from "@/components/dashboard/ui"

export default async function SettingsPage() {
  const user = await getSessionUser()
  if (!user) redirect("/sign-in")

  return (
    <>
      <PageHeader title="Settings" subtitle="Your PizzaHub account details." />

      <div className="max-w-xl rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <span className="grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-[#f4574a] to-[#ff7d68] text-lg font-extrabold text-white">
            {(user.name || user.email).slice(0, 2).toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="truncate text-lg font-extrabold text-foreground">
              {user.name || "Signed in"}
            </p>
            <p className="flex items-center gap-1.5 truncate text-[13px] text-muted-foreground">
              <Mail className="size-3.5" />
              {user.email}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-muted/30 p-3.5">
            <p className="flex items-center gap-1.5 text-[11px] font-extrabold tracking-wider text-muted-foreground uppercase">
              <UserRound className="size-3.5" /> Role
            </p>
            <p className="mt-1.5 text-sm font-bold text-foreground capitalize">
              {user.role}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-muted/30 p-3.5">
            <p className="flex items-center gap-1.5 text-[11px] font-extrabold tracking-wider text-muted-foreground uppercase">
              <Crown className="size-3.5" /> Plan
            </p>
            <p className="mt-1.5 text-sm font-bold text-foreground capitalize">
              {user.role === "vendor" ? user.plan : "—"}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-muted/30 p-3.5">
            <p className="flex items-center gap-1.5 text-[11px] font-extrabold tracking-wider text-muted-foreground uppercase">
              <ShieldCheck className="size-3.5" /> Status
            </p>
            <div className="mt-1.5">
              {user.blocked ? (
                <StatusBadge status="Blocked" />
              ) : (
                <StatusBadge status="Active" />
              )}
            </div>
          </div>
        </div>

        <p className="mt-5 text-[12.5px] leading-snug text-muted-foreground">
          Need to change your email, password or name? Sign out and use the
          sign-in page — account credentials are managed through PizzaHub&apos;s
          secure auth flow.
        </p>

        <form
          action={async () => {
            await fetch("/api/auth/signout", { method: "POST" })
            redirect("/sign-in")
          }}
          method="post"
          className="mt-3"
        >
          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
          >
            Sign out
          </button>
        </form>
      </div>
    </>
  )
}