"use client";

import { useEffect } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";

const PILLS = [
  {
    label: "Project value",
    value: 2_000_000,
    tone: "light" as const,
    pos: "xl:left-[4%] xl:top-[30px]",
    dur: 8,
    delay: 0,
    depth: 14,
    rot: 9,
  },
  {
    label: "Estimated rework cost",
    value: 100_000,
    tone: "yellow" as const,
    pos: "xl:right-[4%] xl:top-0",
    dur: 10,
    delay: 1.1,
    depth: 24,
    rot: 11,
  },
];

const TONES = {
  light: {
    face: "bg-white border border-neutral-200 text-neutral-900 shadow-[0_18px_36px_-16px_rgba(15,23,42,0.4)]",
    l1: "bg-neutral-200",
    l2: "bg-neutral-300",
    label: "text-neutral-500",
  },
  yellow: {
    face: "bg-accent text-black shadow-[0_18px_40px_-14px_rgba(245,201,60,0.75)]",
    l1: "bg-[#d9a91c]",
    l2: "bg-[#b8890f]",
    label: "text-black/70",
  },
};

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function Pill({
  pill,
  mx,
  my,
  reduce,
}: {
  pill: (typeof PILLS)[number];
  mx: MotionValue<number>;
  my: MotionValue<number>;
  reduce: boolean;
}) {
  const t = TONES[pill.tone];
  const x = useTransform(mx, [-0.5, 0.5], [-pill.depth, pill.depth]);
  const y = useTransform(my, [-0.5, 0.5], [-pill.depth * 0.7, pill.depth * 0.7]);

  const count = useMotionValue(reduce ? pill.value : 0);
  const text = useTransform(count, (v) => money.format(Math.round(v)));

  useEffect(() => {
    if (reduce) {
      count.set(pill.value);
      return;
    }
    const controls = animate(count, pill.value, {
      duration: 1.8,
      delay: 0.4 + pill.delay * 0.3,
      ease: [0.16, 1, 0.3, 1],
    });
    return () => controls.stop();
  }, [reduce, count, pill.value, pill.delay]);

  return (
    <motion.div
      style={{ x, y }}
      className={`pointer-events-none relative z-30 [perspective:900px] xl:absolute ${pill.pos}`}
    >
      <motion.div
        animate={
          reduce
            ? undefined
            : {
                rotateY: [-pill.rot, pill.rot, -pill.rot],
                rotateX: [5, -5, 5],
                y: [0, -12, 0],
              }
        }
        transition={{ duration: pill.dur, delay: pill.delay, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative"
      >
        <span aria-hidden className={`absolute inset-0 rounded-full ${t.l1} [transform:translateZ(-9px)]`} />
        <span aria-hidden className={`absolute inset-0 rounded-full ${t.l2} [transform:translateZ(-18px)]`} />
        <span
          aria-hidden
          className="absolute inset-x-6 -bottom-6 h-6 rounded-full bg-neutral-900/20 blur-xl [transform:translateZ(-40px)]"
        />

        <div
          aria-hidden
          style={{ transformStyle: "preserve-3d" }}
          className={`relative rounded-full px-9 py-5 text-center ${t.face}`}
        >
          <span className="pointer-events-none absolute inset-x-4 top-1 h-1/2 rounded-full bg-gradient-to-b from-white/50 to-transparent" />
          <div className="relative [transform:translateZ(34px)]">
            <motion.span className="block whitespace-nowrap text-[clamp(1.75rem,2.6vw,2.5rem)] font-medium leading-none tracking-tight tabular-nums">
              {text}
            </motion.span>
          </div>
          <div className="relative mt-2.5 [transform:translateZ(20px)]">
            <span className={`block text-[11px] font-semibold uppercase tracking-[0.16em] ${t.label}`}>
              {pill.label}
            </span>
          </div>
        </div>

        <span className="sr-only">
          {pill.label}: {money.format(pill.value)}
        </span>
      </motion.div>
    </motion.div>
  );
}

export default function FloatingPills() {
  const reduce = !!useReducedMotion();

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const mx = useSpring(px, { stiffness: 50, damping: 20 });
  const my = useSpring(py, { stiffness: 50, damping: 20 });

  useEffect(() => {
    if (reduce) return;
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      px.set(e.clientX / window.innerWidth - 0.5);
      py.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [reduce, px, py]);

  return (
    <div className="relative mx-auto mt-8 flex flex-wrap items-center justify-center gap-5 xl:mt-0 xl:block xl:h-0">
      {PILLS.map((p) => (
        <Pill key={p.label} pill={p} mx={mx} my={my} reduce={reduce} />
      ))}
    </div>
  );
}
