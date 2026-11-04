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

// The three features. Each one plays a small drawn demo on the sheet, so no
// images are needed. The descriptions for items 2 and 3 are placeholders:
// replace them with your own copy.
const ITEMS = [
  { title: "Flag conflicts", text: "Plans checked against specs, in context." },
  { title: "Compare revisions", text: "See exactly what changed between two sets." },
  { title: "Measure takeoffs", text: "Quantities pulled straight from the drawings." },
];

// The strip of references that scrolls across the page.
const REFS = ["Sheet A-301", "Spec 09 51 00", "RFI-042"];

// ILLUSTRATIVE EXAMPLE: the sheet numbers and dollar amounts below are made up.
// Replace them with a real example from your product before publishing.
const STEPS = [
  {
    title: "A revision is issued",
    text: "Sheet A-301 lowers the corridor ceiling from 9'-0\" to 8'-6\".",
  },
  {
    title: "The evidence is found",
    text: "The change also shows up in spec 09 51 00 and in RFI-042, each linked to its page.",
  },
  {
    title: "The scope is traced",
    text: "Four floors are affected: ceiling grid, light fixtures and sprinkler drops.",
  },
  {
    title: "A person decides",
    text: "The estimator reviews the numbers and approves or adjusts them.",
  },
];

// Amounts are numbers so they can count up. They add up to TOTAL.
const COSTS = [
  { label: "Ceiling grid and tile rework", amount: 18400 },
  { label: "Light fixture relocation", amount: 9600 },
  { label: "Sprinkler drop adjustments", amount: 6200 },
  { label: "Review and coordination", amount: 2800 },
];
const TOTAL = COSTS.reduce((sum, c) => sum + c.amount, 0);
const money = (n: number) => `$${n.toLocaleString("en-US")}`;

const ACCENT = "#F5C93C";
const W = 800;
const H = 560;

// ---- Tune the motion here -------------------------------------------------
const AUTO_SECONDS = 6; // how long each feature plays before the next one starts
const MARQUEE_SECONDS = 30; // time for the reference strip to scroll one full set
// The view of the sheet for each feature (x y width height, same 800 x 560 space).
const VIEWS = ["100 140 600 420", "0 0 800 560", "80 100 640 448"];
// ---------------------------------------------------------------------------

/* ---------- the drawing sheet, with one demo layer per feature ---------- */

function Stage() {
  const columns = [140, 330, 520, 710];
  const slabs = [
    { y: 96, h: 14 },
    { y: 250, h: 18 },
    { y: 396, h: 18 },
  ];
  return (
    <svg
      data-svg
      viewBox={VIEWS[0]}
      className="absolute inset-0 size-full"
      aria-hidden
    >
      <defs>
        <pattern id="ft-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="7" stroke="#a3a3a3" strokeWidth="1.2" />
        </pattern>
        <clipPath id="ft-clip">
          <rect data-clip x="0" y="0" width="0" height={H} />
        </clipPath>
      </defs>

      {/* the drawing */}
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
        <rect key={s.y} x="100" y={s.y} width="640" height={s.h} fill="url(#ft-hatch)" stroke="#171717" strokeWidth="1.5" />
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

      {/* feature 1: a note on the drawing disagrees with the spec */}
      <g data-scene>
        <rect
          data-s0-region
          x="500"
          y="232"
          width="150"
          height="46"
          rx="8"
          fill={ACCENT}
          fillOpacity="0.3"
          stroke={ACCENT}
          strokeWidth="2.5"
        />
        <g data-s0-panel>
          <rect x="120" y="296" width="200" height="84" rx="8" fill="#fff" stroke="#171717" strokeWidth="1.5" />
          <text x="136" y="320" fontSize="10" letterSpacing="1.5" fill="#737373">
            SPEC 03 30 00
          </text>
          <text x="136" y="342" fontSize="12" fill="#171717">
            Slab thickness
          </text>
          <text x="136" y="368" fontSize="22" fontWeight="600" fill="#171717">
            150 mm
          </text>
        </g>
        <path
          data-s0-line
          d="M500 258 C 430 258, 380 330, 320 338"
          pathLength={1}
          fill="none"
          stroke="#171717"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="1"
        />
        <g data-s0-mark>
          <circle cx="410" cy="297" r="15" fill={ACCENT} stroke="#171717" strokeWidth="1.5" />
          <text x="410" y="304" textAnchor="middle" fontSize="20" fontWeight="700" fill="#171717">
            ≠
          </text>
        </g>
      </g>

      {/* feature 2: a scan line sweeps across and the changes appear behind it */}
      <g data-scene>
        <g clipPath="url(#ft-clip)">
          <rect
            x="96"
            y="236"
            width="648"
            height="46"
            rx="14"
            fill={ACCENT}
            fillOpacity="0.25"
            stroke={ACCENT}
            strokeWidth="3"
            strokeDasharray="10 7"
          />
          <rect
            x="496"
            y="380"
            width="170"
            height="56"
            rx="14"
            fill={ACCENT}
            fillOpacity="0.25"
            stroke={ACCENT}
            strokeWidth="3"
            strokeDasharray="10 7"
          />
          <rect
            x="96"
            y="82"
            width="300"
            height="42"
            rx="14"
            fill={ACCENT}
            fillOpacity="0.25"
            stroke={ACCENT}
            strokeWidth="3"
            strokeDasharray="10 7"
          />
        </g>
        <g data-s1-scan>
          <line x1="0" y1="0" x2="0" y2={H} stroke="#171717" strokeWidth="2" />
          <circle cx="0" cy="280" r="9" fill="#fff" stroke="#171717" strokeWidth="2" />
        </g>
      </g>

      {/* feature 3: a measurement is drawn and the length counts up */}
      <g data-scene>
        <line data-s2-tick x1="100" y1="282" x2="100" y2="322" stroke="#171717" strokeWidth="3" strokeLinecap="round" />
        <line data-s2-tick x1="740" y1="282" x2="740" y2="322" stroke="#171717" strokeWidth="3" strokeLinecap="round" />
        <path
          data-s2-line
          d="M100 302H740"
          pathLength={1}
          fill="none"
          stroke={ACCENT}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray="1"
        />
        <g data-s2-label>
          <rect x="340" y="326" width="160" height="62" rx="10" fill="#fff" stroke="#171717" strokeWidth="1.5" />
          <text x="420" y="350" textAnchor="middle" fontSize="10" letterSpacing="1.5" fill="#737373">
            SLAB EDGE
          </text>
          <text data-s2-n x="420" y="376" textAnchor="middle" fontSize="24" fontWeight="600" fill="#171717">
            38.4 m
          </text>
        </g>
      </g>
    </svg>
  );
}

/* ---------- section ---------- */

export default function Features() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const sec = root.current;
      if (!sec) return;
      const one = <T extends Element>(s: string) => sec.querySelector(s) as T;
      const all = <T extends Element>(s: string) => Array.from(sec.querySelectorAll<T>(s));
      const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const loop = !calm; // endless loops only when motion is welcome
      const cleanups: Array<() => void> = [];

      /* ============================================================ */
      /* 1. Heading                                                    */
      /* ============================================================ */
      if (!calm) {
        gsap.from(all("[data-hw]"), {
          yPercent: 118,
          duration: 1.2,
          ease: "power4.out",
          stagger: 0.09,
          scrollTrigger: { trigger: one("[data-h2]"), start: "top 85%", once: true },
        });
        gsap.fromTo(
          all("[data-hline]")[1],
          { x: "-4vw" },
          {
            x: "4vw",
            ease: "none",
            scrollTrigger: { trigger: one("[data-h2]"), start: "top 90%", end: "bottom 10%", scrub: 0.6 },
          }
        );
      }

      /* ============================================================ */
      /* 2. The feature demo: plays on its own, click to jump           */
      /* ============================================================ */
      const block = one<HTMLElement>("[data-features]");
      const rows = all<HTMLElement>("[data-row]");
      const titles = all<HTMLElement>("[data-rtitle]");
      const descs = all<HTMLElement>("[data-rdesc]");
      const bars = all<HTMLElement>("[data-bar]");
      const svg = one<SVGSVGElement>("[data-svg]");
      const scenes = all<SVGGElement>("[data-scene]");
      const floater = one<HTMLElement>("[data-float]");
      const N = rows.length;

      // scene 0 (conflict)
      const s0 = {
        region: one("[data-s0-region]"),
        panel: one("[data-s0-panel]"),
        line: one("[data-s0-line]"),
        mark: one("[data-s0-mark]"),
      };
      // scene 1 (compare)
      const clipRect = one<SVGRectElement>("[data-clip]");
      const scan = one<SVGGElement>("[data-s1-scan]");
      // scene 2 (measure)
      const s2 = {
        line: one("[data-s2-line]"),
        ticks: all("[data-s2-tick]"),
        label: one("[data-s2-label]"),
        n: one<SVGTextElement>("[data-s2-n]"),
      };

      const scene0 = () => {
        gsap.set([s0.region, s0.panel, s0.mark], { opacity: 0 });
        gsap.set(s0.line, { strokeDashoffset: 1, opacity: 1 });
        const tl = gsap.timeline();
        tl.to(s0.region, { opacity: 1, duration: 0.5 }, 0.4)
          .fromTo(s0.panel, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.7, ease: "power3.out" }, 0.8)
          .to(s0.line, { strokeDashoffset: 0, duration: 0.8, ease: "power2.inOut" }, 1.4)
          .fromTo(
            s0.mark,
            { opacity: 0, scale: 0, svgOrigin: "410 297" },
            { opacity: 1, scale: 1, svgOrigin: "410 297", duration: 0.5, ease: "back.out(2.5)" },
            2.1
          );
        if (loop) {
          tl.to(s0.mark, { scale: 1.2, svgOrigin: "410 297", duration: 0.7, yoyo: true, repeat: -1, ease: "sine.inOut" }, 2.7);
          tl.to(s0.region, { fillOpacity: 0.12, duration: 0.9, yoyo: true, repeat: -1, ease: "sine.inOut" }, 2.7);
        }
        return tl;
      };

      const scene1 = () => {
        const o = { x: calm ? W : 0 };
        const render = () => {
          clipRect.setAttribute("width", String(o.x));
          scan.setAttribute("transform", `translate(${o.x} 0)`);
        };
        render();
        const tw = gsap.to(o, {
          x: W,
          duration: 3.8,
          ease: "sine.inOut",
          repeat: loop ? -1 : 0,
          yoyo: true,
          onUpdate: render,
        });
        return tw;
      };

      const scene2 = () => {
        const o = { n: 0 };
        const reset = () => {
          o.n = 0;
          s2.n.textContent = "0.0 m";
          gsap.set(s2.line, { strokeDashoffset: 1, opacity: 1 });
          gsap.set(s2.ticks, { opacity: 0 });
          gsap.set(s2.label, { opacity: 0 });
        };
        reset();
        const tl = gsap.timeline({ repeat: loop ? -1 : 0, repeatDelay: 0.6, onRepeat: reset });
        tl.to(s2.ticks, { opacity: 1, duration: 0.3, stagger: 0.1 }, 0.3)
          .to(s2.line, { strokeDashoffset: 0, duration: 1, ease: "power2.inOut" }, 0.5)
          .to(s2.label, { opacity: 1, duration: 0.3 }, 1.2)
          .to(
            o,
            {
              n: 38.4,
              duration: 1.3,
              ease: "power2.out",
              onUpdate: () => {
                s2.n.textContent = `${o.n.toFixed(1)} m`;
              },
            },
            1.2
          );
        if (loop) {
          tl.to([s2.line, s2.ticks, s2.label], { opacity: 0, duration: 0.4 }, "+=1.8");
        }
        return tl;
      };

      const SCENES = [scene0, scene1, scene2];

      let cur = 0;
      let sceneAnim: gsap.core.Animation | null = null;
      let auto: gsap.core.Tween | null = null;
      let hovering = false;
      let visible = false;

      const applyPause = () => {
        const p = hovering || !visible;
        auto?.paused(p);
        sceneAnim?.paused(p);
      };

      const startAuto = () => {
        auto?.kill();
        gsap.set(bars, { scaleX: 0 });
        if (!loop) return;
        auto = gsap.fromTo(
          bars[cur],
          { scaleX: 0 },
          { scaleX: 1, duration: AUTO_SECONDS, ease: "none", onComplete: () => go((cur + 1) % N) }
        );
        applyPause();
      };

      const paintRows = (i: number, instant: boolean) => {
        const d = instant ? 0 : 0.5;
        rows.forEach((_, k) => {
          const open = k === i;
          gsap.to(titles[k], { color: open ? "#171717" : "#a3a3a3", duration: d });
          gsap.to(descs[k], { height: open ? "auto" : 0, opacity: open ? 1 : 0, duration: d, ease: "power3.out" });
        });
        scenes.forEach((s, k) => gsap.to(s, { opacity: k === i ? 1 : 0, duration: d, overwrite: true }));
        gsap.to(svg, { attr: { viewBox: VIEWS[i] }, duration: instant || calm ? 0 : 1.1, ease: "power3.inOut" });
      };

      const go = (i: number) => {
        cur = i;
        sceneAnim?.kill();
        paintRows(i, false);
        sceneAnim = SCENES[i]();
        startAuto();
        applyPause();
      };

      // starting state: first feature open, nothing playing until it is in view
      paintRows(0, true);
      let started = false;

      ScrollTrigger.create({
        trigger: block,
        start: "top 85%",
        end: "bottom 10%",
        onToggle: (self) => {
          visible = self.isActive;
          if (visible && !started) {
            started = true;
            sceneAnim = SCENES[0]();
            startAuto();
          }
          applyPause();
        },
      });

      rows.forEach((row, i) => {
        const onClick = () => {
          if (i !== cur) go(i);
        };
        row.addEventListener("click", onClick);
        cleanups.push(() => row.removeEventListener("click", onClick));
      });
      const onEnter = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        hovering = true;
        applyPause();
      };
      const onLeave = () => {
        hovering = false;
        applyPause();
      };
      block.addEventListener("pointerenter", onEnter);
      block.addEventListener("pointerleave", onLeave);
      cleanups.push(() => {
        block.removeEventListener("pointerenter", onEnter);
        block.removeEventListener("pointerleave", onLeave);
      });

      if (!calm) {
        // entrance
        gsap.from(rows, {
          y: 44,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: { trigger: block, start: "top 82%", once: true },
        });
        gsap.from(one("[data-stagebox]"), {
          y: 70,
          opacity: 0,
          rotationX: 14,
          transformPerspective: 1400,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: { trigger: block, start: "top 78%", once: true },
        });
        // the sheet floats gently the whole time
        gsap.to(floater, { y: -9, duration: 3.4, ease: "sine.inOut", yoyo: true, repeat: -1 });
      }

      /* ============================================================ */
      /* 3. The reference strip: scrolls forever, speeds up and leans   */
      /*    with the page scroll                                        */
      /* ============================================================ */
      const track = one<HTMLElement>("[data-track]");
      // The strip always moves. With "reduce motion" on it runs at half speed
      // and skips the speed-up and lean that follow the page scroll.
      const drift = gsap.to(track, {
        xPercent: -50,
        duration: calm ? MARQUEE_SECONDS * 2 : MARQUEE_SECONDS,
        ease: "none",
        repeat: -1,
      });
      if (!calm) {
        const skewTo = gsap.quickTo(track, "skewX", { duration: 0.5, ease: "power3.out" });
        ScrollTrigger.create({
          trigger: one("[data-marquee]"),
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            const v = self.getVelocity();
            drift.timeScale(Math.max(drift.timeScale(), 1 + Math.min(7, Math.abs(v) / 380)));
            skewTo(gsap.utils.clamp(-9, 9, v / -260));
          },
        });
        const decay = () => {
          const t = drift.timeScale();
          if (t > 1) drift.timeScale(Math.max(1, t * 0.95));
        };
        gsap.ticker.add(decay);
        const onEnd = () => skewTo(0);
        ScrollTrigger.addEventListener("scrollEnd", onEnd);
        cleanups.push(() => {
          gsap.ticker.remove(decay);
          ScrollTrigger.removeEventListener("scrollEnd", onEnd);
        });
      }

      /* ============================================================ */
      /* 4. One revision, traced end to end                             */
      /* ============================================================ */
      const steps = all<HTMLElement>("[data-step]");
      const nodes = all<HTMLElement>("[data-node]");
      const list = one<HTMLElement>("[data-steps]");
      const fill = one<HTMLElement>("[data-rail-fill]");
      const pulse = one<HTMLElement>("[data-pulse]");

      if (!calm) {
        gsap.fromTo(
          fill,
          { scaleY: 0 },
          {
            scaleY: 1,
            transformOrigin: "50% 0%",
            ease: "none",
            scrollTrigger: { trigger: list, start: "top 65%", end: "bottom 65%", scrub: 0.5 },
          }
        );

        steps.forEach((li, i) => {
          gsap.set(li.querySelectorAll("[data-sbody]"), { opacity: 0.28, y: 18 });
          ScrollTrigger.create({
            trigger: li,
            start: "top 68%",
            onEnter: () => {
              gsap.to(li.querySelectorAll("[data-sbody]"), { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.08 });
              gsap.to(nodes[i], { backgroundColor: ACCENT, borderColor: ACCENT, scale: 1.25, duration: 0.5, ease: "back.out(2.5)" });
            },
            onLeaveBack: () => {
              gsap.to(li.querySelectorAll("[data-sbody]"), { opacity: 0.28, y: 18, duration: 0.5 });
              gsap.to(nodes[i], { backgroundColor: "#ffffff", borderColor: "#d4d4d4", scale: 1, duration: 0.4 });
            },
          });
        });

        // a pulse of light keeps running down the rail
        gsap
          .timeline({ repeat: -1, repeatDelay: 0.5 })
          .fromTo(pulse, { top: "0%", opacity: 0 }, { top: "100%", opacity: 1, duration: 3.4, ease: "power1.inOut" })
          .to(pulse, { opacity: 0, duration: 0.4 }, "-=0.4");
      } else {
        gsap.set(fill, { scaleY: 1, transformOrigin: "50% 0%" });
        gsap.set(nodes, { backgroundColor: ACCENT, borderColor: ACCENT });
        gsap.set(pulse, { opacity: 0 });
      }

      /* ============================================================ */
      /* 5. The ledger                                                  */
      /* ============================================================ */
      const ledger = one<HTMLElement>("[data-ledger]");
      const rowsL = all<HTMLElement>("[data-lrow]");
      const totalEl = one<HTMLElement>("[data-total]");
      const blink = one<HTMLElement>("[data-blink]");

      if (!calm) {
        totalEl.textContent = money(0);
        rowsL.forEach((li, i) => {
          const leader = li.querySelector("[data-leader]");
          const label = li.querySelector("[data-llabel]");
          const amt = li.querySelector<HTMLElement>("[data-amt]")!;
          const target = Number(amt.dataset.value);
          const o = { n: 0 };
          amt.textContent = money(0);
          const tl = gsap.timeline({
            scrollTrigger: { trigger: ledger, start: "top 72%", once: true },
            delay: 0.15 + i * 0.12,
          });
          tl.from(label, { x: -24, opacity: 0, duration: 0.7, ease: "power3.out" }, 0)
            .fromTo(leader, { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: "power3.inOut" }, 0.1)
            .to(
              o,
              {
                n: target,
                duration: 1.4,
                ease: "power3.out",
                onUpdate: () => {
                  amt.textContent = money(Math.round(o.n));
                },
              },
              0.2
            );
        });

        const t = { n: 0 };
        gsap.to(t, {
          n: TOTAL,
          duration: 2.1,
          ease: "power3.out",
          delay: 0.7,
          onUpdate: () => {
            totalEl.textContent = money(Math.round(t.n));
          },
          scrollTrigger: { trigger: ledger, start: "top 72%", once: true },
        });

        // the "awaiting approval" light keeps blinking
        gsap.to(blink, { opacity: 0.15, duration: 0.8, ease: "sine.inOut", yoyo: true, repeat: -1 });
      }

      return () => cleanups.forEach((fn) => fn());
    },
    { scope: root }
  );

  const headingLines = [["Precision", "search"], ["Every", "clause,", "every", "sheet"]];

  return (
    <section
      ref={root}
      id="features"
      className="relative overflow-x-clip bg-background px-6 py-[110px] md:px-24 md:py-[170px]"
    >
      {/* ---------------- heading ---------------- */}
      <h2
        data-h2
        className={`${display.className} text-[clamp(2.75rem,7.4vw,7.75rem)] font-medium leading-[0.93] tracking-[-0.055em]`}
      >
        {headingLines.map((line, li) => (
          <span key={li} data-hline className={`block ${li === 1 ? "text-neutral-400" : "text-neutral-900"}`}>
            {line.map((w, wi) => (
              <span key={wi} className="mr-[0.2em] inline-block overflow-hidden pb-[0.12em] align-bottom">
                <span data-hw className="inline-block">
                  {w}
                </span>
              </span>
            ))}
          </span>
        ))}
      </h2>

      {/* ---------------- the demo ---------------- */}
      <div
        data-features
        className="mt-20 grid items-start gap-14 md:mt-28 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20"
      >
        <ul role="tablist" aria-label="Features">
          {ITEMS.map((item, i) => (
            <li
              key={item.title}
              className={`relative border-t border-neutral-300 ${i === ITEMS.length - 1 ? "border-b" : ""}`}
            >
              <button
                type="button"
                data-row
                role="tab"
                aria-selected={i === 0}
                className="block w-full py-7 text-left outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/30 md:py-9"
              >
                <span
                  data-rtitle
                  className={`${display.className} block text-[clamp(2.1rem,3.6vw,3.6rem)] font-medium leading-[1] tracking-[-0.05em] text-neutral-900`}
                >
                  {item.title}
                </span>
                <span data-rdesc className="block overflow-hidden">
                  <span className="mt-4 block max-w-[24rem] text-[clamp(1.05rem,1.4vw,1.3rem)] leading-snug text-neutral-500">
                    {item.text}
                  </span>
                </span>
              </button>
              {/* fills over the time the feature plays, then the next one starts */}
              <span
                aria-hidden
                data-bar
                className="absolute bottom-[-1px] left-0 h-[2px] w-full origin-left"
                style={{ backgroundColor: ACCENT, transform: "scaleX(0)" }}
              />
            </li>
          ))}
        </ul>

        <div data-stagebox role="tabpanel" aria-label="Feature demo" className="relative">
          <div data-float>
            <div className="relative aspect-[800/560] w-full overflow-hidden rounded-[24px] border border-neutral-200 bg-white shadow-[0_30px_70px_-40px_rgba(15,23,42,0.35)]">
              <Stage />
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- the reference strip ---------------- */}
      <div
        data-marquee
        className="-mx-6 mt-24 overflow-hidden border-y border-neutral-200 py-6 md:-mx-24 md:mt-36 md:py-8"
        aria-hidden
      >
        <div data-track className="flex w-max whitespace-nowrap will-change-transform">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center">
              {REFS.map((r, i) => (
                <div key={r} className="flex items-center">
                  <span
                    className={`${display.className} px-8 text-[clamp(3rem,9vw,9rem)] font-medium leading-none tracking-[-0.055em] md:px-12 ${
                      i % 2 ? "text-neutral-300" : "text-neutral-900"
                    }`}
                  >
                    {r}
                  </span>
                  <span className="size-[clamp(12px,1.4vw,20px)] rounded-full" style={{ backgroundColor: ACCENT }} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ---------------- one revision, traced ---------------- */}
      <div className="mt-24 grid gap-14 md:mt-36 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <h3
            className={`${display.className} text-[clamp(2.25rem,4.4vw,4.5rem)] font-medium leading-[0.98] tracking-[-0.05em] text-neutral-900`}
          >
            One revision, traced end to end
          </h3>
          <p className="mt-5 max-w-[24rem] text-[clamp(1.05rem,1.4vw,1.3rem)] leading-snug text-neutral-500">
            See what changed, where it shows up, and what it costs.
          </p>
        </div>

        <div className="relative">
          {/* the rail: a grey line that fills yellow as you read, with a light always running down it */}
          <div aria-hidden className="absolute bottom-2 left-[5px] top-2 w-px bg-neutral-200">
            <div data-rail-fill className="size-full" style={{ backgroundColor: ACCENT, transform: "scaleY(0)" }} />
          </div>
          <div aria-hidden className="absolute bottom-[19px] left-0 top-2 w-[11px]">
            <span
              data-pulse
              className="absolute left-1/2 size-[11px] -translate-x-1/2 rounded-full opacity-0"
              style={{ backgroundColor: ACCENT, boxShadow: `0 0 18px 4px ${ACCENT}` }}
            />
          </div>

          <ol data-steps>
            {STEPS.map((s) => (
              <li key={s.title} data-step className="relative py-8 pl-12 md:py-10 md:pl-16">
                <span
                  aria-hidden
                  data-node
                  className="absolute left-0 top-[2.45rem] size-[11px] rounded-full border-2 border-neutral-300 bg-white md:top-[3.05rem]"
                />
                <h4
                  data-sbody
                  className={`${display.className} text-[clamp(1.6rem,2.6vw,2.6rem)] font-medium leading-[1.02] tracking-[-0.045em] text-neutral-900`}
                >
                  {s.title}
                </h4>
                <p
                  data-sbody
                  className="mt-3 max-w-[30rem] text-[clamp(1.05rem,1.35vw,1.25rem)] leading-snug text-neutral-500"
                >
                  {s.text}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* ---------------- the ledger ---------------- */}
      <div data-ledger className="mt-24 grid gap-10 md:mt-36 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div>
          <p className="flex items-center gap-3 text-[13px] font-medium uppercase tracking-[0.16em] text-neutral-500">
            <span aria-hidden className="inline-block h-[3px] w-8" style={{ backgroundColor: ACCENT }} />
            Example
          </p>
          <h3
            className={`${display.className} mt-5 text-[clamp(2rem,3.6vw,3.6rem)] font-medium leading-[1] tracking-[-0.05em] text-neutral-900`}
          >
            Estimated impact
          </h3>
        </div>

        <div>
          <ul>
            {COSTS.map((row) => (
              <li key={row.label} data-lrow className="flex items-end gap-4 py-4 text-[clamp(1.05rem,1.4vw,1.3rem)]">
                <span data-llabel className="text-neutral-600">
                  {row.label}
                </span>
                <span
                  aria-hidden
                  data-leader
                  className="mb-[0.4em] h-0 flex-1 origin-left border-b border-dotted border-neutral-400"
                />
                <span data-amt data-value={row.amount} className="font-medium tabular-nums text-neutral-900">
                  {money(row.amount)}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-8 border-t border-neutral-900 pt-6">
            <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
              <p className="flex items-center gap-3 text-[15px] text-neutral-500">
                <span
                  data-blink
                  aria-hidden
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: ACCENT }}
                />
                Awaiting estimator approval
              </p>
              <div className="relative">
                <span
                  data-total
                  className={`${display.className} block text-[clamp(3.25rem,8vw,8rem)] font-medium leading-[0.95] tracking-[-0.055em] tabular-nums text-neutral-900`}
                >
                  {money(TOTAL)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}