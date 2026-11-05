"use client";

/**
 * Solution: GSAP version.
 * Needs:  npm i gsap @gsap/react
 * (ScrollTrigger and SplitText ship inside the gsap package.)
 */

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

/* ------------------------------------------------------------------ */
/* Content                                                              */
/* ------------------------------------------------------------------ */

type Pillar = {
  title: string;
  text: string;
  bullets: string[];
  /**
   * IMAGE SLOT: when you have the picture, drop it in /public and set the
   * path here, e.g. image: "/solution-plan.png". Until then a yellow
   * placeholder box is shown.
   */
  image?: string;
  imageName: string;
};

const PILLARS: Pillar[] = [
  {
    title: "Review",
    text: "Bring documents together and explore the details your project team needs to understand.",
    bullets: ["Project document answers", "Clear drawing review & markups", "Questions connected to context"],
    image: "/construction/solution-plan.webp",
    imageName: "construction/solution-plan.webp",
  },
  {
    title: "Connect",
    text: "Bring people and project discussions together so your team works from shared context.",
    bullets: ["Shared project discussions", "Project information in context", "Project access & permissions"],
    image: "/construction/solution-align.webp",
    imageName: "construction/solution-align.webp",
  },
  {
    title: "Measure",
    text: "Measure lengths, areas and counts, then review the quantities behind your project work.",
    bullets: ["Drawing measurement tools", "Length, area and count takeoff", "Results for professional review"],
    image: "/construction/solution-execute.webp",
    imageName: "construction/solution-execute.webp",
  },
];

const ACCENT = "#ffc800";
const TRACK = "#c9cfe0";
const PAGE = "#f5f4ef";

/* ------------------------------------------------------------------ */
/* Image slot                                                           */
/* ------------------------------------------------------------------ */

function ImageSlot({ src, name, alt }: { src?: string; name: string; alt: string }) {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        width={900}
        height={720}
        className="media h-full w-full object-cover will-change-transform"
      />
    );
  }

  // Placeholder until the real image is added
  return (
    <div
      data-image-slot={name}
      className="media relative flex h-full w-full items-end bg-[linear-gradient(135deg,#ffc800_0%,#ffdc57_55%,#e0ad00_100%)] p-4 will-change-transform"
    >
      <span className="rounded-md bg-white/15 px-2 py-1 font-mono text-[11px] uppercase tracking-wide text-[#0b0b12]/80 backdrop-blur">
        Image: {name}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Section                                                              */
/* ------------------------------------------------------------------ */

const STOPS = [16.667, 50, 83.333];

export default function Solution() {
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
          // reduced motion: leave everything in its final state
          if (!full && !lite) return;

          const cleanups: Array<() => void> = [];

          /* ---------- Heading ---------- */
          gsap.from(q(".eyebrow"), {
            opacity: 0,
            y: 14,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: { trigger: ".eyebrow", start: "top 90%" },
          });

          const split = new SplitText(q(".headline")[0], { type: "words", mask: "words" });
          gsap.from(split.words, {
            yPercent: 115,
            duration: 0.95,
            ease: "power4.out",
            stagger: 0.07,
            scrollTrigger: { trigger: ".headline", start: "top 88%" },
          });

          /* ---------- Cards (entrance) ---------- */
          const cards = q(".card") as HTMLElement[];

          cards.forEach((card, i) => {
            const slot = card.querySelector(".slot") as HTMLElement;
            const rings = card.querySelectorAll(".ring");
            const texts = card.querySelectorAll(".btxt");

            const tl = gsap.timeline({
              defaults: { ease: "power3.out" },
              scrollTrigger: { trigger: card, start: "top 86%" },
            });

            tl.from(
              card,
              {
                y: 64,
                opacity: 0,
                rotate: full ? (i - 1) * 2.5 : 0,
                transformOrigin: "50% 100%",
                duration: 1,
              },
              0
            )
              .fromTo(
                slot,
                { clipPath: "inset(100% 0% 0% 0% round 16px)" },
                {
                  clipPath: "inset(0% 0% 0% 0% round 16px)",
                  duration: 1.1,
                  ease: "power3.inOut",
                  clearProps: "clipPath",
                },
                0.25
              )
              .from(rings, { scale: 0, duration: 0.45, stagger: 0.1, ease: "back.out(2.4)" }, 0.45)
              .from(texts, { x: -14, opacity: 0, duration: 0.55, stagger: 0.1 }, 0.5);
          });

          /* ---------- Desktop-only motion ---------- */
          if (full) {
            // Image parallax: picture settles and drifts inside its window
            cards.forEach((card) => {
              const media = card.querySelector(".media");
              const slot = card.querySelector(".slot");
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

            // Plan -> Align -> Execute line, dots and dimming
            const fill = q(".track-fill");
            const dots = q(".track-dot");
            const labels = q(".track-label");
            const inners = q(".card-inner");

            gsap.set(fill, { scaleX: 0, transformOrigin: "left center" });

            const applyState = (dimIdx: number, dotIdx: number) => {
              inners.forEach((el, i) => {
                const dim = dimIdx >= 0 && i !== dimIdx;
                gsap.to(el, { opacity: dim ? 0.5 : 1, scale: dim ? 0.98 : 1, duration: 0.5, ease: "power2.out", overwrite: "auto" });
              });
              dots.forEach((el, i) => {
                const on = i <= dotIdx;
                gsap.to(el, {
                  backgroundColor: on ? ACCENT : PAGE,
                  borderColor: on ? ACCENT : TRACK,
                  scale: on ? 1.25 : 1,
                  duration: 0.4,
                  ease: "back.out(2)",
                  overwrite: "auto",
                });
              });
              labels.forEach((el, i) => {
                gsap.to(el, { color: i <= dotIdx ? "#0b0d1a" : "#8a8fa3", duration: 0.4, overwrite: "auto" });
              });
            };

            ScrollTrigger.create({
              trigger: q(".cards-grid")[0],
              start: "top 70%",
              end: "bottom 35%",
              onUpdate: (self) => {
                gsap.to(fill, { scaleX: self.progress, duration: 0.25, ease: "none", overwrite: "auto" });
                const idx = Math.min(2, Math.floor(self.progress * 3));
                applyState(idx, idx);
              },
              onLeave: () => {
                gsap.to(fill, { scaleX: 1, duration: 0.3, overwrite: "auto" });
                applyState(-1, 2);
              },
              onLeaveBack: () => {
                gsap.to(fill, { scaleX: 0, duration: 0.3, overwrite: "auto" });
                applyState(-1, -1);
              },
            });

            // Hover: card lift + image tilt toward the cursor
            if (canHover) {
              cards.forEach((card) => {
                const slot = card.querySelector(".slot") as HTMLElement;

                const lift = () => gsap.to(card, { y: -6, duration: 0.4, ease: "power3.out", overwrite: "auto" });
                const drop = () => gsap.to(card, { y: 0, duration: 0.5, ease: "power3.out", overwrite: "auto" });
                card.addEventListener("mouseenter", lift);
                card.addEventListener("mouseleave", drop);

                gsap.set(slot, { transformPerspective: 900 });
                const rx = gsap.quickTo(slot, "rotationX", { duration: 0.6, ease: "power3.out" });
                const ry = gsap.quickTo(slot, "rotationY", { duration: 0.6, ease: "power3.out" });

                const move = (e: MouseEvent) => {
                  const r = slot.getBoundingClientRect();
                  const px = (e.clientX - r.left) / r.width - 0.5;
                  const py = (e.clientY - r.top) / r.height - 0.5;
                  ry(px * 6);
                  rx(-py * 6);
                };
                const reset = () => {
                  rx(0);
                  ry(0);
                };
                slot.addEventListener("mousemove", move);
                slot.addEventListener("mouseleave", reset);

                cleanups.push(() => {
                  card.removeEventListener("mouseenter", lift);
                  card.removeEventListener("mouseleave", drop);
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
      id="solution"
      style={{ colorScheme: "light" }}
      className="scroll-mt-20 overflow-x-clip bg-[#f5f4ef] px-3 py-16 text-[#0b0d1a] md:px-5 md:py-24"
    >
      <div className="mx-auto max-w-[1280px]">
        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="eyebrow mb-6 inline-flex items-center gap-2 font-mono text-[13px] font-semibold uppercase tracking-wide text-[#755b00]">
            <span className="relative flex size-3 items-center justify-center">
              <span className="absolute inline-flex size-full animate-ping rounded-full border border-[#ffc800] opacity-50" />
              <span className="relative inline-flex size-3 rounded-full border-2 border-[#ffc800]" />
            </span>
            Our Solution
          </div>

          <h2 className="headline text-4xl font-semibold leading-[1.08] tracking-[-0.03em] md:text-6xl">
            <span className="block">Read It. Connect The Team.</span>
            <span className="block">Measure The Detail.</span>
          </h2>
        </div>

        {/* Cards */}
        <div className="cards-grid mt-16 grid gap-3 md:mt-12 md:grid-cols-3">
          {PILLARS.map((p) => (
            <article
              key={p.title}
              className="card overflow-hidden rounded-2xl bg-[#ecebe5] transition-shadow duration-300 hover:shadow-[0_24px_50px_-20px_rgba(96,74,0,0.35)]"
            >
              <div className="card-inner flex h-full flex-col">
                <div className="p-5 pb-6 md:p-4 md:pb-6">
                  <h3 className="text-[26px] font-medium leading-tight">{p.title}</h3>
                  <p className="mt-2 max-w-[38ch] text-[15px] leading-snug text-[#555a6e]">{p.text}</p>

                  <ul className="mt-6 space-y-3.5">
                    {p.bullets.map((b) => (
                      <li key={b} className="group/li flex items-center gap-3 text-[15px] font-medium text-[#0b0d1a]">
                        <span className="ring size-2.5 shrink-0 rounded-full border-2 border-[#3a3f52] transition-colors duration-300 group-hover/li:border-[#ffc800] group-hover/li:bg-[#ffc800]" />
                        <span className="btxt">{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Image area */}
                <div className="slot mt-auto aspect-[5/4] w-full overflow-hidden rounded-2xl will-change-transform">
                  <ImageSlot src={p.image} name={p.imageName} alt={`${p.title} preview`} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
