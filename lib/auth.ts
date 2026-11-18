import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const mongoUri = process.env.MONGODB_URL;
if (!mongoUri) {
  throw new Error("Missing MONGODB_URL environment variable");
}

const client = new MongoClient(mongoUri);
const db = client.db();

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL?.trim() || undefined,
    emailAndPassword: { 
    enabled: true, 
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
  database: mongodbAdapter(db, {
    client,
  }),
});