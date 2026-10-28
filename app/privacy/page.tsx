import type { Metadata } from "next";
import LegalPage, { type LegalSection } from "@/components/LegalPage";
import { LEGAL as L } from "@/lib/legal-config";

export const metadata: Metadata = {
  title: `Privacy Policy | ${L.company}`,
  description: `How ${L.company} collects, uses and protects personal information and your project content.`,
};

const SECTIONS: LegalSection[] = [
  {
    id: "who-we-are",
    title: "Who we are",
    body: [
      `This policy explains how ${L.company} ("we", "us") collects, uses and shares personal information when you use ${L.product} and our website at ${L.website}.`,
      `If you use ${L.product} through your employer or another organization, that organization usually decides what is uploaded and why. In that case it is the controller of the project content, and we act as its processor. This policy then applies to the rest of what we collect, such as account and usage data.`,
    ],
  },
  {
    id: "what-we-collect",
    title: "What we collect",
    body: [
      "We collect the following, depending on how you use the service:",
      [
        "Account details: your name, work email, company and role.",
        "Project content: the drawings, specifications, RFIs, addenda, markups and other files you upload, and the answers, drafts and citations generated from them.",
        "Usage and device data: pages viewed, features used, IP address, browser and device type, and error logs.",
        "Billing details: handled by our payment processor. We do not store full card numbers.",
        "Messages: what you send to support, in surveys, or in feedback.",
        "Cookies and similar technologies, described in section 10.",
      ],
    ],
  },
  {
    id: "how-we-use",
    title: "How we use it",
    body: [
      [
        "To provide the service: reading your documents, answering questions with citations, tracing changes across drawings, specs and RFIs, and drafting RFIs for review.",
        "To keep the service secure, prevent abuse and fix problems.",
        "To give you support and send service messages, such as security notices and billing receipts.",
        "To understand how the product is used and improve it, using usage data. We do not use the contents of your documents for this (see section 4).",
        "To send product news, where the law allows. You can opt out at any time.",
        "To meet legal obligations and enforce our terms.",
      ],
    ],
  },
  {
    id: "ai-and-documents",
    title: "AI and your documents",
    body: [
      "We do not use your project content to train our models or anyone else's. The model providers that process content for us are bound by contract not to train on it or keep it beyond what is needed to return a result.",
      "Our staff do not read your documents unless you ask us to help with a support issue, or we need to investigate a security or abuse problem. Where we do, access is limited and logged.",
      "Generated answers can be wrong. Each answer links to the sheet or spec it came from so people can check it, and we recommend a person approves any figure before it is relied on.",
    ],
  },
  {
    id: "sharing",
    title: "Who we share it with",
    body: [
      "We do not sell personal information, and we do not share it for cross-context behavioral advertising. We share it only with:",
      [
        "Service providers that help us run the service, such as cloud hosting, AI model providers, payment processing, email, analytics and customer support tools. They may use the data only to provide their service to us.",
        "Your organization's administrators, who can see account and usage information for their workspace.",
        "Authorities or other parties when the law requires it, or when needed to protect rights, safety or security.",
        "A buyer or successor if we are part of a merger, acquisition or sale of assets. We will tell you and the new owner must honor this policy.",
        "Anyone else, only with your consent.",
      ],
      `A current list of our service providers is available on request at ${L.privacyEmail}.`,
    ],
  },
  {
    id: "retention",
    title: "How long we keep it",
    body: [
      [
        `Project content: until you or your organization delete it or the account ends. We then delete it from our systems within ${L.deleteAfterDays} days, and from backups within ${L.backupDays} days.`,
        "Account details: while your account is active, and afterwards for as long as needed for legal, tax and accounting purposes.",
        `Logs and usage data: up to ${L.logMonths} months, unless needed longer to investigate abuse or security issues.`,
      ],
    ],
  },
  {
    id: "security",
    title: "Security",
    body: [
      "We protect personal information with encryption in transit and at rest, role-based access controls, and regular reviews of our systems and vendors. Single sign-on is available for organizations that want it.",
      `No system is perfectly secure. If a breach affects your information, we will tell you and any required authorities as the law requires. To report a security concern, write to ${L.privacyEmail}.`,
    ],
  },
  {
    id: "transfers",
    title: "International transfers",
    body: [
      "We and our service providers may process information in countries other than your own. Where the law requires it, we use safeguards such as standard contractual clauses to protect information that leaves your region.",
    ],
  },
  {
    id: "your-rights",
    title: "Your choices and rights",
    body: [
      "Depending on where you live, you may have the right to:",
      [
        "Access the personal information we hold about you, and get a copy.",
        "Correct information that is wrong or out of date.",
        "Delete your information.",
        "Object to or limit certain uses, or withdraw consent you gave earlier.",
        "Move your information to another service.",
        "Not be treated unfairly for using these rights.",
      ],
      `To use any of these, email ${L.privacyEmail}. We may need to confirm who you are first. If we cannot help, you can ask us to review our answer, and you can complain to your local data protection authority.`,
      "California residents: in the last 12 months we have not sold or shared personal information as those terms are defined in California law. If you use the service through your organization, requests about project content may need to go through that organization.",
    ],
  },
  {
    id: "cookies",
    title: "Cookies",
    body: [
      [
        "Essential cookies keep you signed in and keep the service secure. These cannot be switched off.",
        "Analytics cookies help us see which pages and features are used. Where the law requires it, we only set these after you agree.",
      ],
      "You can also block or delete cookies in your browser settings, though parts of the site may then stop working.",
    ],
  },
  {
    id: "children",
    title: "Children",
    body: [
      `${L.product} is for professional use and is not directed at anyone under 18. We do not knowingly collect information from children. If you think we have, contact us and we will delete it.`,
    ],
  },
  {
    id: "changes",
    title: "Changes to this policy",
    body: [
      "We may update this policy as the product or the law changes. We will post the new version here with a new date, and tell you by email or in the product if the change is significant.",
    ],
  },
  {
    id: "contact",
    title: "Contact us",
    body: [`Questions or requests: ${L.privacyEmail}`, `${L.company}, ${L.address}`],
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated={L.updated}
      intro="Your drawings, specs and RFIs are your business records. This page explains what we collect, why, and the choices you have."
      summary={[
        "We never use your project documents to train AI models.",
        "We do not sell your personal information.",
        "Every answer links to its source, and people review the numbers.",
        `You can ask us to access, correct or delete your information at ${L.privacyEmail}.`,
      ]}
      sections={SECTIONS}
      other={{ href: "/terms", label: "Read the Terms of Service" }}
    />
  );
}
