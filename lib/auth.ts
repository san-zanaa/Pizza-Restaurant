import { betterAuth } from "better-auth"
import { mongodbAdapter } from "@better-auth/mongo-adapter"
import { getDb, getMongoClient } from "@/lib/db"

function createAuth() {
  const googleClientId = process.env.GOOGLE_CLIENT_ID
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET

  return betterAuth({
    baseURL: process.env.BETTER_AUTH_URL?.trim() || undefined,
    emailAndPassword: {
      enabled: true,
      
      sendResetPassword: async ({ user, url }) => {
        console.info(`[PizzaHub] Password reset link for ${user.email}: ${url}`)
      },
    },
    ...(googleClientId && googleClientSecret
      ? {
          socialProviders: {
            google: {
              clientId: googleClientId,
              clientSecret: googleClientSecret,
            },
          },
        }
      : {}),
  
    user: {
      additionalFields: {
        role: {
          type: "string",
          defaultValue: "customer",
          input: true,
        },
        blocked: {
          type: "boolean",
          defaultValue: false,
          input: false,
        },
        plan: {
          type: "string",
          defaultValue: "free",
          input: false,
        },
      },
    },
    database: mongodbAdapter(getDb(), {
      client: getMongoClient(),
    }),
  })
}

type AuthInstance = ReturnType<typeof createAuth>

let instance: AuthInstance | null = null

function getAuth(): AuthInstance {
  instance ??= createAuth()
  return instance
}

/**
 * The better-auth instance, created lazily on first use.
 *
 * `next build` imports the auth route to collect page data, and CI/build
 * environments often don't have the database env vars present — so this
 * module must never throw at import time. Missing env vars now surface as a
 * clear error on the first actual auth request instead.
 *
 * The proxy forwards every property access (including `in` checks used by
 * `toNextJsHandler`) to the real instance.
 */
export const auth: AuthInstance = new Proxy({} as AuthInstance, {
  get(_target, property) {
    const target = getAuth()
    const value = Reflect.get(target, property)
    return typeof value === "function" ? value.bind(target) : value
  },
  has(_target, property) {
    return Reflect.has(getAuth(), property)
  },
})
