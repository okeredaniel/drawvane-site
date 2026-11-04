"use client";

import Link from "next/link";
import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";

const BRAND = "Stratora";
const BLUE = "#1f3dff";
const INK = "#0b0b12";
const DARK = "#02030b";
const ICON = "#979797";

const mono = {
  fontFamily:
    'var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
};

/* ------------------------------- ticker data ------------------------------- */

// First three come from the reference. The fourth is a PLACEHOLDER (it is cut off in the screenshot).
const STATS = [
  { label: "Workspaces active", value: "12,480" },
  { label: "Plans generated", value: "1.8M" },
  { label: "Tasks organized", value: "24.6M" },
  { label: "Teams onboarded", value: "3,200" },
];

function Sparkle() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M8 1.5c.4 3.3 1.7 4.6 5 5-3.3.4-4.6 1.7-5 5-.4-3.3-1.7-4.6-5-5 3.3-.4 4.6-1.7 5-5Z"
        stroke={INK}
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
      <path d="M12.8 11.2v3M11.3 12.7h3" stroke={INK} strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <span className="flex shrink-0 items-center whitespace-nowrap">
      <span className="mx-5 h-3 w-px bg-black/15" aria-hidden />
      <span className="text-[12px] uppercase text-[#4b4f5c]">{label}</span>
      <span
        className="ml-2 rounded-[4px] bg-[#e3e6ef] px-2 py-[3px] text-[11px] text-[#0b0b12]"
        style={mono}
      >
        {value}
      </span>
    </span>
  );
}

/* ---------------------------------- icons ---------------------------------- */
// Marks stand-in for the logos in the reference. They size to their wrapper and take its text color,
// so the same icon works grey on the light card and white on the dark hover card.

function Svg({ children }: { children: ReactNode }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 52 52" fill="currentColor" aria-hidden>
      {children}
    </svg>
  );
}

const CUT = { fill: "var(--cut, #fff)" } as CSSProperties;

function IconBurst() {
  return (
    <Svg>
      <circle cx="26" cy="26" r="9" fill="none" stroke="currentColor" strokeWidth="6" />
      {Array.from({ length: 8 }).map((_, i) => (
        <path key={i} d="M26 1 31 11H21Z" transform={`rotate(${i * 45} 26 26)`} />
      ))}
    </Svg>
  );
}

function IconAsterisk() {
  return (
    <Svg>
      {Array.from({ length: 4 }).map((_, i) => (
        <line
          key={i}
          x1="26"
          y1="2"
          x2="26"
          y2="50"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
          transform={`rotate(${i * 45} 26 26)`}
        />
      ))}
    </Svg>
  );
}

function IconCorners() {
  return (
    <Svg>
      <path d="M2 2H23L2 23Z" />
      <path d="M50 2H29L50 23Z" />
      <path d="M2 50H23L2 29Z" />
      <path d="M50 50H29L50 29Z" />
      <path d="M26 15 37 26 26 37 15 26Z" />
    </Svg>
  );
}

function IconHash() {
  return (
    <Svg>
      {[18, 34].map((p) => (
        <g key={p} stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
          <line x1={p} y1="3" x2={p} y2="49" />
          <line x1="3" y1={p} x2="49" y2={p} />
        </g>
      ))}
      {[10, 42].map((p) => (
        <g key={p} stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
          <line x1={p} y1="3" x2={p} y2="9" />
          <line x1={p} y1="43" x2={p} y2="49" />
          <line x1="3" y1={p} x2="9" y2={p} />
          <line x1="43" y1={p} x2="49" y2={p} />
        </g>
      ))}
    </Svg>
  );
}

function IconHexCircle() {
  return (
    <Svg>
      <circle cx="26" cy="26" r="26" />
      <path d="M26 15.5 35 20.8V31.2L26 36.5 17 31.2V20.8Z" style={CUT} />
    </Svg>
  );
}

function IconDots() {
  const dots: ReactNode[] = [];
  for (let y = -4; y <= 4; y++) {
    for (let x = -4; x <= 4; x++) {
      if (Math.hypot(x, y) <= 4.3) {
        dots.push(<circle key={`${x}${y}`} cx={26 + x * 5.6} cy={26 + y * 5.6} r="2.1" />);
      }
    }
  }
  return <Svg>{dots}</Svg>;
}

function IconBite() {
  return (
    <Svg>
      <path d="M3 3H27A22 22 0 0 0 49 25V49H3Z" />
    </Svg>
  );
}

function IconStripes() {
  return (
    <Svg>
      <defs>
        <clipPath id="impact-stripes">
          <circle cx="26" cy="26" r="26" />
        </clipPath>
      </defs>
      <g clipPath="url(#impact-stripes)">
        <rect width="52" height="52" />
        {[24, 29, 34, 39, 44].map((y, i) => (
          <rect key={y} y={y} width="52" height={1.2 + i * 0.35} style={CUT} />
        ))}
      </g>
    </Svg>
  );
}

// Cards with a `brand` get the black "+" and flip to the dark card on hover.
// "Menlo" comes from the reference; the other three names are PLACEHOLDERS.
const CELLS: { icon: ReactNode; brand?: string }[] = [
  { icon: <IconBurst />, brand: "Vertex" },
  { icon: <IconAsterisk /> },
  { icon: <IconCorners />, brand: "Kinetic" },
  { icon: <IconHash /> },
  { icon: <IconHexCircle /> },
  { icon: <IconDots />, brand: "Menlo" },
  { icon: <IconBite /> },
  { icon: <IconStripes />, brand: "Solstice" },
];

/* --------------------------------- section --------------------------------- */

export default function OurImpact() {
  // lets touch screens open a card by tapping the "+"
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section style={{ backgroundColor: "#eef0f5" }} className="pb-24 pt-4 md:pt-10">
      <style>{`
        @keyframes impactScroll { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        .impact-track { animation: impactScroll 32s linear infinite; }
        .impact-ticker:hover .impact-track { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) { .impact-track { animation: none; } }
      `}</style>

      <div className="mx-auto max-w-[1280px] px-6 min-[1330px]:px-0">
        {/* ticker */}
        <div className="impact-ticker mx-auto max-w-[800px] border-t border-black/20">
          <div className="flex h-[42px] items-center">
            <div className="flex shrink-0 items-center gap-2 pr-1">
              <Sparkle />
              <span
                className="text-[12px] font-semibold uppercase tracking-[0.01em]"
                style={{ color: INK }}
              >
                Our impact so far
              </span>
            </div>
            <div
              className="relative flex-1 overflow-hidden"
              style={{
                maskImage:
                  "linear-gradient(to right, transparent 0, #000 7%, #000 90%, transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(to right, transparent 0, #000 7%, #000 90%, transparent 100%)",
              }}
            >
              <div className="impact-track flex w-max">
                {[0, 1].map((dup) => (
                  <div key={dup} className="flex shrink-0" aria-hidden={dup === 1}>
                    {STATS.map((s) => (
                      <StatItem key={s.label} label={s.label} value={s.value} />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* statement + logo grid */}
        <div className="mt-12 grid overflow-hidden rounded-md bg-[#e8eaf2] lg:mt-[58px] lg:grid-cols-[350px_1fr]">
          <div className="flex min-h-[320px] flex-col justify-between bg-[#e5e7f0] p-[26px] lg:min-h-0">
            <p
              className="max-w-[300px] text-[24px] leading-[31px] tracking-[-0.01em]"
              style={{ color: INK }}
            >
              Thousands of modern teams use{" "}
              <span style={{ color: BLUE }}>{BRAND}</span> to plan faster,
              collaborate better, and ship products with clarity—not chaos.
            </p>

            <Link
              href="/case-studies"
              className="group mt-10 inline-flex items-center gap-2 text-[12px] uppercase text-[#3d414d]"
            >
              <span className="underline-offset-4 group-hover:underline">
                Read customer stories
              </span>
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                aria-hidden
                className="transition-transform duration-200 group-hover:translate-x-1"
              >
                <path
                  d="M1 5h8M5.5 1.5 9 5 5.5 8.5"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-[2px] lg:grid-cols-4">
            {CELLS.map((c, i) => {
              const shown = open === i;
              return (
                <div
                  key={i}
                  onMouseLeave={() => setOpen((v) => (v === i ? null : v))}
                  className="group/cell relative flex h-[200px] items-center justify-center overflow-hidden rounded-[5px] bg-[#fbfbff] lg:h-[253px]"
                >
                  {/* resting state: grey mark */}
                  <div
                    className="h-[52px] w-[52px] transition-transform duration-300 ease-out group-hover/cell:scale-110"
                    style={{ color: ICON }}
                  >
                    {c.icon}
                  </div>

                  {c.brand && (
                    <>
                      <button
                        type="button"
                        aria-label={`More about ${c.brand}`}
                        aria-expanded={shown}
                        onClick={() => setOpen(shown ? null : i)}
                        className="absolute right-[17px] top-4 flex h-6 w-6 items-center justify-center rounded-full transition-transform duration-300 hover:scale-110"
                        style={{ backgroundColor: INK }}
                      >
                        <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden>
                          <path d="M4.5 1v7M1 4.5h7" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" />
                        </svg>
                      </button>

                      {/* hover state: dark card */}
                      <Link
                        href="/case-studies"
                        aria-label={`Read the ${c.brand} story`}
                        tabIndex={shown ? 0 : -1}
                        className={`absolute inset-0 flex flex-col justify-between px-3 pb-4 pt-4 text-white transition-opacity duration-300 group-hover/cell:pointer-events-auto group-hover/cell:opacity-100 focus-visible:pointer-events-auto focus-visible:opacity-100 ${
                          shown ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
                        }`}
                        style={{ backgroundColor: DARK }}
                      >
                        <span className="flex items-center justify-between">
                          <span className="flex items-center gap-[7px]">
                            <span
                              className="block h-[22px] w-[22px] text-white"
                              style={{ ["--cut" as string]: DARK } as CSSProperties}
                            >
                              {c.icon}
                            </span>
                            <span
                              className="text-[19px] leading-none"
                              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                            >
                              {c.brand}
                            </span>
                          </span>
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#e9eaf0]">
                            <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden>
                              <path
                                d="M2 7 7 2M3 2h4v4"
                                stroke={INK}
                                strokeWidth="1.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </span>
                        </span>
                        <span className="text-[12px] font-semibold">{c.brand}</span>
                      </Link>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}