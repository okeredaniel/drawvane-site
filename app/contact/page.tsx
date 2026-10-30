import { Suspense } from "react";
import ContactPageSection from "@/components/ContactPageSection";
import Footer from "@/components/Footer";
import { contactReady } from "@/lib/contact";
import { pageMetadata } from "@/lib/site";
export const metadata = pageMetadata(
  "Contact",
  "Discuss a Stratora pilot, request a demo or ask about a construction workflow.",
  "/contact",
);
export default function ContactPage() {
  return (
    <>
      <main id="main-content" className="pt-[66px]">
        <Suspense
          fallback={<p className="site-section">Loading enquiry form…</p>}
        >
          <ContactPageSection available={contactReady(process.env)} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
