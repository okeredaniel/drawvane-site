"use client";
import { useSiteMotion } from "./SiteMotion";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";

// Only publish claims that are true for your product.
// Change the wording of any card here, for example if you don't have an audit yet.
type IconName = "audited" | "privacy" | "access" | "encryption" | "sources" | "review";

const HEADING = "Review the safeguards first.";
const CARDS: { icon: IconName; label: string; title: string }[] = [
  { icon: "audited", label: "Assurance", title: "Request security evidence" },
  { icon: "privacy", label: "Privacy", title: "Confirm model-data terms" },
  { icon: "access", label: "Access", title: "Agree access requirements" },
  { icon: "encryption", label: "Storage", title: "Review storage and retention" },
  { icon: "sources", label: "Sources", title: "Check the cited document" },
  { icon: "review", label: "Review", title: "Keep professional review" },
];

const EASE = [0.22, 1, 0.36, 1] as const;

const ICON_PATHS: Record<IconName, string[]> = {
  audited: ["M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6z", "M8.5 12l2.5 2.5 4.5-5"],
  privacy: ["M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z", "M5.6 5.6l12.8 12.8"],
  access: ["M8 11a4 4 0 1 0 0 8 4 4 0 0 0 0-8z", "M11 12.5L20 3.5", "M17 6.5l3 3"],
  encryption: ["M5 11h14v9H5z", "M8 11V8a4 4 0 0 1 8 0v3"],
  sources: ["M7 3h8l4 4v14H7z", "M10 12h6", "M10 16h4"],
  review: ["M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z", "M8 12.5l2.7 2.7L16 9.5"],
};

function TileIcon({ name }: { name: IconName }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-6 text-accent"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICON_PATHS[name].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}

/* ---------- pointer tilt shared by the vault and the tiles ---------- */

function useTilt(maxX: number, maxY: number, reduce: boolean) {
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 170, damping: 18, mass: 0.6 });
  const sy = useSpring(py, { stiffness: 170, damping: 18, mass: 0.6 });
  const rotateX = useTransform(sy, [-0.5, 0.5], [maxX, -maxX]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-maxY, maxY]);

  const handlers = {
    onPointerMove: (e: React.PointerEvent<HTMLElement>) => {
      if (reduce || e.pointerType !== "mouse") return;
      const r = e.currentTarget.getBoundingClientRect();
      px.set((e.clientX - r.left) / r.width - 0.5);
      py.set((e.clientY - r.top) / r.height - 0.5);
    },
    onPointerLeave: () => {
      px.set(0);
      py.set(0);
    },
  };

  return { sx, sy, rotateX: reduce ? 0 : rotateX, rotateY: reduce ? 0 : rotateY, handlers };
}

/* ---------- the vault: concentric rings stacked in depth ---------- */

function Ring({
  z,
  spin,
  reduce,
  children,
}: {
  z: number;
  spin: number; // seconds per turn, negative = counter-clockwise
  reduce: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className="absolute inset-0"
      style={{ transform: `translateZ(${z}px)`, transformStyle: "preserve-3d" }}
    >
      <motion.div
        className="size-full"
        animate={{ rotate: reduce ? 0 : spin > 0 ? 360 : -360 }}
        transition={reduce ? { duration: 0 } : { duration: Math.abs(spin), ease: "linear", repeat: Infinity }}
      >
        {children}
      </motion.div>
    </div>
  );
}

function Vault({ reduce }: { reduce: boolean }) {
  const { rotateX, rotateY, handlers } = useTilt(14, 16, reduce);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1.1, ease: EASE }}
      style={{ perspective: 1200 }}
      className="relative mx-auto aspect-square w-full max-w-[400px]"
      {...handlers}
    >
      <motion.div
        className="absolute inset-0"
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        aria-hidden="true"
      >
        {/* back plate */}
        <div
          className="absolute inset-[5%] rounded-full border border-neutral-200 bg-gradient-to-br from-white to-neutral-100 shadow-[0_40px_70px_-30px_rgba(15,23,42,0.35)]"
          style={{ transform: "translateZ(-40px)" }}
        />

        {/* outer ring: 60 tick marks */}
        <Ring z={0} spin={120} reduce={reduce}>
          <svg viewBox="0 0 340 340" className="size-full">
            <circle
              cx="170"
              cy="170"
              r="156"
              fill="none"
              stroke="#a3a3a3"
              strokeWidth="9"
              pathLength={360}
              strokeDasharray="0.6 5.4"
            />
          </svg>
        </Ring>

        {/* middle ring: broken line, the bolt track */}
        <Ring z={30} spin={-80} reduce={reduce}>
          <svg viewBox="0 0 340 340" className="size-full text-neutral-900">
            <circle
              cx="170"
              cy="170"
              r="124"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              pathLength={100}
              strokeDasharray="60 4 30 6"
            />
          </svg>
        </Ring>

        {/* inner ring: accent bolts */}
        <Ring z={60} spin={50} reduce={reduce}>
          <svg viewBox="0 0 340 340" className="size-full text-accent">
            <circle
              cx="170"
              cy="170"
              r="92"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              pathLength={100}
              strokeDasharray="18 7"
            />
          </svg>
        </Ring>

        {/* core */}
        <div
          className="absolute left-1/2 top-1/2 grid size-[26%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-neutral-200 bg-white shadow-[0_18px_30px_-12px_rgba(15,23,42,0.35)]"
          style={{ transform: "translate(-50%, -50%) translateZ(100px)" }}
        >
          <svg
            viewBox="0 0 24 24"
            className="size-1/2 text-accent"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 11h14v9H5z" />
            <path d="M8 11V8a4 4 0 0 1 8 0v3" />
          </svg>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ---------- a claim tile ---------- */

function Tile({
  card,
  i,
  reduce,
}: {
  card: (typeof CARDS)[number];
  i: number;
  reduce: boolean;
}) {
  const { sx, sy, rotateX, rotateY, handlers } = useTilt(6, 7, reduce);
  const shadowX = useTransform(sx, [-0.5, 0.5], [10, -10]);
  const shadowY = useTransform(sy, [-0.5, 0.5], [22, 8]);
  const shadow = useMotionTemplate`${shadowX}px ${shadowY}px 30px -16px rgba(15,23,42,0.25)`;

  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, ease: EASE, delay: 0.2 + i * 0.08 }}
      style={{ perspective: 900 }}
      {...handlers}
    >
      <motion.div
        style={{ rotateX, rotateY, boxShadow: shadow, transformStyle: "preserve-3d" }}
        className="group flex h-full min-h-[190px] flex-col rounded-[22px] border border-neutral-200 bg-neutral-50 p-6 transition-colors duration-300 hover:border-accent"
      >
        <div
          className="grid size-11 place-items-center rounded-xl border border-neutral-200 bg-white shadow-sm"
          style={{ transform: "translateZ(34px)" }}
        >
          <TileIcon name={card.icon} />
        </div>
        <p
          className="mt-auto text-sm text-neutral-500"
          style={{ transform: "translateZ(14px)" }}
        >
          {card.label}
        </p>
        <h3
          className="mt-1 text-[22px] font-medium leading-tight tracking-[-0.03em] text-neutral-900"
          style={{ transform: "translateZ(22px)" }}
        >
          {card.title}
        </h3>
      </motion.div>
    </motion.div>
  );
}

/* ---------- section ---------- */

export default function Security() {
  const { paused: reduce } = useSiteMotion();

  return (
    <section
      id="security"
      aria-label="Security"
      className="bg-background px-6 py-20 md:px-24 md:py-28"
    >
      <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-[5fr_6fr] lg:gap-20">
        <div className="lg:sticky lg:top-28">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: EASE }}
            className="text-[clamp(2.25rem,3.4vw,3rem)] font-medium leading-[1.05] tracking-[-0.04em] text-neutral-900"
          >
            {HEADING}
          </motion.h2>
          <div className="mt-12">
            <Vault reduce={reduce} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
          {CARDS.map((card, i) => (
            <Tile key={card.label} card={card} i={i} reduce={reduce} />
          ))}
        </div>
      </div>
    </section>
  );
}
