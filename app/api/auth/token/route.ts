import { NextResponse } from "next/server"
import { getSessionUser } from "@/lib/session"
import { signAppJwt, TOKEN_TTL_SECONDS } from "@/lib/jwt"

export async function GET() {
  const user = await getSessionUser()
  if (!user) {
    return NextResponse.json({ error: "You must be signed in." }, { status: 401 })
  }
  if (user.blocked) {
    return NextResponse.json(
      { error: "Your account has been blocked by an administrator." },
      { status: 403 }
    )
  }

  try {
    const token = await signAppJwt(user)
    return NextResponse.json({
      token,
      expiresInSeconds: TOKEN_TTL_SECONDS,
      user,
    })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not create a session token." },
      { status: 500 }
    )
  }
}
