"use client";

import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

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

const INK = "#0E1A2B";
const LABELS = ["A", "B", "C"];

export default function Pricing() {
  const root = useRef<HTMLElement>(null);
  const sheet = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Reduced motion: no animation, the sheet just sits there.
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const cols = gsap.utils.toArray<HTMLElement>(".plan-col");

        const tl = gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: { trigger: sheet.current, start: "top 80%" },
        });

        // 1. the sheet's dividing rules draw first
        tl.from(".vrule", { scaleY: 0, transformOrigin: "top", duration: 0.9, stagger: 0.12, ease: "power3.inOut" }, 0);
        tl.from(".hrule", { scaleX: 0, transformOrigin: "left", duration: 0.9, stagger: 0.05, ease: "power3.inOut" }, 0.1);

        // 2. then each column is wiped in from the top, one after another
        cols.forEach((col, i) => {
          const at = 0.35 + i * 0.16;
          tl.from(col.querySelector(".col-body"), { clipPath: "inset(0 0 100% 0)", duration: 1, ease: "power3.inOut" }, at);
          tl.from(col.querySelectorAll(".col-part"), { y: 22, opacity: 0, duration: 0.8, stagger: 0.07 }, at + 0.25);
          tl.from(col.querySelectorAll(".feat"), { x: -14, opacity: 0, duration: 0.7, stagger: 0.08 }, at + 0.55);

          // "$1,200" counts up
          const priceEl = col.querySelector<HTMLElement>(".price-num");
          if (priceEl) {
            const target = Number(priceEl.dataset.value || 0);
            const counter = { v: 0 };
            priceEl.textContent = "$0";
            tl.to(
              counter,
              {
                v: target,
                duration: 1.4,
                ease: "power2.out",
                onUpdate: () => {
                  priceEl.textContent = "$" + Math.round(counter.v).toLocaleString("en-US");
                },
              },
              at + 0.3
            );
          }
        });
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section
      id="pricing"
      aria-label="Pricing"
      ref={root}
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

        {/* ---------- One ruled sheet, three columns ---------- */}
        <div ref={sheet} className="mt-14 grid grid-cols-1 border border-[#0E1A2B] lg:grid-cols-3">
          {PLANS.map((plan, i) => {
            const dark = !!plan.featured;
            const priceValue = plan.price.startsWith("$") ? plan.price.replace(/[^0-9]/g, "") : null;
            return (
              <article key={plan.name} className="plan-col group relative flex flex-col bg-white">
                {/* divider between columns */}
                {i > 0 && (
                  <>
                    <span aria-hidden className="vrule absolute inset-y-0 left-0 hidden w-px bg-[#0E1A2B] lg:block" />
                    <span aria-hidden className="hrule absolute inset-x-0 top-0 h-px bg-[#0E1A2B] lg:hidden" />
                  </>
                )}

                <div className="col-body flex h-full flex-col">
                  {/* title strip */}
                  <div
                    className={`col-part flex items-center justify-between border-b border-[#0E1A2B] px-6 py-3 transition-colors duration-300 md:px-8 ${
                      dark ? "bg-[#F5C93C]" : "bg-[#F4F6F9] group-hover:bg-[#F5C93C]"
                    }`}
                  >
                    <span style={{ color: INK }} className="text-[12px] font-semibold uppercase tracking-[0.16em]">
                      Plan {LABELS[i]}
                    </span>
                    {dark && (
                      <span style={{ color: INK }} className="text-[12px] font-semibold uppercase tracking-[0.16em]">
                        Most popular
                      </span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col px-6 pb-8 pt-8 md:px-8">
                    <h2
                      style={{ color: INK }}
                      className="col-part text-[clamp(2.2rem,3.4vw,3.2rem)] font-semibold leading-none tracking-[-0.045em]"
                    >
                      {plan.name}
                    </h2>
                    <p className="col-part mt-3 min-h-[3.4rem] text-[15px] leading-relaxed text-neutral-600">
                      {plan.description}
                    </p>

                    {/* price */}
                    <div className="col-part mt-8 border-t border-[#0E1A2B]/20 pt-6">
                      <p
                        style={{ color: INK }}
                        className="text-[clamp(2.6rem,4vw,3.6rem)] font-semibold leading-none tracking-[-0.05em]"
                      >
                        {priceValue ? (
                          <span className="price-num" data-value={priceValue}>
                            {plan.price}
                          </span>
                        ) : (
                          plan.price
                        )}
                      </p>
                      <p className="mt-2 text-sm text-neutral-500">{plan.note}</p>
                    </div>

                    {/* features, numbered like a drawing schedule */}
                    <ul className="mt-8 flex-1 border-t border-[#0E1A2B]/20">
                      {plan.features.map((f, n) => (
                        <li
                          key={f}
                          className="feat grid grid-cols-[2.25rem_1fr] border-b border-[#0E1A2B]/12 py-3 text-[15px] text-neutral-700"
                        >
                          <span className="tabular-nums text-neutral-400">0{n + 1}</span>
                          <span className={f.startsWith("Everything") ? "font-semibold text-neutral-900" : ""}>
                            {f}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <Link
                      href="/contact"
                      style={{ color: "#fff" }}
                      className="col-part group/btn mt-8 flex items-center justify-between bg-[#0E1A2B] px-5 py-3.5 text-[15px] font-medium transition-colors hover:bg-[#1B2C45] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                    >
                      {plan.cta}
                      <span
                        aria-hidden
                        className="text-[18px] leading-none transition-transform duration-300 group-hover/btn:translate-x-1.5"
                      >
                        →
                      </span>
                    </Link>
                  </div>
                </div>
              </article>
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