"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";

// Each item: title, one-line description, and the image shown on the stage.
// Put the images in /public/features/ (feature-1.jpg, feature-2.jpg, feature-3.jpg).
// If yours are .png or .webp, change the extension in the `image` path.
// The descriptions for items 2 and 3 are placeholders: replace with your own copy.
type FeatureItem = {
  title: string;
  text: string;
  image?: string;
};

const ITEMS: FeatureItem[] = [
  {
    title: "Flag conflicts",
    text: "Plans checked against specs, in context.",
    // image: "/features/feature-1.avif",
  },
  {
    title: "Compare revisions",
    text: "See exactly what changed between two sets.",
    // image: "/features/feature-2.avif",
  },
  {
    title: "Measure takeoffs",
    text: "Quantities pulled straight from the drawings.",
    // image: "/features/feature-3.avif",
  },
];

// ILLUSTRATIVE EXAMPLE: the sheet numbers and dollar amounts below are made up.
// Replace them with a real example from your product before publishing.
type Step = {
  title: string;
  text: string;
};

const STEPS: Step[] = [
  {
    title: "A revision is issued",
    text: "Sheet A-301 lowers the corridor ceiling from 9'-0\" to 8'-6\".",
  },
  {
    title: "The evidence is found",
    text: "The change also shows up in spec 09 51 00 and in RFI-042, each linked to its page.",
  },
  {
    title: "The scope is traced",
    text: "Four floors are affected: ceiling grid, light fixtures and sprinkler drops.",
  },
  {
    title: "A person decides",
    text: "The estimator reviews the numbers and approves or adjusts them.",
  },
];

// Amounts are numbers so the total can count up. They add up to TOTAL.
const COSTS = [
  { label: "Ceiling grid and tile rework", amount: 18400 },
  { label: "Light fixture relocation", amount: 9600 },
  { label: "Sprinkler drop adjustments", amount: 6200 },
  { label: "Review and coordination", amount: 2800 },
];
const TOTAL = COSTS.reduce((sum, c) => sum + c.amount, 0);

const money = (n: number) => `$${n.toLocaleString("en-US")}`;

const EASE = [0.22, 1, 0.36, 1] as const;
const SPRING = { stiffness: 140, damping: 18, mass: 0.5 };

/* ------------------------------------------------------------------ */
/* Pointer-driven 3D tilt with a moving highlight. An optional scroll  */
/* rotation can be layered on top (used by the big image stage).       */
/* ------------------------------------------------------------------ */
function Tilt3D({
  children,
  className = "",
  max = 8,
  baseRotateX,
  baseScale,
  baseOpacity,
  glareRadius = "rounded-2xl",
}: {
  children: ReactNode;
  className?: string;
  max?: number;
  baseRotateX?: MotionValue<number>;
  baseScale?: MotionValue<number>;
  baseOpacity?: MotionValue<number>;
  glareRadius?: string;
}) {
  const reduce = useReducedMotion();
  const [hover, setHover] = useState(false);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, SPRING);
  const sy = useSpring(my, SPRING);
  const zero = useMotionValue(0);
  const base = baseRotateX ?? zero;

  const rotateY = useTransform(sx, [-0.5, 0.5], [-max, max]);
  const tiltX = useTransform(sy, [-0.5, 0.5], [max * 0.7, -max * 0.7]);
  const rotateX = useTransform([base, tiltX], ([a, b]: number[]) => a + b);

  const gx = useTransform(sx, [-0.5, 0.5], [0, 100]);
  const gy = useTransform(sy, [-0.5, 0.5], [0, 100]);
  const glare = useMotionTemplate`radial-gradient(520px circle at ${gx}% ${gy}%, rgba(255,255,255,0.5), transparent 45%)`;

  return (
    <motion.div
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onPointerEnter={(e) => {
        if (!reduce && e.pointerType === "mouse") setHover(true);
      }}
      onPointerLeave={() => {
        setHover(false);
        mx.set(0);
        my.set(0);
      }}
      style={{
        rotateX,
        rotateY: reduce ? 0 : rotateY,
        scale: baseScale,
        opacity: baseOpacity,
        transformPerspective: 1400,
      }}
      className={`relative [transform-style:preserve-3d] ${className}`}
    >
      {children}
      <motion.div
        aria-hidden
        animate={{ opacity: hover ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        style={{ background: glare }}
        className={`pointer-events-none absolute inset-0 ${glareRadius}`}
      />
    </motion.div>
  );
}

/* Total that counts up once it scrolls into view. */
function CountUp({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduce = useReducedMotion() ?? false;
  const n = useMotionValue(reduce ? to : 0);
  const text = useTransform(n, (v) => money(Math.round(v)));

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      n.set(to);
      return;
    }
    const controls = animate(n, to, { duration: 1.6, ease: EASE });
    return () => controls.stop();
  }, [inView, reduce, to, n]);

  return <motion.span ref={ref}>{text}</motion.span>;
}

export default function Features() {
  const [active, setActive] = useState(0);
  const [failed, setFailed] = useState<Record<string, boolean>>({});
  const reduce = useReducedMotion();

  // The stage starts tipped back and shrunk, then rises to face you as the
  // section scrolls into view.
  const stageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ["start 95%", "center 62%"],
  });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.4 });
  const stageRotateX = useTransform(p, [0, 1], [reduce ? 0 : 30, 0]);
  const stageScale = useTransform(p, [0, 1], [reduce ? 1 : 0.88, 1]);
  const stageOpacity = useTransform(p, [0, 0.35], [reduce ? 1 : 0, 1]);

  return (
    <section
      id="features"
      className="overflow-x-clip bg-background px-6 py-[120px] md:px-24 md:py-[190px]"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: EASE }}
        className="text-center"
      >
        <h2 className="text-[clamp(2.5rem,4vw,3.5rem)] font-medium leading-[1.05] tracking-[-0.04em] text-neutral-900">
          Precision search
        </h2>
        <p className="text-[clamp(2.5rem,4vw,3.5rem)] font-medium leading-[1.05] tracking-[-0.04em] text-neutral-400">
          Every clause, every sheet
        </p>
      </motion.div>

      {/* Feature selector: one row of three, a white card slides between them */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: EASE }}
        role="tablist"
        aria-label="Features"
        className="mx-auto mt-14 grid max-w-[1100px] gap-3 md:mt-[56px] md:grid-cols-3"
      >
        {ITEMS.map((item, i) => {
          const open = i === active;
          return (
            <button
              key={item.title}
              type="button"
              role="tab"
              id={`feature-tab-${i}`}
              aria-selected={open}
              aria-controls="feature-stage"
              onClick={() => setActive(i)}
              className="relative rounded-2xl border border-transparent p-5 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-neutral-900/30"
            >
              {open && (
                <motion.span
                  layoutId="feature-card"
                  transition={{ type: "spring", stiffness: 380, damping: 34 }}
                  className="absolute inset-0 rounded-2xl border border-neutral-200 bg-white shadow-[0_10px_30px_-14px_rgba(15,23,42,0.25)]"
                />
              )}
              <span className="relative block">
                <span className="mb-4 block h-1 w-10 rounded-full bg-neutral-200">
                  {open && (
                    <motion.span
                      layoutId="feature-bar"
                      transition={{ type: "spring", stiffness: 380, damping: 34 }}
                      className="block h-full w-full rounded-full bg-accent"
                    />
                  )}
                </span>
                <span
                  className={`block text-[22px] tracking-[-0.03em] transition-colors duration-300 ${
                    open ? "font-medium text-neutral-900" : "text-neutral-500"
                  }`}
                >
                  {item.title}
                </span>
                <span
                  className={`mt-2 block text-base transition-colors duration-300 ${
                    open ? "text-neutral-500" : "text-neutral-400"
                  }`}
                >
                  {item.text}
                </span>
              </span>
            </button>
          );
        })}
      </motion.div>

      {/* Image stage */}
      <div
        ref={stageRef}
        id="feature-stage"
        role="tabpanel"
        aria-labelledby={`feature-tab-${active}`}
        className="relative mx-auto mt-10 max-w-[1100px] md:mt-14"
      >
        {/* grounding shadow */}
        <div
          aria-hidden
          className="absolute inset-x-[8%] -bottom-6 h-12 rounded-full bg-neutral-900/20 blur-3xl"
        />

        <Tilt3D
          max={6}
          baseRotateX={stageRotateX}
          baseScale={stageScale}
          baseOpacity={stageOpacity}
          glareRadius="rounded-[28px]"
          className="rounded-[28px] border border-neutral-200 bg-white p-2 shadow-[0_30px_70px_-30px_rgba(15,23,42,0.35)]"
        >
          <div className="relative aspect-[1.8/1] overflow-hidden rounded-[22px] bg-gradient-to-b from-neutral-100 to-neutral-200">
            <AnimatePresence initial={false}>
              <motion.div
                key={active}
                initial={{ opacity: 0, scale: 1.05, x: 36, rotateY: reduce ? 0 : -10 }}
                animate={{ opacity: 1, scale: 1, x: 0, rotateY: 0 }}
                exit={{ opacity: 0, x: -36, rotateY: reduce ? 0 : 10 }}
                transition={{ duration: 0.65, ease: EASE }}
                style={{ transformPerspective: 1000 }}
                className="absolute inset-0"
              >
                {(() => {
                  const item = ITEMS[active];
                  const src = item.image;
                  const showImage = !!src && !failed[src];
                  return showImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={src}
                      alt={item.title}
                      className="h-full w-full object-cover"
                      draggable={false}
                      onError={() => src && setFailed((f) => ({ ...f, [src]: true }))}
                    />
                  ) : null;
                })()}
              </motion.div>
            </AnimatePresence>
          </div>
        </Tilt3D>
      </div>

      {/* One revision, traced end to end */}
      <div className="mx-auto mt-[120px] max-w-[1200px] md:mt-[170px]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: EASE }}
          className="mx-auto max-w-2xl text-center"
        >
          <h3 className="text-[clamp(2rem,3.2vw,2.75rem)] font-medium leading-[1.05] tracking-[-0.04em] text-neutral-900">
            One revision, traced end to end
          </h3>
          <p className="mt-4 text-lg text-neutral-500">
            See what changed, where it shows up, and what it costs.
          </p>
        </motion.div>

        {/* Steps run left to right along one line that draws itself */}
        <ol className="relative mt-16 grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          <motion.span
            aria-hidden
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 1.4, ease: EASE }}
            className="absolute left-[18px] right-0 top-[18px] hidden h-px origin-left bg-neutral-300 lg:block"
          />
          {STEPS.map((step, i) => (
            <motion.li
              key={step.title}
              initial={{ opacity: 0, y: 40, rotateX: reduce ? 0 : -38 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, ease: EASE, delay: i * 0.14 }}
              style={{ transformPerspective: 900, transformOrigin: "50% 0%" }}
              className="relative pt-12"
            >
              <span className="absolute left-0 top-0 grid size-9 place-items-center rounded-full bg-accent text-[15px] font-semibold text-black shadow-[0_0_0_6px_var(--color-background,#fff)]">
                {i + 1}
              </span>
              <div className="h-full rounded-2xl border border-neutral-200 bg-white p-6 shadow-[0_4px_20px_-8px_rgba(15,23,42,0.15)] transition-[transform,box-shadow] duration-500 hover:-translate-y-1.5 hover:shadow-[0_24px_50px_-24px_rgba(15,23,42,0.35)]">
                <p className="text-[20px] font-medium tracking-[-0.02em] text-neutral-900">
                  {step.title}
                </p>
                <p className="mt-2 text-[16px] leading-relaxed text-neutral-500">
                  {step.text}
                </p>
              </div>
            </motion.li>
          ))}
        </ol>

        {/* Cost breakdown: one wide card, rows slide in, total counts up */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: EASE }}
          className="relative mx-auto mt-16 max-w-3xl"
        >
          <div
            aria-hidden
            className="absolute inset-x-10 -bottom-5 h-10 rounded-full bg-neutral-900/15 blur-2xl"
          />
          <Tilt3D
            max={5}
            className="rounded-3xl border border-neutral-200 bg-white p-7 shadow-[0_24px_60px_-30px_rgba(15,23,42,0.3)] md:p-9"
            glareRadius="rounded-3xl"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-[20px] font-medium tracking-tight text-neutral-900">
                Estimated impact
              </p>
              <span className="rounded-full bg-accent px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-wide text-black">
                Example
              </span>
            </div>

            <ul className="mt-6">
              {COSTS.map((row, i) => (
                <motion.li
                  key={row.label}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, ease: EASE, delay: 0.2 + i * 0.1 }}
                  className="flex items-center justify-between gap-4 border-b border-dashed border-neutral-200 py-4 text-[16px]"
                >
                  <span className="text-neutral-600">{row.label}</span>
                  <span className="font-medium text-neutral-900">
                    {money(row.amount)}
                  </span>
                </motion.li>
              ))}
            </ul>

            {/* total sits slightly forward of the card */}
            <div className="mt-6 flex flex-wrap items-end justify-between gap-4 [transform:translateZ(40px)]">
              <p className="flex items-center gap-2 text-[14px] text-neutral-500">
                <span className="size-2 rounded-full bg-accent" />
                Awaiting estimator approval
              </p>
              <div className="flex items-baseline gap-4">
                <span className="text-[16px] font-medium text-neutral-900">Total</span>
                <span className="text-[40px] font-medium leading-none tracking-tight text-neutral-900 tabular-nums md:text-[48px]">
                  <CountUp to={TOTAL} />
                </span>
              </div>
            </div>
          </Tilt3D>
        </motion.div>
      </div>
    </section>
  );
}