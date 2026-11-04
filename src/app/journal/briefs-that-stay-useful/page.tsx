import JournalArticle, { type JournalArticleData } from "@/components/sections/JournalArticle";

const ARTICLE: JournalArticleData = {
  category: "Product Strategy",
  title: "Briefs That Stay Useful",
  subtitle:
    "Keep the problem, evidence, scope, and key decisions connected as an initiative moves from planning to delivery.",
  image: "/journal/briefs-that-stay-useful.avif",
  author: "maya",
  intro:
    "A product brief often receives careful attention at kickoff and much less attention afterward. Delivery continues, the scope evolves, and the document gradually describes a version of the project that no longer exists. A useful brief is a maintained explanation of the work, not simply proof that planning happened.",
  sections: [
    {
      heading: "Keep the core small",
      paragraphs: [
        "Start with the problem, the people affected, the evidence available, and the intended outcome. Add constraints and exclusions that shape the team’s choices. These elements help a reader understand why the initiative exists.",
        "Link to detailed research rather than copying every finding into the brief. The main document should make the current reasoning readable while preserving access to the evidence behind it.",
      ],
    },
    {
      heading: "Record decisions that change direction",
      paragraphs: [
        "Update the brief when a decision changes the problem being solved, the target user, or the scope of the first release. Routine implementation details can remain in the delivery plan.",
        "Explain the reason for a significant change. Keeping only the newest answer can make later readers repeat a debate because they cannot see why an earlier option was rejected.",
      ],
    },
    {
      heading: "Make it part of an existing review",
      paragraphs: [
        "Attach the brief to the milestones where the team already evaluates progress. Ask whether new evidence changes the original assumptions and whether the next phase still supports the intended outcome.",
        "Give maintenance to a named owner. Shared contribution works best when someone is responsible for resolving conflicting edits and keeping the current position clear. A document without ownership is easy to ignore.",
      ],
    },
    {
      heading: "A practical next step",
      paragraphs: [
        "Open the brief for one active initiative. If it cannot explain the current scope and its latest tradeoff, update those two points before adding more background material.",
      ],
    },
  ],
};

export default function Page() {
  return <JournalArticle article={ARTICLE} />;
}
