"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";

type CardData = {
  src: string;
  x: number; // left, % of the card field
  y: number; // top, px (at full 1500px width)
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
  { src: "/blueprints/plan-1.avif", x: 26, y: 388, w: 13.3, r: 1 },
  { src: "/blueprints/plan-2.avif", x: 43, y: 392, w: 13.3, r: -1, back: true },
  { src: "/blueprints/plan-3.avif", x: 66, y: 320, w: 13.3, r: -2 },
  { src: "/blueprints/plan-4.avif", x: 78, y: 317, w: 7.3, r: 2, back: true },
];

// The card field is designed at this size. On smaller laptops it is scaled
// down as one piece so every card keeps its place and nothing gets lost.
const DESIGN_W = 1500;
const DESIGN_H = 560;
const BOX_TOP = 177; // prompt box top, at full size
const BOX_ROOM = 300; // space kept free for the prompt box under its top

// Unique image sources, used to preload the large preview versions
const UNIQUE_SRCS = Array.from(new Set(CARDS.map((c) => c.src)));

// Small screens (under 1024px): a compact fanned stack above the prompt box
const FAN = [
  { src: UNIQUE_SRCS[0], r: -6, y: 10 },
  { src: UNIQUE_SRCS[3], r: 3, y: 0 },
  { src: UNIQUE_SRCS[5], r: -3, y: 0 },
  { src: UNIQUE_SRCS[8], r: 6, y: 10 },
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

// Compact fanned stack for phones and tablets (no hover there).
function MobileCards() {
  return (
    <div aria-hidden className="mx-auto mb-8 flex max-w-[640px] justify-center lg:hidden">
      {FAN.map((c, i) => (
        <div
          key={c.src}
          className="relative aspect-[4/3] w-[29%] overflow-hidden rounded-lg shadow-[0_0_30px_rgba(37,70,255,0.35)] ring-1 ring-blue-400/30"
          style={{
            marginLeft: i === 0 ? 0 : "-5%",
            rotate: `${c.r}deg`,
            translate: `0 ${c.y}px`,
            opacity: i % 2 ? 0.75 : 1,
            zIndex: i % 2 ? 1 : 2,
          }}
        >
          <Image
            src={c.src}
            alt=""
            fill
            sizes="(max-width: 1023px) 30vw, 300px"
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}

// Loads the large version of every sheet in the background (once the page is
// up) so the preview never shows an empty box while its image downloads.
// Same `sizes` as the preview so the browser requests the exact same file.
function PreloadPreviews() {
  return (
    <div aria-hidden className="pointer-events-none fixed -z-10 h-0 w-0 overflow-hidden opacity-0">
      {UNIQUE_SRCS.map((src) => (
        <Image
          key={src}
          src={src}
          alt=""
          width={1020}
          height={660}
          sizes="1020px"
          loading="eager"
        />
      ))}
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
            className="relative aspect-[1020/660] w-[min(1020px,90vw)] overflow-hidden rounded-2xl bg-slate-900 ring-1 ring-blue-400/60"
            style={{ boxShadow: "0 0 80px rgba(37,70,255,0.45)" }}
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
              priority
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
  const [scale, setScale] = useState(1);
  const [wide, setWide] = useState(false); // 1024px and up
  const stage = useRef<HTMLDivElement>(null);

  // How much to shrink the card field so it fits the available width
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const measure = () => {
      const w = el.clientWidth;
      if (w > 0) setScale(Math.min(1, w / DESIGN_W));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Preview + preloading are only needed where the card field is shown
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setWide(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const fieldH = Math.max(DESIGN_H * scale, (BOX_TOP) * scale + BOX_ROOM);
  const vars = {
    "--field-h": `${fieldH}px`,
    "--box-top": `${BOX_TOP * scale}px`,
  } as CSSProperties;

  return (
    <section
      id="home"
      className="relative overflow-x-clip bg-background pb-40 pt-[66px] lg:pb-64"
    >
      {/* fades the hero into the next section's background (dark mode only, see theme.css) */}
      <div className="hero-fade pointer-events-none absolute inset-x-0 bottom-0 z-0 h-64 bg-gradient-to-b from-transparent to-[#0d1117]" />
      <div className="mx-auto max-w-[1500px] px-5 pt-12 text-center sm:px-6 md:pt-16">
        <p className="text-base text-slate-400">Document intelligence for AEC teams</p>
        <h1 className="mt-6 font-display text-[clamp(2.5rem,8vw,6rem)] font-medium leading-[0.95] tracking-[-0.05em]">
          <span className="block text-white">Ask the plan set.</span>
          <span className="block text-slate-400">Get the sheet number.</span>
        </h1>
        <p className="mt-8 text-lg text-slate-300">
          Cited answers from your drawings, specs and RFIs.
        </p>
      </div>

      <div
        ref={stage}
        style={vars}
        className="relative mx-auto mt-10 max-w-[1500px] px-4 sm:px-6 lg:mt-14 lg:h-[var(--field-h)] lg:px-0"
      >
        {/* Small screens: compact fanned stack */}
        <MobileCards />

        {/* Large screens: the full card field, scaled to fit */}
        <div
          className="absolute left-0 top-0 hidden lg:block"
          style={{
            width: DESIGN_W,
            height: DESIGN_H,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          {CARDS.map((c) => (
            <BlueprintCard key={c.src + c.x} card={c} onActive={setActive} />
          ))}
        </div>

        {/* Prompt box: glass look. Centered over the cards on large screens,
            a normal block under the fanned cards on small ones. */}
        <div className="relative z-20 mx-auto w-full max-w-[620px] rounded-[28px] border border-white/15 bg-slate-800/15 p-5 backdrop-blur-xl sm:p-6 lg:absolute lg:left-1/2 lg:top-[var(--box-top)] lg:w-[min(620px,52%)] lg:max-w-none lg:-translate-x-1/2">
          <p className="text-[16px] text-white/90 sm:text-[17px]">
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
            className="keep-white absolute bottom-5 right-5 grid size-11 place-items-center rounded-full bg-accent text-white transition-transform hover:scale-105 sm:bottom-6 sm:right-6"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          </button>
        </div>
      </div>
      {wide && <PreloadPreviews />}
      <MotionConfig reducedMotion="user">
        <Preview src={wide ? active : null} />
      </MotionConfig>
    </section>
  );
}