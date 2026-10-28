"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";

type Plan = {
  name: string;
  step: string;
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
    step: "Start small",
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
    step: "Roll it out",
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
    step: "Standardize",
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

const TITLE = "Simple pricing for a working pilot.";
const EASE = [0.22, 1, 0.36, 1] as const;
const SPRING = { stiffness: 180, damping: 18, mass: 0.6 };

// Floating drawing sheets behind the heading (large screens only).
const SHEETS = [
  { id: "A-301", pos: "left-[3%] top-[70px] h-[170px] w-[250px]", rotate: -12, tilt: 52, depth: 30, dur: 9, delay: 0, flag: "right-8 top-7 h-9 w-16" },
  { id: "S-102", pos: "left-[11%] top-[250px] h-[135px] w-[200px]", rotate: 8, tilt: 58, depth: 18, dur: 11, delay: 1.2, flag: "left-6 top-8 h-7 w-12" },
  { id: "M-204", pos: "right-[3%] top-[60px] h-[175px] w-[255px]", rotate: 11, tilt: 52, depth: 30, dur: 10, delay: 0.6, flag: "left-8 top-9 h-9 w-16" },
  { id: "E-110", pos: "right-[11%] top-[255px] h-[135px] w-[200px]", rotate: -9, tilt: 58, depth: 18, dur: 12, delay: 1.8, flag: "right-6 top-7 h-7 w-12" },
];

function Sheet({
  sheet,
  mx,
  my,
  sy,
  still,
}: {
  sheet: (typeof SHEETS)[number];
  mx: MotionValue<number>;
  my: MotionValue<number>;
  sy: MotionValue<number>;
  still: boolean;
}) {
  const x = useTransform(mx, [-0.5, 0.5], [-sheet.depth, sheet.depth]);
  // mouse movement plus scroll: deeper sheets drift further as you scroll
  const y = useTransform(
    [my, sy],
    ([m, s]: number[]) => m * 2 * sheet.depth + s * (sheet.depth / 30)
  );

  return (
    <motion.div
      aria-hidden
      style={{ x, y }}
      className={`pointer-events-none absolute hidden [perspective:900px] lg:block ${sheet.pos}`}
    >
      <motion.div
        style={{
          rotateX: sheet.tilt,
          rotateZ: sheet.rotate,
          backgroundImage:
            "linear-gradient(rgba(15,23,42,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.07) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
        animate={still ? undefined : { y: [0, -14, 0] }}
        transition={{ duration: sheet.dur, delay: sheet.delay, repeat: Infinity, ease: "easeInOut" }}
        className="relative h-full w-full rounded-lg border border-neutral-200 bg-white/85 shadow-[0_24px_40px_-24px_rgba(15,23,42,0.35)]"
      >
        <span className={`absolute rounded-sm border-2 border-accent ${sheet.flag}`} />
        <span className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded border border-neutral-300 bg-white px-2 py-1 text-[10px] font-semibold text-neutral-700">
          <span className="size-1.5 bg-accent" />
          {sheet.id}
        </span>
      </motion.div>
    </motion.div>
  );
}

function Check({ dark = false }: { dark?: boolean }) {
  return (
    <span
      className={`mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border ${
        dark ? "border-neutral-700 text-accent" : "border-neutral-200 text-neutral-900"
      }`}
    >
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

function PlanCard({
  plan,
  index,
  reduce,
  wide,
}: {
  plan: Plan;
  index: number;
  reduce: boolean;
  wide: boolean;
}) {
  const dark = !!plan.featured;

  // ---- Scroll-driven 3D: the card starts tilted back, straightens as it
  // reaches the middle of the screen, then leans away as it leaves.
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });
  const dir = index === 0 ? 1 : index === 2 ? -1 : 0; // left card fans one way, right the other
  const fan = wide ? dir * 16 : 0;
  const keys = [0, 0.32, 0.68, 1];
  const sRotX = useTransform(p, keys, [34, 0, 0, -22]);
  const sRotY = useTransform(p, keys, [fan, 0, 0, -fan * 0.6]);
  const sY = useTransform(p, keys, [90 + index * 40, 0, 0, -50]);
  const sScale = useTransform(p, keys, [0.9, 1, 1, 0.96]);
  const sOpacity = useTransform(p, [0, 0.2], [0, 1]);

  // ---- Mouse tilt and glare (inner layer)
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(my, [0, 1], [6, -6]), SPRING);
  const rotateY = useSpring(useTransform(mx, [0, 1], [-6, 6]), SPRING);
  const gx = useTransform(mx, [0, 1], [0, 100]);
  const gy = useTransform(my, [0, 1], [0, 100]);
  const glare = useMotionTemplate`radial-gradient(420px circle at ${gx}% ${gy}%, rgba(245,201,60,${dark ? 0.16 : 0.22}), transparent 60%)`;

  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  }
  function onLeave() {
    mx.set(0.5);
    my.set(0.5);
  }

  return (
    <motion.div
      ref={ref}
      style={
        reduce
          ? undefined
          : {
              rotateX: sRotX,
              rotateY: sRotY,
              y: sY,
              scale: sScale,
              opacity: sOpacity,
              transformPerspective: 1100,
            }
      }
      className={dark ? "lg:-mt-6" : ""}
    >
      <motion.div
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={{
          rotateX: reduce ? 0 : rotateX,
          rotateY: reduce ? 0 : rotateY,
          transformPerspective: 1000,
        }}
      >
        <div
          className={`relative isolate overflow-hidden rounded-2xl p-[1.5px] transition duration-300 hover:-translate-y-1 ${
            dark
              ? "bg-neutral-800 shadow-[0_14px_36px_-14px_rgba(0,0,0,0.55)] hover:shadow-[0_20px_44px_-14px_rgba(245,201,60,0.4)]"
              : "bg-neutral-200 shadow-[0_2px_10px_-4px_rgba(15,23,42,0.1)] hover:bg-neutral-300 hover:shadow-[0_12px_28px_-12px_rgba(15,23,42,0.22)]"
          }`}
        >
          {dark && !reduce && (
            <motion.span
              aria-hidden
              className="absolute left-1/2 top-1/2 aspect-square w-[300%]"
              style={{
                x: "-50%",
                y: "-50%",
                background:
                  "conic-gradient(from 0deg, transparent 0deg, transparent 300deg, #F5C93C 340deg, #fff2b8 355deg, transparent 360deg)",
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 4, ease: "linear", repeat: Infinity }}
            />
          )}

          <Link
            href="/contact"
            aria-label={`${plan.cta}: ${plan.name} plan`}
            className={`group relative block overflow-hidden rounded-[14.5px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
              dark ? "bg-neutral-950 text-neutral-50" : "bg-white text-neutral-900"
            }`}
          >
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{ background: glare }}
            />

            <div className="relative">
              {dark && (
                <div className="bg-accent py-2.5 text-center text-[11px] font-bold uppercase tracking-[0.2em] text-black">
                  Most popular
                </div>
              )}

              <div className="p-8">
                <h2 className="text-[28px] font-medium tracking-tight">{plan.name}</h2>
                <p
                  className={`mt-3 min-h-[52px] text-[16px] leading-relaxed ${
                    dark ? "text-neutral-400" : "text-neutral-600"
                  }`}
                >
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
                    dark
                      ? "mt-7 inline-flex items-center rounded-full bg-accent px-6 py-3 text-[15px] font-semibold text-black transition-opacity group-hover:opacity-90"
                      : "mt-7 inline-flex items-center rounded-full border border-neutral-200 bg-white px-6 py-3 text-[15px] font-medium text-neutral-900 transition group-hover:border-neutral-900"
                  }
                >
                  {plan.cta}
                  <span aria-hidden className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </span>

                <ul className={`mt-9 space-y-4 text-[16px] ${dark ? "text-neutral-300" : "text-neutral-700"}`}>
                  {plan.features.map((feature, i) => (
                    <motion.li
                      key={feature}
                      initial={reduce ? false : { opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.5, ease: EASE, delay: 0.2 + i * 0.06 }}
                      className="flex items-start gap-3"
                    >
                      <Check dark={dark} />
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
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Pricing() {
  const reduce = !!useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Three columns only from the lg breakpoint, so the fan effect is desktop only
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setWide(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Mouse position over the section (-0.5 to 0.5), smoothed. Moves the sheets.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const mx = useSpring(px, { stiffness: 50, damping: 20 });
  const my = useSpring(py, { stiffness: 50, damping: 20 });

  // Scroll position of the section, so the sheets drift as you scroll
  const { scrollYProgress: sectionP } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const sy = useTransform(sectionP, [0, 1], [0, -200]);

  // The yellow rail fills as the cards come into view
  const { scrollYProgress: gridP } = useScroll({
    target: gridRef,
    offset: ["start 85%", "start 30%"],
  });
  const railFill = useSpring(gridP, { stiffness: 90, damping: 25 });

  const words = TITLE.split(" ");

  return (
    <section
      ref={sectionRef}
      id="pricing"
      aria-label="Pricing"
      onPointerMove={(e) => {
        if (reduce) return;
        px.set(e.clientX / window.innerWidth - 0.5);
        py.set(e.clientY / window.innerHeight - 0.5);
      }}
      className="relative isolate overflow-hidden bg-neutral-50 px-6 pb-24 pt-[85px] text-neutral-900 md:px-10"
    >
      {/* soft yellow glow that slowly breathes */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-140px] -z-10 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-accent/25 blur-3xl"
        animate={reduce ? undefined : { scale: [1, 1.12, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {SHEETS.map((s) => (
        <Sheet key={s.id} sheet={s} mx={mx} my={my} sy={sy} still={reduce} />
      ))}

      <div className="relative mx-auto max-w-[1320px]">
        <div className="mx-auto max-w-3xl text-center">
          <motion.span
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="inline-block rounded-full bg-transparent text-[12px] font-bold uppercase tracking-wide text-accent"
          >
            Pricing
          </motion.span>

          <h1
            aria-label={TITLE}
            className="mt-5 text-[clamp(2.5rem,5vw,4rem)] font-medium leading-[1.0] tracking-[-0.04em]"
          >
            {words.map((w, i) => (
              <span
                key={i}
                aria-hidden
                className="mr-[0.25em] inline-block overflow-hidden pb-[0.12em] align-bottom last:mr-0"
              >
                <motion.span
                  className="inline-block"
                  initial={reduce ? false : { y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.8, ease: EASE, delay: 0.1 + i * 0.07 }}
                >
                  {w}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.55 }}
            className="mt-5 text-lg text-neutral-600"
          >
            Start with one pilot project, then expand as your team adopts the workflow.
          </motion.p>
        </div>

        {/* The path: start small, roll it out, standardize */}
        <div aria-hidden className="relative mt-14 hidden grid-cols-3 gap-6 lg:grid">
          <div
            className="absolute top-[15.5px] h-px bg-neutral-200"
            style={{ left: "calc((100% - 3rem) / 6)", right: "calc((100% - 3rem) / 6)" }}
          />
          <motion.div
            className="absolute top-[14.5px] h-[3px] origin-left bg-accent"
            style={{
              left: "calc((100% - 3rem) / 6)",
              right: "calc((100% - 3rem) / 6)",
              scaleX: reduce ? 1 : railFill,
            }}
          />
          {PLANS.map((plan, i) => (
            <div key={plan.name} className="relative z-10 flex flex-col items-center gap-3">
              <span className="grid size-8 place-items-center rounded-full border-2 border-accent bg-white text-[13px] font-semibold">
                {i + 1}
              </span>
              <span className="text-[13px] font-medium uppercase tracking-wide text-neutral-500">
                {plan.step}
              </span>
            </div>
          ))}
        </div>

        <div ref={gridRef} className="mt-10 grid grid-cols-1 gap-6 lg:mt-8 lg:grid-cols-3 lg:items-start">
          {PLANS.map((plan, i) => (
            <PlanCard key={plan.name} plan={plan} index={i} reduce={reduce} wide={wide} />
          ))}
        </div>

        {/* Included in every plan */}
        <motion.ul
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mt-16 flex flex-wrap justify-center gap-3"
        >
          {INCLUDED.map((item) => (
            <li
              key={item}
              className="flex items-center gap-3 rounded-full border border-neutral-200 bg-white py-2.5 pl-3 pr-5 text-[15px] text-neutral-700"
            >
              <Check />
              {item}
            </li>
          ))}
        </motion.ul>

        {/* Closing call to action */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: EASE }}
          className="mt-10 flex flex-col items-start justify-between gap-6 rounded-3xl bg-neutral-950 p-8 md:flex-row md:items-center md:p-10"
        >
          <div>
            <p className="text-[clamp(1.5rem,2.6vw,2rem)] font-medium tracking-tight text-neutral-50">
              Not sure which plan fits?
            </p>
            <p className="mt-2 text-[16px] text-neutral-400">
              Tell us about your projects and we will point you to the right one.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex shrink-0 items-center rounded-full bg-accent px-7 py-3.5 text-[15px] font-semibold text-black transition hover:opacity-90"
          >
            Talk to us
            <span aria-hidden className="ml-2">→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}