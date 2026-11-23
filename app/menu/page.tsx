import { Suspense } from "react"
import { BrowseMenu } from "@/components/browse-menu"

export const metadata = { title: "Browse Menu · PizzaHub" }

export default function MenuPage() {
  return (
    
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl px-4 pt-10 text-sm text-muted-foreground sm:px-6 lg:px-8">
          Loading menu…
        </div>
      }>
      <BrowseMenu />
    </Suspense>
  )
}
