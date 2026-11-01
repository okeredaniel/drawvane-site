"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Bricolage_Grotesque } from "next/font/google";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Real display font for the big type (the site's `font-display` was falling
// back to Arial). To use your own site font instead, delete this and the
// `${display.className}` bits below.
const display = Bricolage_Grotesque({ subsets: ["latin"], weight: ["500", "600"], display: "swap" });

// Only publish claims that are true for your product.
// Change the wording of any line here, for example if you don't have an audit yet.
// Claims land on the sheet in this order, alternating left and right.
const HEADING = [
  { w: "Your", grey: false },
  { w: "drawings", grey: false },
  { w: "stay", grey: true },
  { w: "yours.", grey: true },
];
const CLAIMS: { label: string; title: string }[] = [
  { label: "Audited", title: "Independent security audit" },
  { label: "Privacy", title: "Never trained on" },
  { label: "Access", title: "SSO and roles" },
  { label: "Encryption", title: "Encrypted always" },
  { label: "Sources", title: "Every answer cites its source" },
  { label: "Review", title: "People approve the numbers" },
];

// Where each claim "lands" on the sheet (800 x 560 drawing space), same order
// as CLAIMS.
const REGIONS = [
  { x: 516, y: 484, w: 248, h: 44 }, // title block
  { x: 34, y: 488, w: 214, h: 52 }, // notes
  { x: 104, y: 28, w: 612, h: 40 }, // grid bubbles
  { x: 96, y: 240, w: 648, h: 34 }, // level 2 slab
  { x: 504, y: 232, w: 140, h: 46 }, // dimension note
  { x: 96, y: 86, w: 648, h: 34 }, // roof slab
];

// Which grid cell each claim sits in on desktop: left, right, left, ...
const PLACE = [
  "md:col-start-1 md:row-start-1",
  "md:col-start-3 md:row-start-1",
  "md:col-start-1 md:row-start-2",
  "md:col-start-3 md:row-start-2",
  "md:col-start-1 md:row-start-3",
  "md:col-start-3 md:row-start-3",
];

const ACCENT = "#F5C93C";
const W = 800;
const H = 560;

// ---- Tune the motion here -------------------------------------------------
const SCROLL_LENGTH = "+=360%"; // how long the section stays pinned (desktop)
const BEAT = 0.75; // timeline length given to each claim
const HEAD_SCALE = 2.3; // how big the heading starts, as a multiple of its final size
// ---------------------------------------------------------------------------

/* ---------- the drawing sheet ---------- */

function Sheet() {
  const columns = [140, 330, 520, 710];
  const slabs = [
    { y: 96, h: 14 },
    { y: 250, h: 18 },
    { y: 396, h: 18 },
  ];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 size-full" aria-hidden>
      <defs>
        <pattern
          id="sec-hatch"
          width="7"
          height="7"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <line x1="0" y1="0" x2="0" y2="7" stroke="#a3a3a3" strokeWidth="1.2" />
        </pattern>
      </defs>

      <rect x="18" y="18" width="764" height="524" fill="none" stroke="#d4d4d4" />

      {columns.map((x, i) => (
        <g key={x}>
          <line x1={x} y1="68" x2={x} y2="480" stroke="#e5e5e5" strokeDasharray="6 5" />
          <circle cx={x} cy="48" r="13" fill="#fff" stroke="#a3a3a3" />
          <text x={x} y="52" textAnchor="middle" fontSize="12" fill="#737373">
            {"ABCD"[i]}
          </text>
        </g>
      ))}

      {columns.map((x) => (
        <rect key={x} x={x - 6} y="110" width="12" height="360" fill="#fff" stroke="#171717" strokeWidth="1.5" />
      ))}
      {slabs.map((s) => (
        <rect
          key={s.y}
          x="100"
          y={s.y}
          width="640"
          height={s.h}
          fill="url(#sec-hatch)"
          stroke="#171717"
          strokeWidth="1.5"
        />
      ))}
      <line x1="60" y1="470" x2="760" y2="470" stroke="#171717" strokeWidth="2" />

      <text x="40" y="504" fontSize="9" letterSpacing="1.5" fill="#a3a3a3">
        NOTES
      </text>
      {[120, 170, 140].map((w, i) => (
        <rect key={i} x="40" y={511 + i * 8} width={w} height="3" rx="1.5" fill="#e5e5e5" />
      ))}

      <line x1="612" y1="250" x2="612" y2="268" stroke="#171717" strokeWidth="1.2" />
      <line x1="606" y1="250" x2="618" y2="250" stroke="#171717" strokeWidth="1.2" />
      <line x1="606" y1="268" x2="618" y2="268" stroke="#171717" strokeWidth="1.2" />
      <text x="626" y="263" fontSize="11" fontWeight="600" fill="#171717">
        200
      </text>

      <rect x="520" y="486" width="240" height="40" fill="none" stroke="#171717" />
      <text x="534" y="512" fontSize="15" fontWeight="600" fill="#171717">
        S-301
      </text>
      <text x="596" y="511" fontSize="9" letterSpacing="1.5" fill="#737373">
        SLAB SECTIONS
      </text>

      {/* the highlight that lands where each claim points */}
      {REGIONS.map((r, i) => (
        <rect
          key={i}
          data-region
          x={r.x}
          y={r.y}
          width={r.w}
          height={r.h}
          rx="8"
          fill={ACCENT}
          fillOpacity="0.3"
          stroke={ACCENT}
          strokeWidth="2"
          opacity="0"
        />
      ))}

      {/* the seal: a yellow border that closes round the sheet, one sixth per claim */}
      <rect
        data-frame
        x="5"
        y="5"
        width="790"
        height="550"
        rx="26"
        fill="none"
        stroke={ACCENT}
        strokeWidth="6"
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray="1"
        strokeDashoffset="0"
      />
    </svg>
  );
}

/* ---------- section ---------- */

export default function Security() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const sec = root.current;
      if (!sec) return;
      const one = <T extends Element>(s: string) => sec.querySelector(s) as T;
      const all = <T extends Element>(s: string) => Array.from(sec.querySelectorAll<T>(s));

      const head = one<HTMLElement>("[data-head]");
      const h2 = one<HTMLElement>("[data-h2]");
      const words = all("[data-hw]");
      const sheet = one<HTMLElement>("[data-sheet]");
      const frame = one<SVGRectElement>("[data-frame]");
      const regions = all<SVGRectElement>("[data-region]");
      const claims = all<HTMLElement>("[data-claim]");
      const lines = all<HTMLElement>("[data-line]");
      const dots = all<HTMLElement>("[data-dot]");
      const N = claims.length;

      const mm = gsap.matchMedia();

      // The scene always plays. If the visitor's system is set to "reduce
      // motion" (`calm`), the same scroll-driven story runs but with no big
      // movement: no zoom, tilt or sliding, only fades and drawn lines.
      mm.add(
        {
          desktop: "(min-width: 768px)",
          phone: "(max-width: 767px)",
          calm: "(prefers-reduced-motion: reduce)",
        },
        (ctx) => {
          const { desktop, calm } = ctx.conditions as {
            desktop: boolean;
            phone: boolean;
            calm: boolean;
          };

          // --------------------------------------------------------------
          // Tablet and desktop: pinned.
          // The heading starts huge in the middle, shrinks, the sheet rises,
          // then the claims land on it one by one while a yellow seal closes
          // round the sheet.
          // --------------------------------------------------------------
          if (desktop) {
            gsap.set(frame, { strokeDashoffset: 1 });
            gsap.set(regions, { opacity: 0 });
            gsap.set(claims, (i: number) => ({ opacity: 0, x: calm ? 0 : i % 2 ? 44 : -44 }));
            gsap.set(lines, { scaleX: 0 });
            gsap.set(dots, { scale: 0 });

            if (!calm) {
              gsap.from(words, {
                yPercent: 118,
                duration: 1.2,
                ease: "power4.out",
                stagger: 0.09,
                scrollTrigger: { trigger: sec, start: "top 80%", once: true },
              });
            }

            const tl = gsap.timeline({
              defaults: { ease: "none" },
              scrollTrigger: {
                trigger: sec,
                start: "top top",
                end: SCROLL_LENGTH,
                pin: true,
                scrub: 0.6,
                anticipatePin: 1,
                invalidateOnRefresh: true,
              },
            });

            // 1. heading: from huge and centred to its place above the sheet
            if (!calm) {
              tl.fromTo(
                head,
                {
                  y: () => sec.clientHeight / 2 - (head.offsetTop + head.offsetHeight / 2),
                  scale: () =>
                    Math.min(HEAD_SCALE, (window.innerWidth * 0.86) / Math.max(h2.offsetWidth, 1)),
                  transformOrigin: "50% 50%",
                },
                { y: 0, scale: 1, duration: 1.4, ease: "power2.inOut" },
                0
              );
            }

            // 2. the sheet rises and settles flat
            tl.fromTo(
              sheet,
              calm
                ? { opacity: 0 }
                : { y: "50vh", opacity: 0, rotationX: 16, scale: 0.9, transformPerspective: 1400 },
              calm
                ? { opacity: 1, duration: 1.2 }
                : { y: 0, opacity: 1, rotationX: 0, scale: 1, duration: 1.2, ease: "power3.out" },
              0.5
            );

            // 3. one beat per claim
            const START = 1.6;
            claims.forEach((_, k) => {
              const s = START + k * BEAT;
              if (k > 0) tl.to(claims[k - 1], { opacity: 0.45, duration: 0.4 }, s);
              tl.to(claims[k], { opacity: 1, x: 0, duration: 0.5, ease: "power3.out" }, s)
                .to(lines[k], { scaleX: 1, duration: 0.35, ease: "power2.out" }, s + 0.2)
                .to(dots[k], { scale: 1, duration: 0.3, ease: "back.out(2.5)" }, s + 0.5)
                .to(regions[k], { opacity: 1, duration: 0.2 }, s + 0.4)
                .to(regions[k], { opacity: 0, duration: 0.3 }, s + 0.4 + BEAT)
                .to(frame, { strokeDashoffset: 1 - (k + 1) / N, duration: 0.5 }, s + 0.3);
            });

            // 4. everything comes back to full strength and the sheet settles
            const T = START + N * BEAT + 0.3;
            tl.to(claims, { opacity: 1, duration: 0.5 }, T);
            if (!calm) {
              tl.to(sheet, { scale: 1.025, duration: 0.25, ease: "power2.out" }, T + 0.4).to(
                sheet,
                { scale: 1, duration: 0.4, ease: "power2.inOut" },
                T + 0.65
              );
            }
            // pause at the end with everything in place
            tl.to({}, { duration: 1 }, T + 0.9);
            return;
          }

          // --------------------------------------------------------------
          // Phones: no pin. Claims rise in one by one; the seal closes as the
          // list goes past.
          // --------------------------------------------------------------
          const list = one<HTMLElement>("[data-list]");
          gsap.set(frame, { strokeDashoffset: 1 });

          if (!calm) {
            gsap.from(words, {
              yPercent: 118,
              duration: 1.1,
              ease: "power4.out",
              stagger: 0.09,
              scrollTrigger: { trigger: head, start: "top 88%", once: true },
            });
            gsap.from(sheet, {
              y: 50,
              opacity: 0,
              duration: 0.9,
              ease: "power3.out",
              scrollTrigger: { trigger: sheet, start: "top 88%", once: true },
            });
          }

          claims.forEach((li) => {
            gsap.from(li.children, {
              y: calm ? 0 : 34,
              opacity: 0,
              duration: 0.9,
              ease: "power3.out",
              stagger: 0.1,
              scrollTrigger: { trigger: li, start: "top 88%", once: true },
            });
          });

          gsap.to(frame, {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: { trigger: list, start: "top 75%", end: "bottom 65%", scrub: 0.5 },
          });
        }
      );
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      id="security"
      aria-label="Security"
      className="relative overflow-x-clip bg-background px-6 py-[110px] md:h-screen md:overflow-hidden md:px-0 md:py-0"
    >
      {/* faint drawing-sheet grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(15,23,42,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,23,42,0.05) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse 75% 65% at 50% 50%, #000 25%, transparent 85%)",
          WebkitMaskImage: "radial-gradient(ellipse 75% 65% at 50% 50%, #000 25%, transparent 85%)",
        }}
      />

      {/* heading and sheet sit together as one block, centred on the screen */}
      <div className="relative md:absolute md:inset-0 md:flex md:flex-col md:items-center md:justify-center md:gap-[3.5vh] md:px-12">
        <div data-head className="relative z-20 md:text-center">
          <h2
            data-h2
            className={`${display.className} text-[clamp(2.75rem,12vw,3.5rem)] font-medium leading-[0.98] tracking-[-0.05em] md:inline-block md:text-[clamp(1.9rem,3.3vw,3.4rem)] md:leading-[1.05]`}
          >
            {HEADING.map((h, i) => (
              <span
                key={i}
                className={`mr-[0.2em] inline-block overflow-hidden pb-[0.12em] align-bottom ${
                  h.grey ? "text-neutral-400" : "text-neutral-900"
                }`}
              >
                <span data-hw className="inline-block">
                  {h.w}
                </span>
              </span>
            ))}
          </h2>
        </div>

        {/* the claims left and right, the sheet in the middle */}
        <div
          data-list
          className="mt-12 grid grid-cols-1 gap-y-8 md:mt-0 md:h-[calc(min(40vw,92vh)*0.7)] md:grid-cols-[1fr_auto_1fr] md:grid-rows-[repeat(3,1fr)] md:gap-y-0"
        >
          {/* the sheet */}
          <div className="relative w-full md:col-start-2 md:row-span-3 md:row-start-1 md:w-[min(40vw,92vh)]">
            <div
              data-sheet
              className="relative aspect-[800/560] w-full rounded-[26px] border border-neutral-200 bg-white shadow-[0_40px_80px_-40px_rgba(15,23,42,0.4)]"
            >
              <Sheet />
            </div>
          </div>

          {/* the claims */}
          {CLAIMS.map((c, i) => {
            const left = i % 2 === 0;
            return (
              <div
                key={c.label}
                data-claim
                className={`flex items-center border-t border-neutral-300 pt-5 md:border-t-0 md:pt-0 ${PLACE[i]} ${
                  left ? "md:flex-row md:justify-end md:text-right" : "md:flex-row-reverse md:justify-end md:text-left"
                }`}
              >
                <div className="md:max-w-[19rem]">
                  <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-neutral-500 md:text-[13px]">
                    {c.label}
                  </p>
                  <h3
                    className={`${display.className} mt-2 text-[clamp(1.6rem,6vw,2rem)] font-medium leading-[1.02] tracking-[-0.04em] text-neutral-900 md:text-[clamp(1.2rem,1.95vw,2rem)]`}
                  >
                    {c.title}
                  </h3>
                </div>

                {/* leader: a hairline from the claim to the sheet, ending in a yellow dot */}
                <div
                  aria-hidden
                  className={`relative hidden h-px w-[clamp(36px,6vw,110px)] shrink-0 bg-transparent md:block ${
                    left ? "ml-5" : "mr-5"
                  }`}
                >
                  <span
                    data-line
                    className={`absolute inset-0 bg-neutral-400 ${left ? "origin-left" : "origin-right"}`}
                  />
                  <span
                    data-dot
                    className={`absolute top-1/2 size-[9px] -translate-y-1/2 rounded-full ${
                      left ? "right-0 translate-x-1/2" : "left-0 -translate-x-1/2"
                    }`}
                    style={{ backgroundColor: ACCENT }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}