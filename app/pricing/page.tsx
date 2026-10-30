import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";
import { pageMetadata } from "@/lib/site";
export const metadata = pageMetadata(
  "Pricing",
  "Discuss a scoped Stratora pilot or team rollout with clear deliverables and commercial terms.",
  "/pricing",
);
export default function PricingPage() {
  return (
    <>
      <main id="main-content" className="pt-[66px]">
        <Pricing />
      </main>
      <Footer />
    </>
  );
}
