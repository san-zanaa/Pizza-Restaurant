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
      minPasswordLength: 6,
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
        isBlocked: {
          type: "boolean",
          defaultValue: false,
          input: false,
        },
        businessName: {
          type: "string",
          defaultValue: "",
          input: false,
        },
        subscriptionPlan: {
          type: "string",
          defaultValue: "free",
          input: false,
        },
        subscriptionExpiresAt: {
          type: "string",
          defaultValue: "",
          input: false,
        },
      },
    },

  
    databaseHooks: {
      user: {
        create: {
          before: async (data) => ({
            data: {
              ...data,
              role: data.role === "vendor" ? "vendor" : "customer",
              isBlocked: false,
              subscriptionPlan: "free",
            },
          }),
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
