import { Banner } from "@/components/banner"
import { FeaturedMenu } from "@/components/featured-menu"
import { FadeIn } from "@/components/fade-in"
import { PizzaCategories } from "@/components/pizza-categories"
import { PopularCombos } from "@/components/popular-combos"
import { StandardSection } from "@/components/standard-section"
import { OfferSection } from "@/components/offer-section"

export default function Page() {
  return (
    <main>
      <FadeIn>
        <Banner />
      </FadeIn>
      <FadeIn delay={0.06}>
        <FeaturedMenu />
      </FadeIn>
      <FadeIn delay={0.12}>
        <PizzaCategories />
      </FadeIn>
      <FadeIn delay={0.18}>
        <StandardSection />
      </FadeIn>
      <FadeIn delay={0.24}>
        <PopularCombos />
      </FadeIn>
      <FadeIn delay={0.3}>
        <OfferSection />
      </FadeIn>
    </main>
  )
}
