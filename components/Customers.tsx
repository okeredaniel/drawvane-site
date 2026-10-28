"use client";

import { useRef, useState } from "react";
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
const HEADING = "Where project teams use it.";
const CASES = [
  {
    label: "Multifamily · Developer",
    title: "Takeoffs tied to their source sheets",
    text: "Quantities and scope checks that link back to the sheet they came from.",
    image: "/customers/case-1.avif",
  },
  {
    label: "Data center · MEP contractor",
    title: "Conflicts caught before submittals",
    text: "Spec and drawing conflicts surfaced before the first submittal.",
    image: "/customers/case-2.avif",
  },
  {
    label: "Healthcare · General contractor",
    title: "Issues found in preconstruction",
    text: "Conflicts surfaced early instead of turning into field RFIs.",
    image: "/customers/case-3.avif",
  },
];

const PEEK = 28;
const SCALE_ONE_BEHIND = 0.935;
const SCALE_TWO_BEHIND = 0.87;

const EASE = [0.22, 1, 0.36, 1] as const;

function CaseCard({
  label,
  title,
  text,
  image,
}: (typeof CASES)[number]) {
  const [missing, setMissing] = useState(false);
  return (
    <article
      className="case-card relative w-full overflow-hidden rounded-[22px] border border-neutral-200 bg-white shadow-[0_4px_20px_-8px_rgba(15,23,42,0.18)] will-change-transform md:w-[min(930px,100%,max(560px,calc((100vh-300px)*1.5)))] md:rounded-[28px]"
    >
      <div className="aspect-[1.5/1] w-full bg-neutral-100">
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
  );
}

export default function Customers() {
  const root = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // The stacking scroll animation is desktop only. On phones and small
      // tablets the cards are just a normal vertical list (see the classes
      // below), so nothing is pinned or hidden and nothing can break.
      mm.add("(min-width: 768px)", () => {
        const cards = gsap.utils.toArray<HTMLElement>(".case-card");
        const dims = gsap.utils.toArray<HTMLElement>(".case-dim");
        const late = gsap.utils.toArray<HTMLElement>(".case-late");
        if (cards.length < 3) return;
        const [c1, c2, c3] = cards;
        const [d1, d2] = dims;

        gsap.set(cards, { transformOrigin: "50% 0%" });
        gsap.set([c2, c3], { y: () => window.innerHeight });
        gsap.set(late, { visibility: "visible" });

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
          { y: () => window.innerHeight },
          { y: PEEK, duration: 1 },
          0
        )
          .to(c1, { scale: SCALE_ONE_BEHIND, duration: 1 }, 0)
          .to(d1, { opacity: 0.45, duration: 1 }, 0)
          .fromTo(
            c3,
            { y: () => window.innerHeight },
            { y: PEEK * 2, duration: 1 },
            1
          )
          .to(c2, { scale: SCALE_ONE_BEHIND, duration: 1 }, 1)
          .to(c1, { scale: SCALE_TWO_BEHIND, duration: 1 }, 1)
          .to(d1, { opacity: 0.75, duration: 1 }, 1)
          .to(d2, { opacity: 0.45, duration: 1 }, 1)
          .to({}, { duration: 0.35 });
      });
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
      <div
        ref={pin}
        className="relative mt-10 flex flex-col gap-6 md:mt-[80px] md:block md:pb-[56px]"
      >
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
    </section>
  );
}