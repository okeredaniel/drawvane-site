import Link from "next/link";
import LegalPage, { type LegalSection } from "@/components/LegalPage";
import Footer from "@/components/Footer";
import { pageMetadata } from "@/lib/site";
export const metadata = pageMetadata(
  "Website privacy notice",
  "How this Stratora website handles enquiries and demonstration content.",
  "/privacy",
);
const sections: LegalSection[] = [
  {
    id: "scope",
    title: "Scope of this notice",
    body: [
      "This notice covers the Stratora marketing website. A product engagement needs its own agreed data-processing and commercial terms before project documents are shared.",
    ],
  },
  {
    id: "enquiries",
    title: "Information in an enquiry",
    body: [
      "The form asks for your name, email, an optional company name and your message. When online submission is available, these details are forwarded to the team's configured inbox through its email delivery provider, Resend, so the team can respond to your enquiry.",
      "The form does not accept attachments. Do not include confidential drawings, credentials or sensitive project information. Copying an enquiry places the text on your device clipboard; it does not send it to the team.",
    ],
  },
  {
    id: "hosting",
    title: "Hosting and demonstrations",
    body: [
      "The website is hosted on Vercel. Hosting and delivery providers process technical information needed to operate their services. The prepared drawing examples on this website do not analyse uploaded documents or call an AI model.",
      "This website does not implement advertising trackers, analytics scripts or marketing-cookie consent. Browser and hosting functionality may still involve technical storage and request logs.",
    ],
  },
  {
    id: "product-review",
    title: "Before sharing project documents",
    body: [
      "Request the applicable product privacy terms, storage region, provider list, access controls, model-data policy and retention arrangements. This website does not establish a security certification, a retention commitment or approval for confidential project uploads.",
    ],
  },
  {
    id: "contact",
    title: "Questions and requests",
    body: [
      "Use the enquiry page to ask about information you have provided. If online enquiries are unavailable, use your existing Stratora contact. Avoid submitting additional sensitive information until you have a verified contact channel.",
    ],
  },
];
export default function PrivacyPage() {
  return (
    <>
      <LegalPage
        title="Website privacy notice"
        updated="October 30, 2026"
        intro="What happens to information you provide through this website."
        summary={[
          "Enquiries are used to respond to your request.",
          "Prepared examples do not process your project documents.",
          "Product data terms must be confirmed before an engagement.",
        ]}
        sections={sections}
        other={{ href: "/terms", label: "Read the website terms" }}
      />
      <div className="site-section !pt-0">
        <Link href="/contact?topic=question" className="button-secondary">
          Ask a privacy question
        </Link>
      </div>
      <Footer />
    </>
  );
}
