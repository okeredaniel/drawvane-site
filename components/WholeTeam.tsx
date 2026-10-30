"use client";
import { useSiteMotion } from "./SiteMotion";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type TeamCard = {
  title: string;
  text: string;
  image?: string;
  chips: { label: string; className: string; depth: number }[];
};

// Put the images in /public/whole-team/. Until a file exists, a light panel
// is shown instead. `chips` are small labels that float above the image in 3D.
const CARDS: TeamCard[] = [
  {
    title: "Ask in plain language",
    text: "Explore answers with source references.",
    image: "/illustrations/drawing.svg",
    chips: [
      { label: "Slab thickness at Level 2?", className: "left-5 top-5", depth: 70 },
      { label: "200 mm · S-301, Note 4", className: "bottom-5 right-5", depth: 110 },
    ],
  },
  {
    title: "Check the source",
    text: "Drawings, specs and RFIs in one drop.",
    image: "/illustrations/drawing.svg",
    chips: [
      { label: "A-102 · Rev C", className: "left-5 top-5", depth: 70 },
      { label: "Spec 03 30 00", className: "right-5 top-1/2", depth: 100 },
      { label: "RFI 047", className: "bottom-5 right-5", depth: 130 },
    ],
  },
];

function CardImage({ src }: { src?: string }) {
  const img = useRef<HTMLImageElement>(null);
  const [missing, setMissing] = useState(false);

  // catch a failed load that happened before React attached
  useEffect(() => {
    const el = img.current;
    if (el && el.complete && el.naturalWidth === 0) setMissing(true);
  }, []);

  const showImage = !!src && !missing;

  return (
    <div className="aspect-[3/2] w-full overflow-hidden rounded-t-[32px] bg-gradient-to-b from-neutral-100 to-neutral-200 md:aspect-[4/3]">
      {showImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={img}
          src={src}
          alt=""
          onError={() => setMissing(true)}
          className="size-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
          draggable={false}
        />
      )}
    </div>
  );
}

function Chip({
  children,
  depth,
  className,
}: {
  children: ReactNode;
  depth: number;
  className: string;
}) {
  // Each chip sits at its own depth and shifts against the pointer,
  // so the layers separate as the card tilts.
  const style: CSSProperties = {
    transform: `translate3d(calc(var(--px, 0) * ${-depth * 0.35}px), calc(var(--py, 0) * ${
      -depth * 0.25
    }px), ${depth}px)`,
  };
  return (
    <span
      style={style}
      className={`pointer-events-none absolute rounded-full border border-neutral-200 bg-white/90 px-3.5 py-1.5 text-sm font-medium text-neutral-700 shadow-[0_10px_24px_-10px_rgba(15,23,42,0.35)] backdrop-blur ${className}`}
    >
      {children}
    </span>
  );
}

// Pointer-driven 3D tilt. Rotates the whole card, moves a light glare across
// it and feeds --px / --py to the floating chips. Skipped on touch devices
// and for people who prefer reduced motion.
function Tilt({ children }: { children: ReactNode }) {
  const { paused } = useSiteMotion();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (paused) return;
    const el = ref.current;
    if (!el) return;
    const ok = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)"
    );
    if (!ok.matches) return;

    gsap.set(el, { transformPerspective: 1100 });
    const rx = gsap.quickTo(el, "rotationX", { duration: 0.6, ease: "power3.out" });
    const ry = gsap.quickTo(el, "rotationY", { duration: 0.6, ease: "power3.out" });

    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      ry((px - 0.5) * 14);
      rx((0.5 - py) * 10);
      el.style.setProperty("--mx", `${px * 100}%`);
      el.style.setProperty("--my", `${py * 100}%`);
      el.style.setProperty("--px", String(px - 0.5));
      el.style.setProperty("--py", String(py - 0.5));
    };
    const enter = () => el.style.setProperty("--glare", "1");
    const leave = () => {
      rx(0);
      ry(0);
      el.style.setProperty("--glare", "0");
      el.style.setProperty("--px", "0");
      el.style.setProperty("--py", "0");
    };

    el.addEventListener("pointermove", move);
    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointerleave", leave);
    return () => {
      rx.tween.kill(); ry.tween.kill(); gsap.set(el, { rotationX: 0, rotationY: 0 });
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointerleave", leave);
    };
  }, [paused]);

  return (
    <div
      ref={ref}
      className="group relative rounded-[32px] border border-neutral-200 bg-white shadow-[0_4px_20px_-8px_rgba(15,23,42,0.15)] transition-shadow duration-500 [transform-style:preserve-3d] hover:shadow-[0_40px_80px_-30px_rgba(15,23,42,0.35)]"
    >
      {children}
      {/* moving light */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[32px] opacity-[var(--glare,0)] transition-opacity duration-500"
        style={{
          background:
            "radial-gradient(520px circle at var(--mx,50%) var(--my,0%), rgba(255,255,255,0.55), transparent 45%)",
        }}
      />
    </div>
  );
}

export default function WholeTeam() {
  const { paused } = useSiteMotion();
  const root = useRef<HTMLElement>(null);
  const grid = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (paused) return;
      const cards = gsap.utils.toArray<HTMLElement>(".team-card", grid.current);
      const mm = gsap.matchMedia();

      mm.add(
        {
          desktop: "(min-width: 768px)",
          mobile: "(max-width: 767px)",
          motion: "(prefers-reduced-motion: no-preference)",
        },
        (ctx) => {
          const { desktop, motion } = ctx.conditions as {
            desktop: boolean;
            motion: boolean;
          };
          if (!motion) return;

          if (desktop) {
            // The two cards start swung away on opposite hinges, like panels
            // opening toward you, and settle flat as the row scrolls in.
            const [left, right] = cards;
            const tl = gsap.timeline({
              defaults: { ease: "none" },
              scrollTrigger: {
                trigger: grid.current,
                start: "top 92%",
                end: "top 32%",
                scrub: 0.7,
              },
            });
            tl.from(
              left,
              {
                x: "-14vw",
                z: -240,
                rotationY: 42,
                opacity: 0,
                transformOrigin: "100% 50%",
                transformPerspective: 1300,
              },
              0
            ).from(
              right,
              {
                x: "14vw",
                z: -240,
                rotationY: -42,
                opacity: 0,
                transformOrigin: "0% 50%",
                transformPerspective: 1300,
              },
              0
            );
          } else {
            // Stacked: each card tips up from the floor as you reach it.
            cards.forEach((card) => {
              gsap.from(card, {
                rotationX: 28,
                y: 60,
                z: -120,
                opacity: 0,
                transformOrigin: "50% 100%",
                transformPerspective: 900,
                ease: "none",
                scrollTrigger: {
                  trigger: card,
                  start: "top 95%",
                  end: "top 60%",
                  scrub: 0.6,
                },
              });
            });
          }
        }
      );
    },
    { scope: root, dependencies: [paused], revertOnUpdate: true }
  );

  return (
    <section
      id="team"
      ref={root}
      className="relative overflow-x-clip bg-background px-6 pb-28 pt-8 lg:px-24 lg:pb-40 lg:pt-16"
    >
      {/* blueprint floor: a faint grid receding into the distance */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute inset-x-[-20%] bottom-[-8%] h-[62%] bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:linear-gradient(to_top,black_10%,transparent_90%)] [transform-origin:50%_100%] [transform:perspective(800px)_rotateX(62deg)]" />
      </div>

      <h2 className="relative text-center font-display text-[40px] font-medium leading-[0.98] tracking-[-0.05em] md:text-[56px]">
        <span className="block text-neutral-900">Built for the whole team</span>
        <span className="block text-neutral-400">Answers everyone can check</span>
      </h2>

      <div
        ref={grid}
        className="relative mt-16 grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-6 lg:gap-8"
      >
        {CARDS.map((card, i) => (
          <article
            key={card.title}
            className={`team-card relative [transform-style:preserve-3d] ${
              i === 0 ? "md:col-span-7" : "md:col-span-5 md:mt-24"
            }`}
          >
            {/* grounding shadow on the floor under the card */}
            <div
              aria-hidden
              className="absolute inset-x-10 -bottom-5 h-10 rounded-full bg-neutral-900/20 blur-2xl"
            />

            <Tilt>
              <CardImage src={card.image} />

              {card.chips.map((chip) => (
                <Chip key={chip.label} depth={chip.depth} className={chip.className}>
                  {chip.label}
                </Chip>
              ))}

              <div
                className="px-7 pb-8 pt-7"
                style={{
                  transform:
                    "translate3d(calc(var(--px, 0) * -8px), calc(var(--py, 0) * -6px), 36px)",
                }}
              >
                <h3 className="text-2xl font-medium tracking-tight text-neutral-900 md:text-[28px]">
                  {card.title}
                </h3>
                <p className="mt-3 text-lg text-neutral-500">{card.text}</p>
              </div>
            </Tilt>
          </article>
        ))}
      </div>
    </section>
  );
}
