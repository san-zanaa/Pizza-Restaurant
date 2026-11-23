import type { Metadata } from "next"
import { AuthSection } from "@/components/auth-section"

export const metadata: Metadata = {
  title: "Sign Up · PizzaHub",
  description:
    "Create your PizzaHub account — order pizza as a customer or list your menu as a vendor.",
}

export default function SignUpPage() {
  return (
    <main>
      <AuthSection initialMode="signup" />
    </main>
  )
}
