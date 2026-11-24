import { redirect } from "next/navigation"
import { getSessionUser } from "@/lib/session"
import { SettingsForm } from "./settings-form"

export default async function SettingsPage() {
  const user = await getSessionUser()
  if (!user) redirect("/sign-in")
  return <SettingsForm user={user} />
}
