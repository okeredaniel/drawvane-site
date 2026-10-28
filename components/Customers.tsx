"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// These cards describe use cases only, with no statistics, because there are
// no real customer results to publish yet. When you have real, approved
// results, add them to `title`/`text` and change the heading to something like
// "Proof from real project teams."
// Put the images in /public/customers/ as case-1.avif, case-2.avif, case-3.avif
// (change the extension here if yours differ).
// `chip` is the small label that floats above each image. The references in
// it are made up: replace them with your own or delete the chip.
const HEADING = "Where project teams use it.";
const CASES = [
  {
    label: "Multifamily · Developer",
    title: "Takeoffs tied to their source sheets",
    text: "Quantities and scope checks that link back to the sheet they came from.",
    image: "/customers/case-1.avif",
    chip: "Linked to sheet A-201",
  },
  {
    label: "Data center · MEP contractor",
    title: "Conflicts caught before submittals",
    text: "Spec and drawing conflicts surfaced before the first submittal.",
    image: "/customers/case-2.avif",
    chip: "Spec 23 05 00 vs M-401",
  },
  {
    label: "Healthcare · General contractor",
    title: "Issues found in preconstruction",
    text: "Conflicts surfaced early instead of turning into field RFIs.",
    image: "/customers/case-3.avif",
    chip: "Found before the field",
  },
];

// Short names for the progress rail, taken from the first part of each label.
const SECTORS = CASES.map((c) => c.label.split("·")[0].trim());

const PEEK = 28;
const SCALE_ONE_BEHIND = 0.935;
const SCALE_TWO_BEHIND = 0.87;

const EASE = [0.22, 1, 0.36, 1] as const;

function CaseCard({
  label,
  title,
  text,
  image,
  chip,
}: (typeof CASES)[number]) {
  const [missing, setMissing] = useState(false);
  const tilt = useRef<HTMLDivElement>(null);

  // Hover (mouse only): the card tilts toward the pointer, a light moves
  // across it, and the floating chip slides against the image.
  useEffect(() => {
    const el = tilt.current;
    if (!el) return;
    const ok = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)"
    );
    if (!ok.matches) return;

    gsap.set(el, { transformPerspective: 1300 });
    const rx = gsap.quickTo(el, "rotationX", { duration: 0.6, ease: "power3.out" });
    const ry = gsap.quickTo(el, "rotationY", { duration: 0.6, ease: "power3.out" });

    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      ry((px - 0.5) * 8);
      rx((0.5 - py) * 6);
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
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    // .case-card is moved by the scroll timeline; the tilt lives one level in
    // so the two never fight over the same transform.
    <div className="case-card relative w-full will-change-transform md:w-[min(930px,100%,max(560px,calc((100vh-350px)*1.5)))]">
      <div ref={tilt} className="relative [transform-style:preserve-3d]">
        <article className="relative overflow-hidden rounded-[22px] border border-neutral-200 bg-white shadow-[0_24px_60px_-28px_rgba(15,23,42,0.35)] md:rounded-[28px]">
          <div className="aspect-[1.5/1] w-full bg-gradient-to-b from-neutral-100 to-neutral-200">
            {!missing && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image}
                alt={title}
                className="h-full w-full object-cover"
                draggable={false}
                onError={() => setMissing(true)}
              />
            )}
          </div>
          <div className="border-t border-neutral-200 px-5 py-5 md:px-6 md:py-6">
            <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-neutral-600">
              <span className="size-1.5 rounded-full bg-accent" />
              {label}
            </p>
            <h3 className="mt-3 text-xl font-medium leading-tight tracking-[-0.03em] text-neutral-900 md:text-2xl">
              {title}
            </h3>
            <p className="mt-2 text-base text-neutral-500">{text}</p>
          </div>
          <div className="case-dim pointer-events-none absolute inset-0 bg-white opacity-0" />
        </article>

        {/* floats above the image */}
        <span
          aria-hidden
          className="pointer-events-none absolute right-4 top-4 flex items-center gap-2 rounded-full border border-neutral-200 bg-white/90 px-3 py-1.5 text-[13px] font-medium text-neutral-700 shadow-[0_10px_24px_-10px_rgba(15,23,42,0.35)] backdrop-blur md:right-6 md:top-6 md:px-3.5 md:text-sm md:[transform:translate3d(calc(var(--px,0)*-16px),calc(var(--py,0)*-10px),70px)]"
        >
          <span className="size-2 rounded-full bg-accent" />
          {chip}
        </span>

        {/* moving light */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[22px] opacity-[var(--glare,0)] transition-opacity duration-500 md:rounded-[28px]"
          style={{
            background:
              "radial-gradient(560px circle at var(--mx,50%) var(--my,0%), rgba(255,255,255,0.4), transparent 45%)",
          }}
        />
      </div>
    </div>
  );
}

export default function Customers() {
  const root = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          desktop: "(min-width: 768px)",
          motion: "(prefers-reduced-motion: no-preference)",
        },
        (ctx) => {
          const { desktop, motion: ok } = ctx.conditions as {
            desktop: boolean;
            motion: boolean;
          };
          const cards = gsap.utils.toArray<HTMLElement>(".case-card");

          // Phones and small tablets: a normal vertical list. Each card tips
          // up from the floor as you reach it.
          if (!desktop) {
            if (!ok) return;
            cards.forEach((card) => {
              gsap.from(card, {
                rotationX: 24,
                y: 50,
                opacity: 0,
                transformOrigin: "50% 100%",
                transformPerspective: 900,
                ease: "none",
                scrollTrigger: {
                  trigger: card,
                  start: "top 95%",
                  end: "top 62%",
                  scrub: 0.6,
                },
              });
            });
            return;
          }

          // Desktop: the section pins and the cards stack. Each new card
          // swings up from below while the ones behind lean back. With
          // reduced motion the stacking stays, only the lean is removed.
          const m = ok ? 1 : 0;
          const dims = gsap.utils.toArray<HTMLElement>(".case-dim");
          const late = gsap.utils.toArray<HTMLElement>(".case-late");
          const fills = gsap.utils.toArray<HTMLElement>(".prog-fill");
          const labels = gsap.utils.toArray<HTMLElement>(".prog-label");
          if (cards.length < 3) return;
          const [c1, c2, c3] = cards;
          const [d1, d2] = dims;
          const [, f2, f3] = fills;
          const [l1, l2, l3] = labels;

          gsap.set(cards, { transformOrigin: "50% 0%", transformPerspective: 1600 });
          gsap.set([c2, c3], { y: () => window.innerHeight });
          gsap.set(late, { visibility: "visible" });
          gsap.set(fills[0], { scaleX: 1 });
          gsap.set([f2, f3], { scaleX: 0 });
          gsap.set(labels, { color: "#a3a3a3" });
          gsap.set(l1, { color: "#171717" });

          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: pin.current,
              start: "top 96px",
              end: () => "+=" + Math.round(window.innerHeight * 2.2),
              pin: true,
              scrub: 0.6,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          tl.fromTo(
            c2,
            { y: () => window.innerHeight, rotationX: 18 * m },
            { y: PEEK, rotationX: 0, duration: 1 },
            0
          )
            .to(c1, { scale: SCALE_ONE_BEHIND, rotationX: 3 * m, duration: 1 }, 0)
            .to(d1, { opacity: 0.45, duration: 1 }, 0)
            .to(f2, { scaleX: 1, duration: 1 }, 0)
            .to(l1, { color: "#a3a3a3", duration: 0.4 }, 0.6)
            .to(l2, { color: "#171717", duration: 0.4 }, 0.6)
            .fromTo(
              c3,
              { y: () => window.innerHeight, rotationX: 18 * m },
              { y: PEEK * 2, rotationX: 0, duration: 1 },
              1
            )
            .to(c2, { scale: SCALE_ONE_BEHIND, rotationX: 3 * m, duration: 1 }, 1)
            .to(c1, { scale: SCALE_TWO_BEHIND, rotationX: 6 * m, duration: 1 }, 1)
            .to(d1, { opacity: 0.75, duration: 1 }, 1)
            .to(d2, { opacity: 0.45, duration: 1 }, 1)
            .to(f3, { scaleX: 1, duration: 1 }, 1)
            .to(l2, { color: "#a3a3a3", duration: 0.4 }, 1.6)
            .to(l3, { color: "#171717", duration: 0.4 }, 1.6)
            .to({}, { duration: 0.35 });
        }
      );
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      id="customers"
      aria-label="Customers"
      className="overflow-x-clip border-t border-neutral-200 bg-background px-5 pb-[80px] pt-[80px] md:px-24 md:pb-[160px] md:pt-[130px]"
    >
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: EASE }}
        className="text-center text-[clamp(2rem,3.4vw,3rem)] font-medium leading-[1.05] tracking-[-0.04em] text-neutral-900"
      >
        {HEADING}
      </motion.h2>

      {/* Phones: a normal list with gaps. Desktop: the cards stack on top of
          each other and the section is pinned while you scroll. */}
      <div ref={pin} className="relative mt-10 md:mt-[64px]">
        {/* progress rail: shows which of the three you are on (desktop only) */}
        <div
          aria-hidden
          className="mx-auto mb-8 hidden w-[min(930px,100%,max(560px,calc((100vh-350px)*1.5)))] grid-cols-3 gap-4 md:grid"
        >
          {SECTORS.map((name) => (
            <div key={name}>
              <div className="h-1 overflow-hidden rounded-full bg-neutral-200">
                <div className="prog-fill h-full origin-left rounded-full bg-accent" />
              </div>
              <p className="prog-label mt-2.5 text-[14px] font-medium text-neutral-400">
                {name}
              </p>
            </div>
          ))}
        </div>

        <div className="relative flex flex-col gap-6 md:block md:pb-[56px]">
          {CASES.map((c, i) => (
            <motion.div
              key={c.title}
              className={
                i === 0
                  ? "relative z-10 flex justify-center"
                  : `case-late relative flex justify-center md:invisible md:absolute md:inset-x-0 md:top-0 ${
                      i === 1 ? "md:z-20" : "md:z-30"
                    }`
              }
              {...(i === 0
                ? {
                    initial: { opacity: 0, y: 40 },
                    whileInView: { opacity: 1, y: 0 },
                    viewport: { once: true, margin: "-80px" },
                    transition: { duration: 0.9, ease: EASE },
                  }
                : {})}
            >
              <CaseCard {...c} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}