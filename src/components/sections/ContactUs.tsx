"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/* YOUR IMAGES                                                         */
/* Save each picture in public/contact/ and put its path here,         */
/* e.g. notebook: "/contact/notebook.avif". */
/* ------------------------------------------------------------------ */
const IMAGES = {
  notebook: "/contact/notebook.avif",
  texture: "/contact/texture.avif",
  phoneLeft: "/contact/phone-left.png",
  phoneRight: "/contact/phone-right.png",
};

const BLUE = "#1f3dff";
const mono = {
  fontFamily:
    'var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
};

/** Fills its parent: the picture when `src` is set, otherwise a dashed placeholder. */
function ImageSlot({
  src,
  alt,
  label,
  fit = "object-cover object-top",
}: {
  src: string;
  alt: string;
  label: string;
  fit?: string;
}) {
  if (src) {
    return (
      <div className="absolute inset-0 overflow-hidden rounded-[inherit]">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 90vw, 700px"
          className={`${fit} rounded-[inherit]`}
        />
      </div>
    );
  }
  return (
    <div
      className="absolute inset-0 flex items-center justify-center rounded-[inherit] border-2 border-dashed border-current/30 p-3 text-center text-[11px] uppercase opacity-60"
      style={mono}
    >
      Add image
      <br />
      {label}
    </div>
  );
}

function Btn({
  href,
  label,
  variant,
}: {
  href: string;
  label: string;
  variant: "white" | "outline";
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const white = variant === "white";

  const move = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    gsap.to(el, {
      x: (e.clientX - (r.left + r.width / 2)) * 0.15,
      y: (e.clientY - (r.top + r.height / 2)) * 0.3,
      duration: 0.35,
      ease: "power3.out",
    });
  };
  const leave = () =>
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1,0.45)" });

  return (
    <Link
      ref={ref}
      href={href}
      onMouseMove={move}
      onMouseLeave={leave}
      style={mono}
      className={`ct-btn group relative flex h-[38px] items-center justify-center gap-2 overflow-hidden rounded-full px-5 text-[13px] font-semibold uppercase tracking-wide ${
        white ? "bg-white text-[#0b0b12]" : "border border-white/30 text-white"
      }`}
    >
      <span
        aria-hidden
        className="absolute inset-0 translate-y-full rounded-full transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-y-0"
        style={{ backgroundColor: white ? "#0b0b12" : "#ffffff" }}
      />
      <span
        aria-hidden
        className={`relative inline-block h-[8px] w-[8px] rounded-full border-2 transition-transform duration-300 group-hover:scale-125 ${
          white ? "border-[#b9bccb] group-hover:border-white" : "border-white/70 group-hover:border-[#1f3dff]"
        }`}
      />
      <span
        className={`relative transition-colors duration-300 ${
          white ? "group-hover:text-white" : "group-hover:text-[#1f3dff]"
        }`}
      >
        {label}
      </span>
      <span
        aria-hidden
        className={`relative -ml-1 w-0 -translate-x-2 overflow-hidden opacity-0 transition-all duration-300 group-hover:ml-0 group-hover:w-4 group-hover:translate-x-0 group-hover:opacity-100 ${
          white ? "group-hover:text-white" : "group-hover:text-[#1f3dff]"
        }`}
      >
        →
      </span>
    </Link>
  );
}

/** `peek` shows the notebook strip above the blue. Pass peek={false} on pages where the blue follows other content. */
export default function ContactUs({ peek = true }: { peek?: boolean }) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top 65%", once: true },
        defaults: { ease: "power3.out" },
      });

      if (el.querySelector(".ct-notebook")) {
        tl.from(".ct-notebook", { y: 70, opacity: 0, rotate: -2, duration: 1.1 });
      }
      tl.from(".ct-eyebrow", { y: 12, opacity: 0, duration: 0.5 }, "-=0.6")
        .from(".ct-word", { yPercent: 110, duration: 0.9, stagger: 0.07, ease: "power4.out" }, "-=0.3")
        .from(".ct-btn", { y: 20, opacity: 0, scale: 0.9, duration: 0.6, stagger: 0.1, ease: "back.out(1.6)" }, "-=0.5")
        .from(
          ".ct-phone",
          { y: 160, opacity: 0, rotate: (i) => (i === 0 ? -4 : 4), duration: 1.1, stagger: 0.15 },
          "-=0.4"
        );

      gsap.to(".ct-float", {
        y: -10,
        duration: 2.4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: { each: 0.5, from: "start" },
        delay: 2,
      });

      gsap.to(".ct-phones", {
        yPercent: -8,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
      });
      gsap.fromTo(
        ".ct-texture",
        { yPercent: -4 },
        {
          yPercent: 4,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
        }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  const headline = ["Get", "started", "today", "with", "a", "plan", "that", "fits", "your", "company."];

  return (
    <section
      id="contact-us"
      ref={root}
      className={`relative overflow-hidden ${peek ? "bg-[#eef0f5]" : ""}`}
    >
      {peek && (
        <div className="flex h-[220px] items-end justify-center overflow-hidden px-6 md:h-[240px]">
          <div className="ct-notebook relative h-[220px] w-full max-w-[720px] text-[#1f3dff] md:h-[240px]">
            <ImageSlot
              src={IMAGES.notebook}
              alt=""
              label="public/contact/notebook.avif"
              fit="object-cover object-top"
            />
          </div>
        </div>
      )}

      <div
        className={`relative overflow-hidden px-6 text-white ${peek ? "pt-[70px]" : "pt-[88px]"}`}
        style={{ backgroundColor: BLUE }}
      >
        <div aria-hidden className="ct-texture pointer-events-none absolute inset-x-0 -inset-y-10">
          {IMAGES.texture && (
            <Image
              src={IMAGES.texture}
              alt=""
              fill
              sizes="100vw"
              className="object-cover opacity-30 mix-blend-soft-light"
            />
          )}
          <div
            className="absolute inset-0 opacity-70"
            style={{
              backgroundImage:
                "radial-gradient(rgba(255,255,255,0.16) 1px, transparent 1.6px)",
              backgroundSize: "6px 6px",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 50% 30%, rgba(255,255,255,0.10), transparent 60%)",
            }}
          />
        </div>

        <div className="relative mx-auto flex max-w-[1180px] flex-col items-center text-center">
          <div
            className="ct-eyebrow flex items-center gap-2 text-[12px] uppercase text-white/85"
            style={mono}
          >
            <span aria-hidden className="inline-block h-[8px] w-[8px] rounded-full border-2 border-white/80" />
            Contact us
          </div>

          <h2 className="mt-4 max-w-[500px] text-[38px] font-medium leading-[1.1] tracking-[-0.02em] sm:text-[40px]">
            {headline.map((w, i) => (
              <span key={i} className="inline-block overflow-hidden pb-1 align-top">
                <span className="ct-word inline-block">{w}</span>
                {i < headline.length - 1 ? "\u00A0" : ""}
              </span>
            ))}
          </h2>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
            <Btn href="/contact" label="Get free demo" variant="white" />
            <Btn href="/contact" label="Contact us" variant="outline" />
          </div>

          <div className="ct-phones mt-[70px] flex h-[340px] items-start justify-center gap-6 overflow-hidden">
            <div className="ct-phone">
              <div className="ct-float relative h-[420px] w-[170px] overflow-hidden">
                <ImageSlot
                  src={IMAGES.phoneLeft}
                  alt="Stratora app, yearly chart"
                  label="public/contact/phone-left.png"
                  fit="object-contain object-center"
                />
              </div>
            </div>
            <div className="ct-phone">
              <div className="ct-float relative h-[420px] w-[135px] overflow-hidden">
                <ImageSlot
                  src={IMAGES.phoneRight}
                  alt="Stratora app, board"
                  label="public/contact/phone-right.png"
                  fit="object-contain object-center"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
