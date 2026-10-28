import Link from "next/link";

type Plan = {
  name: string;
  description: string;
  price: string;
  unit?: string;
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

function Check() {
  return (
    <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border border-neutral-200 text-neutral-900">
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="m5 12 5 5L20 7" />
      </svg>
    </span>
  );
}

export default function Pricing() {
  return (
    <section
      id="pricing"
      aria-label="Pricing"
      className="bg-neutral-50 px-6 pb-24 pt-[85px] text-neutral-900 md:px-10"
    >
      <div className="mx-auto max-w-[1320px]">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full bg-transparent text-[12px] font-bold uppercase tracking-wide text-accent">
            Pricing
          </span>
          <h1 className="mt-5 text-[clamp(2.5rem,5vw,4rem)] font-medium leading-[1.0] tracking-[-0.04em]">
            Simple pricing for a working pilot.
          </h1>
          <p className="mt-5 text-lg text-neutral-600">
            Start with one pilot project, then expand as your team adopts the workflow.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-start">
          {PLANS.map((plan) => (
            <Link
              key={plan.name}
              href="/contact"
              aria-label={`${plan.cta}: ${plan.name} plan`}
              className={`group block overflow-hidden rounded-2xl border bg-white transition duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 ${
                plan.featured
                  ? "border-accent shadow-[0_4px_14px_-6px_rgba(245,201,60,0.4)] hover:shadow-[0_8px_22px_-8px_rgba(245,201,60,0.55)]"
                  : "border-neutral-200 shadow-[0_2px_10px_-4px_rgba(15,23,42,0.1)] hover:shadow-[0_8px_22px_-10px_rgba(15,23,42,0.18)]"
              }`}
            >
              {plan.featured && (
                <div className="bg-accent py-2.5 text-center text-[11px] font-bold uppercase tracking-[0.2em] text-black">
                  Most popular
                </div>
              )}

              <div className="p-8">
                <h2 className="text-[28px] font-medium tracking-tight">{plan.name}</h2>
                <p className="mt-3 min-h-[52px] text-[16px] leading-relaxed text-neutral-600">
                  {plan.description}
                </p>

                <p className="mt-7 text-[44px] font-medium leading-none tracking-tight">
                  {plan.price}
                  {plan.unit && (
                    <span className="ml-1 text-base font-normal text-neutral-500">{plan.unit}</span>
                  )}
                </p>
                <p className="mt-3 text-[13px] text-neutral-500">{plan.note}</p>

                {/* Looks like a button, but the whole card is the link */}
                <span
                  className={
                    plan.featured
                      ? "keep-white mt-7 inline-flex rounded-full bg-neutral-950 px-6 py-3 text-[15px] font-semibold text-white transition-opacity group-hover:opacity-90"
                      : "mt-7 inline-flex rounded-full border border-neutral-200 bg-white px-6 py-3 text-[15px] font-medium text-neutral-900 transition group-hover:border-neutral-900"
                  }
                >
                  {plan.cta}
                </span>

                <ul className="mt-9 space-y-4 text-[16px] text-neutral-700">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check />
                      <span
                        className={feature.startsWith("Everything") ? "font-medium text-neutral-900" : ""}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Link>
          ))}
        </div>

        <p className="mt-12 text-center text-[16px] text-neutral-600">
          Not sure which plan fits?{" "}
          <Link href="/contact" className="font-medium text-neutral-900 underline underline-offset-4">
            Talk to us
          </Link>
          .
        </p>
      </div>
    </section>
  );
}