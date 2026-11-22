import { MongoClient, type Collection, type Db } from "mongodb"
import type { MenuItem, Order, Transaction } from "@/lib/types"

type MongoHandle = { client: MongoClient; dbName: string }

let handle: MongoHandle | null = null

function resolveDbName(uri: string): string {
  const fromUri = uri
    .match(/mongodb(?:\+srv)?:\/\/[^/?#]*\/([^/?#]*)/i)?.[1]
    ?.trim()
  return process.env.MONGODB_DB_NAME?.trim() || fromUri || "pizzahub"
}

function getMongo(): MongoHandle {
  const uri = process.env.MONGODB_URL?.trim()
  if (!uri) {
    throw new Error(
      "Missing MONGODB_URL environment variable. Set it in your local .env file and in your hosting provider's environment variables (e.g. Vercel → Project → Settings → Environment Variables)."
    )
  }
  handle ??= { client: new MongoClient(uri), dbName: resolveDbName(uri) }
  return handle
}

export function getMongoClient(): MongoClient {
  return getMongo().client
}

export function getDb(): Db {
  const { client, dbName } = getMongo()
  return client.db(dbName)
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
