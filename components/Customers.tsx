"use client";
import { useSiteMotion } from "./SiteMotion";

import { useRef, useState } from "react";
import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";

// These cards describe use cases only, with no statistics, because there are
// no real customer results to publish yet. When you have real, approved
// results, add them to `title`/`text` and change the heading to something like
// "Proof from real project teams."
// Put the images in /public/customers/ as case-1.avif, case-2.avif, case-3.avif
// (change the extension here if yours differ).
// `chip` is the small label that floats in front of each image. The sheet and
// spec references are made up: replace them with your own or delete the chip.
const HEADING = "Explore a workflow for your team.";
const SUBHEAD = "Illustrative use cases, not customer results.";
type CaseItem = {
  label: string;
  title: string;
  text: string;
  image?: string;
  chip: string;
};

const CASES: CaseItem[] = [
  {
    label: "Multifamily · Developer",
    title: "Takeoffs tied to their source sheets",
    text: "Quantities and scope checks that link back to the sheet they came from.",
    image: "/illustrations/evidence.svg",
    chip: "Linked to sheet A-201",
  },
  {
    label: "Data center · MEP contractor",
    title: "Review conflicts before submittals",
    text: "Compare a specification and drawing before preparing a submittal.",
    image: "/illustrations/evidence.svg",
    chip: "Spec 23 05 00 vs M-401",
  },
  {
    label: "Healthcare · General contractor",
    title: "Review issues in preconstruction",
    text: "Explore how a source review could inform an RFI.",
    image: "/illustrations/evidence.svg",
    chip: "Found before the field",
  },
];

const DURATION = 6500; // ms each project type stays on screen
const PEEK = 30; // how far each card behind sticks out above the front one
const SHRINK = 0.03; // how much smaller each card behind is
const EASE = [0.22, 1, 0.36, 1] as const;

// Faint drawing grid shown behind the photos (and when a photo is missing)
const GRID = {
  backgroundImage:
    "linear-gradient(rgba(15,23,42,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.06) 1px, transparent 1px)",
  backgroundSize: "24px 24px",
};

function Photo({
  src,
  alt,
  className = "aspect-[1.5/1]",
}: {
  src?: string;
  alt: string;
  className?: string;
}) {
  const [missing, setMissing] = useState(false);
  const showImage = !!src && !missing;

  return (
    <div
      className={`relative w-full overflow-hidden bg-neutral-100 ${className}`}
      style={GRID}
    >
      {showImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          draggable={false}
          onError={() => setMissing(true)}
          className="h-full w-full object-cover"
        />
      )}
    </div>
  );
}

function Chip({ text }: { text: string }) {
  return (
    <span className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3.5 py-1.5 text-[13px] font-medium text-neutral-700 shadow-[0_10px_24px_-10px_rgba(15,23,42,0.35)]">
      <span className="size-2 rounded-full bg-accent" />
      {text}
    </span>
  );
}

// Phones and tablets: a plain list. Each card fades up once.
function MobileCard({ c }: { c: CaseItem }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: EASE }}
      className="overflow-hidden rounded-[22px] border border-neutral-200 bg-white shadow-[0_4px_20px_-8px_rgba(15,23,42,0.18)]"
    >
      <div className="relative">
        <Photo src={c.image} alt={c.title} />
        <div className="absolute right-3 top-3">
          <Chip text={c.chip} />
        </div>
      </div>
      <div className="border-t border-neutral-200 px-5 py-5">
        <p className="flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.14em] text-neutral-500">
          <span className="size-1.5 rounded-full bg-accent" />
          {c.label}
        </p>
        <h3 className="mt-3 text-xl font-medium leading-tight tracking-[-0.03em] text-neutral-900">
          {c.title}
        </h3>
        <p className="mt-2 text-base text-neutral-500">{c.text}</p>
      </div>
    </motion.article>
  );
}

// Desktop: pick a project type on the left, the card stack on the right.
function Showcase({ reduce }: { reduce: boolean }) {
  const n = CASES.length;
  const [active, setActive] = useState(0);
  const [held, setHeld] = useState(false); // mouse over or keyboard focus inside
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-80px" });

  // 0 to 1: how far through the current project type we are
  const progress = useMotionValue(0);
  const none = useMotionValue(0);
  const paused = held || !inView || reduce;

  // Auto-advance. `delta` is capped so a lag spike or a returning tab can
  // never skip ahead or jump.
  useAnimationFrame((_, delta) => {
    if (paused) return;
    const next = progress.get() + Math.min(delta, 64) / DURATION;
    if (next >= 1) {
      progress.set(0);
      setActive((a) => (a + 1) % n);
    } else {
      progress.set(next);
    }
  });

  function select(i: number) {
    setActive(i);
    progress.set(0);
  }

  // Mouse tilt of the whole stack (mouse only, never on touch)
  const tx = useMotionValue(0.5);
  const ty = useMotionValue(0.5);
  const spring = { stiffness: 160, damping: 20, mass: 0.6 };
  const rotateY = useSpring(useTransform(tx, [0, 1], [-7, 7]), spring);
  const rotateX = useSpring(useTransform(ty, [0, 1], [5, -5]), spring);

  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    tx.set((e.clientX - r.left) / r.width);
    ty.set((e.clientY - r.top) / r.height);
  }
  function onLeave() {
    tx.set(0.5);
    ty.set(0.5);
  }

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocusCapture={() => setHeld(true)}
      onBlurCapture={() => setHeld(false)}
      className="mx-auto mt-16 hidden max-w-[1200px] grid-cols-[minmax(0,380px)_minmax(0,1fr)] items-center gap-14 lg:grid"
    >
      {/* Left: the three project types */}
      <ul>
        {CASES.map((c, i) => {
          const open = i === active;
          return (
            <li key={c.title} className="relative border-b border-neutral-200 last:border-b-0">
              <button
                type="button"
                onClick={() => select(i)}
                aria-pressed={open}
                className="group block w-full py-6 text-left"
              >
                <span className="flex items-center gap-3 text-[13px] font-medium uppercase tracking-[0.14em] text-neutral-500">
                  <span
                    className={`grid size-6 place-items-center rounded-full text-[12px] transition-colors duration-300 ${
                      open ? "bg-accent text-black" : "bg-neutral-100 text-neutral-500"
                    }`}
                  >
                    {i + 1}
                  </span>
                  {c.label}
                </span>
                <span
                  className={`mt-3 block tracking-[-0.03em] transition-all duration-300 ${
                    open
                      ? "text-[28px] font-medium leading-tight text-neutral-900"
                      : "text-[20px] text-neutral-400 group-hover:text-neutral-700"
                  }`}
                >
                  {c.title}
                </span>
                <motion.span
                  initial={false}
                  animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="block overflow-hidden"
                >
                  <span className="block pt-3 text-[17px] leading-relaxed text-neutral-500">
                    {c.text}
                  </span>
                </motion.span>
              </button>

              {/* time bar for the current one */}
              <span aria-hidden className="absolute inset-x-0 bottom-[-1px] h-[2px]">
                <motion.span
                  className="block h-full origin-left bg-accent"
                  style={{ scaleX: open ? progress : none }}
                />
              </span>
            </li>
          );
        })}
      </ul>

      {/* Right: the stack of cards */}
      <div className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-10 -z-10 rounded-full bg-accent/20 blur-3xl"
        />
        <motion.div
          onPointerMove={onMove}
          onPointerLeave={onLeave}
          style={{
            rotateX: reduce ? 0 : rotateX,
            rotateY: reduce ? 0 : rotateY,
            transformPerspective: 1400,
            transformStyle: "preserve-3d",
          }}
          className="relative pt-[70px]"
        >
          <div className="relative aspect-[1.5/1]">
            {CASES.map((c, i) => {
              const offset = (i - active + n) % n; // 0 = front
              return (
                <motion.div
                  key={c.title}
                  aria-hidden={offset !== 0}
                  initial={false}
                  animate={{ y: -offset * PEEK, scale: 1 - offset * SHRINK }}
                  transition={
                    reduce
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 140, damping: 20, mass: 0.8 }
                  }
                  style={{
                    zIndex: n - offset,
                    transformOrigin: "50% 100%",
                    transformStyle: "preserve-3d",
                  }}
                  className="absolute inset-0"
                >
                  <article className="relative h-full overflow-hidden rounded-[28px] border border-neutral-200 bg-white shadow-[0_24px_60px_-28px_rgba(15,23,42,0.35)]">
                    <Photo src={c.image} alt={c.title} className="h-full" />
                    {/* fades the cards behind */}
                    <motion.div
                      aria-hidden
                      initial={false}
                      animate={{ opacity: offset === 0 ? 0 : offset === 1 ? 0.45 : 0.7 }}
                      transition={{ duration: 0.4 }}
                      className="pointer-events-none absolute inset-0 bg-white"
                    />
                  </article>

                  {/* floats in front of the image */}
                  <motion.div
                    aria-hidden
                    initial={false}
                    animate={{ opacity: offset === 0 ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ z: 50 }}
                    className="pointer-events-none absolute right-5 top-5"
                  >
                    <Chip text={c.chip} />
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function Customers() {
  const { paused: reduce } = useSiteMotion();

  return (
    <section
      id="customers"
      aria-label="Illustrative use cases"
      className="overflow-x-clip border-t border-neutral-200 bg-background px-5 py-[80px] md:px-24 md:py-28"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: EASE }}
        className="text-center"
      >
        <h2 className="text-[clamp(2rem,3.4vw,3rem)] font-medium leading-[1.05] tracking-[-0.04em] text-neutral-900">
          {HEADING}
        </h2>
        <p className="mt-3 text-lg text-neutral-500">{SUBHEAD}</p>
      </motion.div>

      <div className="mt-10 flex flex-col gap-6 lg:hidden">
        {CASES.map((c) => (
          <MobileCard key={c.title} c={c} />
        ))}
      </div>

      <Showcase reduce={reduce} />
    </section>
  );
}
