"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import FloatingPills from "./FloatingPills";

type CardData = {
  src: string;
  x: number; // left, % of the card field
  y: number; // top, px (at full 1500px width)
  w: number; // width, % of the card field
  r: number; // resting rotation, deg
  p: number; // starting point on its own circle, radians (different per card)
  o: number; // size of its own circle, px at full size (different per card)
};

// Layout copied from the reference. Put your images in /public/blueprints/
const CARDS: CardData[] = [
  { src: "/blueprints/plan-1.avif", x: 22.3, y: 23, w: 12.7, r: -2, p: 0, o: 150 },
  { src: "/blueprints/plan-2.avif", x: 43.5, y: 17, w: 12, r: 1, p: 2.1, o: 110 },
  { src: "/blueprints/plan-3.avif", x: 59.3, y: 7, w: 12, r: 2, p: 4.0, o: 135 },
  { src: "/blueprints/plan-4.avif", x: 57, y: 71, w: 14.3, r: 1, p: 5.6, o: 95 },
  { src: "/blueprints/plan-5.avif", x: 1.7, y: 170, w: 9.3, r: -2, p: 1.2, o: 140 },
  { src: "/blueprints/plan-6.avif", x: 14, y: 160, w: 8.7, r: 2, p: 3.3, o: 100 },
  { src: "/blueprints/plan-7.avif", x: 41, y: 112, w: 10.7, r: -1, p: 0.7, o: 120 },
  { src: "/blueprints/plan-8.avif", x: 78.5, y: 116, w: 8.7, r: 2, p: 4.8, o: 90 },
  { src: "/blueprints/plan-9.avif", x: 88.7, y: 198, w: 9.2, r: 3, p: 2.7, o: 150 },
  { src: "/blueprints/plan-10.avif", x: 8.6, y: 325, w: 9.3, r: -2, p: 5.1, o: 115 },
  { src: "/blueprints/plan-1.avif", x: 26, y: 388, w: 13.3, r: 1, p: 3.9, o: 100 },
  { src: "/blueprints/plan-2.avif", x: 43, y: 392, w: 13.3, r: -1, p: 1.7, o: 135 },
  { src: "/blueprints/plan-3.avif", x: 66, y: 320, w: 13.3, r: -2, p: 0.3, o: 105 },
  { src: "/blueprints/plan-4.avif", x: 78, y: 317, w: 7.3, r: 2, p: 4.4, o: 125 },
];

// The card field is designed at this size. On smaller laptops it is scaled
// down as one piece so every card keeps its place and nothing gets lost.
const DESIGN_W = 1500;
const DESIGN_H = 560;
const BOX_TOP = 177; // prompt box top, at full size
const BOX_ROOM = 340; // space kept free for the prompt box under its top (was 300, the new box is a bit taller)

// ---- Card motion settings -------------------------------------------------
// Every card travels around its own full circle in 3D: sideways, back behind
// the others, around, and forward again. The container itself never moves.
const SPREAD = 0.82; // 1 = original layout, lower = cards pulled closer together
const CIRCLE_SIZE = 0.85; // 1 = full circles, lower = tighter circles
const CYCLE_SECONDS = 8; // time for one full loop: lower = faster
const DIRECTION = 1; // 1 = one way round, -1 = the other way
const PERSPECTIVE = 1100; // px, lower = stronger 3D
// Your laptop has "reduce motion" turned on, so this is true to let you see it.
// Set to false to respect that system setting for everyone (the cards then
// stay still for anyone who has it on).
const IGNORE_REDUCED_MOTION = true;

// Resting spot of each card after pulling the layout toward the centre
const FIELD_CX = DESIGN_W / 2;
const FIELD_CY = DESIGN_H / 2;
const LAYOUT = CARDS.map((c) => {
  const w = (c.w / 100) * DESIGN_W;
  const h = w * 0.75;
  const cx = (c.x / 100) * DESIGN_W + w / 2;
  const cy = c.y + h / 2;
  return {
    w,
    left: FIELD_CX + (cx - FIELD_CX) * SPREAD - w / 2,
    top: FIELD_CY + (cy - FIELD_CY) * SPREAD - h / 2,
  };
});

// Unique image sources, used to preload the large preview versions
const UNIQUE_SRCS = Array.from(new Set(CARDS.map((c) => c.src)));

// Small screens (under 1024px): a compact fanned stack above the prompt box
const FAN = [
  { src: UNIQUE_SRCS[0], r: -6, y: 10 },
  { src: UNIQUE_SRCS[3], r: 3, y: 0 },
  { src: UNIQUE_SRCS[5], r: -3, y: 0 },
  { src: UNIQUE_SRCS[8], r: 6, y: 10 },
];

// PLACEHOLDER DEMO CONTENT. Swap the answers and sheet references for real
// examples from your product before launch.
const DEMO = [
  {
    short: "Fire ratings",
    q: "What is the fire rating of the corridor walls on Level 2?",
    a: "Corridor walls on Level 2 are 1-hour rated, with 20-minute rated doors.",
    refs: ["Sheet A-201", "Spec 08 11 13"],
  },
  {
    short: "Ceiling conflicts",
    q: "Any conflicts between the plans and specs at the ceiling?",
    a: "One. The plans show a 9'-0\" ceiling in Room 214, but the spec calls for 8'-6\".",
    refs: ["Sheet A-301", "Spec 09 51 00"],
  },
  {
    short: "Door counts",
    q: "How many doors are in the east wing?",
    a: "There are 42 doors in the east wing, across three levels.",
    refs: ["Sheet A-601"],
  },
];

function BlueprintCard({
  card,
  spot,
  register,
  onActive,
}: {
  card: CardData;
  spot: { left: number; top: number; w: number };
  register: (el: HTMLDivElement | null) => void;
  onActive: (src: string | null) => void;
}) {
  return (
    <div
      ref={register}
      tabIndex={0}
      aria-label="View drawing sheet"
      className="absolute aspect-[4/3] cursor-zoom-in overflow-hidden rounded-lg shadow-[0_0_40px_rgba(37,70,255,0.35)] ring-1 ring-blue-400/30 outline-none focus-visible:ring-2 focus-visible:ring-white"
      style={{
        left: spot.left,
        top: spot.top,
        width: spot.w,
        transform: `rotate(${card.r}deg)`,
        willChange: "transform, opacity, filter",
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

// NEW: the prompt box is now a live demo. It types a question, then shows a
// cited answer with sheet chips. It keeps its own state so typing never
// re-renders the Hero (and never touches the card animation).
function PromptDemo() {
  const [qi, setQi] = useState(0);
  const [typed, setTyped] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [run, setRun] = useState(0); // bump to replay the current question

  useEffect(() => {
    const q = DEMO[qi].q;
    const reduce =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches && !IGNORE_REDUCED_MOTION;
    if (reduce) {
      setTyped(q.length);
      setShowAnswer(true);
      return;
    }
    setTyped(0);
    setShowAnswer(false);
    let i = 0;
    const timers: number[] = [];
    const type = () => {
      i += 1;
      setTyped(i);
      if (i < q.length) {
        timers.push(window.setTimeout(type, 28));
      } else {
        timers.push(window.setTimeout(() => setShowAnswer(true), 450));
        timers.push(window.setTimeout(() => setQi((v) => (v + 1) % DEMO.length), 6500));
      }
    };
    timers.push(window.setTimeout(type, 400));
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [qi, run]);

  const current = DEMO[qi];

  return (
    <div className="relative z-20 mx-auto w-full max-w-[620px] rounded-[28px] border border-white/15 bg-slate-800/15 p-4 backdrop-blur-xl sm:p-5 lg:absolute lg:left-1/2 lg:top-[var(--box-top)] lg:w-[min(620px,52%)] lg:max-w-none lg:-translate-x-1/2">
      {/* the question being typed */}
      <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/5 py-2.5 pl-4 pr-2.5">
        <p className="min-h-[44px] flex-1 content-center text-[15px] leading-snug text-white sm:text-[16px]">
          <span aria-live="off">{current.q.slice(0, typed)}</span>
          <span
            aria-hidden
            className="ml-0.5 inline-block h-[1.05em] w-px translate-y-[3px] animate-pulse bg-white/80"
          />
        </p>
        <button
          type="button"
          aria-label="Ask"
          className="keep-white grid size-10 shrink-0 place-items-center rounded-full bg-accent text-white transition-transform hover:scale-105"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </button>
      </div>

      {/* the cited answer */}
      <div className="mt-3 min-h-[108px] px-1">
        <AnimatePresence mode="wait">
          {showAnswer && (
            <motion.div
              key={qi}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="flex gap-3"
            >
              <span aria-hidden className="mt-1 w-0.5 shrink-0 self-stretch rounded-full bg-blue-400/70" />
              <div>
                <p className="text-[15px] leading-relaxed text-white/90">{current.a}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {current.refs.map((r) => (
                    <span
                      key={r}
                      className="inline-flex items-center gap-1.5 rounded-md border border-blue-400/30 bg-blue-500/10 px-2 py-1 text-xs text-blue-100"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
                        <path d="M14 3v5h5" />
                      </svg>
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* switch questions */}
      <div className="mt-3 flex flex-wrap gap-2">
        {DEMO.map((d, i) => (
          <button
            key={d.short}
            type="button"
            aria-pressed={i === qi}
            onClick={() => (i === qi ? setRun((r) => r + 1) : setQi(i))}
            className={`rounded-full border px-3 py-1.5 text-[13px] transition-colors ${
              i === qi
                ? "border-white/70 bg-white/10 text-white"
                : "border-white/30 text-white/80 hover:bg-white/10"
            }`}
          >
            {d.short}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Hero() {
  const [active, setActive] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [wide, setWide] = useState(false); // 1024px and up
  const stage = useRef<HTMLDivElement>(null);
  const cardEls = useRef<(HTMLDivElement | null)[]>([]);

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

  // Moves every card around its own 3D circle. Cards at the back of their
  // circle get smaller (perspective), dimmer and blurred; cards at the front
  // are bigger and sharp. Layout and the container stay put.
  useEffect(() => {
    if (!wide) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce && !IGNORE_REDUCED_MOTION) return;
    let raf = 0;
    const tick = (now: number) => {
      const phase = DIRECTION * ((now / 1000) * 2 * Math.PI) / CYCLE_SECONDS;
      CARDS.forEach((c, i) => {
        const el = cardEls.current[i];
        if (!el) return;
        const a = phase + c.p;
        const R = c.o * CIRCLE_SIZE;
        const s = Math.sin(a);
        const dx = R * Math.cos(a);
        const dy = R * 0.28 * s;
        const z = R * s;
        el.style.transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, ${z.toFixed(1)}px) rotate(${c.r}deg)`;
        const back = s < 0 ? -s : 0;
        el.style.filter = back > 0.08 ? `blur(${(back * 4).toFixed(1)}px)` : "none";
        el.style.opacity = (0.5 + 0.5 * ((s + 1) / 2)).toFixed(2);
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [wide]);

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

      {/* NEW: headline block */}
      <div className="mx-auto max-w-[1500px] px-5 pt-12 text-center sm:px-6 md:pt-16">
        <p className="mx-auto inline-flex items-center gap-2.5 rounded-full bg-white/5 py-1.5 pl-3 pr-4 text-sm text-slate-300">
          Built for a Greener and Cleaner Canada
        </p>

        <h1 className="mt-7 font-display text-[clamp(2.75rem,8.5vw,6.5rem)] font-medium leading-[0.92] tracking-[-0.055em]">
          <span className="block text-white">Ask the plan set.</span>
          <span className="block text-slate-400">Get the sheet number.</span>
        </h1>

        <p className="mx-auto mt-7 max-w-[520px] text-lg leading-relaxed text-slate-300">
          $52B is lost to construction rework every year. Stratora gives you answers before mistakes happen.
        </p>

        <FloatingPills />
      </div>

      <div
        ref={stage}
        style={vars}
        className="hero-field relative mx-auto mt-10 max-w-[1500px] px-4 sm:px-6 lg:mt-14 lg:h-[var(--field-h)] lg:overflow-hidden lg:px-0"
      >
        {/* Small screens: compact fanned stack */}
        <MobileCards />

        {/* Large screens: the full card field, scaled to fit. The field stays
            still; each card moves around its own circle in 3D. */}
        <div
          className="absolute left-0 top-0 hidden lg:block"
          style={{
            width: DESIGN_W,
            height: DESIGN_H,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          <div className="absolute inset-0" style={{ perspective: PERSPECTIVE }}>
            <div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
              {CARDS.map((c, i) => (
                <BlueprintCard
                  key={c.src + c.x}
                  card={c}
                  spot={LAYOUT[i]}
                  register={(el) => {
                    cardEls.current[i] = el;
                  }}
                  onActive={setActive}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Prompt box: glass look. Centered over the cards on large screens,
            a normal block under the fanned cards on small ones. */}
        <PromptDemo />
      </div>
      {wide && <PreloadPreviews />}
      <MotionConfig reducedMotion="user">
        <Preview src={wide ? active : null} />
      </MotionConfig>
    </section>
  );
}