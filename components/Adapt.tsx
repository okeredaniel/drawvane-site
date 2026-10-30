import Link from "next/link";

const EYEBROW =
  "text-[12px] font-semibold uppercase tracking-[0.16em] text-[#6b4e0a]";
const H1 =
  "font-semibold leading-[0.98] tracking-[-0.045em] text-[#0b0f14]";

const STEPS = [
  {
    n: "01",
    title: "Assess the workflow",
    body: "Identify repetitive work, document challenges and the decisions that need better evidence.",
  },
  {
    n: "02",
    title: "Define a focused pilot",
    body: "Choose one project and one workflow. Agree the scope, responsibilities and success criteria before starting.",
  },
  {
    n: "03",
    title: "Prepare the team",
    body: "Establish document access, review responsibilities and working practices that fit the people doing the work.",
  },
  {
    n: "04",
    title: "Evaluate the results",
    body: "Compare time spent, traceability and review quality against the agreed starting point before expanding.",
  },
];

function PrimaryButton({ children }: { children: React.ReactNode }) {
  return (
    <Link
      href="/contact"
      className="inline-flex items-center rounded-full bg-[#F5C93C] px-6 py-3 text-[15px] font-semibold text-[#0b0f14] transition hover:brightness-95"
    >
      {children}
    </Link>
  );
}

function RevisionDrawing() {
  return (
    <svg
      viewBox="0 0 500 250"
      className="h-auto w-full"
      role="img"
      aria-label="Illustrative floor plan with a highlighted review area linked to sheet A-301"
    >
      <g stroke="#9aa39f" strokeWidth="1.2">
        <line x1="10" y1="12" x2="350" y2="12" />
        <line x1="10" y1="238" x2="350" y2="238" />
      </g>

      {/* walls */}
      <g stroke="#1b2e28" strokeWidth="3.5" fill="none" strokeLinecap="square">
        <rect x="20" y="28" width="330" height="195" />
        <line x1="145" y1="28" x2="145" y2="100" />
        <line x1="145" y1="130" x2="145" y2="223" />
        <line x1="250" y1="28" x2="250" y2="95" />
        <line x1="250" y1="125" x2="250" y2="223" />
        <line x1="20" y1="125" x2="115" y2="125" />
        <line x1="190" y1="125" x2="350" y2="125" />
      </g>

      {/* door swings */}
      <g stroke="#1b2e28" strokeWidth="1" fill="none">
        <path d="M250 95 A38 38 0 0 1 288 133" opacity="0" />
        <path d="M250 62 A30 30 0 0 1 280 92" />
        <path d="M115 125 A32 32 0 0 1 147 157" />
      </g>

      {/* review area */}
      <rect
        x="155"
        y="135"
        width="85"
        height="78"
        fill="#fbe9b7"
        stroke="#a9852a"
        strokeWidth="1.2"
        strokeDasharray="4 3"
      />

      <g fontFamily="inherit" fontSize="10" fill="#1b2e28">
        <text x="48" y="64">ROOM 01</text>
        <text x="48" y="178">ROOM 02</text>
        <text x="166" y="177">REVIEW</text>
        <text x="266" y="178">ROOM 03</text>
      </g>

      {/* callout */}
      <polyline
        points="240,172 400,172 400,86"
        fill="none"
        stroke="#a9852a"
        strokeWidth="1.5"
      />
      <circle cx="240" cy="172" r="4" fill="#a9852a" />
      <rect x="360" y="38" width="130" height="48" rx="4" fill="#151a14" />
      <text x="372" y="58" fontSize="9" fill="#F5C93C">
        CHECK THE SOURCE
      </text>
      <text x="372" y="76" fontSize="11" fontWeight="600" fill="#fff">
        A-301
      </text>
    </svg>
  );
}

export default function Adapt() {
  return (
    <>
      {/* 1. Hero */}
      <section id="adapt" className="bg-white">
        <div className="mx-auto max-w-[1900px] px-4 py-20 sm:px-6 md:px-10 md:py-28 2xl:px-[96px]">
          <p className={EYEBROW}>ADAPT · Guided adoption</p>
          <h1 className={`${H1} mt-5 max-w-[14ch] text-[44px] sm:text-[60px] lg:max-w-[16ch] lg:text-[72px]`}>
            Bring AI into the way your team already works.
          </h1>
          <p className="mt-7 max-w-[34rem] text-[18px] leading-[1.65] text-neutral-600">
            Start with one project and one practical workflow. Define what
            success looks like, prepare your team and evaluate the results with
            professional review throughout.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <PrimaryButton>Discuss an ADAPT pilot</PrimaryButton>
            <a
              href="#approach"
              className="inline-flex items-center rounded-full border border-neutral-300 bg-white px-6 py-3 text-[15px] font-semibold text-[#0b0f14] transition hover:bg-neutral-50"
            >
              Explore the approach
            </a>
          </div>
          <p className="mt-9 max-w-[36rem] text-[14px] leading-relaxed text-neutral-600">
            For construction firms, consultants, estimators and project teams.
            Pilot availability, capabilities, fees and delivery arrangements are
            confirmed before engagement.
          </p>
        </div>
      </section>

      {/* 2. Platform and practice */}
      <section className="scroll-mt-[66px] bg-[#f4f4ee]">
        <div className="mx-auto grid max-w-[1900px] items-center gap-12 px-4 py-20 sm:px-6 md:px-10 md:py-28 lg:grid-cols-[1fr_1.15fr] lg:gap-16 2xl:px-[96px]">
          <div>
            <p className={EYEBROW}>Platform and practice</p>
            <h2 className={`${H1} mt-5 text-[40px] sm:text-[52px] lg:text-[56px]`}>
              Stratora is the platform.
              <br />
              ADAPT is the process.
            </h2>
            <p className="mt-7 max-w-[34rem] text-[18px] leading-[1.65] text-neutral-600">
              ADAPT is Stratora’s adoption program for helping teams introduce
              AI into drawing, document and project-review workflows. It starts
              with a bounded question and a shared way to judge the evidence.
            </p>
            <p className="mt-5 max-w-[34rem] text-[15px] leading-relaxed text-neutral-600">
              It is not a replacement for professional judgment. Project
              decisions, quantities and technical conclusions remain subject to
              the appropriate human review.
            </p>
          </div>

          <div className="overflow-hidden rounded-[28px] border border-neutral-200 bg-white shadow-[0_30px_60px_-25px_rgba(0,0,0,0.25)]">
            <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4 text-[11px] font-medium uppercase tracking-[0.08em] text-neutral-600">
              <span id="approach">Illustrative pilot</span>
              <span>Drawing review</span>
            </div>

            <div className="bg-[#f1f1ea] bg-[linear-gradient(rgba(0,0,0,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.035)_1px,transparent_1px)] bg-[size:24px_24px] p-6 sm:p-10">
              <div className="border border-neutral-200 bg-white p-4 sm:p-6">
                <p className="mb-3 text-[11px] uppercase tracking-[0.14em] text-neutral-600">
                  Stratora / Revision review
                </p>
                <RevisionDrawing />
                <div className="mt-2 flex justify-between border-t border-neutral-200 pt-3 text-[10px] uppercase tracking-[0.06em] text-neutral-600">
                  <span>Illustrative drawing · Not for construction</span>
                  <span>Rev A</span>
                </div>
              </div>
            </div>

            <div className="px-5 py-6 sm:px-6">
              <p className={EYEBROW}>One question. A defined outcome.</p>
              <h3 className="mt-3 text-[22px] font-medium tracking-[-0.01em] text-[#0b0f14]">
                What changed in this drawing revision?
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-neutral-600">
                Agree a drawing set, identify the evidence to compare and have a
                qualified reviewer check the findings. Measure the review effort
                and traceability before considering a wider rollout.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Four steps */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1900px] px-4 pt-20 sm:px-6 md:px-10 md:pt-28 2xl:px-[96px]">
          <p className={EYEBROW}>A practical starting point</p>
          <h2 className={`${H1} mt-5 text-[40px] sm:text-[52px] lg:text-[56px]`}>
            Four steps to a focused pilot.
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {STEPS.map((step) => (
              <div
                key={step.n}
                className="rounded-[24px] border border-neutral-200 bg-white p-7"
              >
                <p className={EYEBROW}>{step.n}</p>
                <h3 className="mt-5 text-[26px] font-semibold tracking-[-0.02em] text-[#0b0f14]">
                  {step.title}
                </h3>
                <p className="mt-3 max-w-[30rem] text-[16px] leading-relaxed text-neutral-600">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CTA */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1900px] px-4 py-16 sm:px-6 md:px-10 md:py-24 2xl:px-[96px]">
          <div className="rounded-[32px] border border-neutral-200 bg-[#fafaf8] p-8 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.18)] sm:p-12">
            <h2 className={`${H1} max-w-[20ch] text-[36px] sm:text-[52px] lg:max-w-none lg:text-[56px]`}>
              Start with the workflow that needs attention.
            </h2>
            <p className="mt-6 max-w-[34rem] text-[18px] leading-[1.65] text-neutral-600">
              Tell us about your team, project stage and the question you want
              to resolve. Do not send confidential project documents before
              access and data terms are agreed.
            </p>
            <div className="mt-8">
              <PrimaryButton>Discuss an ADAPT pilot</PrimaryButton>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}