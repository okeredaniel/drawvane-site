"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "motion/react";

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/*  Settings                                                           */
/* ------------------------------------------------------------------ */

const BRAND = "Stratora";
const ACCENT = "#ffc800";
const ACCENT_INK = "#755b00";
const PAGE_BG = "#f5f4ef";
const INK = "#0B0F1A";
const MONO =
  "var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, monospace";

const HEADING_LINES = ["The tools your projects run on.", "The context that brings them together."];

/** Tilt of the whole marquee in degrees (negative = rises to the right). */
const TILT_DEG = -4;

/** Seconds for one full loop of each row (bigger = slower). */
const ROW_DURATIONS = [42, 54, 38, 48];

// Brand references describe the customer workflow, not a claim of native connectivity.
type Tile = { id: string; name: string; bg: string; src?: string; category?: string };

const TILES: Tile[] = [
  {
    "id": "googledocs",
    "name": "Google Docs",
    "bg": "#fff4c7",
    "src": "/tools/googledocs.svg"
  },
  {
    "id": "procore",
    "name": "Procore",
    "category": "Project delivery",
    "bg": "#fdfcf8"
  },
  {
    "id": "googledrive",
    "name": "Google Drive",
    "bg": "#f0eee5",
    "src": "/tools/googledrive.svg"
  },
  {
    "id": "bluebeam",
    "name": "Bluebeam",
    "category": "PDF review",
    "bg": "#ffdf66"
  },
  {
    "id": "googlesheets",
    "name": "Google Sheets",
    "bg": "#fff4c7",
    "src": "/tools/googlesheets.svg"
  },
  {
    "id": "autodesk",
    "name": "Autodesk",
    "bg": "#fdfcf8",
    "src": "/tools/autodesk.svg"
  },
  {
    "id": "excel",
    "name": "Excel",
    "category": "Spreadsheets",
    "bg": "#f0eee5"
  },
  {
    "id": "teams",
    "name": "Teams",
    "category": "Team communication",
    "bg": "#ffdf66"
  },
  {
    "id": "dropbox",
    "name": "Dropbox",
    "bg": "#fff4c7",
    "src": "/tools/dropbox.svg"
  },
  {
    "id": "sharepoint",
    "name": "SharePoint",
    "category": "Shared documents",
    "bg": "#fdfcf8"
  },
  {
    "id": "acrobat",
    "name": "Acrobat",
    "category": "PDF documents",
    "bg": "#f0eee5"
  },
  {
    "id": "outlook",
    "name": "Outlook",
    "category": "Email and calendar",
    "bg": "#ffdf66"
  }
];

// every 4th tile goes in the same row, so each row has a mix of colors
const ROWS: Tile[][] = [0, 1, 2, 3].map((r) =>
  TILES.filter((_, i) => i % 4 === r)
);

// each row's 6 tiles are repeated so one "group" is wider than any screen
const REPEATS_PER_GROUP = 3;

/* ------------------------------------------------------------------ */
/*  Small pieces                                                       */
/* ------------------------------------------------------------------ */

function RingDot({ color = ACCENT_INK }: { color?: string }) {
  return (
    <motion.span
      aria-hidden
      className="inline-block h-[9px] w-[9px] rounded-full"
      style={{ border: `2px solid ${color}` }}
      animate={{ scale: [1, 1.35, 1], opacity: [1, 0.6, 1] }}
      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

function IntegrationTile({ tile, hidden }: { tile: Tile; hidden: boolean }) {
  return (
    <div
      className="shrink-0 px-[10px] py-4 md:px-[14px]"
      aria-hidden={hidden || undefined}
    >
      <div data-bend>
      <motion.div
        className="relative aspect-[3/2] w-[124px] md:w-[148px]"
        initial="rest"
        animate="rest"
        whileHover="hover"
        whileTap="tap"
        variants={{
          rest: { scale: 1, y: 0 },
          hover: {
            scale: 1.14,
            y: -8,
            transition: { type: "spring", stiffness: 320, damping: 16 },
          },
          tap: { scale: 0.95, transition: { duration: 0.1 } },
        }}
      >
        {/* the leaning rounded shape */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            background: tile.bg,
            borderRadius: 22,
            transform: "skewX(-8deg)",
            boxShadow:
              "0 14px 26px -14px rgba(96,74,0,0.45), inset 0 1px 0 rgba(255,255,255,0.35)",
          }}
        >
          {/* light sweep on hover */}
          <motion.span
            aria-hidden
            className="absolute inset-y-0 left-0 w-1/2"
            style={{
              background:
                "linear-gradient(100deg,transparent,rgba(255,255,255,0.55),transparent)",
            }}
            variants={{
              rest: { x: "-130%" },
              hover: { x: "260%", transition: { duration: 0.8, ease: "easeInOut" } },
            }}
          />
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-2 text-[#0b0b12]">
          {tile.src ? (
            <Image src={tile.src} alt="" width={30} height={30} className="h-7 w-7 object-contain" />
          ) : (
            <span aria-hidden className="h-7 text-[20px] font-semibold leading-7 tracking-[-.04em]">{tile.name}</span>
          )}
          <span className="text-center text-[11px] font-medium leading-tight">{tile.category ?? tile.name}</span>
        </div>
      </motion.div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section                                                            */
/* ------------------------------------------------------------------ */

export default function Integration() {
  const sectionRef = useRef<HTMLElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const marquee = marqueeRef.current;
    const spot = spotRef.current;
    if (!section || !marquee || !spot) return;

    // People who turned animations off in their system get a calmer version:
    // the rows still scroll (slowly) but the extra effects are skipped.
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const baseSpeed = reduce ? 0.35 : 1;

    const cleanups: Array<() => void> = [];

    const ctx = gsap.context(() => {
      const rows = gsap.utils.toArray<HTMLElement>("[data-row]", marquee);
      const bobs = gsap.utils.toArray<HTMLElement>("[data-bob]", marquee);
      const tracks = gsap.utils.toArray<HTMLElement>("[data-track]", marquee);
      const blobs = gsap.utils.toArray<HTMLElement>("[data-blob]", section);

      /* 1. The marquee loops. Row 1 right, row 2 left, row 3 right, row 4 left. */
      const loops = tracks.map((track, i) => {
        const right = i % 2 === 0;
        return gsap.fromTo(
          track,
          { xPercent: right ? -50 : 0 },
          {
            xPercent: right ? 0 : -50,
            duration: ROW_DURATIONS[i % ROW_DURATIONS.length],
            ease: "none",
            repeat: -1,
          }
        );
      });

      // speed = base x hover slow-down x scroll boost
      const hover = { v: 1 };
      const boost = { v: 0 };
      const applySpeed = () =>
        loops.forEach((t) => t.timeScale(baseSpeed * hover.v * (1 + boost.v)));
      applySpeed();

      /* 2. Bend: tiles follow an arch (edges lower, tilted along the curve) */
      const bendItems = gsap
        .utils.toArray<HTMLElement>("[data-bend]", marquee)
        .map((el) => ({
          track: el.closest("[data-track]") as HTMLElement,
          cell: el.parentElement as HTMLElement,
          baseX: 0,
          setY: gsap.quickSetter(el, "y", "px"),
          setR: gsap.quickSetter(el, "rotation", "deg"),
          setS: gsap.quickSetter(el, "scale"),
        }));
      let W = 1;
      let curve = 60;
      const trackW = new Map<HTMLElement, number>();
      const trackX = new Map<HTMLElement, number>();

      const measure = () => {
        W = marquee.offsetWidth || 1;
        curve = Math.min(90, Math.max(18, W * 0.045));
        tracks.forEach((t) => trackW.set(t, t.offsetWidth));
        bendItems.forEach((b) => {
          b.baseX = b.cell.offsetLeft + b.cell.offsetWidth / 2;
        });
      };
      measure();

      const bend = () => {
        tracks.forEach((t) =>
          trackX.set(
            t,
            ((gsap.getProperty(t, "xPercent") as number) / 100) * (trackW.get(t) || 0)
          )
        );
        const half = W / 2;
        bendItems.forEach((b) => {
          const x = (trackX.get(b.track) || 0) + b.baseX; // position inside the box
          const t = (x - half) / half; // -1 left edge ... 1 right edge
          b.setY(curve * t * t);
          b.setR((Math.atan((2 * curve * t) / half) * 180) / Math.PI);
          b.setS(1 - Math.min(1, t * t) * 0.1);
        });
      };
      bend();
      gsap.ticker.add(bend);
      window.addEventListener("resize", measure);
      cleanups.push(() => {
        gsap.ticker.remove(bend);
        window.removeEventListener("resize", measure);
      });

      if (reduce) return;

      /* 3. Rows rise in one after another */
      gsap.from(rows, {
        opacity: 0,
        y: 60,
        scale: 0.92,
        duration: 1,
        ease: "power3.out",
        stagger: 0.15,
        scrollTrigger: { trigger: marquee, start: "top 90%", once: true },
      });

      /* 4. Scrolling fast makes the rows speed up, then settle back */
      ScrollTrigger.create({
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const target = Math.min(Math.abs(self.getVelocity()) / 350, 4);
          gsap.to(boost, {
            v: target,
            duration: 0.2,
            overwrite: true,
            onUpdate: applySpeed,
            onComplete: () => {
              gsap.to(boost, {
                v: 0,
                duration: 1.4,
                ease: "power2.out",
                onUpdate: applySpeed,
              });
            },
          });
        },
      });

      /* 5. Rows bob up and down very slightly, each on its own beat */
      bobs.forEach((b, i) => {
        gsap.to(b, {
          y: i % 2 ? 6 : -6,
          duration: 3 + i * 0.7,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      });

      /* 6. Background glow blobs drift slowly */
      blobs.forEach((b, i) => {
        gsap.to(b, {
          x: i % 2 ? -70 : 70,
          y: i % 2 ? 40 : -40,
          duration: 9 + i * 2,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      });

      /* 7. Mouse only: rows slow down under the cursor + soft spotlight */
      if (window.matchMedia("(pointer: fine)").matches) {
        gsap.set(spot, { xPercent: -50, yPercent: -50, opacity: 0 });
        const sx = gsap.quickTo(spot, "x", { duration: 0.5, ease: "power3" });
        const sy = gsap.quickTo(spot, "y", { duration: 0.5, ease: "power3" });

        const onMove = (e: PointerEvent) => {
          const sr = section.getBoundingClientRect();
          sx(e.clientX - sr.left);
          sy(e.clientY - sr.top);
        };
        const onSectionEnter = () => gsap.to(spot, { opacity: 1, duration: 0.5 });
        const onSectionLeave = () => gsap.to(spot, { opacity: 0, duration: 0.5 });
        const onMarqueeEnter = () =>
          gsap.to(hover, { v: 0.4, duration: 0.6, onUpdate: applySpeed });
        const onMarqueeLeave = () =>
          gsap.to(hover, { v: 1, duration: 0.8, onUpdate: applySpeed });

        section.addEventListener("pointermove", onMove);
        section.addEventListener("pointerenter", onSectionEnter);
        section.addEventListener("pointerleave", onSectionLeave);
        marquee.addEventListener("pointerenter", onMarqueeEnter);
        marquee.addEventListener("pointerleave", onMarqueeLeave);
        cleanups.push(() => {
          section.removeEventListener("pointermove", onMove);
          section.removeEventListener("pointerenter", onSectionEnter);
          section.removeEventListener("pointerleave", onSectionLeave);
          marquee.removeEventListener("pointerenter", onMarqueeEnter);
          marquee.removeEventListener("pointerleave", onMarqueeLeave);
        });
      }
    }, section);

    return () => {
      cleanups.forEach((fn) => fn());
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="integrations"
      className="relative overflow-hidden"
      style={{ background: PAGE_BG, color: INK }}
    >
      {/* ambient glow */}
      <div
        data-blob
        aria-hidden
        className="pointer-events-none absolute -left-24 top-1/3 h-[420px] w-[420px] rounded-full blur-3xl"
        style={{ background: "rgba(96,74,0,0.10)" }}
      />
      <div
        data-blob
        aria-hidden
        className="pointer-events-none absolute -right-24 top-1/2 h-[380px] w-[380px] rounded-full blur-3xl"
        style={{ background: "rgba(96,74,0,0.14)" }}
      />
      {/* cursor spotlight */}
      <div
        ref={spotRef}
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 h-[520px] w-[520px] rounded-full opacity-0"
        style={{
          background:
            "radial-gradient(closest-side, rgba(96,74,0,0.16), transparent)",
        }}
      />

      <div className="relative pb-14 pt-16 md:pb-16 md:pt-20">
        {/* heading */}
        <div className="mx-auto max-w-[1120px] px-6 text-center">
          <motion.div
            className="inline-flex items-center gap-2 text-[13px] font-medium uppercase tracking-wide"
            style={{ color: ACCENT_INK, fontFamily: MONO }}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
          >
            <RingDot />
            Your working world
          </motion.div>

          <h2
            className="mx-auto mt-3 mb-6 text-[34px] font-semibold leading-[1.08] tracking-[-0.02em] md:mb-8 md:text-[48px]"
            style={{ color: INK }}
          >
            {HEADING_LINES.map((line, li) => (
              <span key={line} className="block">
                {line.split(" ").map((word, wi, arr) => (
                  <span
                    key={wi}
                    className="inline-block overflow-hidden pb-[0.12em] align-bottom"
                  >
                    <motion.span
                      className="inline-block"
                      initial={{ y: "110%" }}
                      whileInView={{ y: "0%" }}
                      viewport={{ once: true, margin: "-80px" }}
                      transition={{
                        duration: 0.7,
                        ease: [0.22, 1, 0.36, 1],
                        delay: li * 0.25 + wi * 0.06,
                      }}
                    >
                      {word}
                      {wi < arr.length - 1 ? "\u00A0" : ""}
                    </motion.span>
                  </span>
                ))}
              </span>
            ))}
          </h2>
        </div>

        {/* marquee: full width, edges fade out */}
        <div
          ref={marqueeRef}
          className="relative mt-6 flex flex-col gap-1 pb-6 md:mt-10 md:gap-3 md:pb-8"
          style={{
            // wider than the screen so the tilted ends never show a gap
            width: "120%",
            marginLeft: "-10%",
            transform: `rotate(${TILT_DEG}deg)`,
            WebkitMaskImage:
              "linear-gradient(to right,transparent,#000 18%,#000 82%,transparent)",
            maskImage:
              "linear-gradient(to right,transparent,#000 18%,#000 82%,transparent)",
          }}
        >
          {ROWS.map((row, ri) => {
            return (
              <div key={ri} data-row>
                <div data-bob>
                  {/* track = two identical groups, so the loop never jumps */}
                  <div data-track className="relative flex w-max will-change-transform">
                    {[0, 1].map((g) =>
                      Array.from({ length: REPEATS_PER_GROUP }).flatMap((_, rep) =>
                        row.map((tile) => (
                          <IntegrationTile
                            key={`${g}-${rep}-${tile.id}`}
                            tile={tile}
                            hidden={g === 1 || rep > 0}
                          />
                        ))
                      )
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* soft fade under the last row */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-28"
            style={{ background: `linear-gradient(to top, ${PAGE_BG} 15%, transparent)` }}
          />
        </div>

        {/* copy + button */}
        <div className="mx-auto mt-2 max-w-[1120px] px-6 text-center md:mt-4">
          <motion.p
            className="mx-auto max-w-[560px] text-[15px] leading-[1.45]"
            style={{ color: "#4A5163" }}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
          >
            From Google Docs to Procore and Bluebeam, your team already has a toolkit.
            Tell us where your project information lives and explore how {BRAND}
            can fit into your workflow.
          </motion.p>
          <p className="mx-auto mt-3 max-w-[560px] text-[12px] leading-relaxed text-[#65604f]">
            Workflow references only. Native connections are not available for every tool shown.
            Confirm connection availability with our team.
          </p>

          <motion.a
            href="/contact"
            className="mt-10 inline-flex h-10 items-center gap-2 rounded-full px-5 text-[13px] font-semibold uppercase tracking-wide text-[#0b0b12]"
            style={{ background: ACCENT, fontFamily: MONO }}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.96 }}
            transition={{ duration: 0.4 }}
          >
            <RingDot color="#fff" />
            Discuss your workflow
            <motion.svg
              aria-hidden
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              animate={{ y: [0, 3, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            >
              <path d="M7 2v10M3 8l4 4 4-4" />
            </motion.svg>
          </motion.a>
        </div>
      </div>
    </section>
  );
}

