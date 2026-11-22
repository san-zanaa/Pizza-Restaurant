export type Role = "customer" | "vendor" | "admin"
export type Plan = "free" | "premium"
export type MenuStatus = "Pending" | "Approved" | "Rejected"
export type OrderStatus = "Pending" | "Accepted" | "Rejected" | "Cancelled"
export type TransactionStatus = "pending" | "paid" | "failed"

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
  name: string
  category: string
  description: string
  price: number
  location: string
  imageUrl: string
  imageDeleteUrl?: string
  vendorId: string
  vendorName: string
  status: MenuStatus
  availability: boolean
  createdAt: string
  updatedAt: string
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
  vendorEmail: string
  plan: "premium"
  amount: number
  currency: string
  status: TransactionStatus
  stripeSessionId: string
  createdAt: string
}

export const MENU_CATEGORIES = [
  "Classic Pizzas",
  "Vegetarian Pizzas",
  "Meat Lovers",
  "Specialty / Gourmet Pizzas",
  "Sides & Appetizers",
  "Beverages & Desserts",
] as const

export const MENU_STATUSES: MenuStatus[] = ["Pending", "Approved", "Rejected"]
export const ORDER_STATUSES: OrderStatus[] = [
  "Pending",
  "Accepted",
  "Rejected",
  "Cancelled",
]

export const FREE_PLAN_ACTIVE_LIMIT = 3

export const PREMIUM_PRICE_CENTS = 2900
