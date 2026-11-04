import JournalArticle, { type JournalArticleData } from "@/components/sections/JournalArticle";

const ARTICLE: JournalArticleData = {
  category: "Product Strategy",
  title: "Strategy Into Weekly Work",
  subtitle:
    "Turn product strategy into clear outcomes, milestones, and the next actions your team can start this week.",
  image: "/journal/strategy-into-weekly-work.avif",
  author: "maya",
  intro:
    "Strategy and daily work are often written at different levels of detail. Leadership describes outcomes, while delivery teams manage specific tasks. Neither view is wrong. The problem begins when there is no clear path between them, leaving people to infer how their current work contributes to the larger objective.",
  sections: [
    {
      heading: "Define a change you can recognize",
      paragraphs: [
        "Write the outcome in terms of a user or business problem. “Improve onboarding” is a direction; helping new users complete a specific setup step gives the team something more concrete to investigate. State what evidence would indicate progress.",
        "Avoid choosing a target simply because it is easy to count. An activity measure can help manage the work, but it should not quietly replace the outcome the initiative exists to achieve.",
      ],
    },
    {
      heading: "Use milestones as decision points",
      paragraphs: [
        "A milestone should represent a meaningful change in readiness or understanding. Research reviewed, a technical approach agreed, or a pilot evaluated can be more useful than a date attached to a collection of tasks.",
        "For each milestone, describe what must be true before the team moves forward. This makes it easier to identify missing evidence and prevents a completed checklist from being mistaken for a successful result.",
      ],
    },
    {
      heading: "Make the next action visible",
      paragraphs: [
        "Connect active tasks to the milestone they support. If the connection is difficult to explain, check whether the task is necessary, belongs elsewhere, or needs a clearer purpose. Give the next decision an owner.",
        "Keep the plan small enough to review. Strategy does not need to be copied into every task, but the relevant context should be accessible without asking someone to reconstruct the entire initiative.",
      ],
    },
    {
      heading: "A practical next step",
      paragraphs: [
        "Choose one strategic objective and trace it down to the work planned for Monday. Any missing link is an opportunity to clarify the plan before adding more activity.",
      ],
    },
  ],
};

export default function Page() {
  return <JournalArticle article={ARTICLE} />;
}
