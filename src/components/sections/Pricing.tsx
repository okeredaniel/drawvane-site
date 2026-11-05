"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ACCENT = "#ffc800";
const ACCENT_INK = "#755b00";
const mono = {
  fontFamily:
    'var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
};

type Billing = "monthly" | "yearly";

// Matches the approved CAD catalogue in stratora-backend/modules/subscription/catalog.py.
// Annual amounts are totals, not monthly equivalents. Enterprise is sales-assisted.
const PLAN_PRICES = {
  starter: { monthly: 450, yearly: 4500 },
  team: { monthly: 2400, yearly: 24000 },
  enterprise: { monthly: 6000, yearly: 60000 },
} as const;

const STARTER_FEATURES = [
  "One user",
  "Project document answers",
  "Drawing review and takeoff",
  "Controlled project and usage allowance",
];
const TEAM_FEATURES = [
  "Up to five users",
  "Shared projects",
  "Project discussions",
  "Priority support",
];
const ENTERPRISE_FEATURES = [
  "Annual sales-assisted contract",
  "Portfolio-based usage",
  "Dedicated rollout",
  "Custom procurement and commercial terms",
];

function CheckIcon({ light }: { light?: boolean }) {
  const c = light ? "#0b0b12" : ACCENT_INK;
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden className="shrink-0">
      <circle cx="9" cy="9" r="8" stroke={c} strokeWidth="1.3" />
      <path
        className="pr-check"
        d="M5.6 9.2l2.3 2.3 4.5-4.7"
        stroke={c}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray={1}
      />
    </svg>
  );
}

function FeatureList({ items, light }: { items: string[]; light?: boolean }) {
  return (
    <ul className="mt-5">
      {items.map((f, i) => (
        <li
          key={f}
          className={`pr-feature flex items-center gap-3 py-[10px] text-[15px] ${
            i !== 0 ? (light ? "border-t border-black/15" : "border-t border-black/10") : ""
          } ${light ? "text-[#0b0b12]" : "text-[#1a1b26]"}`}
        >
          <CheckIcon light={light} />
          <span className={light ? "font-medium" : ""}>{f}</span>
        </li>
      ))}
    </ul>
  );
}

function Price({ value, suffix, light }: { value: number; suffix: string; light?: boolean }) {
  const [shown, setShown] = useState(value);
  const state = useRef({ v: value });
  const sufRef = useRef<HTMLSpanElement>(null);
  const first = useRef(true);

  useEffect(() => {
    const tween = gsap.to(state.current, {
      v: value,
      duration: 0.9,
      ease: "power3.out",
      onUpdate: () => setShown(Math.round(state.current.v)),
    });
    return () => {
      tween.kill();
    };
  }, [value]);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    gsap.fromTo(
      sufRef.current,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
    );
  }, [suffix]);

  return (
    <div className="flex flex-wrap items-baseline gap-1.5">
      <span className="text-[38px] font-medium leading-none tracking-tight tabular-nums">
        ${shown.toLocaleString("en-US")}
      </span>
      <span ref={sufRef} className={`text-[15px] ${light ? "text-[#0b0b12]/75" : "text-[#3b3d4d]"}`}>
        {suffix}
      </span>
    </div>
  );
}

function Cta({
  href,
  label,
  variant,
}: {
  href: string;
  label: string;
  variant: "yellow" | "white";
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const isYellow = variant === "yellow";

  const move = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    gsap.to(el, {
      x: (e.clientX - (r.left + r.width / 2)) * 0.12,
      y: (e.clientY - (r.top + r.height / 2)) * 0.25,
      duration: 0.35,
      ease: "power3.out",
    });
  };
  const leave = () =>
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1,0.45)" });

  return (
    <Link
      ref={ref}
      href={href}
      onMouseMove={move}
      onMouseLeave={leave}
      style={{ ...mono, backgroundColor: isYellow ? ACCENT : "#ffffff" }}
      className={`pr-cta group relative flex h-[38px] w-full items-center justify-center gap-2 overflow-hidden rounded-full text-[13px] font-semibold uppercase tracking-wide ${
        isYellow ? "text-[#0b0b12]" : "text-[#0b0b12]"
      }`}
    >
      <span
        aria-hidden
        className="absolute inset-0 translate-y-full rounded-full transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-y-0"
        style={{ backgroundColor: isYellow ? "#0b0b12" : ACCENT }}
      />
      <span
        aria-hidden
        className={`relative inline-block h-[8px] w-[8px] rounded-full border-2 transition-transform duration-300 group-hover:scale-125 ${
          isYellow ? "border-[#0b0b12]/80 group-hover:border-white" : "border-[#b9bccb] group-hover:border-[#0b0b12]"
        }`}
      />
      <span
        className={`relative transition-colors duration-300 ${isYellow ? "group-hover:text-white" : "group-hover:text-[#0b0b12]"}`}
      >
        {label}
      </span>
      <span
        aria-hidden
        className={`relative -ml-1 w-0 -translate-x-2 overflow-hidden opacity-0 transition-all duration-300 group-hover:ml-0 group-hover:w-4 group-hover:translate-x-0 group-hover:opacity-100 ${
          isYellow ? "group-hover:text-white" : "group-hover:text-[#0b0b12]"
        }`}
      >
        →
      </span>
    </Link>
  );
}

export default function Pricing() {
  const root = useRef<HTMLElement>(null);
  const [billing, setBilling] = useState<Billing>("monthly");

  const yearly = billing === "yearly";
  const starter = PLAN_PRICES.starter[billing];
  const team = PLAN_PRICES.team[billing];
  const enterprise = PLAN_PRICES.enterprise[billing];
  const suffix = yearly ? "/year" : "/month";

  const btnRefs = useRef<Record<Billing, HTMLButtonElement | null>>({ monthly: null, yearly: null });
  const indRef = useRef<HTMLSpanElement>(null);
  const saveRef = useRef<HTMLSpanElement>(null);
  const toggleMounted = useRef(false);

  useLayoutEffect(() => {
    const b = btnRefs.current[billing];
    if (!b || !indRef.current) return;
    gsap.to(indRef.current, {
      x: b.offsetLeft,
      width: b.offsetWidth,
      duration: toggleMounted.current ? 0.55 : 0,
      ease: "power3.out",
    });
    if (toggleMounted.current && saveRef.current) {
      gsap.fromTo(
        saveRef.current,
        { scale: 0.8 },
        { scale: 1, duration: 0.7, ease: "elastic.out(1,0.4)" }
      );
    }
    toggleMounted.current = true;
  }, [billing]);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top 70%", once: true },
        defaults: { ease: "power3.out" },
      });

      tl.from(".pr-eyebrow", { y: 12, opacity: 0, duration: 0.5 })
        .from(".pr-word", { yPercent: 110, duration: 0.9, stagger: 0.08, ease: "power4.out" }, "-=0.2")
        .from(".pr-toggle", { y: 20, opacity: 0, scale: 0.9, duration: 0.7, ease: "back.out(1.6)" }, "-=0.5")
        .from(".pr-card", { y: 90, opacity: 0, scale: 0.94, duration: 1, stagger: 0.15 }, "-=0.3")
        .from(".pr-badge", { scale: 0, rotate: -12, duration: 0.6, ease: "back.out(2.4)" }, "-=0.5")
        .from(".pr-feature", { x: -14, opacity: 0, duration: 0.45, stagger: 0.035 }, "-=0.7")
        .fromTo(
          ".pr-check",
          { strokeDashoffset: 1 },
          { strokeDashoffset: 0, duration: 0.5, stagger: 0.035 },
          "<"
        )
        .from(".pr-cta", { y: 16, opacity: 0, duration: 0.5, stagger: 0.1 }, "-=0.4");

      gsap.to(".pr-orb", {
        x: "random(-40, 40)",
        y: "random(-30, 30)",
        duration: "random(3.5, 5.5)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: { each: 0.6, from: "random" },
      });

      gsap.to(".pr-badge-dot", {
        scale: 1.35,
        opacity: 0.55,
        duration: 0.9,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, el);

    return () => ctx.revert();
  }, []);

  const lift = (e: React.MouseEvent<HTMLElement>, on: boolean) =>
    gsap.to(e.currentTarget, {
      y: on ? -8 : 0,
      duration: on ? 0.4 : 0.7,
      ease: on ? "power3.out" : "elastic.out(1,0.5)",
      overwrite: "auto",
    });

  const spot = (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  const headline = ["Choose", "the", "right", "project", "plan."];

  return (
    <section
      id="pricing"
      ref={root}
      className="relative overflow-hidden bg-[#f5f4ef] px-6 py-24 text-[#0b0b12]"
    >
      <div className="mx-auto max-w-[1180px]">
        <div className="flex flex-col items-center text-center">
          <div
            className="pr-eyebrow flex items-center gap-2 text-[13px] uppercase"
            style={{ ...mono, color: ACCENT_INK }}
          >
            <span
              aria-hidden
              className="inline-block h-[8px] w-[8px] rounded-full border-2"
              style={{ borderColor: ACCENT }}
            />
            Pricing
          </div>

          <h2 className="mt-3 max-w-[340px] text-[40px] font-semibold leading-[1.04] tracking-[-0.02em] sm:max-w-[420px] sm:text-[44px]">
            {headline.map((w, i) => (
              <span key={i} className="inline-block overflow-hidden pb-1 align-top">
                <span className="pr-word inline-block">{w}</span>
                {i < headline.length - 1 ? "\u00A0" : ""}
              </span>
            ))}
          </h2>

          <p className="mt-4 text-[15px] text-[#4a4c5c]">
            All prices in Canadian dollars (CAD).
          </p>

          <div className="pr-toggle mt-10 flex flex-wrap items-center justify-center gap-4">
            <div className="relative flex rounded-full bg-[#e4e0d5] p-1" style={mono}>
              <span
                ref={indRef}
                aria-hidden
                className="absolute left-0 top-1 h-[calc(100%-8px)] rounded-full bg-white shadow-sm"
                style={{ width: 0 }}
              />
              {(["monthly", "yearly"] as Billing[]).map((b) => (
                <button
                  key={b}
                  ref={(n) => {
                    btnRefs.current[b] = n;
                  }}
                  type="button"
                  onClick={() => setBilling(b)}
                  aria-pressed={billing === b}
                  className="relative z-10 rounded-full px-4 py-[9px] text-[13px] uppercase text-[#0b0b12]"
                >
                  {b}
                </button>
              ))}
            </div>
            <span
              ref={saveRef}
              className="inline-block text-[13px] uppercase transition-colors duration-300"
              style={{ ...mono, color: yearly ? ACCENT_INK : "#4a4c5c" }}
            >
              2 months free
            </span>
          </div>
          <p className="mt-3 text-[13px] text-[#4a4c5c]">
            Annual savings apply to Starter and Team. Enterprise uses custom terms.
          </p>
        </div>

        <div className="mt-14 grid items-center gap-5 lg:grid-cols-3 lg:gap-[18px]">
          <article
            className="pr-card rounded-[20px] bg-[#ebe8df] p-4 will-change-transform"
            onMouseEnter={(e) => lift(e, true)}
            onMouseLeave={(e) => lift(e, false)}
          >
            <h3 className="text-[16px] uppercase text-[#2b2d3a]">Starter</h3>
            <div className="mt-9">
              <Price value={starter} suffix={suffix} />
              <p className="mt-2 text-[13px] text-[#4a4c5c]">
                {yearly ? "CAD, prepaid annually" : "CAD, billed monthly"}
              </p>
            </div>
            <p className="mt-3 max-w-[300px] text-[15px] leading-[1.35] text-[#4a4c5c]">
              For individual estimators, quantity surveyors and project engineers reviewing project information.
            </p>
            <p className="mt-8 text-[17px] font-medium">Included:</p>
            <FeatureList items={STARTER_FEATURES} />
            <div className="mt-10">
              <Cta href="https://app.stratora.ai/pricing" label="Get started" variant="yellow" />
            </div>
          </article>

          <article
            className="pr-card relative z-10 overflow-hidden rounded-[20px] p-4 text-[#0b0b12] ring-2 ring-[#e5b800] will-change-transform"
            style={{
              background: "linear-gradient(160deg,#ffdc57 0%,#ffc800 55%,#ffd333 100%)",
              boxShadow: "0 30px 60px -20px rgba(96,74,0,0.55)",
            }}
            onMouseEnter={(e) => lift(e, true)}
            onMouseLeave={(e) => lift(e, false)}
            onMouseMove={spot}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.12]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)",
                backgroundSize: "28px 28px",
                maskImage: "radial-gradient(ellipse at 70% 40%, #000 0%, transparent 75%)",
                WebkitMaskImage: "radial-gradient(ellipse at 70% 40%, #000 0%, transparent 75%)",
              }}
            />
            <div
              aria-hidden
              className="pr-orb pointer-events-none absolute -right-10 top-20 h-48 w-48 rounded-full bg-[#ffe799] opacity-40 blur-3xl"
            />
            <div
              aria-hidden
              className="pr-orb pointer-events-none absolute -left-10 bottom-24 h-44 w-44 rounded-full bg-[#fff0b0] opacity-30 blur-3xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-70"
              style={{
                background:
                  "radial-gradient(260px circle at var(--mx,50%) var(--my,30%), rgba(255,255,255,0.22), transparent 70%)",
              }}
            />

            <div className="relative">
              <div className="flex items-start justify-between">
                <h3 className="text-[16px] uppercase text-[#0b0b12]/90">Team</h3>
                <span
                  className="pr-badge flex items-center gap-2 rounded-full bg-white px-3 py-[7px] text-[11px] font-semibold uppercase"
                  style={{ ...mono, color: ACCENT_INK }}
                >
                  <span
                    aria-hidden
                    className="pr-badge-dot inline-block h-[9px] w-[9px] rounded-full border-2"
                    style={{ borderColor: ACCENT }}
                  />
                  For teams
                </span>
              </div>
              <div className="mt-5">
                <Price value={team} suffix={suffix} light />
                <p className="mt-2 text-[13px] text-[#0b0b12]/80">
                  {yearly ? "CAD, prepaid annually" : "CAD, billed monthly"}
                </p>
              </div>
              <p className="mt-3 max-w-[330px] text-[15px] leading-[1.35] text-[#0b0b12]/80">
                For teams that need shared context, closer collaboration, and clear project details.
              </p>
              <p className="mt-6 text-[17px] font-medium">Included:</p>
              <FeatureList items={TEAM_FEATURES} light />
              <div className="mt-8">
                <Cta href="https://app.stratora.ai/pricing" label="Get started" variant="white" />
              </div>
            </div>
          </article>

          <article
            className="pr-card rounded-[20px] bg-[#ebe8df] p-4 will-change-transform"
            onMouseEnter={(e) => lift(e, true)}
            onMouseLeave={(e) => lift(e, false)}
          >
            <h3 className="text-[16px] uppercase text-[#2b2d3a]">Enterprise</h3>
            <div className="mt-7">
              <p className="mb-1 text-[13px] font-medium text-[#4a4c5c]">From</p>
              <Price value={enterprise} suffix={suffix} />
              <p className="mt-2 text-[13px] text-[#4a4c5c]">
                CAD, annual contract with custom terms
              </p>
            </div>
            <p className="mt-4 max-w-[300px] text-[15px] leading-[1.35] text-[#4a4c5c]">
              For contractors rolling out Stratora across a portfolio, with dedicated support and custom terms.
            </p>
            <p className="mt-6 text-[17px] font-medium">Included:</p>
            <FeatureList items={ENTERPRISE_FEATURES} />
            <div className="mt-8">
              <Cta href="mailto:support@stratora.ai" label="Contact sales" variant="yellow" />
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

