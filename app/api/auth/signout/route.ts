import { NextResponse } from "next/server"
import { toNextJsHandler } from "better-auth/next-js"
import { auth } from "@/lib/auth"

export const GET = toNextJsHandler(auth.api.signOut)
export const POST = toNextJsHandler(auth.api.signOut)