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

// No measured results are published here yet. Each row shows a short word
// (`headline`) instead of a number.
// When you have real, approved figures, give a row a `value` and `suffix`
// (and remove its `headline`), for example:
//   { value: 12, suffix: " min", text: "average to draft a referenced RFI." }
// Rows with a `value` count up when they scroll into view.
type Stat = {
  value?: number;
  suffix?: string;
  headline?: string;
  text: string;
};

const HEADING_LINES = [["What", "you", "can"], ["count", "on."]];
const STATS: Stat[] = [
  { headline: "Cited", text: "Every answer links back to the sheet or spec it came from." },
  { headline: "Traced", text: "A change is followed across drawings, specs and RFIs." },
  { headline: "Reviewed", text: "People approve the numbers before anyone relies on them." },
  { headline: "Private", text: "Your documents are never used to train models." },
];

const ACCENT = "#F5C93C";

// ---- Tune the motion here -------------------------------------------------
const DASH_W = 40; // width of the yellow dash when a row is active (px)
const DASH_GAP = 16; // space between the dash and the word (px)
const DIM = 0.35; // how faded the other rows get while one is active
// ---------------------------------------------------------------------------

export default function Results() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const sec = root.current;
      if (!sec) return;
      const q = <T extends Element>(s: string, from: ParentNode = sec) =>
        Array.from(from.querySelectorAll<T>(s));

      const mm = gsap.matchMedia();

      // Reduced motion: nothing is hidden by the markup, so there is nothing to do.
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const cleanups: Array<() => void> = [];

        // ---------------------------------------------------------------
        // 1. Heading: words rise out of their masks, then the grey second
        //    line drifts sideways against the scroll.
        // ---------------------------------------------------------------
        const h2 = sec.querySelector("h2") as HTMLElement;
        gsap.from(q("[data-hw]", h2), {
          yPercent: 118,
          duration: 1.2,
          ease: "power4.out",
          stagger: 0.09,
          scrollTrigger: { trigger: h2, start: "top 82%", once: true },
        });
        gsap.fromTo(
          q("[data-hline]", h2)[1],
          { x: "-5vw" },
          {
            x: "5vw",
            ease: "none",
            scrollTrigger: { trigger: h2, start: "top 90%", end: "bottom 10%", scrub: 0.6 },
          }
        );

        // ---------------------------------------------------------------
        // 2. Rail: a yellow line down the left fills as you read the list.
        // ---------------------------------------------------------------
        const list = sec.querySelector("[data-list]") as HTMLElement;
        const rail = sec.querySelector("[data-rail]") as HTMLElement | null;
        if (rail) {
          gsap.fromTo(
            rail,
            { scaleY: 0 },
            {
              scaleY: 1,
              transformOrigin: "50% 0%",
              ease: "none",
              scrollTrigger: { trigger: list, start: "top 60%", end: "bottom 60%", scrub: 0.5 },
            }
          );
        }

        // ---------------------------------------------------------------
        // 3. Rows
        // ---------------------------------------------------------------
        const rows = q<HTMLElement>("[data-row]");
        // ScrollTrigger can invoke callbacks during setup at a restored scroll position.
        // Initialize every row before any callback reads the shared state.
        const states = new Map<HTMLElement, { active: boolean; hover: boolean }>(
          rows.map((row) => [row, { active: false, hover: false }])
        );

        const setDash = (row: HTMLElement) => {
          const s = states.get(row)!;
          const open = s.active || s.hover;
          gsap.to(row.querySelector("[data-dash]"), {
            width: open ? DASH_W : 0,
            marginRight: open ? DASH_GAP : 0,
            duration: 0.55,
            ease: "power3.out",
            overwrite: "auto",
          });
        };

        // dim every row except the active or hovered one
        const refreshDim = () => {
          const lit = rows.filter((r) => {
            const s = states.get(r)!;
            return s.hover;
          });
          const focus = lit.length
            ? lit
            : rows.filter((r) => states.get(r)!.active);
          rows.forEach((r) => {
            const keep = focus.length === 0 || focus.includes(r);
            gsap.to(q("[data-fade]", r), {
              opacity: keep ? 1 : DIM,
              duration: 0.45,
              ease: "power2.out",
              overwrite: "auto",
            });
          });
        };

        rows.forEach((row, i) => {
          const line = row.querySelector("[data-line]");
          const stub = row.querySelector("[data-stub]");
          const chars = q("[data-char]", row);
          const count = row.querySelector<HTMLElement>("[data-count]");
          const words = q("[data-sw]", row);
          const sentence = row.querySelector<HTMLElement>("[data-sentence]");
          const head = row.querySelector<HTMLElement>("[data-head]");

          // entrance: the hairline draws, a yellow stretch follows, the word's
          // letters rise one by one
          const tl = gsap.timeline({
            scrollTrigger: { trigger: row, start: "top 84%", once: true },
          });
          tl.fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: 1.4, ease: "power3.inOut" }, 0)
            .fromTo(stub, { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: "power3.out" }, 0.45);
          if (chars.length) {
            tl.from(chars, { yPercent: 115, duration: 1, ease: "power4.out", stagger: 0.04 }, 0.15);
          }
          if (count) {
            const target = Number(count.dataset.value);
            const suffix = count.dataset.suffix ?? "";
            const o = { n: 0 };
            count.textContent = `0${suffix}`;
            tl.to(
              o,
              {
                n: target,
                duration: 1.6,
                ease: "power3.out",
                onUpdate: () => {
                  count.textContent = `${Math.round(o.n)}${suffix}`;
                },
              },
              0.15
            );
          }

          // the sentence lights up word by word, tied to the scrollbar
          if (words.length && sentence) {
            gsap.fromTo(
              words,
              { opacity: 0.18 },
              {
                opacity: 1,
                ease: "none",
                stagger: 0.12,
                scrollTrigger: { trigger: sentence, start: "top 90%", end: "top 48%", scrub: 0.4 },
              }
            );
          }

          // the big word and its sentence drift at slightly different speeds
          if (head && sentence) {
            gsap.fromTo(
              head,
              { yPercent: 8 },
              {
                yPercent: -8,
                ease: "none",
                scrollTrigger: { trigger: row, start: "top bottom", end: "bottom top", scrub: 0.8 },
              }
            );
            gsap.fromTo(
              sentence,
              { yPercent: -10 },
              {
                yPercent: 10,
                ease: "none",
                scrollTrigger: { trigger: row, start: "top bottom", end: "bottom top", scrub: 0.8 },
              }
            );
          }

          // the row the reader is on gets the yellow dash and stays bright
          ScrollTrigger.create({
            trigger: row,
            start: "top 62%",
            end: "bottom 62%",
            onToggle: (self) => {
              states.get(row)!.active = self.isActive;
              setDash(row);
              refreshDim();
            },
          });

          // hover (mouse only)
          const enter = (e: PointerEvent) => {
            if (e.pointerType !== "mouse") return;
            states.get(row)!.hover = true;
            setDash(row);
            refreshDim();
          };
          const leave = () => {
            states.get(row)!.hover = false;
            setDash(row);
            refreshDim();
          };
          row.addEventListener("pointerenter", enter);
          row.addEventListener("pointerleave", leave);
          cleanups.push(() => {
            row.removeEventListener("pointerenter", enter);
            row.removeEventListener("pointerleave", leave);
          });

          // the word nudges toward the pointer while it is over the row
          const wordEl = row.querySelector<HTMLElement>("[data-nudge]");
          if (wordEl) {
            const xTo = gsap.quickTo(wordEl, "x", { duration: 0.6, ease: "power3.out" });
            const move = (e: PointerEvent) => {
              if (e.pointerType !== "mouse") return;
              const r = row.getBoundingClientRect();
              xTo(((e.clientX - r.left) / r.width - 0.5) * 36);
            };
            const reset = () => xTo(0);
            row.addEventListener("pointermove", move);
            row.addEventListener("pointerleave", reset);
            cleanups.push(() => {
              row.removeEventListener("pointermove", move);
              row.removeEventListener("pointerleave", reset);
            });
          }
          void i;
        });

        return () => cleanups.forEach((fn) => fn());
      });
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      id="results"
      aria-label="What you can count on"
      className="relative overflow-x-clip bg-background px-6 py-[110px] md:px-24 md:py-[170px]"
    >
      <h2
        className={`${display.className} text-[clamp(2.75rem,7.6vw,8rem)] font-medium leading-[0.93] tracking-[-0.055em]`}
      >
        {HEADING_LINES.map((line, li) => (
          <span
            key={li}
            data-hline
            className={`block ${li === 1 ? "text-neutral-400" : "text-neutral-900"}`}
          >
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

      <div className="relative mt-20 md:mt-28">
        {/* yellow rail that fills as you read (desktop) */}
        <div
          aria-hidden
          className="absolute -left-12 bottom-0 top-0 hidden w-[2px] bg-neutral-200 md:block"
        >
          <div data-rail className="size-full" style={{ backgroundColor: ACCENT }} />
        </div>

        <ul data-list>
          {STATS.map((stat, i) => (
            <li
              key={stat.text}
              data-row
              className={`relative grid gap-5 py-10 md:grid-cols-[1fr_1.1fr] md:items-start md:gap-16 md:py-14 ${
                i === STATS.length - 1 ? "border-b border-neutral-300" : ""
              }`}
            >
              {/* hairline, with a short yellow stretch at the start */}
              <span aria-hidden data-line className="absolute inset-x-0 top-0 h-px origin-left bg-neutral-300" />
              <span
                aria-hidden
                data-stub
                className="absolute left-0 top-[-0.5px] h-[2px] w-16 origin-left"
                style={{ backgroundColor: ACCENT }}
              />

              <div data-head data-fade>
                <h3
                  data-nudge
                  className={`${display.className} flex items-center text-[clamp(2.5rem,5.4vw,5.25rem)] font-medium leading-[0.95] tracking-[-0.055em] text-neutral-900`}
                >
                  <span
                    aria-hidden
                    data-dash
                    className="inline-block h-[3px] w-0 shrink-0"
                    style={{ backgroundColor: ACCENT }}
                  />
                  <span className="block overflow-hidden pb-[0.12em]" aria-label={stat.headline}>
                    {stat.value !== undefined ? (
                      <span
                        data-count
                        data-value={stat.value}
                        data-suffix={stat.suffix ?? ""}
                        className="block"
                      >
                        {`${stat.value}${stat.suffix ?? ""}`}
                      </span>
                    ) : (
                      (stat.headline ?? "").split("").map((c, k) => (
                        <span key={k} aria-hidden data-char className="inline-block">
                          {c}
                        </span>
                      ))
                    )}
                  </span>
                </h3>
              </div>

              <p
                data-sentence
                data-fade
                className="max-w-[30rem] text-[clamp(1.2rem,1.8vw,1.7rem)] leading-[1.3] tracking-[-0.015em] text-neutral-900 md:pt-3"
              >
                {stat.text.split(" ").map((w, k) => (
                  <span key={k} data-sw className="mr-[0.28em] inline-block">
                    {w}
                  </span>
                ))}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}