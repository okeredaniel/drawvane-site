"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// ---- Tune the animation here -------------------------------------------
// Laptop zoom start: ~1.8x zoom, screen filling the viewport.
const START = { scale: 1.82, x: "-28vw", y: "-21vh" };
// Zoom happens around the laptop screen's top-left corner (% of the video).
const ORIGIN = "14.9% 8.4%";
// How long the section stays pinned. 1 unit = 1 screen of scrolling,
// so this matches the timeline length below (3.6 screens).
const SCROLL_LENGTH = "+=360%";
// -------------------------------------------------------------------------

const TEXT = "text-[20px] leading-8 text-slate-400";
const HIGHLIGHT = "text-[#3d5afe]";

export default function LaptopSection() {
  const section = useRef<HTMLElement>(null);
  const enter = useRef<HTMLDivElement>(null); // slides the laptop in
  const laptop = useRef<HTMLDivElement>(null); // zooms the laptop out
  const video = useRef<HTMLVideoElement>(null);
  const copy = useRef<HTMLDivElement>(null); // both texts, scrolling up

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

      // Scroll animation on desktop. Phones get a plain stacked layout.
      mm.add("(min-width: 768px)", () => {
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
          // both texts scroll up through the screen at scroll speed,
          // starting below the screen and leaving above it
          .fromTo(
            copy.current,
            { y: "100vh" },
            { y: () => -((copy.current?.offsetHeight ?? 0) + 80), duration: 2.1 },
            1.2
          )
          // short pause at the end before the page scrolls on
          .to({}, { duration: 0.3 });
      });
    },
    { scope: section }
  );

  return (
    <section
      id="demo"
      data-keep-dark
      ref={section}
      className="relative overflow-hidden bg-[#0d1117] pb-16 pt-24 md:h-screen md:pb-0 md:pt-0"
    >
      {/* Left: the two texts. On desktop they scroll up past the laptop. */}
      <div className="relative z-10 px-6 md:absolute md:left-0 md:top-0 md:px-0 md:pl-24">
        <div
          ref={copy}
          className="flex max-w-[26rem] flex-col gap-8 md:gap-[88vh]"
        >
          <p className={TEXT}>
            <span className={HIGHLIGHT}>Ask your drawing set</span> anything and
            watch the answer appear.
          </p>
          <p className={TEXT}>
            Every reply{" "}
            <span className={HIGHLIGHT}>links back to the exact sheet</span> and
            detail it came from, so your team can check it in seconds.
          </p>
        </div>
      </div>

      {/* Right: the video. The laptop is part of the video, and the video's
          own background (#0d1117) matches this section, so it blends in. */}
      <div className="mt-10 px-6 md:absolute md:inset-y-0 md:right-[-2.3vw] md:mt-0 md:flex md:w-[min(80.5vw,175vh)] md:items-center md:px-0 md:pt-[18vh]">
        <div ref={enter} className="w-full">
          <div ref={laptop} className="w-full will-change-transform">
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
  );
}