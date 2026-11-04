"use client";

import Image from "next/image";
import Link from "next/link";

const mono = {
  fontFamily:
    'var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
};

const BLUE = "#1f3dff";

export default function NorthwayCaseStudy() {
  return (
    <main className="bg-[#eef0f5] text-[#0b0b12]">
      <section className="px-6 pb-16 pt-20 sm:pt-24">
        <div className="mx-auto max-w-[1040px]">
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#1f3dff]"
            style={mono}
          >
            <span aria-hidden>←</span>
            Back to case studies
          </Link>

          <div className="mt-8 overflow-hidden rounded-[26px] bg-[#fbfcff] shadow-[0_30px_80px_rgba(15,23,42,0.08)] ring-1 ring-black/5">
            <div className="grid gap-0 lg:grid-cols-[1.02fr_0.98fr]">
              <div className="p-6 sm:p-8 lg:p-10">
                <div
                  className="inline-flex items-center gap-2 rounded-full border border-[#dfe5ff] bg-[#eef3ff] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#1f3dff]"
                  style={mono}
                >
                  <span aria-hidden className="inline-block h-[8px] w-[8px] rounded-full bg-[#1f3dff]" />
                  Case study
                </div>

                <h1 className="mt-6 max-w-[560px] text-[40px] font-medium leading-[1.05] tracking-[-0.04em] sm:text-[50px]">
                  How Northway aligned three product teams.
                </h1>

                <p className="mt-6 max-w-[540px] text-[17px] leading-[1.6] text-[#4a4c5c]">
                  Northway was trying to keep product, operations, and delivery aligned without creating more
                  meetings, spreadsheets, or duplicate planning rituals. Stratora gave each team a shared plan,
                  clearer ownership, and better visibility into dependencies before a sprint became chaotic.
                </p>

                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  {[
                    ["38%", "Less preparation"],
                    ["12h", "Saved weekly"],
                    ["42", "Team members"],
                  ].map(([value, label]) => (
                    <div key={label} className="rounded-2xl border border-black/5 bg-[#f3f5fb] p-4">
                      <div className="text-[28px] font-medium tracking-[-0.03em] text-[#0b0b12]">{value}</div>
                      <div className="mt-1 text-[11px] uppercase text-[#4a4c5c]" style={mono}>
                        {label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative min-h-[260px] border-t border-black/5 bg-[#e7ebff] lg:min-h-full lg:border-l lg:border-t-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.7),transparent_55%)]" />
                <div className="relative h-full min-h-[260px]">
                  <Image
                    src="/case-studies/northway.avif"
                    alt="Northway planning overview"
                    fill
                    sizes="(max-width: 1024px) 100vw, 520px"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-12">
        <div className="mx-auto grid max-w-[1040px] gap-6 md:grid-cols-3">
          {[
            {
              title: "Challenge",
              copy:
                "Northway had three product teams moving in parallel, but priorities were being reinterpreted across meetings, docs, and handoffs. Every clean-up cycle created more drift and less clarity.",
            },
            {
              title: "Approach",
              copy:
                "They unified goals, milestones, owners, and dependencies into one living plan so leaders and teams could review progress in the same place without rebuilding the update from scratch.",
            },
            {
              title: "Outcome",
              copy:
                "The team cut weekly prep time, reduced duplicated context gathering, and made cross-team dependency decisions far earlier—before they became blockers.",
            },
          ].map((item) => (
            <article key={item.title} className="rounded-[22px] border border-black/5 bg-[#fbfcff] p-6">
              <div className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#1f3dff]" style={mono}>
                {item.title}
              </div>
              <p className="mt-4 text-[16px] leading-[1.55] text-[#1a1b26]">{item.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="mx-auto grid max-w-[1040px] gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[26px] bg-[#0b0b12] p-7 text-white sm:p-8">
            <div className="text-[12px] font-semibold uppercase tracking-[0.14em] text-white/70" style={mono}>
              Before & after
            </div>
            <h2 className="mt-4 max-w-[500px] text-[30px] font-medium tracking-[-0.03em]">
              A single plan that stayed useful as priorities changed.
            </h2>
            <ul className="mt-6 space-y-4 text-[17px] leading-[1.55] text-white/82">
              <li>• Weekly status prep no longer required re-collecting information from multiple tools.</li>
              <li>• Leaders could instantly see which workstreams were moving and which dependencies were at risk.</li>
              <li>• Teams used the same set of priorities, which reduced mismatch between product intent and delivery reality.</li>
            </ul>
          </div>

          <div className="rounded-[26px] border border-black/5 bg-[#fbfcff] p-7 sm:p-8">
            <div className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#1f3dff]" style={mono}>
              Quote
            </div>
            <blockquote className="mt-4 text-[24px] font-medium leading-[1.3] tracking-[-0.02em] text-[#0b0b12]">
              “We stopped spending the first hour of every review reconstructing the plan and started using that time to make decisions.”
            </blockquote>
            <div className="mt-6 text-[15px] text-[#4a4c5c]">
              <div className="font-semibold text-[#0b0b12]">Maya Ellison</div>
              <div className="mt-1" style={mono}>VP Product, Northway</div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto flex max-w-[1040px] justify-center">
          <Link
            href="/contact"
            style={{ backgroundColor: BLUE }}
            className="group relative inline-flex h-[42px] items-center gap-2 overflow-hidden rounded-full px-6 text-[12px] font-semibold uppercase tracking-[0.12em] text-white"
          >
            <span
              aria-hidden
              className="absolute inset-0 translate-y-full bg-[#0b0b12] transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-y-0"
            />
            <span className="relative">Book a demo</span>
            <span
              aria-hidden
              className="relative -ml-1 w-0 -translate-x-2 overflow-hidden opacity-0 transition-all duration-300 group-hover:ml-0 group-hover:w-4 group-hover:translate-x-0 group-hover:opacity-100"
            >
              →
            </span>
          </Link>
        </div>
      </section>
    </main>
  );
}
