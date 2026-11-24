import { Pizza, ShoppingCart } from "lucide-react"
import Link from "next/link"
import { Btn, PageHeader } from "@/components/dashboard/ui"

export const metadata = { title: "Cart · PizzaHub" }

export default function CartPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col justify-center gap-8 px-4 py-12 sm:px-6 lg:px-8">
      <PageHeader
        title="Cart"
        subtitle="Your favorite pizzas are waiting. Place an order from the menu and it shows up here."
        actions={
          <Btn render={<Link href="/menu" />}>
            <ShoppingCart className="size-4" />
            Browse the menu
          </Btn>
        }
      />

      <div className="grid gap-6 rounded-3xl border border-border bg-card p-6 text-center sm:px-8 lg:p-10">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-gradient-to-br from-[#f4574a] to-[#ff9e2c] text-[#fffaf5]">
          <Pizza className="size-6" />
        </span>
        <h2 className="mt-4 text-2xl font-extrabold text-foreground">
          Ready when you are
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
          Every order starts the moment you place it from a dish page — your
          delivery date, address and instructions are saved there, and you can
          track everything from your dashboard.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Btn render={<Link href="/menu" />}>
            <ShoppingCart className="size-4" />
            Browse the menu
          </Btn>
        </div>
      </div>

      <p className="mt-8 text-center text-[13px] text-muted-foreground">
        Already placed an order? It&apos;s on your dashboard —{" "}
        <Link href="/sign-in?callbackUrl=/dashboard/orders" className="font-bold text-[#f4574a] hover:underline">
          sign in
        </Link>{" "}
        to see it.
      </p>
    </div>
  )
}
