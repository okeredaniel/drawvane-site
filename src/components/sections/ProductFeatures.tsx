"use client";

/**
 * ProductFeatures: GSAP (scroll) + Motion (hover) version.
 * Needs:  npm i gsap@latest @gsap/react
 * (gsap 3.13+ ships ScrollTrigger, SplitText and DrawSVG for free.)
 */

import { useRef } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, DrawSVGPlugin);

const MotionA = motion.create("a");

/* ------------------------------------------------------------------ */
/* Content (edit text here)                                             */
/* ------------------------------------------------------------------ */

const TAG = "Product Features";
const HEADING = "What Stratora gives you";

/**
 * BACKGROUND IMAGE SLOT: when you have the textured background picture, put it in
 * /public and set the path, e.g. "/construction/hero-bg-1.webp".
 */
const BG_IMAGE: string | undefined = "/construction/hero-bg-1.webp";

type Feature = { id: string; title: string; text: string };

const FEATURES: Feature[] = [
  { id: "plan", title: "Ask Stratora", text: "Ask questions about project documents and explore the answers in one place." },
  { id: "workspace", title: "Project Workspace", text: "Keep drawings, documents and discussions in one shared workspace." },
  { id: "board", title: "Drawing Review", text: "Review drawings and add markups to highlight details for your team." },
  { id: "context", title: "Team Collaboration", text: "Bring people together around the same project documents and discussions." },
  { id: "memory", title: "Quantity Takeoff", text: "Measure lengths, areas and counts while keeping the drawing detail in view." },
  { id: "signals", title: "Call Stratora", text: "Talk through your project questions when speaking feels easier than typing." },
];

/* ------------------------------------------------------------------ */
/* Icons (every drawn piece has class "ico-s" so GSAP can draw it)      */
/* ------------------------------------------------------------------ */

const svgProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className: "size-7",
  "aria-hidden": true,
};

function FeatureIcon({ id }: { id: string }) {
  switch (id) {
    case "plan":
      return (
        <svg {...svgProps}>
          <path className="ico-s" d="M11 3l1.8 5.2L18 10l-5.2 1.8L11 17l-1.8-5.2L4 10l5.2-1.8z" />
          <path className="ico-s" d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z" />
        </svg>
      );
    case "workspace":
      return (
        <svg {...svgProps}>
          <rect className="ico-s" x="3" y="3" width="7" height="9" rx="1.5" />
          <rect className="ico-s" x="14" y="3" width="7" height="5" rx="1.5" />
          <rect className="ico-s" x="14" y="12" width="7" height="9" rx="1.5" />
          <rect className="ico-s" x="3" y="16" width="7" height="5" rx="1.5" />
        </svg>
      );
    case "board":
      return (
        <svg {...svgProps} strokeWidth={2}>
          <path className="ico-s" d="M6 4v9" />
          <path className="ico-s" d="M12 4v16" />
          <path className="ico-s" d="M18 4v6" />
        </svg>
      );
    case "context":
      return (
        <svg {...svgProps}>
          <circle className="ico-s" cx="9" cy="8" r="3" />
          <path className="ico-s" d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
          <circle className="ico-s" cx="17" cy="9" r="2.5" />
          <path className="ico-s" d="M17 14c2.5 0 4.5 2 4.5 4.5" />
        </svg>
      );
    case "memory":
      return (
        <svg {...svgProps}>
          <path className="ico-s" d="M3 12a9 9 0 1 0 3-6.7" />
          <path className="ico-s" d="M3 4v5h5" />
          <path className="ico-s" d="M12 7v5l3 2" />
        </svg>
      );
    default:
      return (
        <svg {...svgProps}>
          <path className="ico-s" d="M4 17a8 8 0 1 1 16 0" />
          <path className="ico-s" d="M12 17l4-5" />
        </svg>
      );
  }
}

/* ------------------------------------------------------------------ */
/* Section                                                              */
/* ------------------------------------------------------------------ */

const itemVariants = {
  rest: { y: 0 },
  hover: { y: -6, transition: { type: "spring" as const, stiffness: 300, damping: 18 } },
};
const iconVariants = {
  rest: { rotate: 0, scale: 1 },
  hover: { rotate: -8, scale: 1.15, transition: { type: "spring" as const, stiffness: 320, damping: 14 } },
};
const haloVariants = {
  rest: { opacity: 0, scale: 0.6 },
  hover: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
};

export default function ProductFeatures() {
  const rootRef = useRef<HTMLElement>(null);

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
          if (!full && !lite) return;

          const cleanups: Array<() => void> = [];

          gsap.fromTo(
            q(".bg"),
            { yPercent: -6, scale: 1.08 },
            {
              yPercent: 6,
              scale: 1.18,
              ease: "none",
              scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: 0.6 },
            }
          );

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
            stagger: 0.07,
            scrollTrigger: { trigger: ".headline", start: "top 90%" },
          });

          const cols = full ? 3 : 1;
          const feats = q(".feat") as HTMLElement[];

          feats.forEach((feat, i) => {
            const row = Math.floor(i / cols);
            const col = i % cols;
            const strokes = feat.querySelectorAll(".ico-s");
            const iconWrap = feat.querySelector(".ico-wrap");
            const titleEl = feat.querySelector(".feat-title") as HTMLElement;
            const desc = feat.querySelector(".feat-text");

            const titleSplit = new SplitText(titleEl, { type: "lines", mask: "lines" });

            const tl = gsap.timeline({
              delay: (row + col) * 0.12,
              defaults: { ease: "power3.out" },
              scrollTrigger: { trigger: feat, start: "top 90%" },
            });

            tl.from(iconWrap, { scale: 0.6, opacity: 0, duration: 0.6, ease: "back.out(2)" }, 0)
              .fromTo(
                strokes,
                { drawSVG: "0%" } as gsap.TweenVars,
                { drawSVG: "100%", duration: 1, stagger: 0.12, ease: "power2.inOut" } as gsap.TweenVars,
                0.05
              )
              .from(titleSplit.lines, { yPercent: 110, duration: 0.8 }, 0.3)
              .from(desc, { opacity: 0, y: 16, duration: 0.8 }, 0.45);
          });

          gsap.from(q(".cta"), {
            opacity: 0,
            y: 24,
            duration: 0.8,
            ease: "back.out(1.6)",
            scrollTrigger: { trigger: ".cta", start: "top 95%" },
          });
          gsap.to(q(".cta-arrow"), { y: 3, duration: 0.7, yoyo: true, repeat: -1, ease: "sine.inOut" });

          if (full) {
            feats.forEach((feat, i) => {
              const row = Math.floor(i / cols);
              gsap.fromTo(
                feat,
                { y: row === 0 ? 28 : -8 },
                {
                  y: row === 0 ? -28 : 8,
                  ease: "none",
                  scrollTrigger: { trigger: ".grid-wrap", start: "top bottom", end: "bottom top", scrub: 0.8 },
                }
              );
            });

            if (canHover) {
              const glow = q(".glow")[0] as HTMLElement;
              if (glow) {
                gsap.set(glow, { xPercent: -50, yPercent: -50, opacity: 0 });
                const gx = gsap.quickTo(glow, "x", { duration: 0.6, ease: "power3.out" });
                const gy = gsap.quickTo(glow, "y", { duration: 0.6, ease: "power3.out" });
                const onMove = (e: MouseEvent) => {
                  const r = root.getBoundingClientRect();
                  gx(e.clientX - r.left);
                  gy(e.clientY - r.top);
                };
                const onEnter = () => gsap.to(glow, { opacity: 1, duration: 0.5, overwrite: "auto" });
                const onLeave = () => gsap.to(glow, { opacity: 0, duration: 0.5, overwrite: "auto" });
                root.addEventListener("mousemove", onMove);
                root.addEventListener("mouseenter", onEnter);
                root.addEventListener("mouseleave", onLeave);
                cleanups.push(() => {
                  root.removeEventListener("mousemove", onMove);
                  root.removeEventListener("mouseenter", onEnter);
                  root.removeEventListener("mouseleave", onLeave);
                });
              }

              const zone = q(".cta-zone")[0] as HTMLElement;
              const mag = q(".cta-mag")[0] as HTMLElement;
              if (zone && mag) {
                const mx = gsap.quickTo(mag, "x", { duration: 0.5, ease: "power3.out" });
                const my = gsap.quickTo(mag, "y", { duration: 0.5, ease: "power3.out" });
                const onMove = (e: MouseEvent) => {
                  const r = mag.getBoundingClientRect();
                  const cx = r.left + r.width / 2;
                  const cy = r.top + r.height / 2;
                  mx((e.clientX - cx) * 0.35);
                  my((e.clientY - cy) * 0.35);
                };
                const onLeave = () => {
                  mx(0);
                  my(0);
                };
                zone.addEventListener("mousemove", onMove);
                zone.addEventListener("mouseleave", onLeave);
                cleanups.push(() => {
                  zone.removeEventListener("mousemove", onMove);
                  zone.removeEventListener("mouseleave", onLeave);
                });
              }
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
      id="product-features"
      style={{ colorScheme: "light" }}
      className="relative scroll-mt-20 overflow-hidden bg-[#ffc800] py-14 text-[#0b0b12] md:py-24"
    >
      <div aria-hidden className="bg absolute inset-0 will-change-transform">
        {BG_IMAGE ? (
          <Image src={BG_IMAGE} alt="" fill sizes="100vw" className="object-cover grayscale opacity-20 mix-blend-multiply" />
        ) : (
          <div className="absolute inset-0 bg-[linear-gradient(160deg,#ffdc57_0%,#ffc800_45%,#e0ad00_100%)]" />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,200,0,0.08),rgba(255,200,0,0.20))]" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.10)_1px,transparent_1px)] [background-size:5px_5px]" />
      </div>

      <div
        aria-hidden
        className="glow pointer-events-none absolute left-0 top-0 hidden size-[520px] rounded-full bg-[radial-gradient(closest-side,rgba(255,255,255,0.22),rgba(255,255,255,0))] md:block"
      />

      <div className="relative mx-auto max-w-[1280px] px-4 md:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="eyebrow mb-6 inline-flex items-center gap-2 font-mono text-[13px] uppercase tracking-wide text-[#0b0b12]/80">
            <span className="relative flex size-3 items-center justify-center">
              <span className="absolute inline-flex size-full animate-ping rounded-full border border-[#0b0b12] opacity-50" />
              <span className="relative inline-flex size-3 rounded-full border-2 border-[#0b0b12]" />
            </span>
            {TAG}
          </div>
          <h2 className="headline text-4xl font-semibold leading-[1.12] tracking-[-0.03em] md:text-6xl">{HEADING}</h2>
        </div>

        <div className="grid-wrap mx-auto mt-8 grid max-w-[1000px] gap-x-6 gap-y-8 sm:grid-cols-2 md:mt-12 md:grid-cols-3 md:gap-y-14">
          {FEATURES.map((f) => (
            <div key={f.id} className="feat">
              <motion.div
                variants={itemVariants}
                initial="rest"
                whileHover="hover"
                className="relative rounded-3xl px-5 py-7 text-center transition-colors duration-300 hover:bg-white/25 hover:ring-1 hover:ring-black/10"
              >
                <motion.span variants={iconVariants} className="ico-wrap relative mx-auto flex size-12 items-center justify-center">
                  <motion.span variants={haloVariants} className="absolute inset-0 rounded-full bg-white/20 blur-md" aria-hidden />
                  <span className="relative">
                    <FeatureIcon id={f.id} />
                  </span>
                </motion.span>
                <h3 className="feat-title mt-4 text-[18px] font-medium leading-snug">{f.title}</h3>
                <p className="feat-text mx-auto mt-2.5 max-w-[34ch] text-[15px] leading-relaxed text-[#0b0b12]/75">{f.text}</p>
              </motion.div>
            </div>
          ))}
        </div>

        <div className="cta mt-10 flex justify-center md:mt-14">
          <div className="cta-zone -m-8 p-8">
            <div className="cta-mag">
              <MotionA
                href="#integrations"
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 18 }}
                className="group inline-flex items-center gap-2.5 rounded-full bg-[#ecebe5] px-6 py-3.5 font-mono text-[13px] font-medium uppercase tracking-wide text-[#0b0d1a] shadow-[0_12px_30px_-12px_rgba(0,0,0,0.5)]"
              >
                <span className="size-2.5 rounded-full border-2 border-[#8a8fa3] transition-colors duration-300 group-hover:bg-[#ffc800] group-hover:border-[#ffc800]" />
                Integrations
                <svg
                  viewBox="0 0 16 16"
                  className="cta-arrow size-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M8 3v10M3.5 8.5L8 13l4.5-4.5" />
                </svg>
              </MotionA>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

