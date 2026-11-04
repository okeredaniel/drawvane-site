import JournalArticle, { type JournalArticleData } from "@/components/sections/JournalArticle";

const ARTICLE: JournalArticleData = {
  category: "Team Practices",
  title: "Reviews That End in Decisions",
  subtitle:
    "Replace status-heavy meetings with focused reviews that surface changes, blockers, owners, and next steps.",
  image: "/journal/reviews-that-end-in-decisions.avif",
  author: "maya",
  intro:
    "A weekly review can consume an hour without changing anyone’s next step. The team reports progress, repeats information from task boards, and leaves the difficult questions until the end. A more useful review begins with what needs a decision and gives routine updates a simpler home.",
  sections: [
    {
      heading: "Prepare changes, not a full history",
      paragraphs: [
        "Ask owners to summarize what changed since the last review. Focus on new risks, altered assumptions, and milestones that need attention. Completed work can remain visible in the shared plan without being narrated line by line.",
        "Send the relevant context ahead of the meeting. People should arrive knowing the question to resolve, the available options, and any deadline that makes the decision time-sensitive.",
      ],
    },
    {
      heading: "Separate blockers from updates",
      paragraphs: [
        "A blocker needs an intervention. An update may only need to be understood. Distinguishing the two helps the team spend time where discussion can change the outcome.",
        "For each blocker, identify who can help and what information is missing. If the right person is absent, assign the follow-up instead of asking the entire meeting to speculate about a solution.",
      ],
    },
    {
      heading: "Finish with an explicit record",
      paragraphs: [
        "Write down the decision, its owner, and the next action. If no decision was possible, record what evidence is needed and when the team will revisit it. This prevents the same discussion from returning unchanged next week.",
        "After the meeting, update the active plan. A decision captured only in meeting notes can remain disconnected from the work it was intended to change. The record should support execution, not become another reporting task.",
      ],
    },
    {
      heading: "A practical next step",
      paragraphs: [
        "Try a review with three agenda headings: what changed, what needs a decision, and what happens next. Remove any item that does not help the team act.",
      ],
    },
  ],
};

export default function Page() {
  return <JournalArticle article={ARTICLE} />;
}
