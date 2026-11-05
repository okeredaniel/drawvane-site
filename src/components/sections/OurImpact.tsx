"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties, PointerEvent, ReactNode } from "react";

const BRAND = "Stratora";
const ACCENT = "#ffc800";
const ACCENT_INK = "#755b00";
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
  { label: "Drawing review", value: "Mark up" },
  { label: "Project documents", value: "Ask" },
  { label: "Quantity takeoff", value: "Measure" },
  { label: "Team collaboration", value: "Connect" },
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
  { icon: <IconBurst />, brand: "Review" },
  { icon: <IconAsterisk /> },
  { icon: <IconCorners />, brand: "Measure" },
  { icon: <IconHash /> },
  { icon: <IconHexCircle /> },
  { icon: <IconDots />, brand: "Discuss" },
  { icon: <IconBite /> },
  { icon: <IconStripes />, brand: "Explore" },
];

/* ------------------------------ 3D card scene ------------------------------ */
// No grid. The cards are scattered through a 3D scene at different depths and sizes.
//   stage  : follows the cursor (parallax tilt of the whole scene)
//   scene  : slowly orbits on its own, so the depth is always changing
//   pos    : where the card lives (x/y = centre as % of the panel, z = depth, s = size) + fly-in entrance
//   float  : each card's own looping drift through space
//   tilt   : hover tilt, and the card pulls forward to the front
// x/y/z/s are the numbers to play with. sx/sy are where the card flies in from.
const SCENE = [
  { x: 36, y: 20, z: 110, s: 1.05, sx: -260, sy: -200, mx: 27, my: 11 },
  { x: 56, y: 11, z: -150, s: 0.8, sx: 100, sy: -260, mx: 73, my: 20 },
  { x: 77, y: 25, z: 170, s: 1.1, sx: 280, sy: -180, mx: 27, my: 36 },
  { x: 90, y: 12, z: -70, s: 0.85, sx: 320, sy: -240, mx: 73, my: 45 },
  { x: 45, y: 52, z: -210, s: 0.75, sx: -200, sy: 120, mx: 27, my: 61 },
  { x: 65, y: 58, z: 60, s: 1.0, sx: 120, sy: 240, mx: 73, my: 70 },
  { x: 86, y: 60, z: 190, s: 1.05, sx: 300, sy: 200, mx: 27, my: 85 },
  { x: 54, y: 85, z: -30, s: 0.9, sx: -80, sy: 280, mx: 73, my: 90 },
];
// slow, different-length loops so the cards never move in sync
const DX = [9.5, 12, 10.5, 13, 8.5, 11.5, 9, 12.5];
const DY = [6.5, 8, 7, 9.5, 6, 8.5, 7.5, 10];
const DR = [11, 14, 12.5, 15, 10, 13.5, 12, 16];
const AMP = [1, 0.85, 1.15, 0.9, 1.1, 0.8, 1.2, 0.95];

function Cell({
  c,
  i,
  shown,
  revealed,
  onToggle,
  onLeave,
}: {
  c: (typeof CELLS)[number];
  i: number;
  shown: boolean;
  revealed: boolean;
  onToggle: () => void;
  onLeave: () => void;
}) {
  const tiltRef = useRef<HTMLDivElement>(null);
  const p = SCENE[i];

  const move = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch") return;
    const el = tiltRef.current;
    if (!el) return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--ry", `${((px - 0.5) * 22).toFixed(2)}deg`);
    el.style.setProperty("--rx", `${((0.5 - py) * 22).toFixed(2)}deg`);
    el.style.setProperty("--gx", `${(px * 100).toFixed(1)}%`);
    el.style.setProperty("--gy", `${(py * 100).toFixed(1)}%`);
  };

  const leave = () => {
    const el = tiltRef.current;
    if (el) ["--rx", "--ry", "--gx", "--gy"].forEach((v) => el.style.removeProperty(v));
    onLeave();
  };

  return (
    <div
      onPointerMove={move}
      onPointerLeave={leave}
      className={`impact-pos impact-card group/cell ${revealed ? "is-in" : ""} ${shown ? "is-open" : ""}`}
      style={
        {
          ["--px0"]: `${p.mx}%`,
          ["--py0"]: `${p.my}%`,
          ["--px1"]: `${p.x}%`,
          ["--py1"]: `${p.y}%`,
          ["--z"]: `${p.z}px`,
          ["--s"]: p.s,
          ["--sx"]: `${p.sx}px`,
          ["--sy"]: `${p.sy}px`,
          ["--ind"]: `${i * 120}ms`,
          ["--lift"]: `${Math.max(90, 250 - p.z)}px`,
        } as CSSProperties
      }
    >
      <div
        className="impact-par"
        style={{ ["--d"]: Math.round(10 + ((p.z + 210) / 400) * 30) } as CSSProperties}
      >
      <div
        className="impact-fx"
        style={
          { ["--dx"]: `${DX[i]}s`, ["--dl"]: `-${i * 1.7}s`, ["--f"]: AMP[i] } as CSSProperties
        }
      >
      <div className="impact-fy" style={{ ["--dy"]: `${DY[i]}s` } as CSSProperties}>
      <div className="impact-fr" style={{ ["--dr"]: `${DR[i]}s` } as CSSProperties}>
        <div
          ref={tiltRef}
          className="impact-tilt relative flex aspect-[1/1.12] w-[clamp(124px,14.5vw,208px)] items-center justify-center rounded-[10px] bg-[#fbfbff]"
        >
          {/* grey mark, floating above the card */}
          <div className="impact-icon h-[52px] w-[52px]" style={{ color: ICON }}>
            {c.icon}
          </div>

          {c.brand && (
            <>
              <span className="absolute right-[17px] top-4" style={{ transform: "translateZ(70px)" }}>
                <button
                  type="button"
                  aria-label={`More about ${c.brand}`}
                  aria-expanded={shown}
                  onClick={onToggle}
                  className="flex h-6 w-6 items-center justify-center rounded-full transition-transform duration-300 hover:scale-110"
                  style={{ backgroundColor: INK }}
                >
                  <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden>
                    <path d="M4.5 1v7M1 4.5h7" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" />
                  </svg>
                </button>
              </span>

              {/* hover state: dark card */}
              <Link
                href="/#features"
                aria-label={`See ${c.brand} workflows`}
                tabIndex={shown ? 0 : -1}
                className={`absolute inset-0 flex flex-col justify-between rounded-[10px] px-3 pb-4 pt-4 text-white transition-opacity duration-300 group-hover/cell:pointer-events-auto group-hover/cell:opacity-100 focus-visible:pointer-events-auto focus-visible:opacity-100 ${
                  shown ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
                }`}
                style={{ backgroundColor: DARK, transform: "translateZ(1px)" }}
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

          {/* light that follows the cursor across the card */}
          <span className="impact-glare pointer-events-none absolute inset-0 rounded-[10px]" aria-hidden />
        </div>
      </div></div></div></div>
    </div>
  );
}

/* --------------------------------- section --------------------------------- */

export default function OurImpact({
  respectReducedMotion = false,
}: {
  /** If true, all motion stops for visitors whose device has "reduce motion" turned on. */
  respectReducedMotion?: boolean;
}) {
  // lets touch screens open a card by tapping the "+"
  const [open, setOpen] = useState<number | null>(null);
  // plays the fly-in the first time the panel scrolls into view
  const [revealed, setRevealed] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setRevealed(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // the whole scene leans toward the cursor
  const parallax = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch") return;
    const el = panelRef.current;
    const st = stageRef.current;
    if (!el || !st) return;
    const r = el.getBoundingClientRect();
    const nx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (r.width / 2)));
    const ny = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (r.height / 2)));
    st.style.setProperty("--mx", nx.toFixed(3));
    st.style.setProperty("--my", ny.toFixed(3));
  };
  const parallaxReset = () => {
    stageRef.current?.style.removeProperty("--mx");
    stageRef.current?.style.removeProperty("--my");
  };

  return (
    // overflow-x: clip only stops a sideways page scrollbar; nothing inside is cut off
    <section style={{ backgroundColor: "#f5f4ef", overflowX: "clip" }} className={`pb-24 pt-4 md:pt-10 ${respectReducedMotion ? "impact-calm" : ""}`}>
      <style>{`
        @keyframes impactScroll { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        .impact-track { animation: impactScroll 32s linear infinite; }
        .impact-ticker:hover .impact-track { animation-play-state: paused; }

        /* the scene: no spinning. Depth comes from card size/position plus a soft cursor parallax */
        .impact-stage { perspective: 1500px; transform-style: preserve-3d; pointer-events: none; }
        .impact-scene { position: absolute; inset: 0; transform-style: preserve-3d; }

        /* card position (mobile values first, then desktop) + fly-in from deep in the scene */
        .impact-pos {
          --ax: 7px; --ay: 10px; --arx: 3deg; --ary: 3deg; --k: .82;
          position: absolute;
          left: var(--px0);
          top: var(--py0);
          transform-style: preserve-3d;
          pointer-events: auto;
          opacity: 0;
          transform: translate3d(-50%, -50%, var(--z)) scale(calc(var(--s) * var(--k))) rotateY(0deg);
        }
        @media (min-width: 1024px) {
          .impact-pos { --ax: 16px; --ay: 22px; --arx: 5deg; --ary: 6deg; --k: 1; left: var(--px1); top: var(--py1); }
        }
        .impact-pos.is-in {
          opacity: 1;
          animation: impactIn 1.6s cubic-bezier(.2,.9,.25,1) var(--ind, 0ms) backwards;
        }
        @keyframes impactIn {
          from {
            opacity: 0;
            transform: translate3d(calc(-50% + var(--sx)), calc(-50% + var(--sy)), -1100px) scale(calc(var(--s) * var(--k) * .6)) rotateY(50deg);
          }
          to {
            opacity: 1;
            transform: translate3d(-50%, -50%, var(--z)) scale(calc(var(--s) * var(--k))) rotateY(0deg);
          }
        }

        /* closer cards shift more as the cursor moves */
        .impact-par {
          transform-style: preserve-3d;
          transform: translate3d(calc(var(--mx, 0) * var(--d, 20) * -1px), calc(var(--my, 0) * var(--d, 20) * -1px), 0);
          transition: transform .8s cubic-bezier(.2,.8,.2,1);
        }

        /* three slow, independent loops (sideways, up/down, tilt) that blend into smooth drifting */
        .impact-fx, .impact-fy, .impact-fr {
          transform-style: preserve-3d;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          animation-direction: alternate;
          animation-delay: var(--dl, 0s);
        }
        .impact-fx { animation-name: impactX; animation-duration: var(--dx, 10s); }
        .impact-fy { animation-name: impactY; animation-duration: var(--dy, 7s); animation-delay: inherit; }
        .impact-fr { animation-name: impactR; animation-duration: var(--dr, 12s); animation-delay: inherit; }
        @keyframes impactX {
          from { transform: translate3d(calc(var(--ax) * var(--f, 1) * -1), 0, 0); }
          to   { transform: translate3d(calc(var(--ax) * var(--f, 1)), 0, 0); }
        }
        @keyframes impactY {
          from { transform: translate3d(0, calc(var(--ay) * var(--f, 1) * -1), 0); }
          to   { transform: translate3d(0, calc(var(--ay) * var(--f, 1)), 0); }
        }
        @keyframes impactR {
          from { transform: rotateX(calc(var(--arx) * -1)) rotateY(calc(var(--ary) * -1)) rotateZ(-1.5deg); }
          to   { transform: rotateX(var(--arx)) rotateY(var(--ary)) rotateZ(1.5deg); }
        }
        .impact-card:hover .impact-fx, .impact-card:hover .impact-fy, .impact-card:hover .impact-fr,
        .impact-card.is-open .impact-fx, .impact-card.is-open .impact-fy, .impact-card.is-open .impact-fr { animation-play-state: paused; }

        /* hover: tilt toward the cursor and pull to the front of the scene */
        .impact-tilt {
          transform-style: preserve-3d;
          transform: rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg));
          transition: transform .45s cubic-bezier(.2,.8,.2,1), box-shadow .35s ease;
          box-shadow: 0 18px 34px -16px rgba(20,22,40,.34), 0 2px 4px rgba(20,22,40,.06);
          will-change: transform;
        }
        .impact-card:hover .impact-tilt,
        .impact-card.is-open .impact-tilt {
          transform: translateZ(var(--lift, 140px)) scale(1.06) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg));
          box-shadow: 0 50px 64px -28px rgba(20,22,40,.52), 0 10px 20px -8px rgba(20,22,40,.2);
        }

        /* the mark floats above the card and pops further on hover */
        .impact-icon {
          transform: translateZ(40px);
          transition: transform .35s cubic-bezier(.2,.8,.2,1), filter .35s ease;
          filter: drop-shadow(0 6px 5px rgba(0,0,0,.14));
        }
        .impact-card:hover .impact-icon { transform: translateZ(90px) scale(1.15); filter: drop-shadow(0 18px 12px rgba(0,0,0,.22)); }

        .impact-glare {
          opacity: 0;
          transition: opacity .3s ease;
          background: radial-gradient(circle at var(--gx, 50%) var(--gy, 50%), rgba(255,255,255,.55), rgba(255,200,0,.16) 35%, transparent 62%);
        }
        .impact-card:hover .impact-glare { opacity: 1; }

        /* only applies when <OurImpact respectReducedMotion /> is used */
        @media (prefers-reduced-motion: reduce) {
          .impact-calm .impact-track { animation: none; }
          .impact-calm .impact-fx, .impact-calm .impact-fy, .impact-calm .impact-fr { animation: none; }
          .impact-calm .impact-pos, .impact-calm .impact-pos.is-in { opacity: 1; animation: none; }
          .impact-calm .impact-par { transform: none; transition: none; }
          .impact-calm .impact-tilt, .impact-calm .impact-icon { transition: none; }
        }
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
                Connected from the start
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

        {/* statement + the 3D card scene (no clipping: cards pass over the text and panel edges) */}
        <div
          ref={panelRef}
          onPointerMove={parallax}
          onPointerLeave={parallaxReset}
          className="relative mt-12 min-h-[860px] rounded-md bg-[#e8eaf2] lg:mt-[58px] lg:min-h-[700px]"
        >
          <div className="relative z-10 flex flex-col justify-between gap-10 p-[26px] lg:absolute lg:inset-y-0 lg:left-0 lg:w-[350px]">
            <p
              className="max-w-[300px] text-[24px] leading-[31px] tracking-[-0.01em]"
              style={{ color: INK }}
            >
              Use{" "}
              <span style={{ color: ACCENT_INK }}>{BRAND}</span> to review drawings,
              measure quantities and discuss the details, all in one workspace.
            </p>

            <Link
              href="/#features"
              className="group inline-flex items-center gap-2 text-[12px] uppercase text-[#3d414d]"
            >
              <span className="underline-offset-4 group-hover:underline">
                Explore project workflows
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

          <div ref={stageRef} className="impact-stage absolute inset-x-0 bottom-0 top-[270px] z-20 lg:inset-0 lg:top-0">
            <div className="impact-scene">
              {CELLS.map((c, i) => (
                <Cell
                  key={i}
                  c={c}
                  i={i}
                  shown={open === i}
                  revealed={revealed}
                  onToggle={() => setOpen(open === i ? null : i)}
                  onLeave={() => setOpen((v) => (v === i ? null : v))}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}