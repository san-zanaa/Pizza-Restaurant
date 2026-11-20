import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getSessionUser } from "@/lib/session"
import { jsonError, jsonOk, guardUser } from "@/lib/api"
import {
  usersCollection,
  menuItemsCollection,
  ordersCollection,
  transactionsCollection,
} from "@/lib/db"

/**
 * GET /api/overview
 * Role-dependent dashboard totals:
 * - admin: platform-wide totals
 * - vendor: this vendor's menu items + order pipeline + plan
 * - customer: this customer's order pipeline
 */
export async function GET() {
  const user = await getSessionUser()
  const gate = guardUser(user)
  if (gate) return gate
  if (!user) return jsonError("You must be signed in.", 401)

  if (user.role === "admin") {
    const [totalUsers, totalVendors, totalCustomers] = await Promise.all([
      usersCollection().countDocuments({}),
      usersCollection().countDocuments({ role: "vendor" }),
      usersCollection().countDocuments({ role: "customer" }),
    ])
    const [totalMenuItems, pendingMenuItems, totalTransactions] =
      await Promise.all([
        menuItemsCollection().countDocuments({}),
        menuItemsCollection().countDocuments({ status: "Pending" }),
        transactionsCollection().countDocuments({}),
      ])

    return jsonOk({
      totalUsers,
      totalVendors,
      totalCustomers,
      totalMenuItems,
      pendingMenuItems,
      totalTransactions,
    })
  }

  if (user.role === "vendor") {
    const [totalItems, activeItems] = await Promise.all([
      menuItemsCollection().countDocuments({ vendorId: user.id }),
      menuItemsCollection().countDocuments({
        vendorId: user.id,
        status: "Approved",
        availability: true,
      }),
    ])
    const [pendingOrders, acceptedOrders, rejectedOrders] =
      await Promise.all([
        ordersCollection().countDocuments({
          vendorId: user.id,
          status: "Pending",
        }),
        ordersCollection().countDocuments({
          vendorId: user.id,
          status: "Accepted",
        }),
        ordersCollection().countDocuments({
          vendorId: user.id,
          status: "Rejected",
        }),
      ])

    return jsonOk({
      totalItems,
      activeItems,
      pendingOrders,
      acceptedOrders,
      rejectedOrders,
      plan: user.plan,
    })
  }

  // Customer
  const [totalOrders, pendingOrders, acceptedOrders, rejectedOrders, cancelledOrders] =
    await Promise.all([
      ordersCollection().countDocuments({ customerId: user.id }),
      ordersCollection().countDocuments({
        customerId: user.id,
        status: "Pending",
      }),
      ordersCollection().countDocuments({
        customerId: user.id,
        status: "Accepted",
      }),
      ordersCollection().countDocuments({
        customerId: user.id,
        status: "Rejected",
      }),
      ordersCollection().countDocuments({
        customerId: user.id,
        status: "Cancelled",
      }),
    ])

  return jsonOk({
    totalOrders,
    pendingOrders,
    acceptedOrders,
    rejectedOrders,
    cancelledOrders,
  })
}
