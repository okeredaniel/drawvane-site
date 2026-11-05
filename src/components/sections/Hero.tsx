"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useState } from "react";

import ParticleBlob from "./ParticleBlob";

const BLUE = "#1f3dff";
const INK = "#0b0b12";
const SLIDE_MS = 6000;

const mono = {
  fontFamily:
    'var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
};

type Slide = {
  tab: string;
  eyebrow: string;
  title: string;
  body: string;
  /** Full-bleed background in /public (e.g. "/hero/bg-1.jpg"). Falls back to the blue gradient. */
  background?: string;
  /** Screenshot in /public (e.g. "/hero/workspace.png"). Shown at its original size. */
  screenshot?: string;
};

const SLIDES: Slide[] = [
  {
    tab: "ADAPT",
    eyebrow: "ADAPT",
    title: "See your company at a glance.",
    body: "Connect your company, people and projects. Guided company assessments are coming next.",
    background: "/hero/bg-1.avif",
    screenshot: "/hero/workspace-overview.avif",
  },
  {
    tab: "HERALD",
    eyebrow: "HERALD",
    title: "Find answers in your project files.",
    body: "Ask questions. Find answers in your documents.",
    background: "/hero/bg-2.avif",
    screenshot: "/hero/ai-planner.avif",
  },
  {
    tab: "ASSAY",
    eyebrow: "ASSAY",
    title: "Make every quantity count.",
    body: "Measure lengths, areas and counts on your drawings.",
    background: "/hero/bg-3.avif",
    screenshot: "/hero/execution-board.avif",
  },
];

/** Inline SVG placeholder so no image files are needed until real screenshots exist. */
function placeholderImage(label: string) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800' viewBox='0 0 1200 800'>
    <rect width='1200' height='800' fill='#f3f5fb'/>
    <rect x='0' y='0' width='1200' height='56' fill='#e3e7f5'/>
    <circle cx='28' cy='28' r='8' fill='#c5cce6'/><circle cx='56' cy='28' r='8' fill='#c5cce6'/><circle cx='84' cy='28' r='8' fill='#c5cce6'/>
    <rect x='48' y='104' width='260' height='24' rx='12' fill='#d5dbf0'/>
    <rect x='48' y='152' width='520' height='200' rx='16' fill='#e3e7f5'/>
    <rect x='600' y='152' width='552' height='200' rx='16' fill='#e3e7f5'/>
    <rect x='48' y='384' width='1104' height='64' rx='12' fill='#e9ecf8'/>
    <rect x='48' y='468' width='1104' height='64' rx='12' fill='#e9ecf8'/>
    <rect x='48' y='552' width='1104' height='64' rx='12' fill='#e9ecf8'/>
    <text x='600' y='720' font-family='monospace' font-size='28' text-anchor='middle' fill='#6b7390'>${label} screenshot</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function Ring({
  size = 10,
  color = BLUE,
  className = "",
}: {
  size?: number;
  color?: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={`inline-block shrink-0 rounded-full ${className}`}
      style={{ width: size, height: size, border: `2px solid ${color}` }}
    />
  );
}

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d={dir === "left" ? "M8.5 3 4.5 7l4 4" : "M5.5 3l4 4-4 4"}
        stroke={INK}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const NOISE =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

function Visual({ slide }: { slide: Slide }) {
  return (
    <div className="absolute inset-0">
      {slide.background ? (
        <Image
          src={slide.background}
          alt=""
          fill
          sizes="(min-width: 1024px) 742px, 100vw"
          className="object-cover"
        />
      ) : (
        <>
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(120% 90% at 30% 15%, #7b98ff 0%, #5a7bff 45%, #4868f2 100%)",
            }}
          />
          <div className="absolute left-[8%] top-[10%] h-[120px] w-[120px] rounded-full bg-white/15 ring-[10px] ring-white/10" />
          <div className="absolute left-[16%] top-[28%] h-[68%] w-[46%] -rotate-[7deg] rounded-md bg-white/10" />
          <div className="absolute right-[4%] top-[8%] h-[70%] w-[30%] rotate-[8deg] rounded-md bg-white/10" />
          <div className="absolute right-[18%] top-[6%] h-[10px] w-[240px] -rotate-[18deg] rounded-full bg-[#2f4bff]/50" />
          <div
            className="absolute inset-0 opacity-40 mix-blend-overlay"
            style={{ backgroundImage: NOISE }}
          />
        </>
      )}

      <div className="relative flex h-full items-center justify-center px-8 pb-16 pt-10 md:px-12">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={slide.screenshot ?? placeholderImage(slide.tab)}
          alt={`${slide.tab} screenshot`}
          className="h-auto max-h-full w-auto max-w-full rounded-xl shadow-[0_24px_60px_rgba(10,20,110,0.35)] ring-1 ring-white/50"
        />
      </div>
    </div>
  );
}

export default function Hero() {
  const [index, setIndex] = useState(0);
  const total = SLIDES.length;

  const go = useCallback((i: number) => setIndex(((i % total) + total) % total), [total]);
  const slide = SLIDES[index];

  return (
    <section style={{ backgroundColor: "#eef0f5" }} className="pb-24 pt-14 md:pt-20">
      <style>{`
        @keyframes heroProgress { from { width: 0% } to { width: 100% } }
        @keyframes heroFadeUp { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: none } }
      `}</style>

      <div className="mx-auto max-w-[1280px] px-6 min-[1330px]:px-0">
        <div className="grid items-center gap-8 lg:grid-cols-[680px_1fr]">
          <div>
            <div
              className="mb-4 flex items-center gap-2 text-[13px] uppercase tracking-[0.04em]"
              style={{ ...mono, color: BLUE }}
            >
              <Ring /> Understand.Coordinate.Build
            </div>
            <h1
              className="max-w-[620px] text-[40px] font-semibold leading-[1.16] tracking-[-0.025em] sm:text-[48px] lg:text-[56px]"
              style={{ color: INK }}
            >
              The Construction Intelligence Layer
            </h1>
          </div>

          <ParticleBlob className="h-[300px] lg:h-[360px]" />
        </div>

        <div className="group mt-16 flex flex-col overflow-hidden rounded-lg lg:mt-20 lg:h-[543px] lg:flex-row">
          <div
            className="flex flex-col justify-between p-8 lg:w-[538px] lg:shrink-0"
            style={{ backgroundColor: BLUE }}
          >
            <div key={index} style={{ animation: "heroFadeUp 450ms ease both" }}>
              <div
                className="flex items-center gap-2 text-[12px] font-bold uppercase text-white/80"
                style={mono}
              >
                <Ring color="rgba(255,255,255,0.9)" /> {slide.eyebrow}
              </div>
              <h2 className="mt-[18px] max-w-[400px] text-[36px] font-semibold leading-[1.2] tracking-[-0.02em] text-white">
                {slide.title}
              </h2>
              <p className="mt-[14px] max-w-[460px] text-[16px] leading-[21px] text-white/70">
                {slide.body}
              </p>
              <Link
                href="/contact"
                style={mono}
                className="mt-[26px] inline-flex h-[41px] items-center gap-2 rounded-full bg-white px-4 text-[14px] font-medium uppercase text-[#0b0b12] transition-transform duration-200 hover:scale-[1.03]"
              >
                <Ring size={10} color="#c9ccd6" /> Contact us
              </Link>
            </div>

            <div className="mt-10" role="tablist" aria-label="Product overview">
              {SLIDES.map((s, i) => {
                const active = i === index;
                return (
                  <button
                    key={s.tab}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => go(i)}
                    style={{
                      ...mono,
                      borderTop: `1px solid ${active ? "#fff" : "rgba(255,255,255,0.25)"}`,
                    }}
                    className={`flex h-[39px] w-full items-center gap-2 text-left text-[12px] font-bold uppercase transition-colors ${
                      active ? "text-white" : "text-white/80 hover:text-white"
                    }`}
                  >
                    {active && (
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
                        <path d="M1 5h8M5.5 1.5 9 5 5.5 8.5" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                    {s.tab}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="relative h-[460px] flex-1 overflow-hidden lg:h-auto">
            {SLIDES.map((s, i) => (
              <div
                key={s.tab}
                className="absolute inset-0 transition-opacity duration-500"
                style={{ opacity: i === index ? 1 : 0, pointerEvents: i === index ? "auto" : "none" }}
                aria-hidden={i !== index}
              >
                <Visual slide={s} />
              </div>
            ))}

            <div className="absolute bottom-[22px] left-8 h-[2px] w-[90px] bg-white/25">
              <div
                key={index}
                className="h-full bg-white [animation-play-state:running] group-hover:[animation-play-state:paused]"
                style={{ animation: `heroProgress ${SLIDE_MS}ms linear forwards` }}
                onAnimationEnd={() => go(index + 1)}
              />
            </div>

            <div className="absolute bottom-6 right-8 flex gap-3">
              <button
                type="button"
                aria-label="Previous slide"
                onClick={() => go(index - 1)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.12)] transition-transform hover:scale-105"
              >
                <Chevron dir="left" />
              </button>
              <button
                type="button"
                aria-label="Next slide"
                onClick={() => go(index + 1)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.12)] transition-transform hover:scale-105"
              >
                <Chevron dir="right" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}