import { Suspense } from "react"
import { ResetPasswordSection } from "@/components/reset-password-section"

export default function ResetPasswordPage() {
  return (
    <main>
      <Suspense fallback={<div className="min-h-[calc(100svh-4rem)]" />}>
        <ResetPasswordSection />
      </Suspense>
    </main>
  )
}
