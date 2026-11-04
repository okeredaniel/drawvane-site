import JournalArticle, { type JournalArticleData } from "@/components/sections/JournalArticle";

const ARTICLE: JournalArticleData = {
  category: "Team Alignment",
  title: "Keep Decision Context",
  subtitle:
    "Preserve the reasoning behind priorities and tradeoffs so growing teams can act without repeated alignment.",
  image: "/journal/keep-decision-context.avif",
  author: "daniel",
  intro:
    "A small team can carry a surprising amount of context through conversation. As more people join, that approach becomes harder to sustain. New teammates see the plan but may not know which alternatives were considered, which constraints still matter, or which decisions are open to change.",
  sections: [
    {
      heading: "Preserve the decisions that affect future work",
      paragraphs: [
        "Focus on choices that shape scope, sequencing, customer behavior, or technical direction. Record the decision, the reason, and the evidence available at the time. Not every discussion needs a permanent record.",
        "Keep the explanation brief enough to read. A concise note linked to the relevant initiative is often more useful than a long meeting transcript that requires its own interpretation.",
      ],
    },
    {
      heading: "Distinguish history from current guidance",
      paragraphs: [
        "Historical context explains how the team arrived here. Current guidance explains what people should do now. Make the distinction visible so an old decision does not accidentally govern work after its assumptions have changed.",
        "When a decision is superseded, link to the newer one. Preserve the earlier reasoning where it remains useful, but help readers identify the position that currently applies.",
      ],
    },
    {
      heading: "Use onboarding to test clarity",
      paragraphs: [
        "Ask a new teammate to explain an active initiative after reading its brief and plan. Their questions can reveal missing context that experienced colleagues no longer notice.",
        "Improve the shared material when those gaps appear. Answering the question privately may help one person, but updating the source helps the next person as well. Give the material an owner so useful improvements stay consistent.",
      ],
    },
    {
      heading: "A practical next step",
      paragraphs: [
        "Choose an initiative that several teams will inherit or extend. Write down its most consequential decisions and check whether someone outside the original group can understand the next step.",
      ],
    },
  ],
};

export default function Page() {
  return <JournalArticle article={ARTICLE} />;
}
