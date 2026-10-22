"use client";

import { useRef, useState } from "react";
import { motion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// PLACEHOLDER CONTENT. These case studies and figures came from the template.
// Replace them with real customers and numbers you can back up.
// Put the images in /public/customers/ as case-1.jpg, case-2.jpg, case-3.jpg
// (change the extension here if yours differ).
const HEADING = "Proof from real project teams.";
const CASES = [
  {
    label: "Multifamily · Developer",
    title: "1,200 review hours back to the team",
    text: "Takeoffs and scope checks tied to the sheets they came from.",
    image: "/customers/case-1.jpg",
  },
  {
    label: "Data center · MEP contractor",
    title: "Two weeks saved in coordination",
    text: "Spec and drawing conflicts resolved before the first submittal.",
    image: "/customers/case-2.jpg",
  },
  {
    label: "Healthcare · General contractor",
    title: "38% fewer RFIs on a 214-sheet pavilion",
    text: "Conflicts surfaced in preconstruction instead of in the field.",
    image: "/customers/case-3.jpg",
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
      className="case-card relative overflow-hidden rounded-[28px] border border-[#242d38] bg-[#0b0f14] shadow-[0_0_40px_rgba(0,0,0,0.5)] will-change-transform"
      style={{
        width: "min(930px, 100%, max(560px, calc((100vh - 300px) * 1.5)))",
      }}
    >
      <div className="aspect-[1.5/1] w-full bg-[#0d1117]">
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
      <div className="border-t border-[#1c232d] px-6 py-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#5b7cff]">
          {label}
        </p>
        <h3 className="mt-3 text-2xl font-medium leading-tight tracking-[-0.03em] text-[#eef1f5]">
          {title}
        </h3>
        <p className="mt-2 text-base text-[#8b95a1]">{text}</p>
      </div>
      <div className="case-dim pointer-events-none absolute inset-0 bg-[#07090c] opacity-0" />
    </article>
  );
}

export default function Customers() {
  const root = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
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
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      id="customers"
      aria-label="Customers"
      className="overflow-x-clip border-t border-[#242d38] bg-background px-6 pb-[120px] pt-[120px] md:px-24 md:pb-[160px] md:pt-[130px]"
    >
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: EASE }}
        className="text-center text-[clamp(2.25rem,3.4vw,3rem)] font-medium leading-[1.05] tracking-[-0.04em] text-[#eef1f5]"
      >
        {HEADING}
      </motion.h2>

      <div
        ref={pin}
        className="relative mt-14 md:mt-[80px]"
        style={{ paddingBottom: PEEK * 2 }}
      >
        {CASES.map((c, i) => (
          <motion.div
            key={c.title}
            className={
              i === 0
                ? "relative z-10 flex justify-center"
                : `case-late invisible absolute inset-x-0 top-0 flex justify-center ${
                    i === 1 ? "z-20" : "z-30"
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
