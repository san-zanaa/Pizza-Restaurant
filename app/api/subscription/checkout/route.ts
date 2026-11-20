import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getSessionUser } from "@/lib/session"
import { jsonError, jsonOk, guardUser } from "@/lib/api"
import { getStripe } from "@/lib/stripe"
import { PREMIUM_PRICE_CENTS } from "@/lib/types"

/**
 * POST /api/subscription/checkout
 * Vendor only: creates a Stripe Checkout session for the Premium upgrade.
 * The plan is activated only after Stripe confirms payment (success page / webhook).
 */
export async function POST() {
  const user = await getSessionUser()
  const gate = guardUser(user)
  if (gate) return gate
  if (!user || user.role !== "vendor") return jsonError("Vendors only.", 403)
  if (user.plan === "premium") {
    return jsonError("You're already on Premium.", 400)
  }

  const stripe = getStripe()
  if (!stripe) {
    return jsonError(
      "Stripe isn't configured on this deployment. Contact support.",
      503
    )
  }

  const headerList = await headers()
  const origin =
    process.env.BETTER_AUTH_URL ||
    (headerList.get("origin") || "http://localhost:3000")

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "PizzaHub Premium",
              description:
                "Unlimited active menu items, Premium vendor badge, and featured placement.",
            },
            unit_amount: PREMIUM_PRICE_CENTS,
          },
          quantity: 1,
        },
      ],
      client_reference_id: user.id,
      metadata: {
        vendorId: user.id,
        vendorName: user.name,
        vendorEmail: user.email,
      },
      success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/payment/cancel`,
    })

    return jsonOk({ url: session.url })
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : "Stripe checkout failed.",
      500
    )
  }
}
