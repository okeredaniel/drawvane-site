import LegalPage, { type LegalSection } from "@/components/LegalPage";
import Footer from "@/components/Footer";
import { pageMetadata } from "@/lib/site";
export const metadata = pageMetadata(
  "Website terms",
  "Information about Stratora website examples, enquiries and separately agreed product engagements.",
  "/terms",
);
const sections: LegalSection[] = [
  {
    id: "website",
    title: "Using this website",
    body: [
      "This website introduces Stratora and lets you enquire about a potential engagement. Sending an enquiry does not create a subscription, confirm a booking or authorise a charge.",
    ],
  },
  {
    id: "examples",
    title: "Illustrations and prepared examples",
    body: [
      "Drawing references, answers, quantities and cost examples on this website are illustrative. They are not customer results, a live analysis of your documents or professional advice. Do not use them for construction, procurement, safety or design decisions.",
    ],
  },
  {
    id: "engagement",
    title: "Product and commercial terms",
    body: [
      "A product engagement requires a separate written agreement covering the parties, available features, deliverables, currency, price, taxes, payment, support and timing. Any subscription or renewal arrangement must be stated in that agreement. No automatic renewal is created by this website.",
      "Data handling, confidentiality and security requirements should be reviewed before you provide project documents. Marketing examples do not establish production acceptance.",
    ],
  },
  {
    id: "review",
    title: "Professional review",
    body: [
      "Project decisions must be checked against the current issued documents by appropriately qualified people. Any proposed AI-supported workflow should be evaluated against agreed acceptance criteria.",
    ],
  },
  {
    id: "contact",
    title: "Questions",
    body: [
      "Use the contact page to ask about a proposed engagement or these website terms. If online enquiries are temporarily unavailable, use your existing verified Stratora contact.",
    ],
  },
];
export default function TermsPage() {
  return (
    <>
      <LegalPage
        title="Website terms"
        updated="October 30, 2026"
        intro="The scope of this website and its illustrative content."
        summary={[
          "Enquiries create no charge or subscription.",
          "Demonstrations are illustrative and require professional verification.",
          "Product engagements need a separate written agreement.",
        ]}
        sections={sections}
        other={{ href: "/privacy", label: "Read the website privacy notice" }}
      />
      <Footer />
    </>
  );
}
