import { NextResponse } from "next/server"
import { toNextJsHandler } from "better-auth/next-js"
import { auth } from "@/lib/auth"
import { passwordError } from "@/lib/password"

const handler = toNextJsHandler(auth)

export const GET = handler.GET

export async function POST(request: Request) {
  const pathname = new URL(request.url).pathname.replace(/\/+$/, "")

  if (pathname.endsWith("/sign-up/email")) {
    let body: Record<string, unknown> = {}
    try {
      body = (await request.json()) as Record<string, unknown>
    } catch {
      body = {}
    }

    const problem = passwordError(String(body.password ?? ""))
    if (problem) {
      return NextResponse.json({ error: problem, message: problem, status: 400 }, { status: 400 })
    }

    const replay = new Request(request.url, {
      method: "POST",
      headers: request.headers,
      body: JSON.stringify(body),
    })
    return handler.POST(replay)
  }

  return handler.POST(request)
}
