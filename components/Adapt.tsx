"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import AdaptCompare from "./AdaptCompare";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// ---- Copy lives here so it is easy to change ---------------------------
const HEADLINE = ["One project.", "One workflow.", "See if it holds up."];
const INTRO =
  "Start with one project and one practical workflow. Agree what success looks like, prepare the team, and review the results with a professional in the loop.";
const STATEMENT =
  "ADAPT is how a team starts using Stratora. One project, one workflow, and an agreed way to judge the result. It never replaces professional judgment: quantities, decisions and conclusions stay with the people who review them.";
const STEPS_TITLE = "How a pilot runs.";
const STEPS = [
  {
    title: "Assess the workflow",
    body: "Find the repetitive work, the document problems and the decisions that need better evidence.",
  },
  {
    title: "Define a focused pilot",
    body: "Pick one project and one workflow. Agree scope, responsibilities and success criteria before starting.",
  },
  {
    title: "Prepare the team",
    body: "Set up document access, review responsibilities and working habits that fit the people doing the work.",
  },
  {
    title: "Evaluate the results",
    body: "Compare time spent, traceability and review quality against the starting point before expanding.",
  },
];
const CLOSE_HEADLINE = ["Tell us what", "slows your team down."];
const CLOSE_TEXT =
  "Tell us about your team, project stage and the question you want to answer.";
const SMALL_PRINT =
  "Please don't send confidential project documents until access and data terms are agreed. Pilot availability, fees and delivery are confirmed before engagement.";
// -----------------------------------------------------------------------

const WRAP = "mx-auto max-w-[1500px] px-5 sm:px-8 md:px-12";
const DISPLAY = "font-semibold tracking-[-0.045em] leading-[0.98]";

/* ---------- CTA button: pulled toward the cursor with GSAP ---------- */

function PilotButton() {
  const zone = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const z = zone.current;
    const b = btn.current;
    if (!z || !b) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const xTo = gsap.quickTo(b, "x", { duration: 0.7, ease: "elastic.out(1, 0.45)" });
    const yTo = gsap.quickTo(b, "y", { duration: 0.7, ease: "elastic.out(1, 0.45)" });
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = z.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * 0.3);
      yTo((e.clientY - (r.top + r.height / 2)) * 0.3);
    };
    const leave = () => {
      xTo(0);
      yTo(0);
    };
    z.addEventListener("pointermove", move);
    z.addEventListener("pointerleave", leave);
    return () => {
      z.removeEventListener("pointermove", move);
      z.removeEventListener("pointerleave", leave);
      gsap.killTweensOf(b);
    };
  }, []);

  return (
    // the outer zone stays still, so the pull never fights the cursor
    <div ref={zone} className="-m-6 inline-block p-6">
      <div ref={btn}>
        <Link
          href="/contact"
          className="group inline-flex items-center gap-3 rounded-full bg-[#F5C93C] px-8 py-4 text-[17px] font-semibold text-[#0E1A2B] transition hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0E1A2B]"
        >
          Discuss an ADAPT pilot
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
            className="transition-transform duration-300 group-hover:translate-x-1.5"
          >
            <path d="M5 12h14" />
            <path d="m13 6 6 6-6 6" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

// A line of text that slides up out of a mask
function MaskLine({
  children,
  cls,
  className = "",
}: {
  children: React.ReactNode;
  cls: string;
  className?: string;
}) {
  return (
    <span className="block overflow-hidden pb-[0.1em]">
      <span className={`${cls} block ${className}`}>{children}</span>
    </span>
  );
}

export default function Adapt() {
  const root = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const statementText = useRef<HTMLParagraphElement>(null);
  const steps = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Reduced motion: no animation at all, everything stays readable.
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        /* ---------- 1. Hero ---------- */
        gsap
          .timeline({ defaults: { ease: "power4.out" } })
          .from(".hero-line", { yPercent: 115, duration: 1.1, stagger: 0.12 }, 0.1)
          .from(".hero-fade", { y: 24, opacity: 0, duration: 0.9, stagger: 0.12, ease: "power3.out" }, 0.75);

        // the demo frame grows into place as it scrolls into view
        gsap.fromTo(
          frame.current,
          { scale: 0.88, borderRadius: 72, transformOrigin: "50% 0%" },
          {
            scale: 1,
            borderRadius: 32,
            ease: "none",
            scrollTrigger: { trigger: frame.current, start: "top 98%", end: "top 30%", scrub: true },
          }
        );

        /* ---------- 2. Statement: words light up as you scroll past ---------- */
        const words = gsap.utils.toArray<HTMLElement>(".lit-word");
        gsap.set(words, { opacity: 0.15 });
        gsap.to(words, {
          opacity: 1,
          ease: "none",
          stagger: 0.1,
          scrollTrigger: {
            trigger: statementText.current,
            start: "top 80%",
            end: "bottom 50%",
            scrub: true,
          },
        });

        /* ---------- 3. Steps: each row draws its line, then its text comes up ---------- */
        const items = gsap.utils.toArray<HTMLElement>(".acc-item");
        if (window.matchMedia("(min-width: 768px)").matches) {
          // Desktop: the section pins and one giant step stays open at a time.
          const parts = (el: HTMLElement) => el.querySelectorAll(".acc-title, .acc-num");
          items.forEach((it, i) => {
            if (i === 0) return;
            gsap.set(parts(it), { opacity: 0.2 });
            gsap.set(it.querySelector(".acc-body"), { height: 0, opacity: 0 });
          });

          const tl = gsap.timeline({
            defaults: { ease: "power2.inOut" },
            scrollTrigger: {
              trigger: steps.current,
              start: "top top",
              end: "+=300%",
              pin: true,
              scrub: 0.5,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });
          for (let i = 1; i < items.length; i++) {
            const at = 0.5 + (i - 1) * 1.5;
            const prev = items[i - 1];
            const cur = items[i];
            const curBody = cur.querySelector<HTMLElement>(".acc-body")!;
            tl.to(prev.querySelector(".acc-body"), { height: 0, opacity: 0, duration: 0.6 }, at)
              .to(parts(prev), { opacity: 0.2, duration: 0.6 }, at)
              .to(curBody, { height: () => curBody.scrollHeight, opacity: 1, duration: 0.6 }, at)
              .to(parts(cur), { opacity: 1, duration: 0.6 }, at);
          }
          tl.to({}, { duration: 0.6 });

          gsap.fromTo(
            ".acc-fill",
            { scaleY: 0.25 },
            {
              scaleY: 1,
              ease: "none",
              scrollTrigger: { trigger: steps.current, start: "top top", end: "+=300%", scrub: true },
            }
          );
        } else {
          // Phones: normal stack, each step rises in
          items.forEach((it) => {
            gsap.from(it, {
              y: 40,
              opacity: 0,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: { trigger: it, start: "top 88%" },
            });
          });
        }

        /* ---------- 4. Close ---------- */
        gsap
          .timeline({
            defaults: { ease: "power4.out" },
            scrollTrigger: { trigger: ".close-head", start: "top 78%" },
          })
          .from(".close-line", { yPercent: 115, duration: 1.1, stagger: 0.14 }, 0)
          .from(".close-fade", { y: 28, opacity: 0, duration: 0.9, stagger: 0.12, ease: "power3.out" }, 0.45);
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  const words = STATEMENT.split(" ");

  return (
    <div ref={root}>
      {/* ---------- 1. Hero ---------- */}
      <section className="bg-white pt-16 md:pt-24">
        <div className={WRAP}>
          <h1
            style={{ color: "#0E1A2B" }}
            className={`${DISPLAY} mx-auto text-center text-[clamp(2.8rem,7.2vw,7.4rem)]`}
          >
            {HEADLINE.map((l, i) => (
              <MaskLine key={l} cls="hero-line" className={i === 2 ? "text-[#0E1A2B]/40" : ""}>
                {l}
              </MaskLine>
            ))}
          </h1>
          <p className="hero-fade mx-auto mt-8 max-w-[38rem] text-center text-[19px] leading-[1.6] text-[#3F4C5F]">
            {INTRO}
          </p>
          <div className="hero-fade mt-10 flex justify-center">
            <PilotButton />
          </div>
        </div>

        <div className={`${WRAP} mt-16 pb-24 md:mt-24 md:pb-36`}>
          <div ref={frame} className="rounded-[32px] bg-[#E9EEF4] p-4 sm:p-6 md:p-12">
            <AdaptCompare />
          </div>
        </div>
      </section>

      {/* ---------- 2. Statement ---------- */}
      <section className="bg-white pb-28 md:pb-44">
        <div className={WRAP}>
          <p
            ref={statementText}
            className={`${DISPLAY} max-w-[1100px] text-[clamp(1.9rem,4.4vw,4rem)] leading-[1.1] text-[#0E1A2B]`}
          >
            {words.map((w, i) => (
              <span key={i} className="lit-word mr-[0.26em] inline-block">
                {w}
              </span>
            ))}
          </p>
        </div>
      </section>

      {/* ---------- 3. Steps ---------- */}
      <section
        ref={steps}
        className="relative bg-[#F4F6F9] py-24 md:flex md:h-screen md:items-center md:pb-12 md:pt-32"
      >
        <div className={`${WRAP} w-full`}>
          <h2
            style={{ color: "#0E1A2B" }}
            className={`${DISPLAY} text-[clamp(2.4rem,4.6vw,4.5rem)]`}
          >
            {STEPS_TITLE}
          </h2>

          <div className="mt-10 grid gap-x-8 md:mt-14 md:grid-cols-[auto_1fr] md:gap-x-12">
            {/* progress rail */}
            <div aria-hidden className="hidden w-[3px] self-stretch bg-[#0E1A2B]/10 md:block">
              <div className="acc-fill h-full origin-top bg-[#F5C93C]" />
            </div>

            <ol>
              {STEPS.map((s, i) => (
                <li key={s.title} className="acc-item border-t border-[#0E1A2B]/15 py-4 md:py-5">
                  <div className="flex items-baseline gap-4 md:gap-6">
                    <span className="acc-num w-8 shrink-0 text-[15px] font-medium text-[#0E1A2B] md:w-10">
                      0{i + 1}
                    </span>
                    <h3
                      style={{ color: "#0E1A2B" }}
                      className={`${DISPLAY} acc-title text-[clamp(2.1rem,4.6vw,4.6rem)] leading-[1.02]`}
                    >
                      {s.title}
                    </h3>
                  </div>
                  <div className="acc-body overflow-hidden pl-12 md:pl-16">
                    <p className="max-w-[34rem] pb-2 pt-3 text-[18px] leading-relaxed text-[#3F4C5F]">
                      {s.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ---------- 4. Close ---------- */}
      <section className="bg-[#F4F6F9]">
        <div className={`${WRAP} close-head py-24 text-center md:py-44`}>
          <h2
            style={{ color: "#0E1A2B" }}
            className={`${DISPLAY} text-[clamp(2.6rem,6.8vw,6.8rem)]`}
          >
            {CLOSE_HEADLINE.map((l) => (
              <MaskLine key={l} cls="close-line">
                {l}
              </MaskLine>
            ))}
          </h2>
          <p className="close-fade mx-auto mt-10 max-w-[34rem] text-[20px] leading-[1.55] text-[#3F4C5F]">
            {CLOSE_TEXT}
          </p>
          <div className="close-fade mt-8 flex justify-center">
            <PilotButton />
          </div>
          <p className="close-fade mx-auto mt-10 max-w-[34rem] text-[14px] leading-relaxed text-[#0E1A2B]/60">
            {SMALL_PRINT}
          </p>
        </div>
      </section>
    </div>
  );
}