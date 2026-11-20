"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Menu } from "@base-ui/react/menu"
import {
  Bell,
  ChevronDown,
  ClipboardList,
  LayoutDashboard,
  Menu as MenuIcon,
  Settings,
  ShoppingCart,
  UserRound,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Btn } from "@/components/dashboard/ui"

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Browse Menu" },
] as const

const DASHBOARD_LINKS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/orders", label: "Orders", icon: ClipboardList },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
] as const

const ACTIVE_PILL =
  "bg-gradient-to-r from-[#f4574a] to-[#ff7d68] text-white shadow-[0_4px_14px_rgba(244,87,74,0.35)]"

const IDLE_LINK = "text-muted-foreground hover:text-foreground"

function isActivePath(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href)
}

function NavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
        active ? ACTIVE_PILL : IDLE_LINK
      )}
    >
      {label}
    </Link>
  )
}

function DashboardMenu({ active }: { active: boolean }) {
  const router = useRouter()

  return (
    <Menu.Root>
      <Menu.Trigger
        className={cn(
          "group inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-transparent px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
          active ? ACTIVE_PILL : IDLE_LINK
        )}
      >
        Dashboard
        <ChevronDown className="size-3.5 transition-transform group-data-[popup-open]:rotate-180" />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner sideOffset={8} className="z-50">
          <Menu.Popup className="min-w-48 rounded-xl border border-border bg-popover p-1.5 text-popover-foreground shadow-xl">
            {DASHBOARD_LINKS.map(({ href, label, icon: Icon }) => (
              <Menu.Item
                key={href}
                onClick={() => router.push(href)}
                className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm outline-none transition-colors select-none data-[highlighted]:bg-muted data-[highlighted]:text-foreground"
              >
                <Icon className="size-4 text-muted-foreground" />
                {label}
              </Menu.Item>
            ))}
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  )
}

function MobileMenu() {
  const router = useRouter()

  return (
    <Menu.Root>
      <Menu.Trigger
        aria-label="Open menu"
        className="inline-flex size-9 cursor-pointer items-center justify-center rounded-full border border-border/60 bg-muted/40 text-foreground transition-colors outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 data-[popup-open]:bg-muted"
      >
        <MenuIcon className="size-5" />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner sideOffset={8} align="end" className="z-50">
          <Menu.Popup className="min-w-48 rounded-xl border border-border bg-popover p-1.5 text-popover-foreground shadow-xl">
            {NAV_LINKS.map(({ href, label }) => (
              <Menu.Item
                key={href}
                onClick={() => router.push(href)}
                className="cursor-pointer rounded-lg px-3 py-2 text-sm outline-none transition-colors select-none data-[highlighted]:bg-muted data-[highlighted]:text-foreground"
              >
                {label}
              </Menu.Item>
            ))}
            <Menu.Separator className="my-1 h-px bg-border" />
            {DASHBOARD_LINKS.map(({ href, label, icon: Icon }) => (
              <Menu.Item
                key={href}
                onClick={() => router.push(href)}
                className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm outline-none transition-colors select-none data-[highlighted]:bg-muted data-[highlighted]:text-foreground"
              >
                <Icon className="size-4 text-muted-foreground" />
                {label}
              </Menu.Item>
            ))}
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  )
}

export function Navbar({ user }: { user?: { name: string; email: string; role: string } }) {
  const pathname = usePathname()
  const router = useRouter()

  const signoutAndRedirect = async () => {
    try {
      await fetch("/api/auth/signout", { method: "POST" })
    } catch {
      // ignore errors
    }
    router.push("/sign-in")
  }

  const signInLink = (
    <Link
      href="/sign-in"
      className="inline-flex h-9 items-center justify-center rounded-full bg-gradient-to-r from-[#f4574a] to-[#ff7d68] px-5 text-sm font-semibold whitespace-nowrap text-white shadow-[0_4px_14px_rgba(244,87,74,0.35)] transition hover:brightness-110 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
    >
      Sign In
    </Link>
  )

  const userMenu = (
    <div className="relative">
      <Btn
        variant="ghost"
        size="sm"
        aria-label="User menu"
        className="rounded-full p-1"
      >
        <UserRound className="size-4" />
      </Btn>
      <Menu.Root>
        <Menu.Trigger className="flex items-center gap-2">
          <span className="font-medium text-foreground">
            {user?.name || "User"}
          </span>
          <Bell className="size-3 text-primary" />
        </Menu.Trigger>
        <Menu.Portal>
          <Menu.Positioner sideOffset={8} className="z-50">
            <Menu.Popup className="min-w-48 rounded-xl border border-border bg-popover p-1.5 text-popover-foreground shadow-xl">
              <Menu.Item onClick={() => router.push("/dashboard/settings")}>
                <UserRound className="size-3.5 mr-2" />
                Settings
              </Menu.Item>
              <Menu.Item onClick={() => router.push("/dashboard/orders")}>
                <ClipboardList className="size-3.5 mr-2" />
                Orders
              </Menu.Item>
              <Menu.Item onClick={() => signoutAndRedirect()}>
                <Image
                  src="/assets/logo.png"
                  alt="PizzaHub"
                  width={1536}
                  height={1024}
                  className="h-5 w-auto mr-2"
                />
                Logout
              </Menu.Item>
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>
    </div>
  )

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto grid h-16 max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 sm:px-6">
        <Link
          href="/"
          className="justify-self-start focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          aria-label="PizzaHub home"
        >
          <Image
            src="/assets/logo.png"
            alt="PizzaHub"
            width={1536}
            height={1024}
            priority
            className="h-10 w-auto rounded-lg sm:h-12"
          />
        </Link>

        <nav
          aria-label="Main"
          className="hidden items-center gap-1 rounded-full border border-border/60 bg-muted/40 p-1.5 md:flex"
        >
          {NAV_LINKS.map(({ href, label }) => (
            <NavLink key={href} href={href} label={label} active={isActivePath(pathname, href)} />
          ))}
          <DashboardMenu active={isActivePath(pathname, "/dashboard")} />
        </nav>

        <div className="flex items-center justify-end gap-2">
          <Link
            href="/cart"
            aria-label="Cart"
            className="inline-flex size-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <ShoppingCart className="size-5" />
            {/* Show notification badge when there are pending orders */}
            {true && (
              <span className="absolute -top-0.5 -right-0.5 size-3.5 rounded-full bg-primary text-white text-[10px] font-bold">
                3
              </span>
            )}
          </Link>

          {user ? (
            userMenu
          ) : (
            signInLink
          )}
          <div className="md:hidden">
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  )
}