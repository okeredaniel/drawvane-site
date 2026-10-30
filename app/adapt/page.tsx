import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/Footer";
import { pageMetadata } from "@/lib/site";
export const metadata = pageMetadata(
  "ADAPT",
  "A focused approach to adopting AI in construction workflows. Start with one project, clear success criteria and professional review.",
  "/adapt",
);
const steps = [
  [
    "Assess the workflow",
    "Identify repetitive work, document challenges and the decisions that need better evidence.",
  ],
  [
    "Define a focused pilot",
    "Choose one project and one workflow. Agree the scope, responsibilities and success criteria before starting.",
  ],
  [
    "Prepare the team",
    "Establish document access, review responsibilities and working practices that fit the people doing the work.",
  ],
  [
    "Evaluate the results",
    "Compare time spent, traceability and review quality against the agreed starting point before expanding.",
  ],
];
export default function AdaptPage() {
  return (
    <>
      <main id="main-content" className="pt-[66px]">
        <section className="site-section" aria-labelledby="adapt-title">
          <p className="eyebrow">ADAPT · Guided adoption</p>
          <h1 id="adapt-title" className="page-title max-w-3xl">
            Bring AI into the way
            <br className="hidden sm:block" /> your team already works.
          </h1>
          <p className="section-intro">
            Start with one project and one practical workflow. Define what
            success looks like, prepare your team and evaluate the results with
            professional review throughout.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link className="button-primary" href="/contact?topic=adapt">
              Discuss an ADAPT pilot
            </Link>
            <a className="button-secondary" href="#adapt-process">
              Explore the approach
            </a>
          </div>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-neutral-600">
            For construction firms, consultants, estimators and project teams.
            Pilot availability, capabilities, fees and delivery arrangements are
            confirmed before engagement.
          </p>
        </section>
        <section className="example-section">
          <div className="site-section example-layout">
            <div>
              <p className="eyebrow">Platform and practice</p>
              <h2 className="section-title">
                Stratora is the platform.
                <br />
                ADAPT is the process.
              </h2>
              <p className="section-intro">
                ADAPT is Stratora’s adoption program for helping teams introduce
                AI into drawing, document and project-review workflows. It
                starts with a bounded question and a shared way to judge the
                evidence.
              </p>
              <p className="mt-5 text-base leading-relaxed text-neutral-600">
                It is not a replacement for professional judgment. Project
                decisions, quantities and technical conclusions remain subject
                to the appropriate human review.
              </p>
            </div>
            <div className="example-workspace">
              <div className="example-toolbar">
                <span>ILLUSTRATIVE PILOT</span>
                <span>DRAWING REVIEW</span>
              </div>
              <Image
                src="/illustrations/revision.svg"
                width={960}
                height={640}
                alt="Illustrative floor plan highlighting an area for review, not for construction"
              />
              <div className="example-answer">
                <p className="eyebrow">One question. A defined outcome.</p>
                <h3>What changed in this drawing revision?</h3>
                <p>
                  Agree a drawing set, identify the evidence to compare and have
                  a qualified reviewer check the findings. Measure the review
                  effort and traceability before considering a wider rollout.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section
          id="adapt-process"
          className="site-section scroll-mt-20"
          aria-labelledby="process-title"
        >
          <p className="eyebrow">A practical starting point</p>
          <h2 id="process-title" className="section-title">
            Four steps to a focused pilot.
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {steps.map(([title, description], i) => (
              <article className="pricing-card" key={title}>
                <p className="eyebrow">0{i + 1}</p>
                <h3 className="mt-4 text-2xl font-semibold">{title}</h3>
                <p className="mt-4 leading-relaxed text-neutral-600">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </section>
        <section className="site-section !pt-0">
          <div className="contact-card">
            <h2 className="section-title !mt-0">
              Start with the workflow that needs attention.
            </h2>
            <p className="section-intro">
              Tell us about your team, project stage and the question you want
              to resolve. Do not send confidential project documents before
              access and data terms are agreed.
            </p>
            <Link className="button-primary mt-8" href="/contact?topic=adapt">
              Discuss an ADAPT pilot
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
