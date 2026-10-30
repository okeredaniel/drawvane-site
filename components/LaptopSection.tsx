import Link from "next/link";
import Image from "next/image";
export default function LaptopSection() {
  return (
    <section
      id="demo"
      className="example-section"
      aria-labelledby="example-title"
    >
      <div className="site-section example-layout">
        <div>
          <p className="eyebrow">From question to source</p>
          <h2 id="example-title" className="section-title">
            Make the evidence
            <br />
            part of the answer.
          </h2>
          <p className="section-intro">
            A useful answer gives the team somewhere to look next. This prepared
            example shows a question, a source reference and a review step
            together.
          </p>
          <p className="mt-5 text-sm text-neutral-600">
            Illustrative content. This is not a live analysis or a customer
            project.
          </p>
          <Link className="button-secondary mt-7" href="/contact?topic=demo">
            Discuss your workflow
          </Link>
        </div>
        <div className="example-workspace">
          <div className="example-toolbar">
            <span>DRAWING REVIEW</span>
            <span>Prepared example</span>
          </div>
          <Image
            src="/illustrations/drawing.svg"
            width="900"
            height="600"
            alt="Illustrative floor plan with a highlighted room and a reference to sheet A-201"
          />
          <div className="example-answer">
            <p className="eyebrow">The question</p>
            <h3>Which area needs a source check?</h3>
            <p>
              The highlighted room is marked for review on this illustrative
              sheet. Open A-201 and check the current revision before making a
              project decision.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="example-tag">A-201 · Rev A</span>
              <span className="example-tag">Professional review required</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
