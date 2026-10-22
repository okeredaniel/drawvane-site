"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";

type CardData = {
  src: string;
  x: number; // left, % of the card field
  y: number; // top, px
  w: number; // width, % of the card field
  r: number; // resting rotation, deg
  back?: boolean; // dimmed + blurred, sits behind
};

// Layout copied from the reference. Put your images in /public/blueprints/
const CARDS: CardData[] = [
  { src: "/blueprints/plan-1.avif", x: 22.3, y: 23, w: 12.7, r: -2 },
  { src: "/blueprints/plan-2.avif", x: 43.5, y: 17, w: 12, r: 1, back: true },
  { src: "/blueprints/plan-3.avif", x: 59.3, y: 7, w: 12, r: 2, back: true },
  { src: "/blueprints/plan-4.avif", x: 57, y: 71, w: 14.3, r: 1 },
  { src: "/blueprints/plan-5.avif", x: 1.7, y: 170, w: 9.3, r: -2 },
  { src: "/blueprints/plan-6.avif", x: 14, y: 160, w: 8.7, r: 2, back: true },
  { src: "/blueprints/plan-7.avif", x: 41, y: 112, w: 10.7, r: -1, back: true },
  { src: "/blueprints/plan-8.avif", x: 79, y: 116, w: 8.7, r: 2, back: true },
  { src: "/blueprints/plan-9.avif", x: 88.7, y: 198, w: 9.2, r: 3 },
  { src: "/blueprints/plan-10.avif", x: 8.6, y: 325, w: 9.3, r: -2 },
  { src: "/blueprints/plan-11.avif", x: 26, y: 388, w: 13.3, r: 1 },
  { src: "/blueprints/plan-12.avif", x: 43, y: 392, w: 13.3, r: -1, back: true },
  { src: "/blueprints/plan-13.avif", x: 66, y: 320, w: 13.3, r: -2 },
  { src: "/blueprints/plan-14.avif", x: 78, y: 317, w: 7.3, r: 2, back: true },
];

const QUESTIONS = [
  "What is the fire rating of the corridor walls on Level 2?",
  "Any conflicts between the plans and specs at the ceiling?",
  "How many doors are in the east wing?",
];

function BlueprintCard({
  card,
  onActive,
}: {
  card: CardData;
  onActive: (src: string | null) => void;
}) {
  return (
    <div
      tabIndex={0}
      aria-label="View drawing sheet"
      className="absolute aspect-[4/3] cursor-zoom-in overflow-hidden rounded-lg shadow-[0_0_40px_rgba(37,70,255,0.35)] ring-1 ring-blue-400/30 outline-none focus-visible:ring-2 focus-visible:ring-white"
      style={{
        left: `${card.x}%`,
        top: card.y,
        width: `${card.w}%`,
        rotate: `${card.r}deg`,
        opacity: card.back ? 0.55 : 1,
        filter: card.back ? "blur(1.5px)" : undefined,
        zIndex: card.back ? 5 : 10,
      }}
      onMouseEnter={() => onActive(card.src)}
      onMouseLeave={() => onActive(null)}
      onFocus={() => onActive(card.src)}
      onBlur={() => onActive(null)}
    >
      <Image
        src={card.src}
        alt="Architectural drawing sheet"
        fill
        sizes="300px"
        className="object-cover"
      />
    </div>
  );
}

// Large centered preview. pointer-events-none keeps the hover on the small
// card underneath, so the preview closes the moment the mouse leaves it.
function Preview({ src }: { src: string | null }) {
  return (
    <AnimatePresence>
      {src && (
        <motion.div
          key="preview-backdrop"
          className="pointer-events-none fixed inset-0 z-[60] grid place-items-center bg-black/60 pt-[66px] backdrop-blur-[3px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            key={src}
            className="relative aspect-[1020/660] w-[min(1020px,90vw)] overflow-hidden rounded-2xl shadow-[0_0_80px_rgba(37,70,255,0.45)] ring-1 ring-blue-400/60"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
          >
            <Image
              src={src}
              alt="Architectural drawing sheet, enlarged"
              fill
              sizes="1020px"
              className="object-cover"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Hero() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <section
      id="home"
      className="relative overflow-x-clip bg-background pb-40 pt-[66px] md:pb-64"
    >
      {/* fades the hero into the next section's background (dark mode only, see theme.css) */}
      <div className="hero-fade pointer-events-none absolute inset-x-0 bottom-0 z-0 h-64 bg-gradient-to-b from-transparent to-[#0d1117]" />
      <div className="mx-auto max-w-[1500px] px-6 pt-16 text-center">
        <p className="text-base text-slate-400">Document intelligence for AEC teams</p>
        <h1 className="mt-6 font-display text-[clamp(3rem,8vw,6rem)] font-medium leading-[0.95] tracking-[-0.05em]">
          <span className="block text-white">Ask the plan set.</span>
          <span className="block text-slate-400">Get the sheet number.</span>
        </h1>
        <p className="mt-8 text-lg text-slate-300">
          Cited answers from your drawings, specs and RFIs.
        </p>
      </div>

      <div className="relative mx-auto mt-14 max-w-[1500px] px-4 md:h-[560px] md:px-0">
        {/* Blueprint field: desktop only (no hover on phones) */}
        <div className="absolute inset-0 hidden md:block">
          {CARDS.map((c) => (
            <BlueprintCard key={c.src} card={c} onActive={setActive} />
          ))}
        </div>

        {/* Prompt box */}
        <div className="relative z-20 mx-auto w-full max-w-[620px] rounded-[28px] border border-white/20 bg-slate-800/50 p-6 backdrop-blur-2xl md:absolute md:left-1/2 md:top-[177px] md:-translate-x-1/2">
          <p className="text-[17px] text-white/90">
            Ask about a clause, a detail or a conflict...
          </p>
          <div className="mt-5 flex flex-col items-start gap-2.5 pr-14">
            {QUESTIONS.map((q) => (
              <button
                key={q}
                type="button"
                className="rounded-full border border-white/40 px-3 py-1.5 text-left text-[13px] text-white/90 transition-colors hover:bg-white/10"
              >
                {q}
              </button>
            ))}
          </div>
          <button
            type="button"
            aria-label="Ask"
            className="keep-white absolute bottom-6 right-6 grid size-11 place-items-center rounded-full bg-accent text-white transition-transform hover:scale-105"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          </button>
        </div>
      </div>
      <MotionConfig reducedMotion="user">
        <Preview src={active} />
      </MotionConfig>
    </section>
  );
}