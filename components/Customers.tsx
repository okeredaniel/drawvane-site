"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Bricolage_Grotesque } from "next/font/google";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Real display font for the big type (the site's `font-display` was falling
// back to Arial). To use your own site font instead, delete this and the
// `${display.className}` bits below.
const display = Bricolage_Grotesque({ subsets: ["latin"], weight: ["500", "600"], display: "swap" });

// These cards describe use cases only, with no statistics, because there are
// no real customer results to publish yet. When you have real, approved
// results, add them to `title`/`text` and change the heading to something like
// "Proof from real project teams."
// Put the pictures in /public/customers/ (case-1.avif, case-2.avif, case-3.avif)
// and uncomment the `image` lines in CASES below. Until then each frame shows
// the faint drawing grid.
const HEADING_LINES = [["Where"], ["project", "teams"], ["use", "it."]];
const HEADING = "Where project teams use it.";
const SUBHEAD = "From preconstruction to the field.";

type CaseItem = {
  label: string;
  title: string;
  text: string;
  image?: string;
};

const CASES: CaseItem[] = [
  {
    label: "Estimators & Quantity Surveyors",
    title: "Trace quantities back to the drawings",
    text: "Review takeoffs alongside their source sheets so quantities and scope can be checked.",
    // image: "/customers/case-1.avif",
  },
  {
    label: "Engineers & Trade Contractors",
    title: "Review coordination issues before work begins",
    text: "Compare drawings and specifications to identify discrepancies that need clarification.",
    // image: "/customers/case-2.avif",
  },
  {
    label: "Project Managers & General Contractors",
    title: "Keep project decisions grounded in evidence",
    text: "Review revisions, clarify scope and bring the relevant documents into project discussions.",
    // image: "/customers/case-3.avif",
  },
];

const EASE = [0.22, 1, 0.36, 1] as const;
const ACCENT = "#F5C93C";

// Faint drawing grid behind the pictures
const GRID = {
  backgroundImage:
    "linear-gradient(rgba(15,23,42,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.06) 1px, transparent 1px)",
  backgroundSize: "24px 24px",
};

function Img({ src, alt }: { src?: string; alt: string }) {
  const [missing, setMissing] = useState(false);
  if (!src || missing) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      draggable={false}
      onError={() => setMissing(true)}
      className="h-full w-full object-cover"
    />
  );
}

/* ------------------------------------------------------------------ */
/* Phones: a plain list, each card fades up once                        */
/* ------------------------------------------------------------------ */

function MobileCard({ c }: { c: CaseItem }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: EASE }}
      className="overflow-hidden rounded-[22px] border border-neutral-200 bg-white shadow-[0_4px_20px_-8px_rgba(15,23,42,0.18)]"
    >
      <div className="relative aspect-[1.5/1] w-full overflow-hidden bg-neutral-100" style={GRID}>
        <Img src={c.image} alt={c.title} />
      </div>
      <div className="border-t border-neutral-200 px-5 py-5">
        <p className="text-[12px] font-medium uppercase tracking-[0.14em] text-neutral-500">{c.label}</p>
        <h3 className={`mt-3 text-xl font-medium leading-tight tracking-[-0.03em] text-neutral-900 ${display.className}`}>
          {c.title}
        </h3>
        <p className="mt-2 text-base text-neutral-500">{c.text}</p>
      </div>
    </motion.article>
  );
}

function MobileList() {
  return (
    <section
      aria-label="Customers"
      className="overflow-x-clip border-t border-neutral-200 bg-background px-5 py-[80px] md:hidden"
    >
      <h2
        className={`text-center text-[clamp(2.2rem,9vw,3.2rem)] font-medium leading-[1.02] tracking-[-0.04em] text-neutral-900 ${display.className}`}
      >
        {HEADING}
      </h2>
      <p className="mt-3 text-center text-lg text-neutral-500">{SUBHEAD}</p>
      <div className="mt-10 flex flex-col gap-6">
        {CASES.map((c) => (
          <MobileCard key={c.title} c={c} />
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Tablet and desktop: pinned, scrolls sideways                         */
/* ------------------------------------------------------------------ */

function HorizontalShowcase() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const hint = useRef<HTMLSpanElement>(null);

  // Other sections can change the page height just after load (fonts, the
  // pinned sections swapping layout). Re-measure a few times early on so the
  // pin starts and ends in the right place. No observer: it fought the scroll.
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    const timers = [300, 1000, 2500].map((ms) => window.setTimeout(refresh, ms));
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh);
    return () => {
      timers.forEach((t) => window.clearTimeout(t));
      window.removeEventListener("load", refresh);
    };
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const sec = section.current;
        const tr = track.current;
        if (!sec || !tr) return;

        // How far the track has to travel to show the last panel
        const dist = () => {
          const vw = window.innerWidth;
          // The intro is exactly 100vw, each panel is min(96vw, 1560px) and the
          // spacer at the end is 10vw. Calculated, so it can never be stale.
          const panel = Math.min(0.96 * vw, 1560);
          const expected = CASES.length * panel + 0.1 * vw;
          // If the page ever measures longer than that, use the longer one.
          const last = tr.lastElementChild as HTMLElement | null;
          const measured = last ? last.offsetLeft + last.offsetWidth - vw : 0;
          return Math.max(expected, measured);
        };

        // 1. The main move: the section is held on screen by CSS (sticky), and
        //    scrolling through its height slides the track to the left.
        const scrollTween = gsap.to(tr, {
          x: () => -dist(),
          ease: "none",
          scrollTrigger: {
            trigger: sec,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
            invalidateOnRefresh: true,
            // 2. Progress bar along the bottom, driven by the same scroll
            onUpdate: (self) => {
              if (bar.current) gsap.set(bar.current, { scaleX: self.progress });
            },
          },
        });

        // 2b. Self-correct. If anything above this section changes the page
        //     height after the start point was measured (fonts, other pinned
        //     sections), the track starts part-way through. The section's real
        //     position on screen is the truth, so compare it with what the
        //     trigger thinks and, if they disagree, re-measure once things
        //     have stopped moving. It gives up after 4 tries so it can never
        //     loop.
        const st = scrollTween.scrollTrigger;
        let fixes = 0;
        let fixTimer: number | undefined;
        const checkStart = () => {
          if (!st) return;
          const r = sec.getBoundingClientRect();
          if (r.bottom < 0 || r.top > window.innerHeight) return;
          const span = r.height - window.innerHeight;
          if (span <= 0) return;
          const expected = Math.min(1, Math.max(0, -r.top / span));
          if (Math.abs(expected - st.progress) < 0.01) {
            fixes = 0;
            return;
          }
          if (fixes >= 4) return;
          window.clearTimeout(fixTimer);
          fixTimer = window.setTimeout(() => {
            fixes += 1;
            ScrollTrigger.refresh();
          }, 120);
        };
        let ticking = false;
        const onScroll = () => {
          if (ticking) return;
          ticking = true;
          requestAnimationFrame(() => {
            ticking = false;
            checkStart();
          });
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        const firstCheck = window.setTimeout(checkStart, 600);

        // 3. Intro: headline words slide up out of their masks, then the rest
        const introTrigger = { trigger: sec, start: "top 70%", toggleActions: "play none none reverse" };
        gsap.from(sec.querySelectorAll("[data-word]"), {
          yPercent: 118,
          duration: 1.1,
          ease: "power4.out",
          stagger: 0.1,
          scrollTrigger: introTrigger,
        });
        gsap.from(sec.querySelectorAll("[data-intro]"), {
          y: 26,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          delay: 0.55,
          stagger: 0.11,
          scrollTrigger: introTrigger,
        });

        // 4. "Keep scrolling" line keeps nudging forward
        if (hint.current) {
          gsap.fromTo(
            hint.current,
            { scaleX: 0.2, transformOrigin: "left center" },
            { scaleX: 1, duration: 1.2, ease: "power2.inOut", repeat: -1, yoyo: true }
          );
        }

        // 5. Each case panel animates as it slides into view
        sec.querySelectorAll<HTMLElement>("[data-panel]").forEach((panel) => {
          const trigger = {
            trigger: panel,
            containerAnimation: scrollTween,
            start: "left 72%",
            toggleActions: "play none none reverse",
          };

          // picture wipes open
          gsap.fromTo(
            panel.querySelector("[data-photo]"),
            { clipPath: "inset(0 0 100% 0 round 32px)" },
            { clipPath: "inset(0 0 0% 0 round 32px)", duration: 1.1, ease: "power3.inOut", scrollTrigger: trigger }
          );

          // text rises in, one line after another
          gsap.from(panel.querySelectorAll("[data-reveal]"), {
            y: 46,
            opacity: 0,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.12,
            delay: 0.15,
            scrollTrigger: trigger,
          });

          // accent line draws
          gsap.from(panel.querySelector("[data-line]"), {
            scaleX: 0,
            transformOrigin: "left center",
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: trigger,
          });

          // the picture drifts a little while the panel passes
          gsap.fromTo(
            panel.querySelector("[data-parallax]"),
            { xPercent: -3.5 },
            {
              xPercent: 3.5,
              ease: "none",
              scrollTrigger: {
                trigger: panel,
                containerAnimation: scrollTween,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            }
          );
        });

        return () => {
          window.removeEventListener("scroll", onScroll);
          window.clearTimeout(fixTimer);
          window.clearTimeout(firstCheck);
        };
      });
    },
    { scope: section }
  );

  return (
    <section
      ref={section}
      aria-label="Customers"
      className="relative hidden border-t border-neutral-200 bg-background md:block"
      // one screen, plus exactly the distance the track has to travel
      style={{ height: `calc(100vh + ${CASES.length} * min(96vw, 1560px) + 10vw)` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
      <div ref={track} className="flex h-full w-max items-center">
        {/* Intro panel: big headline on the left, who it is for on the right */}
        <div className="grid h-full w-screen shrink-0 grid-cols-[1.7fr_1fr] items-center gap-16 px-24 pt-16">
          <div>
            <h2
              className={`text-[clamp(3.2rem,8.4vw,9.5rem)] font-medium leading-[0.92] tracking-[-0.055em] ${display.className}`}
            >
              {HEADING_LINES.map((line, li) => (
                <span key={li} className={`block ${li === 2 ? "text-neutral-400" : "text-neutral-900"}`}>
                  {line.map((w, wi) => (
                    <span key={wi} className="mr-[0.2em] inline-block overflow-hidden pb-[0.12em] align-bottom">
                      <span data-word className="inline-block">
                        {w}
                      </span>
                    </span>
                  ))}
                </span>
              ))}
            </h2>
            <div
              data-intro
              className="mt-12 flex items-center gap-4 text-sm uppercase tracking-[0.18em] text-neutral-500"
            >
              Keep scrolling
              <span className="block h-[2px] w-24" style={{ backgroundColor: "#e5e5e5" }}>
                <span ref={hint} className="block h-full w-full" style={{ backgroundColor: ACCENT }} />
              </span>
            </div>
          </div>

          <div className="max-w-[26rem] justify-self-end">
            <p data-intro className="text-[clamp(1.1rem,1.5vw,1.45rem)] leading-snug text-neutral-500">
              {SUBHEAD}
            </p>
            <ul className="mt-8">
              {CASES.map((c) => (
                <li
                  key={c.label}
                  data-intro
                  className="border-t border-neutral-200 py-4 text-[clamp(1rem,1.25vw,1.2rem)] tracking-[-0.01em] text-neutral-900 last:border-b"
                >
                  {c.label}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* One panel per project type. Every panel and every frame is the same size. */}
        {CASES.map((c, i) => (
          <div
            key={c.title}
            data-panel
            className="flex h-full w-[min(96vw,1560px)] shrink-0 items-center justify-center px-[3vw]"
          >
            <div className={`flex w-full items-center gap-[5vw] ${i % 2 ? "flex-row-reverse" : ""}`}>
              <div
                data-photo
                className="relative h-[min(70vh,700px)] w-[min(58vw,980px)] shrink-0 overflow-hidden rounded-[32px] border border-neutral-200 bg-neutral-50 shadow-[0_30px_70px_-32px_rgba(15,23,42,0.4)]"
                style={GRID}
              >
                <div data-parallax className="absolute inset-0 scale-[1.08]">
                  <Img src={c.image} alt={c.title} />
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <div data-line className="h-[3px] w-12" style={{ backgroundColor: ACCENT }} />
                <p
                  data-reveal
                  className="mt-6 text-[13px] font-medium uppercase tracking-[0.16em] text-neutral-500"
                >
                  {c.label}
                </p>
                <h3
                  data-reveal
                  className={`mt-4 text-[clamp(1.8rem,2.8vw,3.2rem)] font-medium leading-[1.02] tracking-[-0.045em] text-neutral-900 ${display.className}`}
                >
                  {c.title}
                </h3>
                <p
                  data-reveal
                  className="mt-5 max-w-[26rem] text-[clamp(1rem,1.2vw,1.15rem)] leading-relaxed text-neutral-500"
                >
                  {c.text}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* breathing room after the last panel */}
        <div aria-hidden className="h-full w-[10vw] shrink-0" />
      </div>

      {/* progress along the bottom */}
      <div aria-hidden className="absolute inset-x-24 bottom-[6vh] h-[2px]" style={{ backgroundColor: "#e5e5e5" }}>
        <div ref={bar} className="h-full origin-left" style={{ backgroundColor: ACCENT, transform: "scaleX(0)" }} />
      </div>
      </div>
    </section>
  );
}

export default function Customers() {
  return (
    <div id="customers">
      <MobileList />
      <HorizontalShowcase />
    </div>
  );
}