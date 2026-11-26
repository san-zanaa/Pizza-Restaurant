
"use client"

import Image from "next/image"
import Link from "next/link"
import { useLayoutEffect, useRef, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { toast } from "react-toastify"
import {
  ArrowUpDown,
  Check,
  LayoutDashboard,
  LogOut,
  Menu as MenuIcon,
  Settings,
  ShoppingCart,
} from "lucide-react"
import { Menu } from "@base-ui/react/menu"
import { cn } from "@/lib/utils"
import { authClient } from "@/lib/auth-client"
import { clearAuthToken } from "@/lib/client-fetch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { AppUser, Role } from "@/lib/types"

function toAppUser(raw: unknown): AppUser | null {
  const user = (raw ?? null) as Record<string, unknown> | null
  if (!user || typeof user.id !== "string") return null
  return {
    id: user.id,
    name: typeof user.name === "string" ? user.name : "",
    email: typeof user.email === "string" ? user.email : "",
    image: typeof user.image === "string" ? user.image : null,
    role: user.role === "vendor" || user.role === "admin" ? user.role : "customer",
    blocked: user.isBlocked === true || user.blocked === true,
    plan: user.subscriptionPlan === "premium" ? "premium" : "free",
  }
}

type NavLink = { href: string; label: string }

const PUBLIC_NAV: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Browse Menu" },
]

const ROLE_NAV: Record<Role, NavLink[]> = {
  vendor: [
    { href: "/dashboard", label: "Dashboard" },
  ],
  customer: [{ href: "/dashboard", label: "Dashboard" }],
  admin: [{ href: "/dashboard", label: "Dashboard" }],
}

const LOGIN_LINKS: NavLink[] = [
  { href: "/sign-in", label: "Sign In" },
  { href: "/sign-up", label: "Sign Up" },
]

const PROFILE_LINKS: NavLink[] = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/settings", label: "Profile Settings" },
]

const ACTIVE_PILL =
  "bg-gradient-to-r from-[#f4574a] to-[#ff7d68] text-white shadow-[0_4px_14px_rgba(244,87,74,0.35)]"

const IDLE_LINK = "text-muted-foreground hover:text-foreground"

function isActivePath(pathname: string, href: string) {
  return href === "/"
    ? pathname === "/"
    : pathname === href || pathname.startsWith(`${href}/`)
}

function ProfileMenu({ user, pathname }: { user: AppUser; pathname: string }) {
  const router = useRouter()
  const active = PROFILE_LINKS.find((item) => isActivePath(pathname, item.href))

  const signOut = async () => {
    clearAuthToken()
    await authClient.signOut()
    toast.info("You've been signed out.")
    router.push("/")
    router.refresh()
  }

  return (
    <Menu.Root>
      <Menu.Trigger
        aria-label="Open profile menu"
        className="group flex items-center gap-1.5 rounded-full border border-border/70 bg-muted/40 p-1 pl-3 text-sm outline-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50">
        <Avatar size="sm">
          <AvatarImage src={user.image ?? ""} alt={user.name} />
          <AvatarFallback className="bg-gradient-to-br from-[#f4574a] to-[#ff9e2c] text-xs font-bold text-white">
            {(user.name || "U").slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <span className="max-w-24 truncate text-[13px] font-medium text-foreground">
          {user.name || "User"}
        </span>
        <ArrowUpDown
          className="size-3.5 text-muted-foreground transition-transform group-data-[popup-open]:rotate-180"
        />
      </Menu.Trigger>

      <Menu.Portal>
        <Menu.Positioner sideOffset={10} align="end" className="z-50">
          <Menu.Popup className="min-w-56 rounded-2xl border border-border bg-popover p-1.5 text-popover-foreground shadow-xl">
            <Menu.Item
              render={<Link href="/dashboard" />}
              className={cn(
                "cursor-pointer rounded-lg px-3 py-2 text-sm outline-none transition-colors select-none data-[highlighted]:bg-muted data-[highlighted]:text-foreground",
                active?.href === "/dashboard" &&
                "bg-[#f4574a]/10 text-[#f4574a] data-[highlighted]:bg-[#f4574a]/15 data-[highlighted]:text-[#f4574a]"
              )}>
              <span className="inline-flex items-center gap-2">
                <LayoutDashboard className="size-4" />
                Dashboard
                {active?.href === "/dashboard" ? <Check className="ml-auto size-3.5" /> : null}
              </span>
            </Menu.Item>
            <Menu.Item
              render={<Link href="/dashboard/settings" />}
              className={cn(
                "cursor-pointer rounded-lg px-3 py-2 text-sm outline-none transition-colors select-none data-[highlighted]:bg-muted data-[highlighted]:text-foreground",
                active?.href === "/dashboard/settings" &&
                "bg-[#f4574a]/10 text-[#f4574a] data-[highlighted]:bg-[#f4574a]/15 data-[highlighted]:text-[#f4574a]"
              )}>
              <span className="inline-flex items-center gap-2">
                <Settings className="size-4" />
                Profile Settings
                {active?.href === "/dashboard/settings" ? <Check className="ml-auto size-3.5" /> : null}
              </span>
            </Menu.Item>
            <Menu.Separator className="mx-3 my-1 h-px bg-border" />
            <Menu.Item
              onClick={signOut}
              className="cursor-pointer rounded-lg px-3 py-2 text-sm text-rose-600 outline-none transition-colors select-none data-[highlighted]:bg-muted data-[highlighted]:text-rose-700">
              <span className="inline-flex items-center gap-2">
                <LogOut className="size-4" />
                Logout
              </span>
            </Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  )
}

function DrawerAvatar({ user }: { user: AppUser }) {
  return (
    <Avatar size="sm">
      <AvatarImage src={user.image ?? ""} alt={user.name} />
      <AvatarFallback className="bg-gradient-to-br from-[#f4574a] to-[#ff9e2c] text-xs font-bold text-white">
        {(user.name || "U").slice(0, 2).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  )
}

function DesktopNav({ links, pathname }: { links: NavLink[]; pathname: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const activeIndex = links.findIndex(({ href }) => isActivePath(pathname, href))
  const [pill, setPill] = useState({ left: 0, width: 0, ready: false })

  useLayoutEffect(() => {
    const update = () => {
      const container = containerRef.current
      const el = activeIndex >= 0 ? linkRefs.current[activeIndex] : null
      if (!container || !el) {
        setPill((p) => ({ ...p, ready: false }))
        return
      }
      const cRect = container.getBoundingClientRect()
      const eRect = el.getBoundingClientRect()
      setPill({ left: eRect.left - cRect.left, width: eRect.width, ready: true })
    }
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [activeIndex, links])

  return (
    <div
      ref={containerRef}
      className="relative flex items-center gap-1 rounded-full border border-border/60 bg-muted/40 p-1.5">
      {pill.ready ? (
        <span
          aria-hidden="true"
          className="absolute top-1.5 bottom-1.5 rounded-full bg-gradient-to-r from-[#f4574a] to-[#ff7d68] shadow-[0_4px_14px_rgba(244,87,74,0.35)] transition-all duration-300 ease-out"
          style={{ left: pill.left, width: pill.width }}
        />
      ) : null}
      {links.map(({ href, label }, i) => {
        const active = isActivePath(pathname, href)
        return (
          <Link
            key={href}
            href={href}
            ref={(el) => {
              linkRefs.current[i] = el
            }}
            className={cn(
              "relative z-10 inline-flex items-center rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
              active ? "text-white" : "text-muted-foreground hover:text-foreground"
            )}>
            {label}
          </Link>
        )
      })}
    </div>
  )
}

function MobileMenu({
  user,
  pathname,
}: {
  user: AppUser | null
  pathname: string
}) {
  const router = useRouter()

  const visit = (href: string) => router.push(href)
  const linkClass =
    "cursor-pointer rounded-lg px-3 py-2 text-sm outline-none transition-colors select-none data-[highlighted]:bg-muted data-[highlighted]:text-foreground"

  const menuLinks = (
    <>
      {PUBLIC_NAV.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          onClick={() => visit(href)}
          className={cn(linkClass, isActivePath(pathname, href) && "bg-[#f4574a]/10 font-semibold text-[#f4574a]")}>
          {label}
        </Link>
      ))}
      {user ? null : LOGIN_LINKS.map(({ href, label }) => (
        <Menu.Item key={href} render={<Link href={href} />} className={linkClass}>
          {label}
        </Menu.Item>
      ))}
    </>
  )

  return (
    <Menu.Root>
      <Menu.Trigger
        aria-label="Open menu"
        className="inline-flex size-9 cursor-pointer items-center justify-center rounded-full border border-border/60 bg-muted/40 text-foreground transition-colors outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 data-[popup-open]:bg-muted">
        <MenuIcon className="size-5" />
      </Menu.Trigger>

      <Menu.Portal>
        <Menu.Positioner sideOffset={8} align="end" className="z-50">
          <Menu.Popup className="min-w-52 rounded-2xl border border-border bg-popover p-1.5 text-popover-foreground shadow-xl">
            {menuLinks}

            {user ? (
              <>
                <Menu.Separator className="my-1 h-px bg-border" />
                <div className="flex items-center gap-2.5 px-3 py-3">
                  <DrawerAvatar user={user} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {user.name || "User"}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <Link
                  href="/dashboard"
                  onClick={() => visit("/dashboard")}
                  className={cn(
                    linkClass,
                    isActivePath(pathname, "/dashboard") &&
                    "bg-[#f4574a]/10 font-semibold text-[#f4574a]"
                  )}>
                  Dashboard
                </Link>
                {ROLE_NAV[user.role].map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => visit(href)}
                    className={cn(linkClass, isActivePath(pathname, href) && "bg-[#f4574a]/10 font-semibold text-[#f4574a]")}>
                    {label}
                  </Link>
                ))}
                <Link
                  href="/dashboard/settings"
                  onClick={() => visit("/dashboard/settings")}
                  className="inline-flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none">
                  <Settings className="size-4" />
                  Profile Settings
                </Link>
                <Menu.Separator className="my-1 h-px bg-border" />
                <Menu.Item
                  onClick={async () => {
                    clearAuthToken()
                    await authClient.signOut()
                    toast.info("You've been signed out.")
                    router.push("/")
                    router.refresh()
                  }}
                  className={cn(linkClass, "text-rose-600 data-[highlighted]:bg-rose-500/10 data-[highlighted]:text-rose-600")}>
                  <span className="inline-flex items-center gap-2">
                    <LogOut className="size-4" />
                    Logout
                  </span>
                </Menu.Item>
              </>
            ) : null}
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  )
}

export function Navbar() {
  const pathname = usePathname()
  const { data: session } = authClient.useSession()
  const user = toAppUser(session?.user)

  const authed = user && !user.blocked ? user : null

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto grid h-16 max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 justify-self-start focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          aria-label="PizzaHub home">
          <Image
            src="/assets/logo.png"
            alt="PizzaHub"
            width={1536}
            height={1024}
            priority
            className="h-10 w-auto rounded-lg sm:h-12"
          />
          <span className="text-[13px] font-extrabold tracking-wide text-[#e63329] dark:text-[#ff8a5c]">
            PizzaHub
          </span>
        </Link>

        <nav aria-label="Main" className="hidden md:block">
          <DesktopNav
            links={[...PUBLIC_NAV, ...(authed ? ROLE_NAV[authed.role] : [])]}
            pathname={pathname}
          />
        </nav>

        <div className="flex items-center justify-end gap-2">
          <Link
            href="/cart"
            aria-label="Cart"
            className="relative inline-flex size-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <ShoppingCart className="size-5" />

            <span className="absolute -top-0.5 -right-0.5 flex size-3.5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
              3
            </span>
          </Link>

          {authed ? (
            <ProfileMenu user={authed} pathname={pathname} />
          ) : (
            <Link
              href="/sign-in"
              className="inline-flex h-9 items-center justify-center rounded-full bg-gradient-to-r from-[#f4574a] to-[#ff7d68] px-5 text-sm font-semibold whitespace-nowrap text-white shadow-[0_4px_14px_rgba(244,87,74,0.35)] transition hover:brightness-110 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              Sign In
            </Link>
          )}
          <div className="md:hidden">
            <MobileMenu user={authed} pathname={pathname} />
          </div>
        </div>
      </div>
    </header>
  )
}
