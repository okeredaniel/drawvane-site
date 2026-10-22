"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// The two cards. Put the images in /public/whole-team/ and make sure each
// `image` path matches your file (.jpg, .png or .webp). Until the file
// exists, a dark panel is shown instead.
const CARDS = [
  {
    title: "Ask in plain language",
    text: "Cited answers in seconds.",
    image: "/whole-team/card-1.jpg",
  },
  {
    title: "Check the source",
    text: "Drawings, specs and RFIs in one drop.",
    image: "/whole-team/card-2.jpg",
  },
];

function CardImage({ src }: { src: string }) {
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

export default function WholeTeam() {
  const root = useRef<HTMLElement>(null);
  const grid = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>(".team-card", grid.current);
      const mm = gsap.matchMedia();

      // Desktop: the left card slides in from the left while the right card
      // slides in from the right. Plays once, when the row scrolls into view.
      mm.add("(min-width: 768px)", () => {
        const [left, right] = cards;
        const tl = gsap.timeline({
          defaults: { duration: 1.1, ease: "power3.out" },
          scrollTrigger: { trigger: grid.current, start: "top 78%", once: true },
        });
        tl.from(left, { x: "-25vw", opacity: 0 }, 0).from(
          right,
          { x: "25vw", opacity: 0 },
          0
        );
      });

      // Phones: the cards are stacked, so they alternate: first from the
      // left, second from the right, each as you reach it
      mm.add("(max-width: 767px)", () => {
        cards.forEach((card, i) => {
          gsap.from(card, {
            x: i % 2 === 0 ? "-30vw" : "30vw",
            opacity: 0,
            duration: 0.9,
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
      id="team"
      ref={root}
      className="overflow-x-clip bg-background px-6 pb-24 pt-8 lg:px-24 lg:pb-32 lg:pt-16"
    >
      <h2 className="text-center font-display text-[40px] font-medium leading-[0.98] tracking-[-0.05em] md:text-[56px]">
        <span className="block text-white">Built for the whole team</span>
        <span className="block text-slate-400">Answers everyone can check</span>
      </h2>

      <div
        ref={grid}
        className="mt-14 grid grid-cols-1 gap-[18px] md:grid-cols-2"
      >
        {CARDS.map((card) => (
          <article
            key={card.title}
            className="team-card overflow-hidden rounded-[32px] border border-[#1c232d] bg-[#0b0e14] shadow-[0_24px_60px_-24px_rgba(0,0,0,0.8)]"
          >
            <CardImage src={card.image} />
            <div className="px-7 pb-8 pt-7">
              <h3 className="text-2xl font-medium tracking-tight text-white">
                {card.title}
              </h3>
              <p className="mt-3 text-lg text-slate-400">{card.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}