"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Bricolage_Grotesque } from "next/font/google";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Headline font. Delete this + the `display.className` below to use the site font.
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["500", "600"],
});

// ---- Tune the animation here -------------------------------------------
// Laptop zoom start (desktop): ~1.8x zoom, screen filling the viewport.
// rotationY = how much the laptop is turned at the start (flattens to 0).
const START = { scale: 1.82, x: "-28vw", y: "-21vh", rotationY: -7 };
// Zoom happens around the laptop screen's top-left corner (% of the video).
const ORIGIN = "14.9% 8.4%";
// How long the section stays pinned (1 unit = 1 screen of scrolling).
const SCROLL_LENGTH = "+=290%";
const SCROLL_LENGTH_PHONE = "+=300%";
// Empty space under the laptop once the section ends.
const BOTTOM_SPACE = "h-[8vh] md:h-[14vh]";
// Laptop fade under the text (tablets / phones). 0 = none, 1 = fully hidden.
const DIM_OPACITY = 0.55;
const DIM_OPACITY_PHONE = 0.6;
// Screens narrower than this (but still desktop layout) get the dim.
const DIM_BELOW = 1280; // px
// Blueprint grid parallax: how far the grid drifts up over the whole pin.
const GRID_DRIFT = "-14vh";
// -------------------------------------------------------------------------

const HEAD = "Ask your drawing set anything. Watch the answer build.";
const SUB =
  "Every reply points to the exact sheet and detail it came from, so your team can check it in seconds.";

// Wraps every word so it can light up on scroll.
function Words({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").map((word, i) => (
        <span key={i}>
          <span className="w inline-block opacity-[0.22]">{word}</span>{" "}
        </span>
      ))}
    </>
  );
}

export default function LaptopSection() {
  const section = useRef<HTMLElement>(null);
  const enter = useRef<HTMLDivElement>(null); // slides the laptop in
  const laptop = useRef<HTMLDivElement>(null); // zooms the laptop out
  const video = useRef<HTMLVideoElement>(null);
  const copy = useRef<HTMLDivElement>(null); // headline + subtext block
  const head = useRef<HTMLHeadingElement>(null);
  const sub = useRef<HTMLParagraphElement>(null);
  const dim = useRef<HTMLDivElement>(null); // fades the laptop under the text
  const grid = useRef<HTMLDivElement>(null); // blueprint grid
  const glow = useRef<HTMLDivElement>(null); // blue light behind the laptop

  // Play the video only while the section is on screen
  useEffect(() => {
    const el = section.current;
    const v = video.current;
    if (!el || !v) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      const words = (el: HTMLElement | null) =>
        Array.from(el?.querySelectorAll<HTMLElement>(".w") ?? []);

      mm.add(
        {
          isPhone: "(max-width: 767px)",
          isDesktop: "(min-width: 768px)",
          isNarrow: `(min-width: 768px) and (max-width: ${DIM_BELOW - 1}px)`,
          isReduced: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { isPhone, isNarrow, isReduced } = context.conditions as {
            isPhone: boolean;
            isDesktop: boolean;
            isNarrow: boolean;
            isReduced: boolean;
          };

          const wHead = words(head.current);
          const wSub = words(sub.current);

          // ---------------------------------------------------------------
          // Reduced motion: no pin, no scrub. Final state, text centered.
          // ---------------------------------------------------------------
          if (isReduced) {
            gsap.set([...wHead, ...wSub], { opacity: 1 });
            gsap.set(glow.current, { opacity: 1 });
            return;
          }

          // ---------------------------------------------------------------
          // Phones: pinned. Laptop stays put and dims, text sits in the
          // middle and its words light up as you scroll.
          // ---------------------------------------------------------------
          if (isPhone) {
            const tl = gsap.timeline({
              defaults: { ease: "none" },
              scrollTrigger: {
                trigger: section.current,
                start: "top top",
                end: SCROLL_LENGTH_PHONE,
                pin: true,
                scrub: 0.6,
                anticipatePin: 1,
                invalidateOnRefresh: true,
              },
            });

            tl.to(dim.current, { opacity: DIM_OPACITY_PHONE, duration: 0.6 }, 0)
              .fromTo(
                copy.current,
                { autoAlpha: 0, y: 24 },
                { autoAlpha: 1, y: 0, duration: 0.4 },
                0
              )
              .to(wHead, { opacity: 1, stagger: 0.05, duration: 0.2 }, 0.2)
              .to(wSub, { opacity: 1, stagger: 0.03, duration: 0.2 }, 1.0)
              .to(grid.current, { y: GRID_DRIFT, duration: 2.7 }, 0)
              .to({}, { duration: 0.3 });
            return;
          }

          // ---------------------------------------------------------------
          // Tablet and desktop
          // ---------------------------------------------------------------

          // 1. Entrance: laptop slides in from the right on its own.
          gsap.fromTo(
            enter.current,
            { x: "35vw", opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 1.1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: section.current,
                start: "top 25%",
                toggleActions: "play none none reverse",
              },
            }
          );

          // 2. Scroll-linked part: pinned. The text block stays centered;
          //    it fades in once the laptop has mostly zoomed out.
          gsap.set(laptop.current, {
            ...START,
            transformOrigin: ORIGIN,
            transformPerspective: 1400,
          });

          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: section.current,
              start: "top top",
              end: SCROLL_LENGTH,
              pin: true,
              scrub: 0.6,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          tl
            // laptop zooms out, flattens, settles
            .to(
              laptop.current,
              { scale: 1, x: 0, y: 0, rotationY: 0, ease: "power2.inOut", duration: 1.4 },
              0
            )
            // blue light comes up behind the laptop
            .to(glow.current, { opacity: 1, duration: 1.4, ease: "power2.in" }, 0)
            // grid drifts slower than the scroll = depth
            .to(grid.current, { y: GRID_DRIFT, duration: 2.9 }, 0)
            // text block fades up into the middle of the screen
            .fromTo(
              copy.current,
              { autoAlpha: 0, y: 28 },
              { autoAlpha: 1, y: 0, duration: 0.5 },
              1.0
            )
            // headline words light up, then the subtext
            .to(wHead, { opacity: 1, stagger: 0.05, duration: 0.2 }, 1.2)
            .to(wSub, { opacity: 1, stagger: 0.03, duration: 0.2 }, 1.9);

          // narrower screens: text sits over the laptop, so dim it
          if (isNarrow) {
            tl.to(dim.current, { opacity: DIM_OPACITY, duration: 0.7 }, 1.0);
          }

          tl.to({}, { duration: 0.3 });
        }
      );
    },
    { scope: section }
  );

  return (
    <>
      <section
        id="demo"
        data-keep-dark
        ref={section}
        className="relative h-svh overflow-hidden bg-[#0d1117] md:h-screen"
      >
        {/* Blueprint grid: minor + major lines, faded toward the edges */}
        <div
          ref={grid}
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-[15vh] h-[130%] will-change-transform"
          style={{
            backgroundImage: [
              "linear-gradient(to right, rgba(61,90,254,0.10) 1px, transparent 1px)",
              "linear-gradient(to bottom, rgba(61,90,254,0.10) 1px, transparent 1px)",
              "linear-gradient(to right, rgba(148,163,184,0.045) 1px, transparent 1px)",
              "linear-gradient(to bottom, rgba(148,163,184,0.045) 1px, transparent 1px)",
            ].join(","),
            backgroundSize: "160px 160px, 160px 160px, 32px 32px, 32px 32px",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 70% at 62% 50%, #000 20%, transparent 78%)",
            maskImage:
              "radial-gradient(ellipse 80% 70% at 62% 50%, #000 20%, transparent 78%)",
          }}
        />

        {/* Text: vertically centered on the left (centered over the laptop on phones) */}
        <div className="absolute inset-y-0 left-0 z-10 flex items-center px-6 md:pl-24 md:pr-0">
          <div ref={copy} className="max-w-[34rem]">
            <h2
              ref={head}
              className={`${display.className} text-[clamp(32px,3.6vw,58px)] font-medium leading-[1.05] tracking-[-0.03em] text-white`}
            >
              <Words text={HEAD} />
            </h2>
            <p
              ref={sub}
              className="mt-6 max-w-[26rem] text-[clamp(17px,1.3vw,20px)] leading-[1.55] text-slate-300"
            >
              <Words text={SUB} />
            </p>
          </div>
        </div>

        {/* The video. The laptop is part of the video, and the video's own
            background (#0d1117) matches this section, so it blends in. */}
        <div className="absolute inset-0 flex items-center px-4 pt-[10vh] md:left-auto md:right-[-2.3vw] md:w-[min(80.5vw,175vh)] md:px-0 md:pt-[18vh]">
          <div ref={enter} className="relative w-full">
            {/* blue light behind the laptop */}
            <div
              ref={glow}
              aria-hidden
              className="pointer-events-none absolute -inset-[8%] opacity-0"
              style={{
                background:
                  "radial-gradient(closest-side, rgba(61,90,254,0.28), rgba(61,90,254,0) 100%)",
              }}
            />

            <div ref={laptop} className="relative w-full will-change-transform">
              <div
                ref={dim}
                aria-hidden
                className="pointer-events-none absolute inset-0 z-[1] bg-[#0d1117] opacity-0"
              />
              {/* Stratora demo video */}
              {/* <video
                ref={video}
                className="block h-auto w-full"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                disablePictureInPicture
                poster="/laptop-poster.jpg"
                aria-label="Stratora demo: asking a question and getting an answer linked to the exact sheet"
              >
                <source src="/laptop.webm" type="video/webm" />
                <source src="/laptop.mp4" type="video/mp4" />
              </video> */}
            </div>

          </div>
        </div>
      </section>

      {/* Space under the laptop after the pinned section ends */}
      <div aria-hidden data-keep-dark className={`bg-[#0d1117] ${BOTTOM_SPACE}`} />
    </>
  );
}