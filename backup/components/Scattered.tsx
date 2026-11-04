"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
  type Variants,
} from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;
const ACCENT = "#F5C93C";
// Hard-coded so the site theme can never turn the text dark on dark
const DARK_PILL = { backgroundColor: "#171717", color: "#ffffff" };

/* ------------------------------------------------------------------ */
/* Content. The document names are placeholders: swap in real ones     */
/* from your product (sheet numbers, spec sections, RFI numbers).      */
/* ------------------------------------------------------------------ */

type Art = "text" | "plan" | "detail" | "table";
type Doc = {
  kind: string;
  title: string;
  art: Art;
  from: { x: number; y: number; r: number }; // scattered: vw / vh from the stage centre, degrees
  to: { x: number; y: number }; // ordered
};

const DOCS: Doc[] = [
  { kind: "Specification", title: "07 21 00 Insulation", art: "text", from: { x: -36, y: -15, r: -14 }, to: { x: -24, y: -21 } },
  { kind: "RFI", title: "RFI-014 Door hardware", art: "text", from: { x: -14, y: 22, r: 9 }, to: { x: -24, y: 0 } },
  { kind: "Addendum", title: "Addendum 02", art: "text", from: { x: -41, y: 19, r: 17 }, to: { x: -24, y: 21 } },
  { kind: "Sheet", title: "A-301 Level 2 plan", art: "plan", from: { x: 31, y: -12, r: 12 }, to: { x: 24, y: -21 } },
  { kind: "Detail", title: "Detail 4 / A-501", art: "detail", from: { x: 11, y: 9, r: -11 }, to: { x: 24, y: 0 } },
  { kind: "Schedule", title: "Door schedule", art: "table", from: { x: 39, y: 24, r: -8 }, to: { x: 24, y: 21 } },
];

// Loose paper that gets swallowed by the hub
const GHOSTS = [
  { x: -4, y: -7, r: 20 },
  { x: 19, y: 25, r: -20 },
  { x: -31, y: 3, r: 6 },
  { x: 5, y: 21, r: 3 },
];

const LINE_1 = "From scattered files";
const LINE_2 = ["To", "one", "linked", "project", "set"];
const CAPTION = "Every sheet, spec and RFI, linked.";

/* ------------------------------------------------------------------ */
/* Helpers                                                              */
/* ------------------------------------------------------------------ */

function useIsDesktop() {
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return desktop;
}

// One word that slides up out of a mask
function Word({
  children,
  delay = 0,
  still = false,
}: {
  children: React.ReactNode;
  delay?: number;
  still?: boolean;
}) {
  return (
    <span className="inline-block overflow-hidden pb-[0.1em] align-bottom">
      <motion.span
        className="inline-block"
        initial={still ? false : { y: "110%" }}
        whileInView={{ y: "0%" }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, ease: EASE, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* A paper document                                                     */
/* ------------------------------------------------------------------ */

function PaperArt({ art }: { art: Art }) {
  if (art === "text") {
    return (
      <div className="mt-auto space-y-[5px]">
        <div className="h-[3px] w-full rounded bg-neutral-200" />
        <div className="h-[3px] w-[82%] rounded bg-neutral-200" />
        <div className="h-[3px] w-[58%] rounded bg-neutral-200" />
      </div>
    );
  }
  return (
    <svg viewBox="0 0 100 40" className="mt-auto h-[34%] w-full" fill="none" aria-hidden>
      {art === "plan" && (
        <>
          <path d="M4 36V6h56v12h36v18z" stroke="#d4d4d4" strokeWidth="1.4" />
          <path d="M30 6v30M60 18v18" stroke="#e5e5e5" strokeWidth="1.2" />
          <path d="M14 36v-8M44 36v-8M78 36v-8" stroke={ACCENT} strokeWidth="2.4" strokeLinecap="round" />
        </>
      )}
      {art === "detail" && (
        <>
          <circle cx="30" cy="20" r="14" stroke="#d4d4d4" strokeWidth="1.4" />
          <circle cx="30" cy="20" r="6" stroke={ACCENT} strokeWidth="2.2" />
          <path d="M52 12h40M52 20h32M52 28h38" stroke="#e5e5e5" strokeWidth="2" strokeLinecap="round" />
        </>
      )}
      {art === "table" && (
        <>
          <path d="M4 6h92M4 16h92M4 26h92M4 36h92" stroke="#e5e5e5" strokeWidth="1.2" />
          <path d="M34 6v30M66 6v30" stroke="#e5e5e5" strokeWidth="1.2" />
          <path d="M8 21h18" stroke={ACCENT} strokeWidth="2.4" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

function Paper({ doc }: { doc?: Doc }) {
  return (
    <div className="flex aspect-[1.3/1] w-full flex-col overflow-hidden rounded-[10px] border border-neutral-200 bg-white p-[8%] shadow-[0_18px_30px_-18px_rgba(15,23,42,0.35)]">
      {doc ? (
        <>
          <p className="text-[clamp(8px,0.65vw,10px)] font-medium uppercase tracking-[0.14em] text-neutral-400">
            {doc.kind}
          </p>
          <p className="mt-1 truncate text-[clamp(11px,1vw,15px)] font-medium leading-tight tracking-[-0.01em] text-neutral-900">
            {doc.title}
          </p>
          <PaperArt art={doc.art} />
        </>
      ) : (
        <div className="space-y-[6px] pt-1">
          <div className="h-[3px] w-[60%] rounded bg-neutral-200" />
          <div className="h-[3px] w-full rounded bg-neutral-100" />
          <div className="h-[3px] w-[88%] rounded bg-neutral-100" />
          <div className="h-[3px] w-[70%] rounded bg-neutral-100" />
          <div className="h-[3px] w-[40%] rounded bg-neutral-100" />
        </div>
      )}
    </div>
  );
}

const CARD_W = "w-[clamp(140px,min(14vw,22vh),220px)]";

/* ------------------------------------------------------------------ */
/* Pinned scene (desktop)                                               */
/* ------------------------------------------------------------------ */

function Letter({ c, i, p }: { c: string; i: number; p: MotionValue<number> }) {
  const dy = ((i * 37) % 21 - 10) * 1.3;
  const dr = ((i * 53) % 19 - 9) * 1.5;
  const y = useTransform(p, [0.04, 0.46], [dy, 0]);
  const rotate = useTransform(p, [0.04, 0.46], [dr, 0]);
  return (
    <motion.span className="inline-block" style={{ y, rotate }}>
      {c}
    </motion.span>
  );
}

function LitWord({ children, a, p }: { children: React.ReactNode; a: number; p: MotionValue<number> }) {
  const color = useTransform(p, [a, a + 0.07], ["#d4d4d4", "#171717"]);
  return <motion.span style={{ color }}>{children}</motion.span>;
}

function ScrollDoc({
  doc,
  i,
  p,
  t,
}: {
  doc: Doc;
  i: number;
  p: MotionValue<number>;
  t: MotionValue<number>;
}) {
  const s = 0.08 + i * 0.04;
  const e = s + 0.32;
  const x = useTransform(p, [s, e], [`${doc.from.x}vw`, `${doc.to.x}vw`]);
  const y = useTransform(p, [s, e], [`${doc.from.y}vh`, `${doc.to.y}vh`]);
  const rotate = useTransform(p, [s, e], [doc.from.r, 0]);
  const scale = useTransform(p, [s, e], [1.1, 1]);
  // slow drift while the paper is still loose, gone once it is in place
  const bobY = useTransform([t, p], (v: number[]) => Math.sin(v[0] * 1.1 + i * 1.7) * 9 * (1 - Math.min(1, v[1] * 4)));
  const bobR = useTransform([t, p], (v: number[]) => Math.sin(v[0] * 0.8 + i) * 2.5 * (1 - Math.min(1, v[1] * 4)));

  return (
    <motion.div className="absolute left-1/2 top-[56%] z-10" style={{ x, y, rotate, scale }}>
      <motion.div style={{ y: bobY, rotate: bobR }} whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 260, damping: 20 }}>
        <div className={`-translate-x-1/2 -translate-y-1/2 ${CARD_W}`}>
          <Paper doc={doc} />
        </div>
      </motion.div>
    </motion.div>
  );
}

function GhostDoc({
  g,
  i,
  p,
  t,
}: {
  g: { x: number; y: number; r: number };
  i: number;
  p: MotionValue<number>;
  t: MotionValue<number>;
}) {
  const s = 0.1 + i * 0.05;
  const e = s + 0.3;
  const x = useTransform(p, [s, e], [`${g.x}vw`, "0vw"]);
  const y = useTransform(p, [s, e], [`${g.y}vh`, "0vh"]);
  const rotate = useTransform(p, [s, e], [g.r, g.r * 2.4]);
  const scale = useTransform(p, [s, e], [1, 0.25]);
  const opacity = useTransform(p, [s, e - 0.06], [1, 0]);
  const bobY = useTransform([t, p], (v: number[]) => Math.sin(v[0] * 1.3 + i * 2.1) * 8);

  return (
    <motion.div className="absolute left-1/2 top-[56%] z-[5]" style={{ x, y, rotate, scale, opacity }}>
      <motion.div style={{ y: bobY }}>
        <div className={`-translate-x-1/2 -translate-y-1/2 ${CARD_W}`}>
          <Paper />
        </div>
      </motion.div>
    </motion.div>
  );
}

function Link({ d, i, p }: { d: string; i: number; p: MotionValue<number> }) {
  const a = 0.4 + i * 0.035;
  const draw = useTransform(p, [a, a + 0.2], [0, 1]);
  const base = useTransform(p, [a - 0.04, a], [0, 1]);
  return (
    <>
      <motion.path d={d} fill="none" stroke="#e5e5e5" strokeWidth={1.5} vectorEffect="non-scaling-stroke" style={{ opacity: base }} />
      <motion.path
        d={d}
        fill="none"
        stroke={ACCENT}
        strokeWidth={3}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        style={{ pathLength: draw }}
      />
    </>
  );
}

function PinnedStory({ still }: { still: boolean }) {
  const track = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.5 });

  const t = useMotionValue(0);
  // ambient drifting only runs when the OS has not asked for reduced motion
  useAnimationFrame((time) => {
    if (!still) t.set(time / 1000);
  });

  const gridY = useTransform(p, [0, 1], [0, -90]);
  const hubS = useTransform(p, [0.36, 0.5], [0, 1]);
  const labelO = useTransform(p, [0.5, 0.62], [0, 1]);
  const capO = useTransform(p, [0.72, 0.86], [0, 1]);
  const capY = useTransform(p, [0.72, 0.86], [14, 0]);

  const gridLines =
    "linear-gradient(to right, rgba(15,23,42,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,23,42,0.06) 1px, transparent 1px)";
  const fade = "radial-gradient(ellipse 75% 65% at 50% 55%, #000 30%, transparent 85%)";

  const links = DOCS.map((d) => {
    const y = 56 + d.to.y;
    return d.to.x < 0
      ? `M33 ${y} C 40 ${y}, 40 56, 45 56`
      : `M67 ${y} C 60 ${y}, 60 56, 55 56`;
  });

  let n = 0;

  return (
    <div ref={track} className="relative h-[360vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* drifting drawing-sheet grid */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -bottom-[120px] -top-[120px]"
          style={{
            y: still ? 0 : gridY,
            backgroundImage: gridLines,
            backgroundSize: "56px 56px",
            maskImage: fade,
            WebkitMaskImage: fade,
          }}
        />

        {/* heading: line one starts out jumbled and settles, line two lights up */}
        <div className="absolute inset-x-0 top-[7vh] z-20 px-6 text-center">
          <h2 className="font-display text-[clamp(1.75rem,3.4vw,3.25rem)] font-medium leading-[1.05] tracking-[-0.04em]">
            <span className="block text-neutral-900">
              {LINE_1.split(" ").map((w, wi, arr) => (
                <Fragment key={wi}>
                  <span className="inline-block whitespace-nowrap">
                    {w.split("").map((c) => {
                      const i = n++;
                      return <Letter key={i} c={c} i={i} p={p} />;
                    })}
                  </span>
                  {wi < arr.length - 1 ? " " : null}
                </Fragment>
              ))}
            </span>
            <span className="block">
              {LINE_2.map((w, i) => (
                <Fragment key={w}>
                  <LitWord a={0.22 + i * 0.06} p={p}>
                    {w}
                  </LitWord>
                  {i < LINE_2.length - 1 ? " " : null}
                </Fragment>
              ))}
            </span>
          </h2>
        </div>

        {/* lines from every document to the hub */}
        <svg aria-hidden className="absolute inset-0 z-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {links.map((d, i) => (
            <Link key={i} d={d} i={i} p={p} />
          ))}
        </svg>

        {/* group labels */}
        <motion.p
          aria-hidden
          style={{ opacity: labelO }}
          className="absolute left-[26%] top-[23.5vh] z-10 -translate-x-1/2 text-[12px] font-medium uppercase tracking-[0.18em] text-neutral-500"
        >
          Written
        </motion.p>
        <motion.p
          aria-hidden
          style={{ opacity: labelO }}
          className="absolute left-[74%] top-[23.5vh] z-10 -translate-x-1/2 text-[12px] font-medium uppercase tracking-[0.18em] text-neutral-500"
        >
          Drawn
        </motion.p>

        {GHOSTS.map((g, i) => (
          <GhostDoc key={i} g={g} i={i} p={p} t={t} />
        ))}
        {DOCS.map((d, i) => (
          <ScrollDoc key={d.title} doc={d} i={i} p={p} t={t} />
        ))}

        {/* the hub */}
        <motion.div className="absolute left-1/2 top-[56%] z-20" style={{ scale: hubS, opacity: hubS }}>
          <div className="-translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <span
                className={`absolute inset-0 rounded-full ${still ? "" : "animate-ping"}`}
                style={{ backgroundColor: "rgba(245,201,60,0.5)" }}
              />
              <span className="relative block whitespace-nowrap rounded-full bg-neutral-900 px-6 py-3 text-[15px] font-medium text-white shadow-[0_18px_30px_-12px_rgba(15,23,42,0.5)]" style={DARK_PILL}>
                One project set
              </span>
            </div>
          </div>
        </motion.div>

        <motion.p
          style={{ opacity: capO, y: capY }}
          className="absolute inset-x-0 bottom-[5vh] z-10 text-center text-lg text-neutral-500"
        >
          {CAPTION}
        </motion.p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Phones and reduced motion: a simple stack                            */
/* ------------------------------------------------------------------ */

function StackedStory({ still }: { still: boolean }) {
  return (
    <div className="px-6 pb-8 pt-24 md:px-24 md:pt-32">
      <h2 className="text-center font-display text-[clamp(2rem,6vw,3.25rem)] font-medium leading-[1.05] tracking-[-0.04em]">
        <span className="block text-neutral-900">
          <Word still={still}>From</Word> <Word still={still} delay={0.08}>scattered</Word>{" "}
          <Word still={still} delay={0.16}>files</Word>
        </span>
        <span className="block text-neutral-400">
          {LINE_2.map((w, i) => (
            <Fragment key={w}>
              <Word still={still} delay={0.24 + i * 0.07}>
                {w}
              </Word>
              {i < LINE_2.length - 1 ? " " : null}
            </Fragment>
          ))}
        </span>
      </h2>

      <div className="mx-auto mt-12 grid max-w-[640px] grid-cols-2 gap-3">
        {DOCS.map((d, i) => (
          <motion.div
            key={d.title}
            initial={still ? false : { opacity: 0, y: 40, rotate: i % 2 ? 7 : -7 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: EASE, delay: (i % 2) * 0.1 }}
          >
            <Paper doc={d} />
          </motion.div>
        ))}
      </div>

      <div className="mt-8 flex flex-col items-center gap-3 text-center">
        <span className="rounded-full px-6 py-3 text-[15px] font-medium" style={DARK_PILL}>
          One project set
        </span>
        <p className="text-lg text-neutral-500">{CAPTION}</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Two feature rows (replaces the two plain cards)                      */
/* ------------------------------------------------------------------ */

const parent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.25 } },
};
const child: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};
const draw: Variants = {
  hidden: { pathLength: 0 },
  show: { pathLength: 1, transition: { duration: 1.2, ease: EASE, delay: 0.2 } },
};

function RfiMock({ still }: { still: boolean }) {
  return (
    <motion.div
      variants={parent}
      initial={still ? "show" : "hidden"}
      whileInView="show"
      viewport={{ once: true, margin: "-120px" }}
      className="relative mx-auto w-full max-w-[560px] -rotate-[1.5deg] rounded-[22px] border border-neutral-200 bg-white p-6 shadow-[0_30px_60px_-30px_rgba(15,23,42,0.35)] md:p-8"
    >
      <motion.div variants={child} className="flex items-center justify-between">
        <span className="text-[13px] font-medium tracking-wide text-neutral-900">RFI-014</span>
        <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-black">Draft</span>
      </motion.div>

      <motion.p variants={child} className="mt-5 text-xl font-medium tracking-[-0.02em] text-neutral-900">
        Door hardware conflict at the Level 2 corridor
      </motion.p>

      <div className="mt-5 space-y-2.5">
        {["Sheet A-301, Level 2 plan", "Spec 08 71 00, door hardware", "Detail 4 on A-501"].map((r) => (
          <motion.p key={r} variants={child} className="border-l-2 border-accent pl-3 text-[15px] text-neutral-700">
            {r}
          </motion.p>
        ))}
      </div>

      <motion.div variants={child} className="mt-6 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50">
        <svg viewBox="0 0 300 120" className="block h-auto w-full" fill="none" aria-hidden>
          <path d="M14 104V16h110v26h160v62z" stroke="#d4d4d4" strokeWidth="2" />
          <path d="M70 16v88M190 42v62" stroke="#e5e5e5" strokeWidth="1.6" />
          <motion.path
            variants={draw}
            d="M92 42 q10 -14 24 -6 q12 -12 26 -2 q14 -6 20 8 q12 10 -2 22 q-4 14 -22 10 q-14 10 -28 2 q-18 4 -22 -12 q-14 -8 4 -22z"
            stroke={ACCENT}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>

      <motion.div variants={child} className="mt-6 flex items-center justify-between">
        <span className="text-sm text-neutral-500">2 markups attached</span>
        <span className="rounded-full px-5 py-2.5 text-sm font-medium" style={DARK_PILL}>Send RFI</span>
      </motion.div>
    </motion.div>
  );
}

const NODES = [
  { label: "Your drive", x: 18, y: 17 },
  { label: "Your inbox", x: 82, y: 20 },
  { label: "Your tracker", x: 16, y: 83 },
  { label: "Your viewer", x: 84, y: 80 },
];

function StackMock({ still }: { still: boolean }) {
  return (
    <motion.div
      variants={parent}
      initial={still ? "show" : "hidden"}
      whileInView="show"
      viewport={{ once: true, margin: "-120px" }}
      className="relative mx-auto aspect-[16/11] w-full max-w-[620px] overflow-hidden rounded-[28px] border border-neutral-200 bg-white shadow-[0_30px_60px_-30px_rgba(15,23,42,0.3)]"
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage: "radial-gradient(rgba(15,23,42,0.12) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      <svg aria-hidden className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {NODES.map((nd, i) => (
          <motion.path
            key={nd.label}
            d={`M${nd.x} ${nd.y} L50 50`}
            fill="none"
            stroke={ACCENT}
            strokeWidth={2.5}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            variants={{
              hidden: { pathLength: 0 },
              show: { pathLength: 1, transition: { duration: 1, ease: EASE, delay: 0.3 + i * 0.15 } },
            }}
          />
        ))}
      </svg>

      {/* little dots travelling in along the lines */}
      {!still &&
        NODES.map((nd, i) => (
          <motion.span
            key={nd.label}
            aria-hidden
            className="absolute size-2 rounded-full"
            style={{ backgroundColor: ACCENT, marginLeft: -4, marginTop: -4 }}
            animate={{ left: [`${nd.x}%`, "50%"], top: [`${nd.y}%`, "50%"], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 2.6, ease: "easeInOut", repeat: Infinity, delay: 1.4 + i * 0.6, repeatDelay: 1.2 }}
          />
        ))}

      {NODES.map((nd, i) => (
        <motion.div
          key={nd.label}
          variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.6, delay: 0.1 + i * 0.12 } } }}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${nd.x}%`, top: `${nd.y}%` }}
        >
          <motion.div
            animate={still ? undefined : { y: [0, -6, 0] }}
            transition={{ duration: 3.6 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
            className="whitespace-nowrap rounded-full border border-neutral-200 bg-white px-4 py-2 text-[14px] text-neutral-700 shadow-sm"
          >
            {nd.label}
          </motion.div>
        </motion.div>
      ))}

      <motion.div variants={child} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative">
          {!still && (
            <span
              className="absolute inset-0 animate-ping rounded-full"
              style={{ backgroundColor: "rgba(245,201,60,0.45)" }}
            />
          )}
          <span className="relative block whitespace-nowrap rounded-full px-5 py-3 text-[15px] font-medium" style={DARK_PILL}>
            Project set
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Feature({
  title,
  text,
  flip,
  still,
  children,
}: {
  title: string;
  text: string;
  flip?: boolean;
  still: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto grid max-w-[1200px] items-center gap-12 md:grid-cols-12 md:gap-8">
      <div className={`md:col-span-5 ${flip ? "md:order-2 md:pl-8" : "md:pr-8"}`}>
        <h3 className="font-display text-[clamp(2rem,3.4vw,3rem)] font-medium leading-[1.04] tracking-[-0.04em] text-neutral-900">
          {title.split(" ").map((w, i, arr) => (
            <Fragment key={i}>
              <Word still={still} delay={i * 0.07}>
                {w}
              </Word>
              {i < arr.length - 1 ? " " : null}
            </Fragment>
          ))}
        </h3>
        <motion.p
          initial={still ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}
          className="mt-4 max-w-[26rem] text-lg text-neutral-500"
        >
          {text}
        </motion.p>
      </div>
      <div className={`md:col-span-7 ${flip ? "md:order-1" : ""}`}>{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Section                                                              */
/* ------------------------------------------------------------------ */

export default function Scattered() {
  const still = !!useReducedMotion();
  const desktop = useIsDesktop();

  return (
    <section id="scattered" className="relative bg-background">
      {desktop ? <PinnedStory still={still} /> : <StackedStory still={still} />}

      <div className="space-y-28 px-6 pb-28 pt-16 md:space-y-44 md:px-24 md:pb-44 md:pt-28">
        <Feature title="RFIs, ready to send" text="References and markups included." still={still}>
          <RfiMock still={still} />
        </Feature>
        <Feature
          title="Fits your stack"
          text="Works with the tools your team already uses."
          flip
          still={still}
        >
          <StackMock still={still} />
        </Feature>
      </div>
    </section>
  );
}