"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// ---- Tune the animation here -------------------------------------------
// Laptop zoom start (desktop): ~1.8x zoom, screen filling the viewport.
const START = { scale: 1.82, x: "-28vw", y: "-21vh" };
// Zoom happens around the laptop screen's top-left corner (% of the video).
const ORIGIN = "14.9% 8.4%";
// How long the section stays pinned. 1 unit = 1 screen of scrolling,
// so this matches the timeline length below (3.6 screens).
const SCROLL_LENGTH = "+=360%";
// Phones: how long the section stays pinned while the texts scroll up.
const SCROLL_LENGTH_PHONE = "+=300%";
// Where the 2nd text stops when the section ends, as a fraction of the
// screen height measured to the middle of the text (0.5 = dead centre).
// Raise it to rest lower, lower it to rest higher.
const REST_AT = 0.40; // desktop / tablet
const REST_AT_PHONE = 0.62; // phones
// Empty space under the laptop once the section ends.
// Same dark colour as the section so it reads as part of it.
const BOTTOM_SPACE = "h-[8vh] md:h-[14vh]";
// The text sits over the laptop, so the laptop is faded toward the section
// colour while the text is on screen. 0 = no dimming, 1 = laptop fully
// hidden. (A colour overlay is used instead of a brightness filter so the
// video's edges never show as a box against the background.)
const DIM_OPACITY = 0.55; // tablets (768px up to DIM_BELOW)
const DIM_OPACITY_PHONE = 0.6; // phones
// Screens narrower than this (but still using the desktop layout) get the dim.
const DIM_BELOW = 1280; // px
// -------------------------------------------------------------------------

const TEXT = "text-[20px] leading-8 text-slate-400";
const HIGHLIGHT = "text-[#3d5afe]";

export default function LaptopSection() {
  const section = useRef<HTMLElement>(null);
  const enter = useRef<HTMLDivElement>(null); // slides the laptop in
  const laptop = useRef<HTMLDivElement>(null); // zooms the laptop out
  const video = useRef<HTMLVideoElement>(null);
  const copy = useRef<HTMLDivElement>(null); // both texts, scrolling up
  const second = useRef<HTMLParagraphElement>(null); // the 2nd text
  const dim = useRef<HTMLDivElement>(null); // fades the laptop under the text

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

      // Where the copy has to end up so the 2nd text rests at `rest`
      const restY = (rest: number) => () => {
        const p = second.current;
        if (!p) return 0;
        const centre = p.offsetTop + p.offsetHeight / 2;
        return window.innerHeight * rest - centre;
      };

      mm.add(
        {
          isPhone: "(max-width: 767px)",
          isDesktop: "(min-width: 768px)",
          isNarrow: `(min-width: 768px) and (max-width: ${DIM_BELOW - 1}px)`,
        },
        (context) => {
          const { isPhone, isNarrow } = context.conditions as {
            isPhone: boolean;
            isDesktop: boolean;
            isNarrow: boolean;
          };

          // ---------------------------------------------------------------
          // Phones: the section is pinned too. The laptop stays in place,
          // dimmed, while the texts scroll up over it.
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
                { y: 0 },
                { y: restY(REST_AT_PHONE), duration: 2.4 },
                0
              )
              // pause at the end with the 2nd text still over the laptop
              .to({}, { duration: 0.3 });
            return;
          }

          // ---------------------------------------------------------------
          // Tablet and desktop
          // ---------------------------------------------------------------

          // 1. Entrance: the laptop is hidden until the section arrives,
          //    then slides in from the right on its own (not tied to scroll).
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

          // 2. Scroll-linked part: pinned, laptop zooms out, texts scroll up.
          gsap.set(laptop.current, { ...START, transformOrigin: ORIGIN });

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
            // laptop zooms out and settles into place
            .to(laptop.current, { scale: 1, x: 0, y: 0, ease: "power2.inOut", duration: 1.4 }, 0)
            // both texts scroll up at scroll speed, starting below the screen.
            // The first text leaves above the screen, but the 2nd text stops
            // beside the laptop and stays there until the section ends.
            .fromTo(
              copy.current,
              { y: "100vh" },
              { y: restY(REST_AT), duration: 2.1 },
              1.2
            );

          // On narrower screens the text sits over the laptop, so fade the
          // laptop down just as the text arrives and keep it dimmed after.
          if (isNarrow) {
            tl.to(dim.current, { opacity: DIM_OPACITY, duration: 0.7 }, 1.0);
          }

          // pause at the end with the 2nd text still beside the laptop
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
        {/* Left / top: the two texts. They scroll up past the laptop. */}
        <div className="absolute left-0 top-0 z-10 px-6 pt-[92px] md:px-0 md:pl-24 md:pt-0">
          <div ref={copy} className="flex max-w-[26rem] flex-col gap-[88vh]">
            <p className={TEXT}>
              <span className={HIGHLIGHT}>Ask your drawing set</span> anything and
              watch the answer appear.
            </p>
            <p ref={second} className={TEXT}>
              Every reply{" "}
              <span className={HIGHLIGHT}>links back to the exact sheet</span> and
              detail it came from, so your team can check it in seconds.
            </p>
          </div>
        </div>

        {/* The video. The laptop is part of the video, and the video's own
            background (#0d1117) matches this section, so it blends in. */}
        <div className="absolute inset-0 flex items-center px-4 pt-[10vh] md:left-auto md:right-[-2.3vw] md:w-[min(80.5vw,175vh)] md:px-0 md:pt-[18vh]">
          <div ref={enter} className="w-full">
            <div ref={laptop} className="relative w-full will-change-transform">
              <div
                ref={dim}
                aria-hidden
                className="pointer-events-none absolute inset-0 z-[1] bg-[#0d1117] opacity-0"
              />
              <video
                ref={video}
                className="block h-auto w-full"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                disablePictureInPicture
                poster="/laptop-poster.jpg"
                aria-label="Drawvane demo: asking a question and getting an answer linked to the exact sheet"
              >
                <source src="/laptop.webm" type="video/webm" />
                <source src="/laptop.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
      </section>

      {/* Space under the laptop after the pinned section ends */}
      <div aria-hidden data-keep-dark className={`bg-[#0d1117] ${BOTTOM_SPACE}`} />
    </>
  );
}