"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;
const YELLOW = "#F5C93C";
const INK = "#171717";

type Step = {
  n: string;
  title: string;
  text: string;
  // Put your images in /public/how-it-works/ and uncomment the paths.
  // Until a file exists, a plain tinted panel is shown in its place.
  image?: string;
  tint: string; // fallback panel colour
  dark?: boolean; // fallback panel is dark (grid lines turn white)
};

const STEPS: Step[] = [
  {
    n: "01",
    title: "Upload the set",
    text: "Drawings and specs in one drop.",
    // image: "/how-it-works/step-1.avif",
    tint: "#f3f4f6",
  },
  {
    n: "02",
    title: "Ask anything",
    text: "Plain language, with the sheet cited.",
    // image: "/how-it-works/step-2.avif",
    tint: "#f3f4f6",
  },
  {
    n: "03",
    title: "Share the answer",
    text: "Your team opens the exact page, not a PDF to hunt through.",
    // image: "/how-it-works/step-3.avif",
    tint: "#f3f4f6",
  },
];

// How much scrolling each step gets on desktop (in screens)
const SCREENS_PER_STEP = 0.9;

// True from the `md` breakpoint up. Starts false so the server and the
// first browser render match, then updates.
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

// One heading word that slides up out of a mask
function Word({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const still = useReducedMotion();
  return (
    <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
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

function Heading() {
  return (
    <h2 className="font-display text-[44px] font-medium leading-[0.98] tracking-[-0.05em] md:text-[clamp(44px,5vw,76px)]">
      <span className="block text-neutral-900">
        <Word>How</Word> <Word delay={0.08}>it</Word> <Word delay={0.16}>works</Word>
      </span>
      <span className="block text-neutral-400">
        <Word delay={0.24}>Upload.</Word> <Word delay={0.32}>Ask.</Word>{" "}
        <Word delay={0.4}>Share.</Word>
      </span>
    </h2>
  );
}

// The picture for one step: the real image, or a plain tinted panel with a grid
function Media({ step }: { step: Step }) {
  const img = useRef<HTMLImageElement>(null);
  const [missing, setMissing] = useState(false);

  // catch a failed load that happened before React attached
  useEffect(() => {
    const el = img.current;
    if (el && el.complete && el.naturalWidth === 0) setMissing(true);
  }, []);

  if (step.image && !missing) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        ref={img}
        src={step.image}
        alt=""
        onError={() => setMissing(true)}
        className="size-full object-cover"
        draggable={false}
      />
    );
  }

  const line = step.dark ? "rgba(255,255,255,0.07)" : "rgba(15,23,42,0.06)";
  return (
    <div
      className="size-full"
      style={{
        backgroundColor: step.tint,
        backgroundImage: `linear-gradient(to right, ${line} 1px, transparent 1px), linear-gradient(to bottom, ${line} 1px, transparent 1px)`,
        backgroundSize: "28px 28px",
      }}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Desktop: pinned story. Steps on the left, one big stage on the right */
/* ------------------------------------------------------------------ */

function StepRow({
  step,
  on,
  onSelect,
}: {
  step: Step;
  on: boolean;
  onSelect: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        aria-current={on ? "step" : undefined}
        className="block w-full text-left"
      >
        <div className="flex items-center gap-4">
          <motion.span
            animate={{
              backgroundColor: on ? YELLOW : "#efefef",
              color: on ? "#000" : "#a3a3a3",
            }}
            transition={{ duration: 0.3 }}
            className="rounded-full px-3 py-1 text-[13px] font-bold tabular-nums"
          >
            {step.n}
          </motion.span>
          <motion.span
            animate={{ color: on ? INK : "#c4c4c4", x: on ? 8 : 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="font-display text-[clamp(1.75rem,2.6vw,2.6rem)] font-medium leading-[1.05] tracking-[-0.04em]"
          >
            {step.title}
          </motion.span>
        </div>
        <motion.div
          initial={false}
          animate={{ height: on ? "auto" : 0, opacity: on ? 1 : 0 }}
          transition={{ duration: 0.45, ease: EASE }}
          className="overflow-hidden"
        >
          <p className="max-w-sm pb-1 pl-[3.6rem] pt-3 text-lg text-neutral-500">
            {step.text}
          </p>
        </motion.div>
      </button>
    </li>
  );
}

function DesktopStory({ still }: { still: boolean }) {
  const track = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: track,
    offset: ["start start", "end end"],
  });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(Math.max(0, Math.min(STEPS.length - 1, Math.floor(v * STEPS.length))));
  });

  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 26 });
  const scrollTilt = useTransform(scrollYProgress, [0, 1], [-5, 5]);
  const gridY = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const mediaY = useTransform(scrollYProgress, [0, 1], ["-3%", "3%"]);

  // Mouse: the stage leans toward the cursor and catches the light
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 160, damping: 20, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 160, damping: 20, mass: 0.6 });
  const rotateY = useTransform([scrollTilt, sx], (v: number[]) => v[0] + v[1] * 10);
  const rotateX = useTransform(sy, [-0.5, 0.5], [6, -6]);
  const gx = useTransform(sx, [-0.5, 0.5], [0, 100]);
  const gy = useTransform(sy, [-0.5, 0.5], [0, 100]);
  const glare = useMotionTemplate`radial-gradient(520px circle at ${gx}% ${gy}%, rgba(255,255,255,0.28), transparent 65%)`;
  const glareOn = useSpring(useMotionValue(0), { stiffness: 140, damping: 22 });

  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    if (still || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
    glareOn.set(1);
  }
  function onLeave() {
    mx.set(0);
    my.set(0);
    glareOn.set(0);
  }

  function goTo(i: number) {
    const el = track.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const range = el.offsetHeight - window.innerHeight;
    window.scrollTo({
      top: top + (range * (i + 0.5)) / STEPS.length,
      behavior: still ? "auto" : "smooth",
    });
  }

  const gridLines =
    "linear-gradient(to right, rgba(15,23,42,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,23,42,0.06) 1px, transparent 1px)";
  const fade = "radial-gradient(ellipse 70% 60% at 50% 50%, #000 30%, transparent 80%)";

  return (
    <section
      id="how-it-works"
      ref={track}
      className="relative isolate bg-background"
      style={{ height: `${100 + STEPS.length * SCREENS_PER_STEP * 100}vh` }}
    >
      <div className="sticky top-0 flex h-screen items-center overflow-hidden px-12 lg:px-24">
        {/* Faint drawing-sheet grid, drifting slower than the page */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <motion.div
            className="absolute inset-x-0"
            style={{
              top: -80,
              bottom: -80,
              y: still ? 0 : gridY,
              backgroundImage: gridLines,
              backgroundSize: "56px 56px",
              maskImage: fade,
              WebkitMaskImage: fade,
            }}
          />
        </div>

        <div className="mx-auto grid w-full max-w-[1400px] grid-cols-12 items-center gap-12">
          {/* Left: heading + the three steps, with a line that fills as you scroll */}
          <div className="col-span-5">
            <Heading />
            <div className="relative mt-14 pl-8">
              <div
                aria-hidden
                className="absolute bottom-2 left-0 top-2 w-[2px] bg-neutral-200"
              >
                <motion.div
                  className="size-full bg-accent"
                  style={{ scaleY: still ? 1 : fill, originY: 0 }}
                />
              </div>
              <ol className="space-y-6">
                {STEPS.map((step, i) => (
                  <StepRow
                    key={step.n}
                    step={step}
                    on={i === active}
                    onSelect={() => goTo(i)}
                  />
                ))}
              </ol>
            </div>
          </div>

          {/* Right: one big stage. Each step's picture wipes up over the last. */}
          <div className="col-span-7" style={{ perspective: 1400 }}>
            <motion.div
              onPointerMove={onMove}
              onPointerLeave={onLeave}
              style={still ? undefined : { rotateX, rotateY }}
              className="relative aspect-[5/4] max-h-[78vh] w-full overflow-hidden rounded-[36px] border border-neutral-200 bg-[#f3f4f6] shadow-[0_40px_70px_-40px_rgba(15,23,42,0.35)]"
            >
              {STEPS.map((step, i) => (
                <motion.div
                  key={step.n}
                  className="absolute inset-0"
                  style={{ zIndex: i }}
                  initial={false}
                  animate={{
                    clipPath: active >= i ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)",
                  }}
                  transition={{ duration: still ? 0 : 0.9, ease: EASE }}
                >
                  <motion.div
                    className="size-full"
                    style={{ y: still ? 0 : mediaY }}
                    initial={false}
                    animate={{ scale: still ? 1.1 : active === i ? 1.1 : 1.25 }}
                    transition={{ duration: 1.4, ease: EASE }}
                  >
                    <Media step={step} />
                  </motion.div>
                </motion.div>
              ))}
              {!still && (
                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{ zIndex: 10, background: glare, opacity: glareOn }}
                />
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Phones: plain stack, each step fades up when reached                */
/* ------------------------------------------------------------------ */

function MobileStack({ still }: { still: boolean }) {
  return (
    <section id="how-it-works" className="relative bg-background px-6 py-24">
      <Heading />
      <ol className="mt-12 space-y-14">
        {STEPS.map((step) => (
          <motion.li
            key={step.n}
            initial={still ? false : { opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <motion.div
              className="aspect-[3/2] overflow-hidden rounded-[28px] border border-neutral-200"
              initial={still ? false : { clipPath: "inset(100% 0% 0% 0%)" }}
              whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.9, ease: EASE }}
            >
              <Media step={step} />
            </motion.div>
            <h3 className="mt-6 font-display text-3xl font-medium tracking-[-0.03em] text-neutral-900">
              {step.title}
            </h3>
            <p className="mt-2 text-lg text-neutral-500">{step.text}</p>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}

export default function HowItWorks() {
  const desktop = useIsDesktop();
  const still = !!useReducedMotion();
  return desktop ? <DesktopStory still={still} /> : <MobileStack still={still} />;
}