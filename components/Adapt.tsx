import Link from "next/link";
import AdaptCompare from "./AdaptCompare";

const INK = "text-[#0E1A2B]";
const DISPLAY = "font-semibold tracking-[-0.045em] leading-[0.98]";
const WRAP =
  "mx-auto max-w-[1900px] px-4 sm:px-6 md:px-10 2xl:px-[96px]";

const STEPS = [
  {
    title: "Assess the workflow",
    body: "Identify repetitive work, document challenges and the decisions that need better evidence.",
  },
  {
    title: "Define a focused pilot",
    body: "Choose one project and one workflow. Agree the scope, responsibilities and success criteria before starting.",
  },
  {
    title: "Prepare the team",
    body: "Establish document access, review responsibilities and working practices that fit the people doing the work.",
  },
  {
    title: "Evaluate the results",
    body: "Compare time spent, traceability and review quality against the agreed starting point before expanding.",
  },
];

function PilotButton({ focus = "outline-[#0E1A2B]" }: { focus?: string }) {
  return (
    <Link
      href="/contact"
      className={`inline-flex items-center rounded-full bg-[#F5C93C] px-7 py-3.5 text-[16px] font-semibold text-[#0E1A2B] transition hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 ${focus}`}
    >
      Discuss an ADAPT pilot
    </Link>
  );
}

// Revision tag, the numbered triangle drafters use to flag a change.
function Delta({ n }: { n: number }) {
  return (
    <svg width="44" height="40" viewBox="0 0 40 36" aria-hidden className="shrink-0">
      <polygon points="20,3 37,33 3,33" fill="#F5C93C" stroke="#0E1A2B" strokeWidth="1.5" strokeLinejoin="round" />
      <text x="20" y="28" textAnchor="middle" fontSize="14" fontWeight="600" fill="#0E1A2B">
        {n}
      </text>
    </svg>
  );
}

export default function Adapt() {
  return (
    <>
      {/* Hero: the pilot question, shown rather than described */}
      <section className="relative overflow-hidden bg-white">
        <div aria-hidden className="absolute inset-y-0 right-0 hidden w-[54%] bg-[#E9EEF4] lg:block" />
        <div className={`${WRAP} relative grid items-center gap-12 pt-14 lg:grid-cols-[46fr_54fr] lg:gap-16 lg:py-20`}>
          <div className="lg:pr-4">
            <p className="text-[15px] font-medium text-[#5A677A]">ADAPT: guided adoption</p>
            <h1 className={`${DISPLAY} ${INK} mt-5 text-[clamp(2.6rem,4.7vw,4.5rem)]`}>
              Bring AI into the way your team already works.
            </h1>
            <p className="mt-7 max-w-[32rem] text-[19px] leading-[1.6] text-[#3F4C5F]">
              Start with one project and one practical workflow. Define what success looks like,
              prepare your team and evaluate the results with professional review throughout.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-2">
              <PilotButton />
              <a
                href="#approach"
                className="px-1 py-3 font-semibold text-[#0E1A2B] underline decoration-[#0E1A2B]/25 decoration-2 underline-offset-[6px] transition hover:decoration-[#0E1A2B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0E1A2B]"
              >
                Explore the approach
              </a>
            </div>
            <p className="mt-8 max-w-[30rem] text-[14px] leading-relaxed text-[#5A677A]">
              For construction firms, consultants, estimators and project teams. Pilot availability,
              capabilities, fees and delivery arrangements are confirmed before engagement.
            </p>
          </div>

          <div className="-mx-4 bg-[#E9EEF4] px-4 py-10 sm:-mx-6 sm:px-6 md:-mx-10 md:px-10 lg:m-0 lg:bg-transparent lg:p-0 lg:pb-0">
            <AdaptCompare />
          </div>
        </div>
      </section>

      {/* Platform and practice */}
      <section id="approach" className="scroll-mt-[66px] bg-white">
        <div className={`${WRAP} py-24 md:py-32`}>
          <h2 className={`${DISPLAY} text-[clamp(2.5rem,6.2vw,5.75rem)]`}>
            <span className={`block ${INK}`}>Stratora is the platform.</span>
            <span className="block text-[#66748A]">ADAPT is the process.</span>
          </h2>
          <div className="mt-14 grid gap-10 md:mt-20 lg:grid-cols-2 lg:gap-24">
            <p className="max-w-[34rem] text-[21px] leading-[1.55] text-[#1E2B3D]">
              ADAPT is Stratora’s adoption program for helping teams introduce AI into drawing,
              document and project-review workflows. It starts with a bounded question and a shared
              way to judge the evidence.
            </p>
            <aside className="max-w-[34rem] self-start border-l-[3px] border-[#F5C93C] pl-6">
              <p className="text-[17px] leading-relaxed text-[#3F4C5F]">
                It is not a replacement for professional judgment. Project decisions, quantities and
                technical conclusions remain subject to the appropriate human review.
              </p>
            </aside>
          </div>
        </div>
      </section>

      {/* Four steps: a real sequence, marked like revisions */}
      <section className="bg-[#EFF3F8]">
        <div className={`${WRAP} grid gap-12 py-24 md:py-32 lg:grid-cols-[4fr_8fr] lg:gap-20`}>
          <h2 className={`${DISPLAY} ${INK} self-start text-[clamp(2.1rem,4vw,3.5rem)] lg:sticky lg:top-[120px]`}>
            Four steps to a focused pilot.
          </h2>
          <ol role="list" className="border-b border-[#C4CFDD]">
            {STEPS.map((s, i) => (
              <li key={s.title} className="grid grid-cols-[44px_1fr] gap-x-6 border-t border-[#C4CFDD] py-8 md:gap-x-8 md:py-10">
                <Delta n={i + 1} />
                <div>
                  <h3 className={`${INK} text-[26px] font-semibold leading-tight tracking-[-0.02em] md:text-[32px]`}>
                    {s.title}
                  </h3>
                  <p className="mt-3 max-w-[34rem] text-[17px] leading-relaxed text-[#3F4C5F]">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Close */}
      <section className="bg-[#0E1A2B]">
        <div className={`${WRAP} py-24 md:py-32`}>
          <h2
            style={{ color: "#fff" }}
            className={`${DISPLAY} max-w-[20ch] text-[clamp(2.4rem,5.4vw,4.75rem)]`}
          >
            Start with the workflow that needs attention.
          </h2>
          <p className="mt-8 max-w-[34rem] text-[19px] leading-[1.6] text-[#B6C2D2]">
            Tell us about your team, project stage and the question you want to resolve. Do not send
            confidential project documents before access and data terms are agreed.
          </p>
          <div className="mt-10">
            <PilotButton focus="outline-white" />
          </div>
        </div>
      </section>
    </>
  );
}