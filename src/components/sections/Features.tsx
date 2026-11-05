"use client";

/**
 * Features: GSAP (scroll) + Motion (hover) version.
 * Needs:  npm i gsap@latest @gsap/react
 * (gsap 3.13+ ships ScrollTrigger, SplitText and DrawSVG for free.)
 */

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, DrawSVGPlugin);

const MotionLink = motion.create(Link);

const ACCENT = "#ffc800";
const ACCENT_INK = "#755b00";
const TRACK = "#c9cfe0";

/* ------------------------------------------------------------------ */
/* Content (edit text here)                                             */
/* ------------------------------------------------------------------ */

const TAG = "Product Features";

type Stat = { id: string; text: string; count?: boolean };

const STATS: Stat[] = [
  { id: "clock", text: "Drawing review" },
  { id: "shield", text: "Document intelligence" },
  { id: "globe", text: "Quantity takeoff" },
  { id: "headset", text: "Team collaboration" },
];

type Row = {
  title: string;
  text: string;
  bullets: string[];
  /**
   * IMAGE SLOT: when you have the picture, drop it in /public and set the
   * path here, e.g. image: "/features-goal.png".
   */
  image?: string;
  imageName: string;
};

const ROWS: Row[] = [
  {
    title: "Ask your project a better question.",
    text: "Ask Stratora what you need to understand. Explore your project documents, work through the details and follow up with questions that help you make sense of the information.",
    bullets: [
      "Questions about project documents",
      "Answers with relevant project context",
      "Follow-up questions as you explore",
    ],
    image: "/features-goal.avif",
    imageName: "features-goal.avif",
  },
  {
    title: "Keep the drawing and the discussion together.",
    text: "Bring drawings, markups and conversations together, so your team can review the details, share observations and discuss what needs a decision.",
    bullets: [
      "Shared discussions around drawings",
      "Drawing details always close by",
      "Markups that make observations clear",
    ],
    image: "/features-align.avif",
    imageName: "features-align.avif",
  },
  {
    title: "Measure the detail behind your work.",
    text: "Work through lengths, areas and counts directly on your drawings, keeping each quantity connected to the detail you need to review.",
    bullets: [
      "Drawing measurements together",
      "Lengths, areas and counts in the same workspace",
      "Quantities ready for professional review",
    ],
    image: "/features-adapt.avif",
    imageName: "features-adapt.avif",
  },
  {
    title: "Talk through the detail when speaking feels easier.",
    text: "Talk to Stratora, explore project questions and follow up wherever you need clarity.",
    bullets: [
      "Voice conversations with Stratora",
      "Follow up with more questions",
      "Explore project questions by voice",
    ],
    image: "/features-health.avif",
    imageName: "features-health.avif",
  },
];

/* ------------------------------------------------------------------ */
/* Icons                                                                */
/* ------------------------------------------------------------------ */

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "#0b0b12",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className: "size-[18px]",
  "aria-hidden": true,
};

function StatIcon({ id }: { id: string }) {
  switch (id) {
    case "clock":
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="12" r="9" />
          <path className="ic-hand" d="M12 12V7" />
        </svg>
      );
    case "shield":
      return (
        <svg {...iconProps}>
          <path className="ic-shield" d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      );
    case "globe":
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18" />
          <ellipse className="ic-meridian" cx="12" cy="12" rx="4.5" ry="9" />
        </svg>
      );
    default:
      return (
        <svg {...iconProps} className="ic-headset size-[18px]">
          <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
          <path d="M4 14h2.5v4H4zM17.5 14H20v4h-2.5z" />
          <path d="M20 18c0 2-2 3-5 3" />
        </svg>
      );
  }
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" className="size-5 shrink-0" fill="none" stroke={ACCENT_INK} strokeWidth="1.5" aria-hidden>
      <circle
        className="chk-circle transition-colors duration-300 group-hover/li:fill-[#ffc800]"
        cx="10"
        cy="10"
        r="8.5"
      />
      <path
        className="chk-tick transition-colors duration-300 group-hover/li:stroke-white"
        d="M6.5 10.2l2.3 2.3 4.4-4.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Image slot                                                           */
/* ------------------------------------------------------------------ */

function ImageSlot({ src, name, alt }: { src?: string; name: string; alt: string }) {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        width={1220}
        height={1320}
        className="media h-full w-full object-cover will-change-transform"
      />
    );
  }
  return (
    <div
      data-image-slot={name}
      className="media relative flex h-full w-full items-end bg-[linear-gradient(160deg,#8fb0fb_0%,#5f86f6_50%,#3a5df0_100%)] p-5 will-change-transform"
    >
      <span className="rounded-md bg-white/20 px-2 py-1 font-mono text-[11px] uppercase tracking-wide text-[#0b0b12]/90 backdrop-blur">
        Image: {name}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Section                                                              */
/* ------------------------------------------------------------------ */

export default function Features() {
  const rootRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  // Row counter (01 / 04): whichever row is crossing the middle of the screen is "active".
  // Done with IntersectionObserver so it works on its own, separate from the GSAP code.
  const [active, setActive] = useState(0);
  useEffect(() => {
    const rows = rootRef.current?.querySelectorAll<HTMLElement>(".row");
    if (!rows || rows.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index ?? 0));
        });
      },
      { rootMargin: "-50% 0px -50% 0px" }
    );
    rows.forEach((r) => io.observe(r));
    return () => io.disconnect();
  }, []);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add(
        {
          full: "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
          lite: "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
          canHover: "(hover: hover)",
        },
        (ctx) => {
          const { full, lite, canHover } = ctx.conditions as Record<string, boolean>;
          // reduced motion: leave everything in its final state
          if (!full && !lite) return;

          const cleanups: Array<() => void> = [];

          /* ---------- Heading ---------- */
          gsap.from(q(".eyebrow"), {
            opacity: 0,
            y: 14,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: { trigger: ".eyebrow", start: "top 92%" },
          });

          const headSplit = new SplitText(q(".headline")[0], { type: "words", mask: "words" });
          gsap.from(headSplit.words, {
            yPercent: 115,
            duration: 0.95,
            ease: "power4.out",
            stagger: 0.06,
            scrollTrigger: { trigger: ".headline", start: "top 88%" },
          });

          /* ---------- Stats ---------- */
          const statsTrigger = { trigger: ".stats", start: "top 90%" };

          gsap.from(q(".stat"), {
            y: 36,
            opacity: 0,
            scale: 0.92,
            duration: 0.8,
            stagger: 0.12,
            ease: "back.out(1.6)",
            scrollTrigger: statsTrigger,
          });
          gsap.from(q(".stat-ic"), {
            scale: 0,
            rotate: -120,
            duration: 0.7,
            delay: 0.15,
            stagger: 0.12,
            ease: "back.out(2)",
            scrollTrigger: statsTrigger,
          });

          const countEl = q(".count")[0];
          if (countEl) {
            const obj = { v: 0 };
            countEl.textContent = "0.00";
            gsap.to(obj, {
              v: 99.99,
              duration: 1.8,
              ease: "power2.out",
              onUpdate: () => {
                countEl.textContent = obj.v.toFixed(2);
              },
              scrollTrigger: statsTrigger,
            });
          }

          // little idle loops so the icons feel alive
          gsap.to(q(".ic-hand"), { rotation: 360, svgOrigin: "12 12", duration: 12, ease: "steps(12)", repeat: -1 });
          gsap.to(q(".ic-shield"), { scale: 1.1, svgOrigin: "12 12", duration: 1.5, yoyo: true, repeat: -1, ease: "sine.inOut" });
          gsap.to(q(".ic-meridian"), { scaleX: 0.15, svgOrigin: "12 12", duration: 2.2, yoyo: true, repeat: -1, ease: "sine.inOut" });
          gsap.to(q(".ic-headset"), { y: -1.5, duration: 1.2, yoyo: true, repeat: -1, ease: "sine.inOut" });

          /* ---------- Rows ---------- */
          const rows = q(".row") as HTMLElement[];

          rows.forEach((row, i) => {
            const imageRight = i % 2 === 0;
            const slot = row.querySelector(".slot") as HTMLElement;
            const titleEl = row.querySelector(".row-title") as HTMLElement;
            const para = row.querySelector(".row-text");
            const panel = row.querySelector(".panel");
            const dividers = row.querySelectorAll(".divider");
            const circles = row.querySelectorAll(".chk-circle");
            const ticks = row.querySelectorAll(".chk-tick");
            const texts = row.querySelectorAll(".btxt");
            const ctas = row.querySelectorAll(".cta");

            const titleSplit = new SplitText(titleEl, { type: "lines", mask: "lines" });

            const tl = gsap.timeline({
              defaults: { ease: "power3.out" },
              scrollTrigger: { trigger: row, start: "top 72%" },
            });

            tl.fromTo(
              slot,
              {
                clipPath: imageRight ? "inset(0% 0% 0% 100% round 24px)" : "inset(0% 100% 0% 0% round 24px)",
                x: full ? (imageRight ? 60 : -60) : 0,
              },
              { clipPath: "inset(0% 0% 0% 0% round 24px)", x: 0, duration: 1.2, ease: "power3.inOut", clearProps: "clipPath" },
              0
            )
              .from(titleSplit.lines, { yPercent: 110, duration: 0.9, stagger: 0.1 }, 0.2)
              .from(para, { opacity: 0, y: 18, duration: 0.7 }, 0.45)
              .from(panel, { opacity: 0, y: 30, duration: 0.8 }, 0.55)
              .from(dividers, { scaleX: 0, transformOrigin: "left center", duration: 0.7, stagger: 0.15, ease: "power2.out" }, 0.8)
              .fromTo(circles, { drawSVG: "0%" } as gsap.TweenVars, { drawSVG: "100%", duration: 0.6, stagger: 0.18, ease: "power2.inOut" } as gsap.TweenVars, 0.7)
              .fromTo(ticks, { drawSVG: "0%" } as gsap.TweenVars, { drawSVG: "100%", duration: 0.35, stagger: 0.18, ease: "power2.out" } as gsap.TweenVars, 1.05)
              .from(texts, { x: -14, opacity: 0, duration: 0.5, stagger: 0.18 }, 0.75)
              .from(ctas, { y: 20, opacity: 0, duration: 0.6, stagger: 0.1, ease: "back.out(1.8)" }, 1.2);
          });

          /* ---------- Desktop-only motion ---------- */
          if (full) {
            // Image parallax: picture settles and drifts inside its window
            rows.forEach((row) => {
              const media = row.querySelector(".media");
              const slot = row.querySelector(".slot");
              if (!media || !slot) return;
              gsap.fromTo(
                media,
                { scale: 1.3, yPercent: -5 },
                {
                  scale: 1.15,
                  yPercent: 5,
                  ease: "none",
                  scrollTrigger: { trigger: slot, start: "top bottom", end: "bottom top", scrub: 0.6 },
                }
              );
            });

            // Hover: image tilts toward the cursor
            if (canHover) {
              rows.forEach((row) => {
                const slot = row.querySelector(".slot") as HTMLElement;
                gsap.set(slot, { transformPerspective: 900 });
                const rx = gsap.quickTo(slot, "rotationX", { duration: 0.6, ease: "power3.out" });
                const ry = gsap.quickTo(slot, "rotationY", { duration: 0.6, ease: "power3.out" });

                const move = (e: MouseEvent) => {
                  const r = slot.getBoundingClientRect();
                  const px = (e.clientX - r.left) / r.width - 0.5;
                  const py = (e.clientY - r.top) / r.height - 0.5;
                  ry(px * 5);
                  rx(-py * 5);
                };
                const reset = () => {
                  rx(0);
                  ry(0);
                };
                slot.addEventListener("mousemove", move);
                slot.addEventListener("mouseleave", reset);
                cleanups.push(() => {
                  slot.removeEventListener("mousemove", move);
                  slot.removeEventListener("mouseleave", reset);
                });
              });
            }
          }

          return () => cleanups.forEach((fn) => fn());
        }
      );

      return () => mm.revert();
    },
    { scope: rootRef }
  );

  return (
    <section
      ref={rootRef}
      id="features"
      style={{ colorScheme: "light" }}
      className="scroll-mt-20 overflow-x-clip bg-[#f5f4ef] px-3 py-16 text-[#0b0d1a] md:px-5 md:py-28"
    >
      <div className="mx-auto max-w-[1280px]">
        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="eyebrow mb-6 inline-flex items-center gap-2 font-mono text-[13px] uppercase tracking-wide text-[#755b00]">
            <span className="relative flex size-3 items-center justify-center">
              <span className="absolute inline-flex size-full animate-ping rounded-full border border-[#ffc800] opacity-50" />
              <span className="relative inline-flex size-3 rounded-full border-2 border-[#ffc800]" />
            </span>
            {TAG}
          </div>

          <h2 className="headline mx-auto max-w-[18ch] text-4xl font-medium leading-[1.12] tracking-tight md:max-w-none md:text-6xl">
            One workspace for <br className="hidden md:block" />
            drawings, documents, <br className="hidden md:block" />
            and your team.
          </h2>
        </div>

        {/* Stats */}
        <div className="stats mt-12 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 md:mt-16 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.id} className="stat">
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
                className="flex items-center gap-4"
              >
                <span className="stat-ic flex size-10 shrink-0 items-center justify-center rounded-full bg-[#ffc800] shadow-[0_8px_20px_-8px_rgba(96,74,0,0.7)]">
                  <StatIcon id={s.id} />
                </span>
                <span className="text-[16px]">
                  {s.count ? <span className="count">99.99</span> : null}
                  {s.text}
                </span>
              </motion.div>
            </div>
          ))}
        </div>

        {/* Rows */}
        <div className="relative mt-16 space-y-20 md:mt-24 md:space-y-32">
          {/* 01 / 04 rail (wide screens only) */}
          <div aria-hidden className="pointer-events-none absolute inset-y-0 -left-16 hidden min-[1500px]:block">
            <div className="sticky top-[42vh] flex flex-col items-center gap-3 font-mono text-[12px] text-[#8a8fa3]">
              <span className="relative block h-6 overflow-hidden text-[18px] leading-6 text-[#0b0d1a]">
                <motion.span
                  key={active}
                  initial={reduce ? false : { y: 14, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="block"
                >
                  {`0${active + 1}`}
                </motion.span>
              </span>
              {ROWS.map((r, j) => (
                <motion.span
                  key={r.imageName}
                  initial={false}
                  animate={{ height: j === active ? 28 : 12, backgroundColor: j === active ? ACCENT : TRACK }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="block w-0.5 rounded"
                  style={{ height: 12, backgroundColor: TRACK }}
                />
              ))}
              <span>{`0${ROWS.length}`}</span>
            </div>
          </div>

          {ROWS.map((row, i) => {
            const imageRight = i % 2 === 0;
            return (
              <div key={row.imageName} data-index={i} className="row grid items-center gap-8 md:grid-cols-2 md:gap-16">
                {/* Image */}
                <div className={imageRight ? "md:order-2" : ""}>
                  <div className="slot aspect-[610/660] w-full overflow-hidden rounded-3xl will-change-transform">
                    <ImageSlot src={row.image} name={row.imageName} alt={row.title} />
                  </div>
                </div>

                {/* Text */}
                <div className={imageRight ? "md:order-1" : ""}>
                  <h3 className="row-title text-[30px] font-medium leading-[1.12] tracking-tight md:text-[38px]">
                    {row.title}
                  </h3>
                  <p className="row-text mt-4 max-w-[52ch] text-[15px] leading-relaxed text-[#555a6e]">{row.text}</p>

                  <div className="panel mt-8 overflow-hidden rounded-2xl bg-[#f8f9fc]">
                    <ul className="rounded-2xl bg-[#ecebe5] px-4">
                      {row.bullets.map((b, j) => (
                        <motion.li
                          key={b}
                          whileHover={{ x: 6 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          className="group/li relative flex items-center gap-3 py-4 text-[16px]"
                        >
                          <CheckIcon />
                          <span className="btxt">{b}</span>
                          {j < row.bullets.length - 1 && (
                            <span className="divider absolute bottom-0 left-0 right-0 h-px bg-[#d3d8e6]" />
                          )}
                        </motion.li>
                      ))}
                    </ul>

                    <div className="flex flex-wrap items-center gap-2.5 p-4">
                      <div className="cta">
                        <MotionLink
                          href="/contact"
                          whileHover={{ scale: 1.06 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ type: "spring", stiffness: 400, damping: 18 }}
                          className="group inline-flex items-center gap-2 rounded-full bg-[#ffc800] px-5 py-3 font-mono text-[13px] font-medium uppercase tracking-wide text-[#0b0b12] shadow-[0_10px_24px_-10px_rgba(96,74,0,0.7)]"
                        >
                          <span className="size-2.5 rounded-full border-2 border-[#0b0b12]/80 transition-colors duration-300 group-hover:bg-[#0b0b12]" />
                          Book a demo
                        </MotionLink>
                      </div>
                      <div className="cta">
                        <MotionLink
                          href="/#pricing"
                          whileHover={{ scale: 1.06 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ type: "spring", stiffness: 400, damping: 18 }}
                          className="group inline-flex items-center gap-2 rounded-full bg-[#ecebe5] px-5 py-3 font-mono text-[13px] font-medium uppercase tracking-wide text-[#3a3f52]"
                        >
                          <span className="size-2.5 rounded-full border-2 border-[#8a8fa3] transition-colors duration-300 group-hover:bg-[#3a3f52]" />
                          Pricing
                        </MotionLink>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
