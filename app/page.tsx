import { Banner } from "@/components/banner"
import { FeaturedMenu } from "@/components/featured-menu"
import { PizzaCategories } from "@/components/pizza-categories"
import { PopularCombos } from "@/components/popular-combos"
import { StandardSection } from "@/components/standard-section"
import { OfferSection } from "@/components/offer-section"

export default function Page() {
  return (
    <main>
      <Banner />
      <FeaturedMenu />
      <PizzaCategories />
      <StandardSection />
      <PopularCombos />
      <OfferSection />
    </main>
  )
}
