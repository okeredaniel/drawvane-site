"use client";
import { useSiteMotion } from "./SiteMotion";

import { useEffect, useRef } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";

// No measured results are published here yet. Each card shows a short word
// (`headline`) instead of a number.
// When you have real, approved figures, give a card `value` and `suffix`
// (and remove its `headline`), for example:
//   { value: 12, suffix: " min", text: "average to draft a referenced RFI." }
// Cards with a `value` count up when they scroll into view.
type IconName = "cited" | "traced" | "reviewed" | "private";

type Stat = {
  value?: number;
  suffix?: string;
  headline?: string;
  text: string;
  icon: IconName;
};

const HEADING = "What to evaluate in your pilot.";
const STATS: Stat[] = [
  { icon: "cited", headline: "Cited", text: "Check answers against the cited sheet or specification." },
  { icon: "traced", headline: "Traced", text: "Test a revision against related project documents." },
  { icon: "reviewed", headline: "Reviewed", text: "Have a qualified person verify quantities before use." },
  { icon: "private", headline: "Private", text: "Agree document access and data-handling terms first." },
];

const EASE = [0.22, 1, 0.36, 1] as const;

/* ---------- count-up (unchanged behaviour) ---------- */

function CountUp({
  value,
  suffix,
  delay,
}: {
  value: number;
  suffix: string;
  delay: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!inView || !ref.current) return;
    const el = ref.current;
    const controls = animate(0, value, {
      duration: 1.6,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        el.textContent = `${Math.round(v)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, value, suffix, delay]);

  return <span ref={ref}>{`${value}${suffix}`}</span>;
}

/* ---------- line icons that draw themselves ---------- */

function Icon({ name, delay }: { name: IconName; delay: number }) {
  const draw = (extra = 0) => ({
    initial: { pathLength: 0, opacity: 0 },
    whileInView: { pathLength: 1, opacity: 1 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 1.1, ease: EASE, delay: delay + 0.5 + extra },
  });
  const dot = (cx: number, cy: number, extra: number) => (
    <motion.circle
      cx={cx}
      cy={cy}
      r="3.5"
      fill="currentColor"
      initial={{ scale: 0 }}
      whileInView={{ scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ type: "spring", stiffness: 300, damping: 16, delay: delay + 0.7 + extra }}
      style={{ transformBox: "fill-box", transformOrigin: "center" }}
    />
  );

  return (
    <svg
      viewBox="0 0 64 64"
      className="size-16 text-accent"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {name === "cited" && (
        <>
          <motion.path d="M14 8h26l10 10v38H14z" {...draw()} />
          <motion.path d="M20 30h22M20 38h16" {...draw(0.2)} />
          <motion.path d="M42 46l10 10" {...draw(0.4)} />
          {dot(42, 46, 0.4)}
        </>
      )}
      {name === "traced" && (
        <>
          <motion.path d="M10 50L28 22l16 14 10-24" {...draw()} />
          {dot(10, 50, 0)}
          {dot(28, 22, 0.2)}
          {dot(44, 36, 0.4)}
          {dot(54, 12, 0.6)}
        </>
      )}
      {name === "reviewed" && (
        <>
          <motion.circle cx="32" cy="32" r="23" {...draw()} />
          <motion.path d="M20 33l9 9 16-19" {...draw(0.3)} />
        </>
      )}
      {name === "private" && (
        <>
          <motion.path d="M22 28v-8a10 10 0 0 1 20 0v8" {...draw()} />
          <motion.rect x="14" y="28" width="36" height="26" rx="5" {...draw(0.2)} />
          {dot(32, 41, 0.5)}
        </>
      )}
    </svg>
  );
}

/* ---------- one drawing sheet: tilts in 3D toward the pointer ---------- */

function Sheet({ stat, i, reduce }: { stat: Stat; i: number; reduce: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 180, damping: 18, mass: 0.6 });
  const sy = useSpring(py, { stiffness: 180, damping: 18, mass: 0.6 });

  const rotateX = useTransform(sy, [-0.5, 0.5], [9, -9]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-11, 11]);
  const gx = useTransform(sx, [-0.5, 0.5], [0, 100]);
  const gy = useTransform(sy, [-0.5, 0.5], [0, 100]);
  const shadowX = useTransform(sx, [-0.5, 0.5], [18, -18]);
  const shadowY = useTransform(sy, [-0.5, 0.5], [34, 14]);

  const glare = useMotionTemplate`radial-gradient(280px circle at ${gx}% ${gy}%, rgba(255,255,255,0.95), transparent 65%)`;
  const shadow = useMotionTemplate`${shadowX}px ${shadowY}px 44px -18px rgba(15,23,42,0.28)`;

  const onMove = (e: React.PointerEvent) => {
    if (reduce || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    px.set(0);
    py.set(0);
  };

  // Sheets start as a pile in the middle and fan out into the row.
  const fan = i - 1.5;
  const delay = i * 0.1;

  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, x: -fan * 70, y: 40, rotate: -fan * 7, scale: 0.92 }}
      whileInView={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1.1, ease: EASE, delay }}
      style={{ perspective: 1100 }}
    >
      <motion.div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={{
          rotateX: reduce ? 0 : rotateX,
          rotateY: reduce ? 0 : rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative h-full"
      >
        {/* two sheets underneath, so each card reads as the top of a stack */}
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-[22px] border border-neutral-200 bg-neutral-100"
          style={{ transform: "translateZ(-34px) translate(10px, 12px)" }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-[22px] border border-neutral-200 bg-white"
          style={{ transform: "translateZ(-17px) translate(5px, 6px)" }}
        />

        <motion.div
          className="relative flex h-full min-h-[320px] flex-col overflow-hidden rounded-[22px] border border-neutral-200 bg-gradient-to-br from-white to-neutral-100 p-7"
          style={{ boxShadow: shadow, transformStyle: "preserve-3d" }}
        >
          {/* light that follows the pointer */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{ background: glare }}
          />

          {/* title-block rule, like the strip on a drawing sheet */}
          <div
            aria-hidden="true"
            className="absolute inset-x-7 bottom-[88px] h-px bg-neutral-200"
          />

          <div className="relative" style={{ transform: "translateZ(56px)" }}>
            <Icon name={stat.icon} delay={delay} />
          </div>

          <p
            className="relative mt-auto text-[clamp(2.5rem,3.4vw,3.25rem)] font-medium leading-none tracking-[-0.045em] text-neutral-900"
            style={{ transform: "translateZ(34px)" }}
          >
            {stat.value !== undefined ? (
              <CountUp value={stat.value} suffix={stat.suffix ?? ""} delay={delay} />
            ) : (
              stat.headline
            )}
          </p>

          <p
            className="relative mt-7 text-base leading-relaxed text-neutral-500"
            style={{ transform: "translateZ(16px)" }}
          >
            {stat.text}
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/* ---------- section ---------- */

export default function Results() {
  const { paused: reduce } = useSiteMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  // The blueprint grid drifts slower than the page, which gives the cards depth.
  const gridY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-60, 60]);

  return (
    <section
      ref={sectionRef}
      id="results"
      aria-label="Pilot evaluation criteria"
      className="relative overflow-hidden border-y border-neutral-200 bg-neutral-50 px-6 py-20 md:px-24 md:py-28"
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-0 -inset-y-[80px]"
        style={{
          y: gridY,
          backgroundImage:
            "linear-gradient(to right, rgba(15,23,42,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,23,42,0.06) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 50%, #000 30%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 50%, #000 30%, transparent 100%)",
        }}
      />

      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: EASE }}
        className="relative text-center text-[clamp(2.25rem,3.4vw,3rem)] font-medium leading-[1.05] tracking-[-0.04em] text-neutral-900"
      >
        {HEADING}
      </motion.h2>

      <div className="relative mt-20 grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 md:grid-cols-4">
        {STATS.map((stat, i) => (
          <Sheet key={stat.text} stat={stat} i={i} reduce={reduce} />
        ))}
      </div>
    </section>
  );
}
