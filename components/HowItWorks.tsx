"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// The three cards. Put the images in /public/how-it-works/ and make sure
// each `image` path matches your file (.jpg, .png or .webp). Until the file
// exists, a light panel is shown instead.
const STEPS = [
  {
    title: "1. Upload the set",
    text: "Drawings and specs in one drop.",
    image: "/how-it-works/step-1.avif",
  },
  {
    title: "2. Ask anything",
    text: "Plain language, cited answers.",
    image: "/how-it-works/step-2.avif",
  },
  {
    title: "3. Share the answer",
    text: "Send it with the sheet attached.",
    image: "/how-it-works/step-3.avif",
  },
];

// The strip under the cards. Only keep the last step as written if your
// product really has a human approval step.
const CHAIN = [
  {
    label: "Open",
    title: "Open the sheet",
    text: "Start from the drawing or spec your team is looking at.",
  },
  {
    label: "Find",
    title: "Find the evidence",
    text: "Related clauses, sheets and RFIs, each linked to its page.",
  },
  {
    label: "Review",
    title: "Review the scope",
    text: "See what a change touches before anyone prices it.",
  },
  {
    label: "Decide",
    title: "Make the decision",
    text: "A person approves the outcome and shares it with the sheet attached.",
  },
];

function StepImage({ src }: { src: string }) {
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
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={img}
          src={src}
          alt=""
          onError={() => setMissing(true)}
          className="size-full object-cover"
          draggable={false}
        />
      )}
    </div>
  );
}

export default function HowItWorks() {
  const root = useRef<HTMLElement>(null);
  const grid = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>(".step-card", grid.current);
      const [left, middle, right] = cards;
      const mm = gsap.matchMedia();

      // Desktop: the side cards start hidden behind the middle one and
      // slide out to the left and right. Plays once, when it scrolls into view.
      mm.add("(min-width: 768px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: grid.current,
            start: "top 70%",
            once: true,
            invalidateOnRefresh: true,
          },
        });

        tl.from(middle, { y: 40, opacity: 0, duration: 0.8, ease: "power3.out" })
          .from(
            left,
            {
              x: () => middle.offsetLeft - left.offsetLeft,
              scale: 0.94,
              opacity: 0,
              duration: 1.2,
              ease: "power3.out",
            },
            0.35
          )
          .from(
            right,
            {
              x: () => middle.offsetLeft - right.offsetLeft,
              scale: 0.94,
              opacity: 0,
              duration: 1.2,
              ease: "power3.out",
            },
            0.35
          );
      });

      // Phones: no room to spread, so each card just fades up
      mm.add("(max-width: 767px)", () => {
        cards.forEach((card) => {
          gsap.from(card, {
            y: 40,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 88%", once: true },
          });
        });
      });

      // The strip fades up once as it scrolls into view
      gsap.from(".chain-strip", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: ".chain-strip", start: "top 88%", once: true },
      });
    },
    { scope: root }
  );

  return (
    <section
      id="how-it-works"
      ref={root}
      className="overflow-x-clip bg-background px-6 py-24 lg:px-24 lg:py-32"
    >
      <h2 className="text-center font-display text-[40px] font-medium leading-[0.98] tracking-[-0.05em] md:text-[56px]">
        <span className="block text-neutral-900">How it works</span>
        <span className="block text-neutral-400">Upload. Ask. Share.</span>
      </h2>

      <div
        ref={grid}
        className="mt-14 grid grid-cols-1 gap-[18px] md:grid-cols-3"
      >
        {STEPS.map((step, i) => (
          <article
            key={step.title}
            // the middle card sits on top so the side cards slide out from behind it
            className={`step-card relative overflow-hidden rounded-[32px] border border-neutral-200 bg-white shadow-[0_4px_20px_-8px_rgba(15,23,42,0.15)] ${
              i === 1 ? "z-10" : "z-0"
            }`}
          >
            <StepImage src={step.image} />
            <div className="px-7 pb-8 pt-7">
              <h3 className="text-2xl font-medium tracking-tight text-neutral-900">
                {step.title}
              </h3>
              <p className="mt-3 text-lg text-neutral-500">{step.text}</p>
            </div>
          </article>
        ))}
      </div>

      {/* From question to decision */}
      <div className="chain-strip mx-auto mt-24 max-w-[1200px] lg:mt-32">
        <div className="text-center">
          <h3 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] font-medium leading-[1.05] tracking-[-0.04em] text-neutral-900">
            From question to decision
          </h3>
          <p className="mt-3 text-lg text-neutral-500">
            Every answer stays tied to the sheet it came from.
          </p>
        </div>

        <ol className="mt-10 grid overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 md:grid-cols-4">
          {CHAIN.map((item, i) => (
            <li
              key={item.label}
              className="relative border-b border-neutral-200 p-6 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0"
            >
              <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-neutral-600">
                <span className="size-1.5 rounded-full bg-accent" />
                {item.label}
              </p>
              <p className="mt-4 text-[20px] font-medium leading-tight tracking-[-0.02em] text-neutral-900">
                {item.title}
              </p>
              <p className="mt-2 text-[15px] leading-relaxed text-neutral-500">
                {item.text}
              </p>
              {i < CHAIN.length - 1 && (
                <span
                  aria-hidden
                  className="absolute -right-3 top-1/2 z-10 hidden size-6 -translate-y-1/2 place-items-center rounded-full border border-neutral-200 bg-white text-[12px] text-neutral-500 md:grid"
                >
                  →
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}