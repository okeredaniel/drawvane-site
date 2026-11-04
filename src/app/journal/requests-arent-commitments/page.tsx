import JournalArticle, { type JournalArticleData } from "@/components/sections/JournalArticle";

const ARTICLE: JournalArticleData = {
  category: "Product Discovery",
  title: "Requests Aren’t Commitments",
  subtitle:
    "Create a clear path from customer feedback to product decisions without treating every request as a promise.",
  image: "/journal/requests-arent-commitments.avif",
  author: "maya",
  intro:
    "Customer requests are valuable inputs, but they arrive with different levels of context and urgency. A request may describe a specific feature when the underlying problem has several possible solutions. Moving it directly onto the roadmap can skip the work needed to understand what the team should actually commit to.",
  sections: [
    {
      heading: "Capture the problem behind the request",
      paragraphs: [
        "Record what the customer is trying to achieve and what currently gets in the way. Include the source and any relevant context, such as the workflow affected or an existing workaround.",
        "Keep the customer’s wording available, but distinguish it from the team’s interpretation. This makes later research easier and helps avoid treating an early assumption as confirmed evidence.",
      ],
    },
    {
      heading: "Use clear decision stages",
      paragraphs: [
        "Separate received feedback, items under investigation, and committed work. Each stage should tell the team what has been decided and what still needs to happen.",
        "An item can be important without having a delivery date. Assign an owner to the next decision, whether that means gathering more evidence, comparing alternatives, or explaining why the request is outside the current scope.",
      ],
    },
    {
      heading: "Communicate the actual commitment",
      paragraphs: [
        "When speaking with a customer, describe the current stage accurately. Investigating a problem is not a promise to ship a particular feature. Be clear about what you can confirm and when you expect another update.",
        "When the team does commit, connect the work to the original evidence. That link helps delivery teams understand the intent and gives product managers a starting point for evaluating whether the result addresses the problem.",
      ],
    },
    {
      heading: "A practical next step",
      paragraphs: [
        "Review the next ten incoming requests. For each one, identify the underlying problem and the next decision before assigning it a place on the roadmap.",
      ],
    },
  ],
};

export default function Page() {
  return <JournalArticle article={ARTICLE} />;
}
