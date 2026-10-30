"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import AnimatedHeadline from "./AnimatedHeadline";
import { useSiteMotion } from "./SiteMotion";

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
  { src: "/illustrations/revision.svg", x: 22.3, y: 23, w: 12.7, r: -2, p: 0, o: 150 },
  { src: "/illustrations/evidence.svg", x: 43.5, y: 17, w: 12, r: 1, p: 2.1, o: 110 },
  { src: "/illustrations/drawing.svg", x: 59.3, y: 7, w: 12, r: 2, p: 4.0, o: 135 },
  { src: "/illustrations/revision.svg", x: 57, y: 71, w: 14.3, r: 1, p: 5.6, o: 95 },
  { src: "/illustrations/evidence.svg", x: 1.7, y: 170, w: 9.3, r: -2, p: 1.2, o: 140 },
  { src: "/illustrations/drawing.svg", x: 14, y: 160, w: 8.7, r: 2, p: 3.3, o: 100 },
  { src: "/illustrations/revision.svg", x: 41, y: 112, w: 10.7, r: -1, p: 0.7, o: 120 },
  { src: "/illustrations/evidence.svg", x: 78.5, y: 116, w: 8.7, r: 2, p: 4.8, o: 90 },
  { src: "/illustrations/drawing.svg", x: 88.7, y: 198, w: 9.2, r: 3, p: 2.7, o: 150 },
  { src: "/illustrations/revision.svg", x: 8.6, y: 325, w: 9.3, r: -2, p: 5.1, o: 115 },
  { src: "/illustrations/revision.svg", x: 26, y: 388, w: 13.3, r: 1, p: 3.9, o: 100 },
  { src: "/illustrations/evidence.svg", x: 43, y: 392, w: 13.3, r: -1, p: 1.7, o: 135 },
  { src: "/illustrations/drawing.svg", x: 66, y: 320, w: 13.3, r: -2, p: 0.3, o: 105 },
  { src: "/illustrations/revision.svg", x: 78, y: 317, w: 7.3, r: 2, p: 4.4, o: 125 },
];

// The card field is designed at this size. On smaller laptops it is scaled
// down as one piece so every card keeps its place and nothing gets lost.
const DESIGN_W = 1500;
const DESIGN_H = 560;
const BOX_TOP = 177; // prompt box top, at full size
const BOX_ROOM = 460; // space kept free for the prompt box under its top (was 300, the new box is a bit taller)

// ---- Card motion settings -------------------------------------------------
// Every card travels around its own full circle in 3D: sideways, back behind
// the others, around, and forward again. The container itself never moves.
const SPREAD = 0.82; // 1 = original layout, lower = cards pulled closer together
const CIRCLE_SIZE = 0.85; // 1 = full circles, lower = tighter circles
const CYCLE_SECONDS = 8; // time for one full loop: lower = faster
const DIRECTION = 1; // 1 = one way round, -1 = the other way
const PERSPECTIVE = 1100; // px, lower = stronger 3D


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
  { src: UNIQUE_SRCS[1], r: 3, y: 0 },
  { src: UNIQUE_SRCS[2], r: -3, y: 0 },
  { src: UNIQUE_SRCS[0], r: 6, y: 10 },
];

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
      aria-label="Preview illustrative drawing sheet"
      onKeyDown={e => { if (e.key === "Escape") onActive(null); }}
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
        alt="Illustrative drawing, not for construction"
        fill
        sizes="300px"
        className="object-cover"
      />
    </div>
  );
}

// Compact fanned stack for phones and tablets (no hover there).
export function MobileCards() {
  return (
    <div aria-hidden className="mx-auto mb-8 flex max-w-[640px] justify-center lg:hidden">
      {FAN.map((c, i) => (
        <div
          key={`${c.src}-${i}`}
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
  const [revealed, setRevealed] = useState(true);
  const current = DEMO[qi];
  return <div className="relative z-20 mx-auto w-full max-w-[620px] rounded-[24px] border border-neutral-300 bg-white/95 p-5 shadow-[0_20px_70px_-35px_rgba(0,0,0,.35)] sm:p-6 lg:absolute lg:left-1/2 lg:top-[var(--box-top)] lg:w-[min(620px,52%)] lg:-translate-x-1/2">
    <p className="eyebrow">Prepared example</p>
    <p className="mt-2 text-xs leading-relaxed text-neutral-600">Illustrative answers and references. Not a live project analysis.</p>
    <div className="mt-4 flex flex-wrap gap-2" aria-label="Choose an example">{DEMO.map((d,i)=><button key={d.short} type="button" aria-pressed={i===qi} onClick={()=>{setQi(i);setRevealed(false);}} className={`rounded-full border px-3 py-2 text-xs font-medium ${i===qi ? "border-neutral-900 bg-neutral-900 text-white keep-white" : "border-neutral-300 text-neutral-700"}`}>{d.short}</button>)}</div>
    <p className="mt-5 text-base font-medium leading-relaxed text-neutral-900">{current.q}</p>
    <button type="button" onClick={()=>setRevealed(v=>!v)} aria-expanded={revealed} aria-controls="prepared-answer" className="mt-4 text-sm font-semibold text-neutral-900 underline underline-offset-4">{revealed ? "Hide prepared answer" : "Show prepared answer"}</button>
    <div id="prepared-answer" hidden={!revealed} className="mt-4 rounded-xl border border-neutral-200 bg-neutral-50 p-4"><p className="text-sm leading-relaxed text-neutral-700">{current.a}</p><p className="mt-3 text-xs text-neutral-600">Example references: {current.refs.join(" · ")}</p></div>
  </div>;
}

export default function Hero() {
  const { paused } = useSiteMotion();
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
    if (!wide || paused || active) return;
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
  }, [wide, paused, active]);

  const fieldH = Math.max(DESIGN_H * scale, (BOX_TOP) * scale + BOX_ROOM);
  const vars = {
    "--field-h": `${fieldH}px`,
    "--box-top": `${BOX_TOP * scale}px`,
  } as CSSProperties;

  return (
    <section
      id="home"
      className="relative overflow-x-clip bg-background pb-16 pt-[66px] lg:pb-20"
    >
      {/* fades the hero into the next section's background (dark mode only, see theme.css) */}
      <div className="hero-fade pointer-events-none absolute inset-x-0 bottom-0 z-0 h-64 bg-gradient-to-b from-transparent to-[#0d1117]" />

      {/* NEW: headline block */}
      <div className="mx-auto max-w-[1500px] px-5 pt-12 text-center sm:px-6 md:pt-16">
        <p className="mx-auto inline-flex items-center gap-2.5 rounded-full bg-white/5 py-1.5 pl-3 pr-4 text-sm text-slate-300">
          <span>For construction teams in Canada</span>
          <Image
            width={20} height={16}
            src="/canada.png"
            alt="Canada"
            className="h-4 w-5 shrink-0 rounded-[3px] border border-white/10 object-cover"
          />
        </p>

        <h1
          aria-label="The Construction Intelligence Layer"
          className="mt-7 font-display text-[clamp(2.75rem,8.5vw,6.5rem)] font-medium leading-[0.92] tracking-[-0.055em]"
        >
          <AnimatedHeadline />
        </h1>

        <p className="mx-auto mt-7 max-w-[520px] text-lg leading-relaxed text-slate-300">
          Bring drawings, questions and source review into the same conversation. Explore a workflow your project team can check.
        </p>

        <div className="mt-7 flex flex-wrap justify-center gap-3"><Link href="/contact?topic=pilot" className="button-primary">Discuss a pilot <span aria-hidden="true">↗</span></Link><a href="#demo" className="button-secondary">Explore an example</a></div>
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
      <MotionConfig reducedMotion={paused ? "always" : "user"}>
        <Preview src={wide ? active : null} />
      </MotionConfig>
    </section>
  );
}
