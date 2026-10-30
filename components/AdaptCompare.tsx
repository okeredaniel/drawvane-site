"use client";

import { useEffect, useRef, useState } from "react";

const INK = "#0E1A2B";
const MARKUP = "#D9402B";
const YELLOW = "#F5C93C";

// Scalloped "revision cloud" outline, the way drafters circle a change.
function cloudPath(x: number, y: number, w: number, h: number, bump = 16) {
  let cx = x;
  let cy = y;
  let d = `M${cx} ${cy}`;
  const run = (dx: number, dy: number, len: number) => {
    const n = Math.max(2, Math.round(len / bump));
    const step = len / n;
    const r = +(step * 0.62).toFixed(2);
    for (let i = 0; i < n; i++) {
      cx = +(cx + dx * step).toFixed(2);
      cy = +(cy + dy * step).toFixed(2);
      d += `A${r} ${r} 0 0 1 ${cx} ${cy}`;
    }
  };
  run(1, 0, w);
  run(0, 1, h);
  run(-1, 0, w);
  run(0, -1, h);
  return d + "Z";
}

// The same floor plan twice. Rev B moves the Room 03 / Room 04 wall and adds a door.
function Plan({ rev }: { rev: "A" | "B" }) {
  const wallX = rev === "A" ? 400 : 450;
  const mid = (210 + wallX) / 2;
  return (
    <svg viewBox="0 0 640 390" className="block h-full w-full" aria-hidden>
      <rect width="640" height="390" fill="#fff" />

      {/* previous wall position, only shown on Rev B */}
      {rev === "B" && (
        <path d="M400 40V330" stroke="#9AA6B6" strokeWidth="1.5" strokeDasharray="5 4" fill="none" />
      )}

      {/* walls */}
      <g stroke={INK} fill="none" strokeLinecap="square">
        <rect x="40" y="40" width="560" height="290" strokeWidth="4" />
        <g strokeWidth="3">
          <path d="M210 40V200M210 246V330" />
          <path d="M40 175H210" />
          {rev === "A" ? (
            <path d="M400 40V330" />
          ) : (
            <path d="M450 40V118M450 154V330" />
          )}
        </g>
      </g>

      {/* door swings */}
      <g stroke="#7C899B" strokeWidth="1.3" fill="none">
        <path d="M210 200A46 46 0 0 1 256 246M210 246H256" />
        {rev === "B" && <path d="M450 118A36 36 0 0 0 414 154M450 154H414" />}
      </g>

      {/* room names */}
      <g fontSize="13" fontWeight="500" letterSpacing="0.4" fill={INK} fontFamily="inherit">
        <text x="60" y="70">ROOM 01</text>
        <text x="60" y="215">ROOM 02</text>
        <text x="232" y="70">ROOM 03</text>
        <text x={wallX + 22} y="70">ROOM 04</text>
      </g>

      {/* dimension of Room 03, the thing that changed */}
      <g stroke={rev === "B" ? MARKUP : "#5A677A"} strokeWidth="1.2" fill="none">
        <path d={`M210 358H${wallX}M210 352V364M${wallX} 352V364`} />
      </g>
      <text
        x={mid}
        y="351"
        fontSize="12"
        fontWeight={rev === "B" ? 600 : 400}
        textAnchor="middle"
        fill={rev === "B" ? MARKUP : "#5A677A"}
      >
        {rev === "B" ? "4,800" : "3,800"}
      </text>

      {rev === "B" && (
        <g>
          <path
            d={cloudPath(404, 92, 84, 96, 14)}
            fill={MARKUP}
            fillOpacity="0.07"
            stroke={MARKUP}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <polygon points="506,96 520,122 492,122" fill="#fff" stroke={MARKUP} strokeWidth="1.6" strokeLinejoin="round" />
          <text x="506" y="118" fontSize="11" fontWeight="600" textAnchor="middle" fill={MARKUP}>
            1
          </text>
          <polyline points="446,188 446,236 466,236" fill="none" stroke={MARKUP} strokeWidth="1.4" />
          <circle cx="446" cy="188" r="3" fill={MARKUP} />
          <rect x="466" y="212" width="124" height="48" fill={INK} />
          <text x="478" y="231" fontSize="11" fill={YELLOW}>
            Check the source
          </text>
          <text x="478" y="251" fontSize="14" fontWeight="600" fill="#fff">
            A-301
          </text>
        </g>
      )}
    </svg>
  );
}

export default function AdaptCompare() {
  const [pos, setPos] = useState(100);
  const touched = useRef(false);

  // One page-load moment: the sheet sweeps from Rev A to Rev B and stops
  // where the change is visible. Stops the instant the person takes over.
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setPos(38);
      return;
    }
    let raf = 0;
    const start = performance.now() + 700;
    const dur = 1800;
    const tick = (t: number) => {
      if (touched.current) return;
      const k = Math.min(1, Math.max(0, (t - start) / dur));
      setPos(100 - 62 * (1 - Math.pow(1 - k, 3)));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const take = () => {
    touched.current = true;
  };

  return (
    <figure>
      <div className="relative aspect-[640/390] select-none overflow-hidden bg-white shadow-[0_24px_50px_-24px_rgba(14,26,43,0.4)] ring-1 ring-[#0E1A2B]/10">
        <div className="absolute inset-0">
          <Plan rev="A" />
        </div>
        <div className="absolute inset-0" style={{ clipPath: `inset(0 0 0 ${pos}%)` }}>
          <Plan rev="B" />
        </div>

        <span
          style={{ color: "#fff" }}
          className="pointer-events-none absolute left-3 top-3 z-20 bg-[#0E1A2B] px-2.5 py-1 text-[13px] font-semibold"
        >
          Rev A
        </span>
        <span
          style={{ color: INK }}
          className="pointer-events-none absolute right-3 top-3 z-20 bg-[#F5C93C] px-2.5 py-1 text-[13px] font-semibold"
        >
          Rev B
        </span>

        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={Math.round(pos)}
          onChange={(e) => {
            take();
            setPos(Number(e.target.value));
          }}
          onPointerDown={take}
          onKeyDown={take}
          aria-label="Compare Rev A and Rev B of the drawing"
          className="peer absolute inset-0 z-30 m-0 h-full w-full cursor-ew-resize opacity-0"
          style={{ touchAction: "pan-y" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 z-20 peer-focus-visible:[&_.grip]:ring-4 peer-focus-visible:[&_.grip]:ring-[#0E1A2B]/40"
          style={{ left: `${pos}%` }}
        >
          <div className="absolute inset-y-0 w-0.5 -translate-x-1/2 bg-[#0E1A2B]" />
          <div className="grip absolute left-0 top-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#F5C93C] text-[#0E1A2B] shadow-md ring-2 ring-[#0E1A2B]">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 7l-5 5 5 5M16 7l5 5-5 5" />
            </svg>
          </div>
        </div>
      </div>

      <figcaption className="mt-8 max-w-[40rem]">
        <p className="text-[14px] font-medium text-[#5A677A]">One question, a defined outcome.</p>
        <h2 className="mt-1.5 text-[26px] font-semibold leading-tight tracking-[-0.02em] text-[#0E1A2B]">
          What changed in this drawing revision?
        </h2>
        <p className="mt-3 text-[16px] leading-relaxed text-[#3F4C5F]">
          Agree a drawing set, identify the evidence to compare and have a qualified reviewer check
          the findings. Measure the review effort and traceability before considering a wider
          rollout.
        </p>
        <p className="mt-4 text-[13px] text-[#5A677A]">
          Illustrative drawing, not for construction. Drag the sheet to compare.
        </p>
      </figcaption>
    </figure>
  );
}