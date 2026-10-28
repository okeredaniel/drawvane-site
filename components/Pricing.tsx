import Link from "next/link";

type Plan = {
  name: string;
  description: string;
  price: string;
  note: string;
  cta: string;
  featured?: boolean;
  features: string[];
};

// TODO: confirm plan names, prices and features with your boss
const PLANS: Plan[] = [
  {
    name: "Pilot",
    description: "For one project team testing a live workflow.",
    price: "$1,200",
    note: "Fixed price to test one live project",
    cta: "Request a pilot",
    features: [
      "Up to 3 document sets",
      "Cited answers with source references",
      "2 weeks of onboarding support",
    ],
  },
  {
    name: "Team",
    description: "Built for rollout across project teams and stakeholders.",
    price: "Custom",
    note: "Scoped to your team and projects",
    cta: "Book a demo",
    featured: true,
    features: [
      "Everything in Pilot",
      "SSO and role-based access",
      "Shared workspace and review notes",
      "Dedicated setup and success guidance",
    ],
  },
  {
    name: "Enterprise",
    description: "For organizations standardizing the workflow across every project.",
    price: "Custom",
    note: "Priced to your portfolio",
    cta: "Talk to us",
    features: [
      "Everything in Team",
      "Rollout planning across projects",
      "Security review and procurement help",
      "Named support contact",
      "Custom contract terms",
    ],
  },
];

// TODO: only keep the claims that are true for your product
const INCLUDED = [
  "Cited answers with the source sheet attached",
  "Your documents are never used to train models",
  "A person approves the numbers",
];

export default function Pricing() {
  return (
    <section
      id="pricing"
      aria-label="Pricing"
      className="bg-white px-6 py-20 text-neutral-900 md:px-10 md:py-28"
    >
      <div className="mx-auto max-w-[1200px]">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-accent">Pricing</p>
          <h1 className="mt-3 text-[clamp(2rem,4vw,3rem)] font-semibold leading-tight tracking-tight">
            Simple pricing for a working pilot.
          </h1>
          <p className="mt-4 text-lg text-neutral-600">
            Start with one pilot project, then expand as your team adopts the workflow.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {PLANS.map((plan) => {
            const dark = !!plan.featured;
            return (
              <div
                key={plan.name}
                className={`flex flex-col rounded-lg border p-8 ${
                  dark
                    ? "border-neutral-900 bg-neutral-900 text-neutral-50"
                    : "border-neutral-200 bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">{plan.name}</h2>
                  {dark && (
                    <span className="text-xs font-medium text-neutral-400">Most popular</span>
                  )}
                </div>
                <p className={`mt-2 text-[15px] ${dark ? "text-neutral-400" : "text-neutral-600"}`}>
                  {plan.description}
                </p>

                <p className="mt-8 text-4xl font-semibold tracking-tight">{plan.price}</p>
                <p className={`mt-1 text-sm ${dark ? "text-neutral-400" : "text-neutral-500"}`}>
                  {plan.note}
                </p>

                <ul
                  className={`mt-8 flex-1 space-y-3 border-t pt-8 text-[15px] ${
                    dark ? "border-neutral-700 text-neutral-300" : "border-neutral-200 text-neutral-700"
                  }`}
                >
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-3">
                      <span aria-hidden className={dark ? "text-accent" : "text-neutral-400"}>
                        –
                      </span>
                      <span
                        className={
                          feature.startsWith("Everything")
                            ? dark
                              ? "font-medium text-neutral-50"
                              : "font-medium text-neutral-900"
                            : ""
                        }
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/contact"
                  className={`mt-8 inline-flex items-center justify-center rounded-md px-5 py-2.5 text-[15px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
                    dark
                      ? "bg-accent text-black hover:brightness-95"
                      : "border border-neutral-300 text-neutral-900 hover:bg-neutral-50"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            );
          })}
        </div>

        <div className="mt-14 border-t border-neutral-200 pt-8">
          <p className="text-sm font-semibold">Included in every plan</p>
          <ul className="mt-3 space-y-1.5 text-[15px] text-neutral-600">
            {INCLUDED.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-neutral-200 pt-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-lg font-semibold">Not sure which plan fits?</p>
            <p className="mt-1 text-[15px] text-neutral-600">
              Tell us about your projects and we will point you to the right one.
            </p>
          </div>
          <Link
            href="/contact"
            className="keep-white inline-flex shrink-0 items-center justify-center rounded-md bg-neutral-900 px-5 py-2.5 text-[15px] font-medium text-white transition-colors hover:bg-neutral-800"
          >
            Talk to us
          </Link>
        </div>
      </div>
    </section>
  );
}