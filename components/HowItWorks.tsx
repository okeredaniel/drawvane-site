"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// The three cards. Put the images in /public/how-it-works/ and make sure
// each `image` path matches your file (.jpg, .png or .webp). Until the file
// exists, a dark panel is shown instead.
const STEPS = [
  {
    title: "1. Upload the set",
    text: "Drawings and specs in one drop.",
    image: "/how-it-works/step-1.jpg",
  },
  {
    title: "2. Ask anything",
    text: "Plain language, cited answers.",
    image: "/how-it-works/step-2.jpg",
  },
  {
    title: "3. Share the answer",
    text: "Send it with the sheet attached.",
    image: "/how-it-works/step-3.jpg",
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
    <div className="aspect-[3/2] w-full overflow-hidden bg-gradient-to-b from-[#121823] to-[#0b0e14]">
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
        <span className="block text-white">How it works</span>
        <span className="block text-slate-400">Upload. Ask. Share.</span>
      </h2>

      <div
        ref={grid}
        className="mt-14 grid grid-cols-1 gap-[18px] md:grid-cols-3"
      >
        {STEPS.map((step, i) => (
          <article
            key={step.title}
            // the middle card sits on top so the side cards slide out from behind it
            className={`step-card relative overflow-hidden rounded-[32px] border border-[#1c232d] bg-[#0b0e14] shadow-[0_24px_60px_-24px_rgba(0,0,0,0.8)] ${
              i === 1 ? "z-10" : "z-0"
            }`}
          >
            <StepImage src={step.image} />
            <div className="px-7 pb-8 pt-7">
              <h3 className="text-2xl font-medium tracking-tight text-white">
                {step.title}
              </h3>
              <p className="mt-3 text-lg text-slate-400">{step.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
