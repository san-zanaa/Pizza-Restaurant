import { Banner } from "@/components/banner"
import { FeaturedMenu } from "@/components/featured-menu"
import { StandardSection } from "@/components/standard-section"
import { OfferSection } from "@/components/offer-section"

export default function Page() {
  return (
    <main>
      <Banner />
      <FeaturedMenu />
      <StandardSection />
      <OfferSection />
    </main>
  )
}
