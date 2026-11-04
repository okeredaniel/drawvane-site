"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// EXAMPLE FIGURES, not measured results. Replace them with numbers you can
// back up. The caption under the panel says they are examples: delete it only
// once the numbers are real.
const CAPTION = "Example figures, not measured results.";
const STATS = [
  { label: "Project value", value: 2_000_000, highlight: false },
  { label: "Estimated rework cost", value: 100_000, highlight: true },
];

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const RED = "#E5372E";
const INK = "#0E1A2B";
// How much of the project value the rework is, worked out from the figures above.
const PCT = Math.round((STATS[1].value / STATS[0].value) * 100);

export default function FloatingPills() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Reduced motion: no animation, everything just shows.
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: { trigger: root.current, start: "top 80%" },
        });

        // 1. the floor plan draws itself, line by line
        tl.from(".plan-draw", { strokeDashoffset: 1, duration: 1.1, stagger: 0.14, ease: "power2.inOut" }, 0);

        // 2. the project value counts up while the plan draws
        const rows = gsap.utils.toArray<HTMLElement>(".stat-row");
        const counters = rows.map((row) => {
          const el = row.querySelector<HTMLElement>(".stat-num")!;
          el.textContent = money.format(0);
          return { el, target: Number(el.dataset.value || 0), c: { v: 0 } };
        });
        const count = (i: number, at: number, dur: number) =>
          tl.to(
            counters[i].c,
            {
              v: counters[i].target,
              duration: dur,
              ease: "power3.inOut",
              onUpdate: () => {
                counters[i].el.textContent = money.format(Math.round(counters[i].c.v));
              },
            },
            at
          );
        tl.from(rows[0].querySelectorAll(".stat-in"), { y: 20, opacity: 0, duration: 0.8, stagger: 0.08 }, 0.2);
        count(0, 0.3, 1.5);

        // 3. then the red figure appears and counts up
        tl.from(rows[1].querySelectorAll(".stat-in"), { y: 20, opacity: 0, duration: 0.8, stagger: 0.08 }, 1.5);
        count(1, 1.6, 1.1);
        tl.from(".stat-caption", { opacity: 0, duration: 0.8 }, 2.5);
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <div ref={root} className="mx-auto mt-28 w-full max-w-[780px] text-left sm:mt-40">
      <div className="grid items-center gap-10 sm:grid-cols-[1.15fr_1fr] sm:gap-12">
        {/* ---------- the drawing ---------- */}
        <svg viewBox="0 0 400 260" className="block w-full" aria-hidden>
          <g stroke={INK} fill="none" strokeLinecap="square" strokeLinejoin="round">
            <rect className="plan-draw" pathLength={1} strokeDasharray={1} x="20" y="20" width="360" height="220" strokeWidth="4" />
            <g strokeWidth="3">
              <path className="plan-draw" pathLength={1} strokeDasharray={1} d="M150 20V128M150 172V240" />
              <path className="plan-draw" pathLength={1} strokeDasharray={1} d="M20 130H150" />
              <path className="plan-draw" pathLength={1} strokeDasharray={1} d="M270 20V240" />
            </g>
            <path
              className="plan-draw"
              pathLength={1}
              strokeDasharray={1}
              d="M150 128A44 44 0 0 1 194 172M150 172H194"
              stroke="#7C899B"
              strokeWidth="1.3"
            />
          </g>

        </svg>

        {/* ---------- the two figures ---------- */}
        <div className="space-y-8">
          {STATS.map((stat) => {
            const color = stat.highlight ? RED : INK;
            return (
              <div key={stat.label} className="stat-row">
                <div className="stat-in flex items-center gap-2">
                  <p
                    aria-hidden
                    className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500"
                  >
                    {stat.label}
                  </p>
                </div>
                <p
                  aria-hidden
                  style={{ color }}
                  className="stat-in mt-2 text-[clamp(1.9rem,3.8vw,2.9rem)] font-semibold leading-none tracking-[-0.04em] tabular-nums"
                >
                  <span className="stat-num inline-block whitespace-nowrap" data-value={stat.value}>
                    {money.format(stat.value)}
                  </span>
                </p>
                {stat.highlight && (
                  <p aria-hidden style={{ color: RED }} className="stat-in mt-2 text-[13px] font-semibold">
                    {PCT}% of the project value
                  </p>
                )}
                <span className="sr-only">
                  {stat.label}: {money.format(stat.value)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <p className="stat-caption mt-10 text-[12px] text-neutral-500">{CAPTION}</p>
    </div>
  );
}