"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  ClipboardList,
  Crown,
  LayoutDashboard,
  LogOut,
  Menu as MenuIcon,
  Pizza,
  Plus,
  Receipt,
  Settings,
  Store,
  Users,
  UtensilsCrossed,
  X,
} from "lucide-react"
import { useState } from "react"
import { authClient } from "@/lib/auth-client"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import type { AppUser } from "@/lib/types"

type NavItem = {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

const VENDOR_NAV: NavItem[] = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/menu/new", label: "Add Menu Item", icon: Plus },
  { href: "/dashboard/menu", label: "My Menu Items", icon: UtensilsCrossed },
  { href: "/dashboard/orders", label: "Customer Orders", icon: ClipboardList },
  { href: "/dashboard/subscription", label: "Subscription", icon: Crown },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
]

const CUSTOMER_NAV: NavItem[] = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/orders", label: "My Orders", icon: ClipboardList },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
]

const ADMIN_NAV: NavItem[] = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/users", label: "Manage Users", icon: Users },
  { href: "/dashboard/menu-items", label: "Manage Menu Items", icon: Pizza },
  { href: "/dashboard/transactions", label: "Transactions", icon: Receipt },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
]

const ROLE_LABEL: Record<AppUser["role"], string> = {
  vendor: "Vendor Dashboard",
  customer: "Customer Dashboard",
  admin: "Admin Dashboard",
}

function navFor(role: AppUser["role"]): NavItem[] {
  if (role === "vendor") return VENDOR_NAV
  if (role === "admin") return ADMIN_NAV
  return CUSTOMER_NAV
}

function isActive(pathname: string, href: string) {
  return href === "/dashboard"
    ? pathname === "/dashboard"
    : pathname.startsWith(href)
}

function NavLinks({
  nav,
  pathname,
  onNavigate,
}: {
  nav: NavItem[]
  pathname: string
  onNavigate?: () => void
}) {
  return (
    <nav className="flex flex-col gap-1" aria-label="Dashboard">
      {nav.map(({ href, label, icon: Icon }) => {
        const active = isActive(pathname, href)
        return (
          <Button
            key={href}
            variant="ghost"
            render={<Link href={href} onClick={onNavigate} />}
            aria-current={active ? "page" : undefined}
            className={cn(
              "w-full justify-start gap-3 font-medium",
              active
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="size-4 shrink-0" />
            {label}
          </Button>
        )
      })}
    </nav>
  )
}

function SidebarBody({
  user,
  pathname,
  onNavigate,
}: {
  user: AppUser
  pathname: string
  onNavigate?: () => void
}) {
  const router = useRouter()
  const nav = navFor(user.role)

  const signOut = async () => {
    await authClient.signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <div className="flex h-full flex-col gap-5">
      {/* Brand */}
      <div className="flex items-center gap-3 px-1">
        <Link
          href="/"
          aria-label="PizzaHub home"
          className="rounded-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <Image
            src="/assets/logo.png"
            alt="PizzaHub"
            width={1536}
            height={1024}
            className="h-9 w-auto"
          />
        </Link>
        <Badge variant="secondary" className="h-5 px-2 text-[10px]">
          {ROLE_LABEL[user.role]}
        </Badge>
      </div>

      <Separator />

      <NavLinks nav={nav} pathname={pathname} onNavigate={onNavigate} />

      {/* Plan highlight for vendors */}
      {user.role === "vendor" ? (
        <Card className="gap-3 border-primary/20 bg-primary/5 p-4">
          <div className="flex items-center gap-2">
            <Crown className="size-4 text-primary" />
            <p className="text-xs font-semibold tracking-wide text-foreground uppercase">
              {user.plan === "premium" ? "Premium plan" : "Free plan"}
            </p>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {user.plan === "premium"
              ? "Unlimited active items, badge & featured placement."
              : "Max 3 active items. Upgrade for unlimited reach."}
          </p>
          {user.plan !== "premium" ? (
            <Button
              size="sm"
              render={<Link href="/dashboard/subscription" onClick={onNavigate} />}
              className="w-full"
            >
              <Crown className="size-3.5" />
              Upgrade to Premium
            </Button>
          ) : null}
        </Card>
      ) : null}

      {/* User footer */}
      <div className="mt-auto flex flex-col gap-3 pt-2">
        <Card className="flex items-center gap-3 p-3">
          <Avatar size="sm">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
              {(user.name || user.email).slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold text-foreground">
              {user.name || "Signed in"}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {user.email}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={signOut}
            aria-label="Sign out"
          >
            <LogOut className="size-4" />
          </Button>
        </Card>
        <Link
          href="/"
          className="flex items-center justify-center gap-1.5 text-xs font-medium text-muted-foreground transition hover:text-foreground"
        >
          <Store className="size-3.5" />
          Back to storefront
        </Link>
      </div>
    </div>
  )
}

/**
 * Role-based dashboard chrome: persistent sidebar on desktop, slide-over
 * drawer (opened from the dashboard top bar) on mobile.
 */
export function DashboardChrome({
  user,
  children,
}: {
  user: AppUser
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <div className="mx-auto flex max-w-[1440px] items-start gap-6 px-4 py-6 sm:px-6 lg:px-8">
      {/* Desktop sidebar */}
      <aside className="sticky top-24 hidden w-64 shrink-0 self-start rounded-xl border border-border bg-card p-4 shadow-sm lg:block">
        <SidebarBody user={user} pathname={pathname} />
      </aside>

      {/* Mobile top bar */}
      <div className="sticky top-20 z-40 -mx-4 mb-4 flex w-full items-center justify-between border-b border-border bg-background/85 px-4 py-2.5 backdrop-blur-xl lg:hidden">
        <span className="text-[13px] font-bold tracking-wide text-foreground uppercase">
          {ROLE_LABEL[user.role]}
        </span>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setOpen(true)}
          aria-label="Open dashboard menu"
          aria-expanded={open}
        >
          <MenuIcon className="size-5" />
        </Button>
      </div>

      {/* Mobile drawer */}
      {open ? (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
        >
          <div
            aria-hidden="true"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <div className="absolute inset-y-0 left-0 w-[300px] max-w-[85vw] overflow-y-auto border-r border-border bg-background p-4 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[13px] font-bold tracking-wide text-foreground uppercase">
                {ROLE_LABEL[user.role]}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
                aria-label="Close dashboard menu"
              >
                <X className="size-5" />
              </Button>
            </div>
            <SidebarBody
              user={user}
              pathname={pathname}
              onNavigate={() => setOpen(false)}
            />
          </div>
        </div>
      ) : null}

      {/* Main content area */}
      <main className="min-w-0 flex-1 pb-16">{children}</main>
    </div>
  )
}
