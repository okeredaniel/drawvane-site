"use client";

import { useEffect } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";

// EXAMPLE FIGURES, not measured results. Replace them with numbers you can
// back up. The caption under the panel says they are examples: delete it only
// once the numbers are real.
const CAPTION = "Example figures, not measured results.";
const STATS = [
  { label: "Project value", value: 2_000_000, highlight: false, z: 28, delay: 0 },
  { label: "Estimated rework cost", value: 100_000, highlight: true, z: 48, delay: 0.25 },
];

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
const SPRING = { stiffness: 140, damping: 20, mass: 0.6 };

function Stat({
  stat,
  reduce,
  right,
}: {
  stat: (typeof STATS)[number];
  reduce: boolean;
  right: boolean;
}) {
  // the number counts up once when the page loads
  const count = useMotionValue(reduce ? stat.value : 0);
  const text = useTransform(count, (v) => money.format(Math.round(v)));
  useEffect(() => {
    if (reduce) {
      count.set(stat.value);
      return;
    }
    const controls = animate(count, stat.value, {
      duration: 1.8,
      delay: 0.4 + stat.delay,
      ease: [0.16, 1, 0.3, 1],
    });
    return () => controls.stop();
  }, [reduce, count, stat.value, stat.delay]);

  return (
    <div
      style={{ transform: `translateZ(${stat.z}px)` }}
      className={right ? "sm:text-right" : ""}
    >
      <p aria-hidden className="text-[clamp(1.9rem,4vw,2.75rem)] font-medium leading-none tracking-tight tabular-nums text-neutral-900">
        <motion.span
          className={`inline-block whitespace-nowrap font-semibold ${
            stat.highlight ? "text-[#E5372E]" : ""
          }`}
        >
          {text}
        </motion.span>
      </p>
      <p
        aria-hidden
        className="mt-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500"
      >
        {stat.label}
      </p>
      <span className="sr-only">
        {stat.label}: {money.format(stat.value)}
      </span>
    </div>
  );
}

export default function FloatingPills() {
  const reduce = !!useReducedMotion();

  // Mouse position over the panel (0 to 1). The whole panel tilts as one piece.
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateY = useSpring(useTransform(mx, [0, 1], [-5, 5]), SPRING);
  const rotateX = useSpring(useTransform(my, [0, 1], [4, -4]), SPRING);

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
    <div
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="mx-auto mt-16 w-full max-w-[720px] [perspective:1200px]"
    >
      {/* very slow idle sway */}
      <motion.div
        animate={reduce ? undefined : { rotateY: [-1.5, 1.5, -1.5] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <motion.div
          style={{
            rotateX: reduce ? 0 : rotateX,
            rotateY: reduce ? 0 : rotateY,
            transformStyle: "preserve-3d",
          }}
          className="relative rounded-2xl border border-dashed border-accent bg-neutral-50 p-6 text-left sm:p-8"
        >
          {/* soft shadow on the "floor" under the panel */}
          <div
            aria-hidden
            className="absolute inset-x-10 -bottom-4 h-8 rounded-full bg-neutral-900/10 blur-xl [transform:translateZ(-40px)]"
          />

          <div className="grid items-center gap-6 [transform-style:preserve-3d] sm:grid-cols-[1fr_auto_1fr] sm:gap-10">
            <Stat stat={STATS[0]} reduce={reduce} right={false} />

            {/* divider with a small yellow dot in the middle */}
            <div
              aria-hidden
              className="relative h-px w-full bg-accent/60 sm:h-16 sm:w-px [transform:translateZ(38px)]"
            >
              <span className="absolute left-1/2 top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_0_4px_rgba(245,201,60,0.25)]" />
            </div>

            <Stat stat={STATS[1]} reduce={reduce} right />
          </div>

          <p className="mt-6 text-[12px] text-neutral-500 [transform:translateZ(10px)]">
            {CAPTION}
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}