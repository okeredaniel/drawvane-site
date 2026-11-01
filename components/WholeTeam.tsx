"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// ---- Tune the scene here ------------------------------------------------
// How long the section stays pinned. 1% = 1% of a screen of scrolling.
const SCROLL_LENGTH = "+=380%";
// The question that types itself out in beat 1.
const QUESTION = "Slab thickness at Level 2?";
const ANSWER = "200 mm · S-301, Note 4";
// -------------------------------------------------------------------------

const ACCENT = "#F5C93C";

// Everything on the sheet lives in one 800 x 560 coordinate space, so the
// chips, the lines and the drawing always line up at any size.
const W = 800;
const H = 560;
const NOTE = { x: 560, y: 259 }; // the spot on the slab the answer points to
const pct = (v: number, of: number) => `${((v / of) * 100).toFixed(2)}%`;

const ANSWER_CHIP = {
  x: 650,
  y: 150,
  path: "M560 259 C 585 215, 610 185, 650 150",
};

// The sources that snap in around the answer in beat 2.
const REFS = [
  {
    label: "Drawing",
    value: "A-102 · Rev C",
    x: 190,
    y: 120,
    from: -150,
    path: "M560 259 C 450 230, 300 150, 190 120",
  },
  {
    label: "Specification",
    value: "03 30 00",
    x: 650,
    y: 405,
    from: 150,
    path: "M560 259 C 585 320, 620 370, 650 405",
  },
  {
    label: "RFI",
    value: "047",
    x: 230,
    y: 452,
    from: -150,
    path: "M560 259 C 480 340, 340 420, 230 452",
  },
];

const STEPS = [
  {
    title: "Ask in plain language",
    text: "Type the question the way you would ask a colleague. A cited answer comes back in seconds.",
  },
  {
    title: "Check the source",
    text: "Every answer links to the drawing, spec and RFI behind it, so anyone on the team can verify it.",
  },
];

const CHIP_SHADOW = "shadow-[0_14px_30px_-14px_rgba(15,23,42,0.45)]";

/* ---------- the drawing sheet, all in SVG ---------- */

function Sheet() {
  const columns = [140, 330, 520, 710];
  const slabs = [
    { y: 96, label: "ROOF" },
    { y: 250, label: "LVL 2" },
    { y: 396, label: "LVL 1" },
  ];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="size-full" aria-hidden>
      <defs>
        <pattern
          id="wt-hatch"
          width="7"
          height="7"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <line x1="0" y1="0" x2="0" y2="7" stroke="#a3a3a3" strokeWidth="1.2" />
        </pattern>
      </defs>

      {/* sheet border */}
      <rect x="18" y="18" width="764" height="524" fill="none" stroke="#d4d4d4" />

      {/* grid lines and bubbles */}
      {columns.map((x, i) => (
        <g key={x}>
          <line x1={x} y1="64" x2={x} y2="480" stroke="#e5e5e5" strokeDasharray="6 5" />
          <circle cx={x} cy="48" r="13" fill="#fff" stroke="#a3a3a3" />
          <text x={x} y="52" textAnchor="middle" fontSize="12" fill="#737373">
            {"ABCD"[i]}
          </text>
        </g>
      ))}

      {/* columns, then slabs on top */}
      {columns.map((x) => (
        <rect key={x} x={x - 6} y="110" width="12" height="360" fill="#fff" stroke="#171717" strokeWidth="1.5" />
      ))}
      {slabs.map((s) => (
        <g key={s.label}>
          <rect
            x="100"
            y={s.y}
            width="640"
            height={s.y === 96 ? 14 : 18}
            fill="url(#wt-hatch)"
            stroke="#171717"
            strokeWidth="1.5"
          />
          <text x="28" y={s.y + 13} fontSize="10" letterSpacing="1.5" fill="#a3a3a3">
            {s.label}
          </text>
        </g>
      ))}

      {/* ground */}
      <line x1="60" y1="470" x2="760" y2="470" stroke="#171717" strokeWidth="2" />

      {/* notes block */}
      <text x="40" y="502" fontSize="9" letterSpacing="1.5" fill="#a3a3a3">
        NOTES
      </text>
      {[120, 170, 140, 90].map((w, i) => (
        <rect key={i} x="40" y={509 + i * 8} width={w} height="3" rx="1.5" fill="#e5e5e5" />
      ))}

      {/* title block */}
      <rect x="520" y="486" width="240" height="40" fill="none" stroke="#171717" />
      <text x="534" y="512" fontSize="15" fontWeight="600" fill="#171717">
        S-301
      </text>
      <text x="596" y="511" fontSize="9" letterSpacing="1.5" fill="#737373">
        SLAB SECTIONS
      </text>

      {/* the highlighted note: lights up in beat 1 */}
      <rect
        className="wt-hl"
        x="508"
        y="240"
        width="116"
        height="38"
        rx="6"
        fill={ACCENT}
        fillOpacity="0.3"
        stroke={ACCENT}
      />
      <circle
        className="wt-ring"
        cx={NOTE.x}
        cy={NOTE.y}
        r="26"
        fill="none"
        stroke={ACCENT}
        strokeWidth="2.5"
        pathLength={1}
      />
      <g className="wt-dim">
        <line x1="612" y1="250" x2="612" y2="268" stroke="#171717" strokeWidth="1.2" />
        <line x1="606" y1="250" x2="618" y2="250" stroke="#171717" strokeWidth="1.2" />
        <line x1="606" y1="268" x2="618" y2="268" stroke="#171717" strokeWidth="1.2" />
        <text x="626" y="263" fontSize="11" fontWeight="600" fill="#171717">
          200
        </text>
      </g>
    </svg>
  );
}

export default function WholeTeam() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const one = (s: string) => q(s)[0] as HTMLElement;
      const all = (s: string) => q(s) as HTMLElement[];
      const mm = gsap.matchMedia();

      // ------------------------------------------------------------------
      // Tablet and desktop: pinned, two beats driven by scroll.
      // Beat 1: the question types, the note lights up, the answer pins.
      // Beat 2: the sheet zooms into that note and the sources snap in.
      // ------------------------------------------------------------------
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const stage = one(".wt-stage");
        const camera = one(".wt-camera");
        const qbubble = one(".wt-qbubble");
        const qtext = one(".wt-qtext");
        const hl = one(".wt-hl");
        const ring = one(".wt-ring");
        const dim = one(".wt-dim");
        const lineA = one(".wt-line-a");
        const answer = one(".wt-answer");
        const refs = all(".wt-ref");
        const refLines = all(".wt-line-r");
        const steps = all(".wt-step");
        const progress = one(".wt-progress");

        const typed = { n: 0 };
        qtext.textContent = "";

        // starting state (the markup itself shows the finished state, so
        // phones and reduced motion need nothing)
        gsap.set(stage, {
          transformPerspective: 1400,
          rotationY: -16,
          rotationX: 8,
          scale: 0.92,
          y: 30,
          opacity: 0.25,
        });
        gsap.set(camera, { transformOrigin: `${pct(NOTE.x, W)} ${pct(NOTE.y, H)}` });
        gsap.set(qbubble, { opacity: 0, y: 14 });
        gsap.set(hl, { scaleX: 0, transformOrigin: "0% 50%" });
        gsap.set([ring, lineA, ...refLines], { strokeDasharray: 1, strokeDashoffset: 1 });
        gsap.set(dim, { opacity: 0 });
        gsap.set(answer, { opacity: 0, scale: 0.6 });
        refs.forEach((r, i) => gsap.set(r, { opacity: 0, x: REFS[i].from }));
        gsap.set(steps[1], { opacity: 0.3 });
        gsap.set(progress, { scaleY: 0, transformOrigin: "50% 0%" });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: SCROLL_LENGTH,
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        tl
          // the sheet swings up into view
          .to(
            stage,
            { rotationY: -7, rotationX: 3, scale: 1, y: 0, opacity: 1, duration: 1, ease: "power2.out" },
            0
          )
          // BEAT 1 · ask
          .to(qbubble, { opacity: 1, y: 0, duration: 0.5 }, 1)
          .to(
            typed,
            {
              n: QUESTION.length,
              duration: 1.3,
              onUpdate: () => {
                qtext.textContent = QUESTION.slice(0, Math.round(typed.n));
              },
            },
            1.4
          )
          .to(hl, { scaleX: 1, duration: 0.7 }, 2.9)
          .to(ring, { strokeDashoffset: 0, duration: 0.7 }, 2.9)
          .to(dim, { opacity: 1, duration: 0.4 }, 3.4)
          .to(lineA, { strokeDashoffset: 0, duration: 0.6 }, 3.7)
          .to(answer, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" }, 4.2)
          // hand over to step two
          .to(steps[0], { opacity: 0.3, duration: 0.5 }, 5.2)
          .to(steps[1], { opacity: 1, duration: 0.5 }, 5.2)
          .to(qbubble, { opacity: 0, y: -10, duration: 0.5 }, 5.2)
          // BEAT 2 · check: zoom into the note, then the sources arrive
          .to(camera, { scale: 1.55, duration: 1.6, ease: "power2.inOut" }, 5.2);

        refs.forEach((r, i) => {
          tl.to(r, { x: 0, opacity: 1, duration: 0.9, ease: "power3.out" }, 6.4 + i * 0.5).to(
            refLines[i],
            { strokeDashoffset: 0, duration: 0.5 },
            7.1 + i * 0.5
          );
        });

        // progress line fills across the whole scene, then a short hold
        tl.to(progress, { scaleY: 1, duration: 10 }, 0).to({}, { duration: 1.4 }, 8.6);

        return () => {
          qtext.textContent = QUESTION;
        };
      });

      // ------------------------------------------------------------------
      // Phones: no pin. The finished sheet just rises into place.
      // ------------------------------------------------------------------
      mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.from(one(".wt-stage"), {
          y: 50,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: one(".wt-stage"), start: "top 88%" },
        });
      });
    },
    { scope: root }
  );

  return (
    <section
      id="team"
      ref={root}
      className="relative overflow-hidden bg-background px-6 py-20 md:h-screen md:px-12 md:py-0 lg:px-24"
    >
      {/* faint drawing-sheet grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(15,23,42,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,23,42,0.05) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse 80% 70% at 60% 50%, #000 25%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 60% 50%, #000 25%, transparent 80%)",
        }}
      />

      <div className="relative mx-auto grid max-w-[1400px] items-center gap-14 md:h-full md:grid-cols-[0.8fr_1.2fr] md:gap-8">
        {/* left: headline and the two steps */}
        <div className="md:pr-6">
          <h2 className="font-display text-[40px] font-medium leading-[0.98] tracking-[-0.05em] md:text-[clamp(2.5rem,4.2vw,4rem)]">
            <span className="block text-neutral-900">Built for the whole team</span>
            <span className="block text-neutral-400">Answers everyone can check</span>
          </h2>

          <div className="relative mt-10 pl-6 md:mt-14">
            <div className="absolute bottom-1 left-0 top-1 w-[2px] bg-neutral-200">
              <div className="wt-progress size-full" style={{ backgroundColor: ACCENT }} />
            </div>
            <ol className="space-y-8">
              {STEPS.map((s) => (
                <li key={s.title} className="wt-step">
                  <h3 className="text-2xl font-medium tracking-tight text-neutral-900 md:text-[28px]">
                    {s.title}
                  </h3>
                  <p className="mt-2 max-w-[26rem] text-lg leading-snug text-neutral-500">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* right: the sheet */}
        <div className="relative mx-auto w-full max-w-[780px]">
          <div className="wt-stage relative aspect-[800/560] w-full">
            {/* grounding shadow */}
            <div
              aria-hidden
              className="absolute inset-x-10 -bottom-5 h-10 rounded-full bg-neutral-900/20 blur-2xl"
            />

            {/* the card; the camera inside it zooms in beat 2 */}
            <div className="absolute inset-0 overflow-hidden rounded-[28px] border border-neutral-200 bg-white shadow-[0_30px_70px_-30px_rgba(15,23,42,0.35)]">
              <div className="wt-camera absolute inset-0 will-change-transform">
                <Sheet />
              </div>
            </div>

            {/* leader lines, in the same coordinate space as the sheet */}
            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="pointer-events-none absolute inset-0 z-10 size-full overflow-visible"
              aria-hidden
            >
              <path
                className="wt-line-a"
                d={ANSWER_CHIP.path}
                pathLength={1}
                fill="none"
                stroke="#171717"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              {REFS.map((r) => (
                <path
                  key={r.value}
                  className="wt-line-r"
                  d={r.path}
                  pathLength={1}
                  fill="none"
                  stroke="#171717"
                  strokeOpacity="0.55"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              ))}
            </svg>

            {/* the question */}
            <div
              className={`wt-qbubble absolute left-[4%] top-[12.5%] z-20 rounded-2xl rounded-bl-sm border border-neutral-200 bg-white px-4 py-2.5 text-[11px] font-medium text-neutral-800 md:text-sm ${CHIP_SHADOW}`}
            >
              <span className="wt-qtext">{QUESTION}</span>
            </div>

            {/* the answer */}
            <div
              className="wt-answer absolute z-20"
              style={{ left: pct(ANSWER_CHIP.x, W), top: pct(ANSWER_CHIP.y, H) }}
            >
              <div
                className={`-translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full px-4 py-2 text-[10px] font-semibold text-black md:text-sm ${CHIP_SHADOW}`}
                style={{ backgroundColor: ACCENT }}
              >
                {ANSWER}
              </div>
            </div>

            {/* the sources */}
            {REFS.map((r) => (
              <div
                key={r.value}
                className="wt-ref absolute z-20"
                style={{ left: pct(r.x, W), top: pct(r.y, H) }}
              >
                <div
                  className={`-translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-xl border border-neutral-200 bg-white px-3 py-2 ${CHIP_SHADOW}`}
                >
                  <p className="text-[9px] uppercase tracking-[0.12em] text-neutral-400 md:text-[10px]">
                    {r.label}
                  </p>
                  <p className="text-[11px] font-medium text-neutral-900 md:text-sm">{r.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}