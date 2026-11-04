import type { Metadata } from "next";
import LegalPage, { type LegalSection } from "@/components/LegalPage";
import { LEGAL as L } from "@/lib/legal-config";

export const metadata: Metadata = {
  title: `Terms of Service | ${L.company}`,
  description: `The terms that apply when you use ${L.product}.`,
};

const SECTIONS: LegalSection[] = [
  {
    id: "agreement",
    title: "Agreement",
    body: [
      `These terms are a contract between you and ${L.company} ("we", "us"). They apply when you create an account or use ${L.product} and our website at ${L.website} (together, the "Service").`,
      "If you accept these terms for an organization, you confirm you have authority to bind it, and \"you\" then means that organization. If you do not agree, do not use the Service.",
      "If your organization has signed a separate agreement or order form with us, that document controls wherever it conflicts with these terms.",
    ],
  },
  {
    id: "service",
    title: "The Service",
    body: [
      `${L.product} reads the documents you upload, such as drawings, specifications, RFIs and addenda, and helps your team search them, trace changes across them and draft responses, with citations back to the source.`,
      "We may add, change or remove features. We will give reasonable notice before removing a feature that paying customers rely on.",
    ],
  },
  {
    id: "accounts",
    title: "Accounts",
    body: [
      [
        "You must be at least 18 and able to enter a binding contract.",
        "Give accurate information and keep it up to date.",
        "Keep your login details secret. You are responsible for activity under your account, and you must tell us promptly if you think it has been misused.",
        "Workspace administrators decide who in their organization has access and what each person can do.",
      ],
    ],
  },
  {
    id: "your-content",
    title: "Your content",
    body: [
      "You keep all rights to what you upload and to the results the Service generates from it (together, \"Your Content\").",
      `You give us a limited license to host, process and display Your Content only as needed to provide the Service to you, keep it secure and meet legal obligations. We do not use Your Content to train AI models. Our Privacy Policy explains more.`,
      "You confirm you have the right to upload Your Content and to let us process it, including any rights needed in documents prepared by others, such as architects, engineers or owners.",
    ],
  },
  {
    id: "ai-output",
    title: "AI output and professional judgment",
    body: [
      "The Service uses AI, and AI can make mistakes. Answers, quantities, summaries and draft RFIs may be incomplete, out of date or wrong.",
      [
        "A qualified person on your team must review output before relying on it.",
        "The Service is not engineering, architectural, legal or construction advice, and does not replace professional judgment, the contract documents, or applicable codes.",
        "You are responsible for decisions you make and for anything you send to others, including RFIs, bids and submittals.",
        "The latest issued documents control. Check that the files you upload are the current ones.",
      ],
      "Similar questions from different customers may produce similar output. We do not promise that output is unique.",
    ],
  },
  {
    id: "acceptable-use",
    title: "Acceptable use",
    body: [
      "You agree not to:",
      [
        "Break the law or infringe anyone's rights.",
        "Upload content you have no right to share, or malicious code.",
        "Try to access other customers' data, or probe, scan or test the Service's security without our written permission.",
        "Reverse engineer the Service, or copy it, resell it or build a competing product from it, except where the law allows.",
        "Use the Service or its output to train or improve another AI model.",
        "Overload or disrupt the Service, or bypass usage limits.",
      ],
      "We may suspend access that breaks these rules or puts the Service or other users at risk.",
    ],
  },
  {
    id: "fees",
    title: "Fees and billing",
    body: [
      "Paid plans are described on our pricing page or in your order form. Fees are charged in advance for each billing period, are exclusive of taxes unless stated, and are non-refundable except where the law requires or we say otherwise.",
      "Subscriptions renew automatically for the same period until you cancel. You can cancel at any time and the plan will end at the close of the current period.",
      "We will give at least 30 days' notice of a price change. If you do not accept it, you can cancel before it takes effect.",
    ],
  },
  {
    id: "our-ip",
    title: "Our intellectual property",
    body: [
      "We own the Service, including its software, design and documentation. We give you a limited, non-exclusive, non-transferable right to use it for your own business during your subscription.",
      "If you send us feedback or suggestions, we may use them without obligation to you.",
    ],
  },
  {
    id: "confidentiality",
    title: "Confidentiality",
    body: [
      "Each of us may receive the other's non-public information. The receiving party will use it only for the purposes of these terms, protect it with reasonable care, and not share it except with people who need it and are bound to keep it confidential, or where the law requires.",
      "This does not cover information that is public through no fault of the recipient, was already known to it, or was developed independently.",
    ],
  },
  {
    id: "third-parties",
    title: "Third-party services",
    body: [
      "The Service may work with tools you connect, such as cloud storage or project software. Those are governed by their own terms, and we are not responsible for them.",
    ],
  },
  {
    id: "disclaimers",
    title: "Disclaimers",
    body: [
      `The Service is provided "as is" and "as available". To the fullest extent the law allows, we disclaim all warranties, express or implied, including merchantability, fitness for a particular purpose, accuracy and non-infringement. We do not promise that the Service will be uninterrupted or error-free, or that output will be accurate or complete.`,
    ],
  },
  {
    id: "liability",
    title: "Limit of liability",
    body: [
      "To the fullest extent the law allows, neither of us is liable for indirect, incidental, special, consequential or punitive damages, or for lost profits, revenue, data or goodwill, even if told they might happen.",
      "Our total liability for all claims relating to the Service is limited to the amount you paid us in the 12 months before the event that gave rise to the claim.",
      "These limits do not apply to liability that cannot be limited by law, such as for fraud, or to your payment obligations.",
    ],
  },
  {
    id: "indemnity",
    title: "Indemnity",
    body: [
      "You will defend and compensate us against third-party claims arising from Your Content, or from your use of the Service in breach of these terms, except to the extent we caused the claim.",
    ],
  },
  {
    id: "termination",
    title: "Ending these terms",
    body: [
      "You can stop using the Service and close your account at any time. We may suspend or end your access if you materially break these terms, fail to pay, or if we must do so by law, normally after notice where that is practical.",
      `After the account ends, you can export Your Content for ${L.deleteAfterDays} days, and we will then delete it as set out in our Privacy Policy. Sections that by their nature should survive, such as ownership, confidentiality, disclaimers, liability and governing law, will survive.`,
    ],
  },
  {
    id: "governing-law",
    title: "Governing law and disputes",
    body: [
      `These terms are governed by the laws of ${L.governingLaw}, without regard to conflict-of-law rules. Courts in ${L.disputeVenue} have exclusive jurisdiction, except that either of us may seek urgent relief in any competent court.`,
      "Before starting a formal claim, please contact us and give us 30 days to try to resolve it informally.",
    ],
  },
  {
    id: "changes",
    title: "Changes to these terms",
    body: [
      "We may update these terms. We will post the new version with a new date and tell you by email or in the product about material changes before they take effect. If you keep using the Service after that, you accept the update.",
    ],
  },
  {
    id: "general",
    title: "General",
    body: [
      [
        "These terms and any order form are the whole agreement between us on this subject.",
        "If a part is found unenforceable, the rest stays in force.",
        "Not enforcing a term is not a waiver of it.",
        "You may not transfer these terms without our consent. We may transfer them as part of a merger or sale of our business.",
        "Neither of us is liable for delay caused by events beyond reasonable control.",
      ],
    ],
  },
  {
    id: "contact",
    title: "Contact us",
    body: [`Questions about these terms: ${L.legalEmail}`, `${L.company}, ${L.address}`],
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      updated={L.updated}
      intro="These are the rules for using the Service. They are written to be read, so please do."
      summary={[
        "You own your documents and what the Service produces from them.",
        "AI can be wrong. A person on your team must review output before relying on it.",
        "Plans renew automatically until you cancel, and you can cancel any time.",
        "You can export your content when you leave.",
      ]}
      sections={SECTIONS}
      other={{ href: "/privacy", label: "Read the Privacy Policy" }}
    />
  );
}
