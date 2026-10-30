import Link from "next/link";
const plans = [
  {
    name: "Pilot",
    description: "A focused starting point for one project team.",
    features: [
      "Agree one workflow to evaluate",
      "Choose a representative document set",
      "Define review and acceptance criteria",
    ],
    cta: "Discuss a pilot",
    topic: "pilot",
  },
  {
    name: "Team",
    description: "Explore a workflow that fits the people doing the work.",
    features: [
      "Map your team's roles and handoffs",
      "Discuss document and access requirements",
      "Plan training and review responsibilities",
    ],
    cta: "Book a demo",
    topic: "demo",
  },
  {
    name: "Organization",
    description: "Discuss the requirements for a wider rollout.",
    features: [
      "Review security and procurement needs",
      "Agree project and support scope",
      "Document commercial terms before starting",
    ],
    cta: "Talk to us",
    topic: "question",
  },
];
export default function Pricing() {
  return (
    <section className="site-section" aria-labelledby="pricing-title">
      <div className="max-w-2xl">
        <p className="eyebrow">Scope first. Clear terms.</p>
        <h1 id="pricing-title" className="page-title">
          Start with the right
          <br />
          project scope.
        </h1>
        <p className="section-intro">
          Pricing is agreed in a written proposal, including currency,
          deliverables, support and timing. Sending an enquiry does not start a
          subscription or create a charge.
        </p>
      </div>
      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        {plans.map((p, i) => (
          <article
            key={p.name}
            className={`pricing-card ${i === 0 ? "pricing-featured" : ""}`}
          >
            <p className="eyebrow">{String(i + 1).padStart(2, "0")}</p>
            <h2 className="mt-4 text-2xl font-semibold">{p.name}</h2>
            <p className="mt-3 text-neutral-600">{p.description}</p>
            <p className="mt-8 text-3xl font-medium">Scoped proposal</p>
            <ul className="my-8 space-y-4 text-sm leading-relaxed">
              {p.features.map((f) => (
                <li key={f} className="flex gap-3">
                  <span aria-hidden="true">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <Link
              className={
                i === 0 ? "button-primary mt-auto" : "button-secondary mt-auto"
              }
              href={`/contact?topic=${p.topic}`}
            >
              {p.cta}
            </Link>
          </article>
        ))}
      </div>
      <p className="mt-8 max-w-3xl text-sm leading-relaxed text-neutral-600">
        Available features and service commitments are confirmed for your
        engagement. Security audits, SSO, retention periods and model-data
        policies should be reviewed before confidential documents are shared.
      </p>
    </section>
  );
}
