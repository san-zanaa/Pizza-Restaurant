import { redirect } from "next/navigation"
import { getSessionUser } from "@/lib/session"
import { DashboardChrome } from "@/components/dashboard/sidebar"
import { Alert } from "@/components/dashboard/ui"

export const metadata = { title: "Dashboard · PizzaHub" }

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getSessionUser()
  if (!user) redirect("/sign-in")

  return (
    <div className="min-h-[calc(100svh-4rem)] bg-muted/25">
      {user.blocked ? (
        <div className="border-b border-rose-500/30 bg-rose-500/10">
          <div className="mx-auto max-w-[1440px] px-4 py-3 sm:px-6 lg:px-8">
            <Alert kind="error">
              Your account has been blocked by an administrator, so protected
              actions (ordering, publishing, upgrading, …) are disabled. Contact
              support to restore access.
            </Alert>
          </div>
        </div>
      ) : null}
      <DashboardChrome user={user}>{children}</DashboardChrome>
    </div>
  )
}
