
export type Role = "customer" | "vendor" | "admin"
export type Plan = "free" | "premium"

export type MenuStatus = "pending" | "approved" | "rejected" | "inactive"
export type OrderStatus = "pending" | "accepted" | "rejected" | "cancelled"
export type TransactionStatus = "paid" | "failed" | "pending"

export interface AppUser {
  id: string
  name: string
  email: string
  image?: string | null
  role: Role
  blocked: boolean
  plan: Plan
}

export interface MenuItem {
  _id: string
  id: string
  itemName: string
  category: string
  description: string
  price: number
  location: string
  images: string[]
  vendorId: string
  vendorName: string
  status: MenuStatus
  createdAt?: string
  updatedAt?: string
}

export interface Order {
  _id: string
  itemId: string
  itemName: string
  itemImage: string
  itemPrice: number
  vendorId: string
  vendorName: string
  customerId: string
  customerName: string
  customerEmail: string
  deliveryDate: string
  deliveryAddress: string
  message: string
  status: OrderStatus
  createdAt: string
  updatedAt: string
}

export interface Transaction {
  _id: string
  vendorId: string
  vendorName: string
  vendorEmail?: string
  plan: "premium"
  amount: number
  currency: string
  status: TransactionStatus
  stripeSessionId: string
  stripePaymentIntentId?: string | null
  expiresAt?: string
  createdAt: string
}

export interface AdminUser {
  _id: string
  id: string
  name: string
  email: string
  image?: string | null
  role: Role
  blocked: boolean
  plan: Plan
  businessName?: string
  subscriptionExpiresAt?: string | null
  createdAt?: string | null
}

export const MENU_CATEGORIES = [
  "Classic Pizzas",
  "Vegetarian Pizzas",
  "Meat Lovers",
  "Specialty / Gourmet Pizzas",
  "Sides & Appetizers",
  "Beverages & Desserts",
] as const

export const MENU_STATUSES: MenuStatus[] = [
  "pending",
  "approved",
  "rejected",
  "inactive",
]

export const ORDER_STATUSES: OrderStatus[] = [
  "pending",
  "accepted",
  "rejected",
  "cancelled",
]

export const USER_ROLES: Role[] = ["customer", "vendor", "admin"]

export function primaryImage(item: Pick<MenuItem, "images">): string {
  return item.images?.[0] ?? ""
}

export const FREE_PLAN_ACTIVE_LIMIT = 3
export const PREMIUM_PRICE_CENTS = 2900
