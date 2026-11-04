import JournalArticle, { type JournalArticleData } from "@/components/sections/JournalArticle";

const ARTICLE: JournalArticleData = {
  category: "Delivery",
  title: "Spot Dependencies Earlier",
  subtitle:
    "Make cross-team dependencies visible early enough to clarify ownership, adjust timing, and prevent blockers.",
  image: "/journal/spot-dependencies-earlier.avif",
  author: "daniel",
  intro:
    "A dependency is not just a line between two tasks. It is an agreement between people about what needs to happen first. When that agreement remains implicit, a team can appear ready to deliver while relying on work that another team has not planned or accepted.",
  sections: [
    {
      heading: "Describe the dependency precisely",
      paragraphs: [
        "Replace “waiting on platform” with the specific capability, decision, or access required. Explain which milestone depends on it and what would happen if it arrived later than expected.",
        "A precise description helps the other team evaluate the request. It also reveals whether the dependency is essential or whether a smaller change could allow useful work to continue.",
      ],
    },
    {
      heading: "Confirm both sides of ownership",
      paragraphs: [
        "Name the person requesting the dependency and the person responsible for responding. An entry in a roadmap does not automatically mean the receiving team has committed capacity.",
        "Discuss the acceptance condition and expected timing together. If either is uncertain, show that uncertainty in the plan. A visible open question is easier to manage than a confident date with no agreement behind it.",
      ],
    },
    {
      heading: "Review when the plan changes",
      paragraphs: [
        "Dependencies need another look when scope, sequencing, or capacity changes. Ask whether the original agreement still applies and whether any downstream team needs to adjust its work.",
        "Keep the review focused on active commitments. A complete diagram of every possible connection can be harder to maintain than a short list of the dependencies that currently influence delivery decisions.",
      ],
    },
    {
      heading: "A practical next step",
      paragraphs: [
        "Before the next milestone is committed, ask its owner to name the work they need from another team. Confirm those agreements while there is still room to change the sequence.",
      ],
    },
  ],
};

export default function Page() {
  return <JournalArticle article={ARTICLE} />;
}
