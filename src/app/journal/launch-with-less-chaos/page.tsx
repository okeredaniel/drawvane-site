import JournalArticle, { type JournalArticleData } from "@/components/sections/JournalArticle";

const ARTICLE: JournalArticleData = {
  category: "Delivery",
  title: "Launch With Less Chaos",
  subtitle:
    "Prepare owners, dependencies, communication, and fallback decisions before release week becomes urgent.",
  image: "/journal/launch-with-less-chaos.avif",
  author: "daniel",
  intro:
    "A launch includes more than the product becoming available. Customers may need guidance, support teams need context, and internal teams need a consistent explanation of what is changing. These activities can be individually well planned while still failing to line up at the moment they depend on one another.",
  sections: [
    {
      heading: "Plan the shared milestones",
      paragraphs: [
        "Identify the points where one team’s readiness affects another. Final product language may influence help content; a scope decision may change campaign messaging. Make those connections explicit early.",
        "Give each shared milestone an owner and an acceptance condition. “Support ready” is more useful when it specifies what information, training, and escalation route need to be available.",
      ],
    },
    {
      heading: "Separate release from announcement",
      paragraphs: [
        "The technical release and the public announcement may have different prerequisites. Treat them as related decisions rather than assuming one date automatically covers both.",
        "Document who can approve each step. When readiness changes, the team should know who can pause an announcement, narrow the audience, or adjust the rollout without starting a new ownership debate.",
      ],
    },
    {
      heading: "Rehearse the change conversation",
      paragraphs: [
        "Before launch week, consider what happens if a key milestone moves. Which messages need updating, who needs to know, and what can still proceed? This makes later changes easier to handle calmly.",
        "After the launch, review the coordination as well as the product outcome. Capture where teams lacked context and which agreements worked. Use that evidence to improve the next launch plan.",
      ],
    },
    {
      heading: "A practical next step",
      paragraphs: [
        "For the next release, bring the functional owners together around the shared milestones. Resolve the dependencies before asking each team to finalize its own checklist.",
      ],
    },
  ],
};

export default function Page() {
  return <JournalArticle article={ARTICLE} />;
}
