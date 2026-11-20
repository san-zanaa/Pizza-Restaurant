import { NextResponse } from "next/server"
import { getSessionUser } from "@/lib/session"
import { jsonError, jsonOk, guardUser } from "@/lib/api"

/**
 * POST /api/upload
 * Authenticated upload proxy to ImgBB. The frontend sends FormData with a "file" field.
 * Requires IMGBB_API_KEY in environment variables.
 */
export async function POST(request: Request) {
  const user = await getSessionUser()
  const gate = guardUser(user)
  if (gate) return gate

  const apiKey = process.env.IMGBB_API_KEY?.trim()
  if (!apiKey) {
    return jsonError(
      "Image uploads aren't configured on this deployment. Contact support.",
      503
    )
  }

  const formData = await request.formData()
  const file = formData.get("file")
  if (!(file instanceof File)) {
    return jsonError("No file provided.", 400)
  }

  const uploadForm = new FormData()
  uploadForm.append("key", apiKey)
  uploadForm.append("file", file)

  try {
    const res = await fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      body: uploadForm,
    })
    const body = (await res.json().catch(() => ({}))) as {
      data?: { url?: string; delete_url?: string }
      error?: { message?: string }
    }

    if (!res.ok || !body.data?.url) {
      return jsonError(
        body.error?.message ?? "ImgBB upload failed.",
        res.ok ? 502 : res.status
      )
    }

    return jsonOk({
      url: body.data.url,
      deleteUrl: body.data.delete_url,
    })
  } catch {
    return jsonError("Image upload failed — check your connection.", 502)
  }
}
