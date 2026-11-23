import { SignJWT } from "jose"
import type { AppUser } from "@/lib/types"


export const TOKEN_TTL_SECONDS = 15 * 60

export function jwtSecret(): Uint8Array {
  const secret =
    process.env.JWT_SECRET?.trim() || process.env.BETTER_AUTH_SECRET?.trim()
  if (!secret) {
    throw new Error(
      "Missing JWT_SECRET (or BETTER_AUTH_SECRET) in .env — it must match assignment-9-server/.env."
    )
  }
  return new TextEncoder().encode(secret)
}

export async function signAppJwt(user: AppUser): Promise<string> {
  return await new SignJWT({
    name: user.name,
    email: user.email,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setIssuer("pizzahub-web")
    .setAudience("pizzahub-api")
    .setExpirationTime(`${TOKEN_TTL_SECONDS}s`)
    .sign(jwtSecret())
}
