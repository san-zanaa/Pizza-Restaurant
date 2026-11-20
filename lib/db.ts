import { MongoClient, type Collection, type Db } from "mongodb"
import type { MenuItem, Order, Transaction } from "@/lib/types"

let client: MongoClient | null = null

export function getDb(): Db {
  const uri = process.env.MONGODB_URL?.trim()
  if (!uri) {
    throw new Error(
      "Missing MONGODB_URL environment variable. Set it in your local .env file and in your hosting provider's environment variables (e.g. Vercel → Project → Settings → Environment Variables)."
    )
  }
  client ??= new MongoClient(uri)
  return client.db()
}

export function menuItemsCollection(): Collection<MenuItem> {
  return getDb().collection<MenuItem>("menuItems")
}

export function ordersCollection(): Collection<Order> {
  return getDb().collection<Order>("orders")
}

export function transactionsCollection(): Collection<Transaction> {
  return getDb().collection<Transaction>("transactions")
}

export function usersCollection(): Collection {
  return getDb().collection("user")
}
