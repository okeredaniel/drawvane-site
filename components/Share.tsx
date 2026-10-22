"use client";

import { useRef, useState } from "react";
import { motion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Put the image in /public/share/ as share.jpg.
// If yours is .png or .webp, change the extension here.
const IMAGE = { src: "/share/share.jpg", alt: "A glowing glass slab on a dark surface" };

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Share() {
  const root = useRef<HTMLElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLDivElement>(null);
  const [missing, setMissing] = useState(false);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        { desktop: "(min-width: 768px)", mobile: "(max-width: 767px)" },
        (ctx) => {
          const { desktop } = ctx.conditions as { desktop: boolean };
          const startScale = desktop ? 0.79 : 0.92;

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: card.current,
              start: "top 90%",
              end: "center 45%",
              scrub: 0.6,
            },
          });

          tl.fromTo(
            card.current,
            { scale: startScale },
            { scale: 1, ease: "none", transformOrigin: "50% 50%" },
            0
          ).fromTo(
            img.current,
            { scale: 1 },
            { scale: 1.12, ease: "none", transformOrigin: "50% 50%" },
            0
          );
        }
      );

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      id="share"
      className="bg-background px-6 py-[120px] md:px-24 md:py-[190px]"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: EASE }}
        className="text-center"
      >
        <h2 className="text-[clamp(2.5rem,4vw,3.5rem)] font-medium leading-[1.05] tracking-[-0.04em] text-white">
          Share the answer
        </h2>
        <p className="text-[clamp(2.5rem,4vw,3.5rem)] font-medium leading-[1.05] tracking-[-0.04em] text-[#7d8794]">
          Keep the project aligned
        </p>
      </motion.div>

      <div className="mt-14 md:mt-[100px]">
        <div ref={card} className="mx-auto w-full will-change-transform">
          <div className="rounded-[28px] border border-[#242d38] bg-[#0b0f14] p-2 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
            <div className="relative aspect-[1.9/1] overflow-hidden rounded-[22px] bg-[#0d1117]">
              <div ref={img} className="absolute inset-0 will-change-transform">
                {!missing && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={IMAGE.src}
                    alt={IMAGE.alt}
                    className="h-full w-full object-cover"
                    draggable={false}
                    onError={() => setMissing(true)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
