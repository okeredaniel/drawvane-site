"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;

// The three cards. Put the images in /public/how-it-works/ and make sure
// each `image` path matches your file. Until the file exists, a light
// panel is shown instead. `n` is the number shown on the floating chip.
const STEPS = [
  {
    n: "01",
    title: "Upload the set",
    text: "Drawings and specs in one drop.",
    // image: "/how-it-works/step-1.avif",
  },
  {
    n: "02",
    title: "Ask anything",
    text: "Plain language, cited answers.",
    // image: "/how-it-works/step-2.avif",
  },
  {
    n: "03",
    title: "Share the answer",
    text: "Send it with the sheet attached.",
    // image: "/how-it-works/step-3.avif",
  },
];

// The strip under the cards. Only keep the last step as written if your
// product really has a human approval step.
const CHAIN = [
  {
    title: "Open the sheet",
    text: "Start from the drawing or spec your team is looking at.",
  },
  {
    title: "Find the evidence",
    text: "Related clauses, sheets and RFIs, each linked to its page.",
  },
  {
    title: "Review the scope",
    text: "See what a change touches before anyone prices it.",
  },
  {
    title: "Make the decision",
    text: "A person approves the outcome and shares it with the sheet attached.",
  },
];

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

function StepImage({ src, y }: { src: string; y?: MotionValue<string> }) {
  const img = useRef<HTMLImageElement>(null);
  const [missing, setMissing] = useState(false);

  // catch a failed load that happened before React attached
  useEffect(() => {
    const el = img.current;
    if (el && el.complete && el.naturalWidth === 0) setMissing(true);
  }, []);

  return (
    <div className="aspect-[3/2] w-full overflow-hidden bg-gradient-to-b from-neutral-100 to-neutral-200">
      {!missing && (
        // The image is scaled up a little and slides inside its frame as you
        // scroll, so it looks like it sits deeper than the card.
        <motion.div className="size-full" style={{ y, scale: y ? 1.14 : 1 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={img}
            src={src}
            alt=""
            onError={() => setMissing(true)}
            className="size-full object-cover"
            draggable={false}
          />
        </motion.div>
      )}
    </div>
  );
}

function StepCard({
  step,
  index,
  reveal,
  float,
  desktop,
  still,
}: {
  step: (typeof STEPS)[number];
  index: number;
  reveal: MotionValue<number>; // 0 -> 1 while the cards fan out
  float: MotionValue<number>; // 0 -> 1 while the row passes through the screen
  desktop: boolean;
  still: boolean;
}) {
  const side = index === 0 ? -1 : index === 2 ? 1 : 0; // left, middle, right
  const animated = desktop && !still;

  // --- Scroll: the side cards slide out from behind the middle one and
  // fan inward, then everything drifts at slightly different speeds ---
  const x = useTransform(reveal, [0, 1], [side === 0 ? "0%" : `${-side * 105}%`, "0%"]);
  const opacity = useTransform(reveal, side === 0 ? [0, 0.3] : [0.1, 0.5], [0, 1]);
  const scale = useTransform(reveal, [0, 1], [0.9, 1]);
  const rotateX = useTransform(reveal, [0, 1], [16, 0]);
  const revealY = useTransform(reveal, [0, 1], [70, 0]);
  const floatY = useTransform(float, [0, 1], index === 1 ? [30, -30] : [-18, 18]);
  const y = useTransform([revealY, floatY], (v: number[]) => v[0] + v[1]);
  const fan = useTransform(reveal, [0, 1], [0, -side * 7]);
  const sway = useTransform(float, [0, 1], [5, -5]);
  const rotateY = useTransform([fan, sway], (v: number[]) => v[0] + v[1]);
  const imgY = useTransform(float, [0, 1], ["-7%", "7%"]);

  // --- Mouse: the card tilts toward the cursor and catches the light ---
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 200, damping: 20, mass: 0.5 });
  const sy = useSpring(my, { stiffness: 200, damping: 20, mass: 0.5 });
  const tiltY = useTransform(sx, [-0.5, 0.5], [-9, 9]);
  const tiltX = useTransform(sy, [-0.5, 0.5], [9, -9]);
  const gx = useTransform(sx, [-0.5, 0.5], [0, 100]);
  const gy = useTransform(sy, [-0.5, 0.5], [0, 100]);
  const glare = useMotionTemplate`radial-gradient(420px circle at ${gx}% ${gy}%, rgba(255,255,255,0.4), rgba(245,201,60,0.18) 40%, transparent 70%)`;
  const glareOn = useSpring(useMotionValue(0), { stiffness: 160, damping: 22 });

  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!animated || e.pointerType !== "mouse") return;
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

  // Phones and reduced motion: no 3D, the card just fades up when reached
  const simple = !desktop && !still;

  return (
    <motion.div
      className={`relative ${index === 1 ? "z-10" : "z-0"}`}
      style={
        animated
          ? { x, y, opacity, scale, rotateX, rotateY, transformStyle: "preserve-3d" }
          : undefined
      }
      initial={simple ? { opacity: 0, y: 40 } : undefined}
      whileInView={simple ? { opacity: 1, y: 0 } : undefined}
      viewport={simple ? { once: true, margin: "-60px" } : undefined}
      transition={simple ? { duration: 0.8, ease: EASE } : undefined}
    >
      <motion.div
        className="group relative"
        style={animated ? { rotateX: tiltX, rotateY: tiltY, transformStyle: "preserve-3d" } : undefined}
        whileHover={animated ? { scale: 1.025 } : undefined}
        transition={{ type: "spring", stiffness: 220, damping: 22 }}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
      >
        <article className="relative overflow-hidden rounded-[32px] border border-neutral-200 bg-white shadow-[0_4px_20px_-8px_rgba(15,23,42,0.15)] transition-[border-color,box-shadow] duration-300 group-hover:border-accent group-hover:shadow-[0_24px_48px_-24px_rgba(15,23,42,0.3)]">
          <StepImage src={step.image} y={animated ? imgY : undefined} />
          <div className="px-7 pb-8 pt-7">
            <h3 className="text-2xl font-medium tracking-tight text-neutral-900">
              {step.title}
            </h3>
            <p className="mt-3 text-lg text-neutral-500">{step.text}</p>
          </div>
          {animated && (
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{ background: glare, opacity: glareOn }}
            />
          )}
        </article>

        {/* The number chip floats in front of the card */}
        <span
          aria-hidden
          className="absolute left-5 top-5 rounded-full bg-accent px-3.5 py-1.5 text-[13px] font-bold text-black shadow-[0_8px_20px_-6px_rgba(15,23,42,0.35)]"
          style={animated ? { transform: "translateZ(60px)" } : undefined}
        >
          {step.n}
        </span>
      </motion.div>
    </motion.div>
  );
}

// One step in the strip. Its node turns yellow when the line reaches it.
function ChainItem({
  item,
  index,
  total,
  progress,
}: {
  item: (typeof CHAIN)[number];
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const t = index / total + 0.02;
  const bg = useTransform(progress, [t - 0.04, t], ["#ffffff", "#F5C93C"]);
  const border = useTransform(progress, [t - 0.04, t], ["#d4d4d4", "#F5C93C"]);
  const pop = useTransform(progress, [t - 0.04, t, t + 0.06], [1, 1.18, 1]);

  return (
    <li className="relative pl-14 md:pl-0 md:pt-14">
      <motion.span
        aria-hidden
        style={{ backgroundColor: bg, borderColor: border, scale: pop }}
        className="absolute left-0 top-0 grid size-10 place-items-center rounded-full border-2 text-[14px] font-bold text-neutral-900"
      >
        {index + 1}
      </motion.span>
      <div className="h-full rounded-2xl border border-neutral-200 bg-white p-6">
        <p className="text-[20px] font-medium leading-tight tracking-[-0.02em] text-neutral-900">
          {item.title}
        </p>
        <p className="mt-2 text-[15px] leading-relaxed text-neutral-500">{item.text}</p>
      </div>
    </li>
  );
}

export default function HowItWorks() {
  const root = useRef<HTMLElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const chain = useRef<HTMLDivElement>(null);
  const desktop = useIsDesktop();
  const still = !!useReducedMotion();

  // Cards fan out as the row scrolls into view (and fold back if you scroll up)
  const { scrollYProgress: revealRaw } = useScroll({
    target: grid,
    offset: ["start 92%", "start 35%"],
  });
  const reveal = useSpring(revealRaw, { stiffness: 110, damping: 24, mass: 0.6 });

  // Slow drift while the row passes through the screen
  const { scrollYProgress: float } = useScroll({
    target: grid,
    offset: ["start end", "end start"],
  });

  // Blueprint grid behind the section moves slower than the page
  const { scrollYProgress: bgProgress } = useScroll({
    target: root,
    offset: ["start end", "end start"],
  });
  const gridY = useTransform(bgProgress, [0, 1], [-70, 70]);

  // The yellow line in the strip fills as you scroll past it
  const { scrollYProgress: chainRaw } = useScroll({
    target: chain,
    offset: ["start 80%", "end 55%"],
  });
  const chainFill = useSpring(chainRaw, { stiffness: 120, damping: 26 });
  const full = useMotionValue(1);
  const progress = still ? full : chainFill;

  const gridLines =
    "linear-gradient(to right, rgba(15,23,42,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,23,42,0.06) 1px, transparent 1px)";
  const fade = "radial-gradient(ellipse 70% 60% at 50% 40%, #000 30%, transparent 80%)";

  return (
    <section
      id="how-it-works"
      ref={root}
      className="relative isolate overflow-x-clip bg-background px-6 py-24 lg:px-24 lg:py-32"
    >
      {/* Faint drawing-sheet grid */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
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

      <h2 className="text-center font-display text-[40px] font-medium leading-[0.98] tracking-[-0.05em] md:text-[56px]">
        <span className="block text-neutral-900">
          <Word>How</Word> <Word delay={0.08}>it</Word> <Word delay={0.16}>works</Word>
        </span>
        <span className="block text-neutral-400">
          <Word delay={0.24}>Upload.</Word> <Word delay={0.32}>Ask.</Word>{" "}
          <span className="relative inline-block">
            <Word delay={0.4}>
              <span className="text-neutral-900">Share.</span>
            </Word>
            {/* yellow highlighter drawn under the last word */}
            <motion.span
              aria-hidden
              className="absolute inset-x-0 bottom-[0.06em] -z-10 h-[0.22em] origin-left bg-accent"
              initial={still ? false : { scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.9 }}
            />
          </span>
        </span>
      </h2>

      <div
        ref={grid}
        className="mt-14 grid grid-cols-1 gap-[18px] md:grid-cols-3"
        style={{ perspective: desktop ? 1400 : undefined }}
      >
        {STEPS.map((step, i) => (
          <StepCard
            // remount when switching between phone and desktop mode
            key={`${step.n}-${desktop}`}
            step={step}
            index={i}
            reveal={reveal}
            float={float}
            desktop={desktop}
            still={still}
          />
        ))}
      </div>

      {/* From question to decision */}
      <div ref={chain} className="mx-auto mt-24 max-w-[1200px] lg:mt-32">
        <div className="text-center">
          <h3 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] font-medium leading-[1.05] tracking-[-0.04em] text-neutral-900">
            From question to decision
          </h3>
          <p className="mt-3 text-lg text-neutral-500">
            Every answer stays tied to the sheet it came from.
          </p>
        </div>

        <div className="relative mt-12">
          {/* phones: line runs down the left */}
          <div
            aria-hidden
            className="absolute bottom-5 left-[19px] top-5 w-[2px] bg-neutral-200 md:hidden"
          >
            <motion.div
              className="size-full bg-accent"
              style={{ scaleY: progress, originY: 0 }}
            />
          </div>
          {/* tablets and up: line runs across the top */}
          <div
            aria-hidden
            className="absolute left-5 right-5 top-[19px] hidden h-[2px] bg-neutral-200 md:block"
          >
            <motion.div
              className="size-full bg-accent"
              style={{ scaleX: progress, originX: 0 }}
            />
          </div>

          <ol className="relative grid gap-6 md:grid-cols-4 md:gap-5">
            {CHAIN.map((item, i) => (
              <ChainItem
                key={item.title}
                item={item}
                index={i}
                total={CHAIN.length}
                progress={progress}
              />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}