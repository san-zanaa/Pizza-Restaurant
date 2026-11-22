import { Banner } from "@/components/banner"
import { FeaturedMenu } from "@/components/featured-menu"
import { PizzaCategories } from "@/components/pizza-categories"
import { WhyChoose } from "@/components/why-choose"
import { HowItWorks } from "@/components/how-it-works"
import { StandardSection } from "@/components/standard-section"
import { OfferSection } from "@/components/offer-section"

export default function Page() {
  return (
    <main>
      <Banner />
      <FeaturedMenu />
      <PizzaCategories />
      <WhyChoose />
      <HowItWorks />
      <StandardSection />
      <OfferSection />
    </main>
  )
}
