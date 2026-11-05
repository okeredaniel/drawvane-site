"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "motion/react";

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/*  Settings                                                           */
/* ------------------------------------------------------------------ */

const BRAND = "Stratora";
const BLUE = "#1230FF";
const PAGE_BG = "#EDF0F5";
const INK = "#0B0F1A";
const MUTED = "#4A5163";
const RULE = "#CBD0DC";
const MONO =
  "var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, monospace";

type Item = {
  title: string;
  text: string;
  icon: "shield" | "lock" | "stars";
};

const ITEMS: Item[] = [
  {
    title: "Access That Fits The Role",
    text: "Set project access for each collaborator.",
    icon: "shield",
  },
  {
    title: "Project Access",
    text: "Choose who can view, edit or manage work within each project.",
    icon: "lock",
  },
  {
    title: "Human Review",
    text: "Review answers and quantities before making project decisions.",
    icon: "stars",
  },
];

/* ------------------------------------------------------------------ */
/*  Icons (strokes draw themselves in when the column scrolls in)      */
/* ------------------------------------------------------------------ */

const drawPath = (delay = 0, duration = 0.9) => ({
  hidden: { pathLength: 0, opacity: 0 },
  show: {
    pathLength: 1,
    opacity: 1,
    transition: { delay, duration, ease: "easeInOut" as const },
  },
});

const strokeProps = {
  fill: "none",
  stroke: BLUE,
  strokeWidth: 2.2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function ShieldIcon() {
  return (
    <motion.svg
      aria-hidden
      width="56"
      height="56"
      viewBox="0 0 56 56"
      variants={{ hover: { scale: 1.08, transition: { type: "spring", stiffness: 300, damping: 12 } } }}
    >
      <motion.path
        d="M28 4c-6 3-12 4.5-18 4.5V27c0 12 7.5 20.5 18 25 10.5-4.5 18-13 18-25V8.5C40 8.5 34 7 28 4z"
        {...strokeProps}
        variants={drawPath(0, 1)}
      />
      <motion.path
        d="M20 27.5l6 6 11-12"
        {...strokeProps}
        variants={drawPath(0.8, 0.5)}
      />
    </motion.svg>
  );
}

function LockIcon() {
  return (
    <svg aria-hidden width="56" height="56" viewBox="0 0 56 56">
      {/* shackle lifts on hover */}
      <motion.path
        d="M17 24V16a11 11 0 0 1 22 0v8"
        {...strokeProps}
        variants={{
          ...drawPath(0.5, 0.7),
          hover: { y: -5, transition: { type: "spring", stiffness: 320, damping: 14 } },
        }}
      />
      <motion.rect
        x="9"
        y="24"
        width="38"
        height="27"
        rx="1.5"
        {...strokeProps}
        variants={drawPath(0, 1)}
      />
      <motion.path d="M28 33v8" {...strokeProps} variants={drawPath(0.9, 0.4)} />
    </svg>
  );
}

function starPath(cx: number, cy: number, R: number, r: number) {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rad = i % 2 === 0 ? R : r;
    pts.push(`${(cx + rad * Math.cos(a)).toFixed(2)},${(cy + rad * Math.sin(a)).toFixed(2)}`);
  }
  return `M${pts.join("L")}Z`;
}

const STARS = Array.from({ length: 12 }, (_, i) => {
  const a = -Math.PI / 2 + (i * Math.PI) / 6;
  return starPath(28 + 22 * Math.cos(a), 28 + 22 * Math.sin(a), 3.3, 1.35);
});

function StarsIcon() {
  return (
    <svg aria-hidden width="56" height="56" viewBox="0 0 56 56">
      {/* the whole ring turns slowly (GSAP, speeds up while you scroll) */}
      <g data-ring>
        {STARS.map((d, i) => (
          <motion.path
            key={i}
            d={d}
            fill={BLUE}
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
            variants={{
              hidden: { scale: 0, opacity: 0 },
              show: {
                scale: 1,
                opacity: 1,
                transition: { delay: i * 0.06, type: "spring", stiffness: 300, damping: 14 },
              },
            }}
          />
        ))}
      </g>
    </svg>
  );
}

const ICONS: Record<Item["icon"], ReactNode> = {
  shield: <ShieldIcon />,
  lock: <LockIcon />,
  stars: <StarsIcon />,
};

/* ------------------------------------------------------------------ */
/*  Section                                                            */
/* ------------------------------------------------------------------ */

export default function Security() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;
    // calmer version for people who turned animations off on their system
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cleanups: Array<() => void> = [];

    const ctx = gsap.context(() => {
      /* 1. Heading lines slide in sideways from opposite sides as you scroll */
      gsap.utils.toArray<HTMLElement>("[data-line]", root).forEach((el, i) => {
        gsap.fromTo(
          el,
          { x: i % 2 ? 70 : -70 },
          {
            x: 0,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top 95%",
              end: "top 55%",
              scrub: 0.6,
            },
          }
        );
      });

      const cols = gsap.utils.toArray<HTMLElement>("[data-col]", root);
      const fine = window.matchMedia("(pointer: fine)").matches;

      cols.forEach((col, i) => {
        const icon = col.querySelector<HTMLElement>("[data-icon]");
        const glow = col.querySelector<HTMLElement>("[data-glow]");
        if (!icon) return;

        /* 2. Each icon drifts at its own pace while you scroll past */
        const amp = 24 + i * 12;
        gsap.fromTo(
          icon,
          { y: amp },
          {
            y: -amp,
            ease: "none",
            scrollTrigger: {
              trigger: col,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.8,
            },
          }
        );

        /* 3. Mouse only: icon tilts toward the cursor + a soft glow follows it */
        if (fine && glow) {
          gsap.set(icon, { transformPerspective: 600 });
          gsap.set(glow, { xPercent: -50, yPercent: -50, opacity: 0 });

          const rx = gsap.quickTo(icon, "rotationX", { duration: 0.5, ease: "power3" });
          const ry = gsap.quickTo(icon, "rotationY", { duration: 0.5, ease: "power3" });
          const ix = gsap.quickTo(icon, "x", { duration: 0.5, ease: "power3" });
          const gx = gsap.quickTo(glow, "x", { duration: 0.6, ease: "power3" });
          const gy = gsap.quickTo(glow, "y", { duration: 0.6, ease: "power3" });
          const clamp = gsap.utils.clamp(-28, 28);

          const onMove = (e: PointerEvent) => {
            const cr = col.getBoundingClientRect();
            const ir = icon.getBoundingClientRect();
            const dx = e.clientX - (ir.left + ir.width / 2);
            const dy = e.clientY - (ir.top + ir.height / 2);
            ry(clamp(dx * 0.08));
            rx(clamp(-dy * 0.08));
            ix(gsap.utils.clamp(-10, 10)(dx * 0.03));
            gx(e.clientX - cr.left);
            gy(e.clientY - cr.top);
          };
          const onEnter = () => gsap.to(glow, { opacity: 1, duration: 0.4 });
          const onLeave = () => {
            gsap.to(glow, { opacity: 0, duration: 0.5 });
            rx(0);
            ry(0);
            ix(0);
          };

          col.addEventListener("pointermove", onMove);
          col.addEventListener("pointerenter", onEnter);
          col.addEventListener("pointerleave", onLeave);
          cleanups.push(() => {
            col.removeEventListener("pointermove", onMove);
            col.removeEventListener("pointerenter", onEnter);
            col.removeEventListener("pointerleave", onLeave);
          });
        }
      });

      /* 4. Star ring turns slowly, and spins up while you scroll fast */
      const ring = root.querySelector<SVGGElement>("[data-ring]");
      if (ring) {
        const spin = gsap.to(ring, {
          rotation: 360,
          svgOrigin: "28 28",
          duration: 90,
          ease: "none",
          repeat: -1,
        });
        const boost = { v: 0 };
        const apply = () => spin.timeScale(1 + boost.v);

        ScrollTrigger.create({
          trigger: root,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            const target = Math.min(Math.abs(self.getVelocity()) / 120, 25);
            gsap.to(boost, {
              v: target,
              duration: 0.2,
              overwrite: true,
              onUpdate: apply,
              onComplete: () => {
                gsap.to(boost, { v: 0, duration: 1.6, ease: "power2.out", onUpdate: apply });
              },
            });
          },
        });
      }
    }, root);

    return () => {
      cleanups.forEach((fn) => fn());
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="security"
      className="relative"
      style={{ background: PAGE_BG, color: INK }}
    >
      <div className="mx-auto max-w-[1280px] px-4 py-20 md:px-6 md:py-24">
        {/* top: heading left, paragraph right */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <motion.div
              className="inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-wide"
              style={{ color: BLUE, fontFamily: MONO }}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5 }}
            >
              <motion.span
                aria-hidden
                className="inline-block h-[9px] w-[9px] rounded-full"
                style={{ border: `2px solid ${BLUE}` }}
                animate={{ scale: [1, 1.35, 1], opacity: [1, 0.6, 1] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              />
              Security
            </motion.div>

            <h2 className="mt-3 text-[34px] font-medium leading-[1.1] tracking-[-0.02em] md:text-[52px]">
              {["Built for shared work.", "Clear permissions."].map((line, li) => (
                <span key={line} data-line className="block overflow-hidden pb-[0.1em]">
                  <motion.span
                    className="block"
                    initial={{ y: "105%" }}
                    whileInView={{ y: "0%" }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{
                      duration: 0.8,
                      ease: [0.22, 1, 0.36, 1],
                      delay: li * 0.12,
                    }}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </h2>
          </div>

          <motion.p
            className="max-w-[290px] text-[14px] leading-[1.5] md:text-[15px]"
            style={{ color: MUTED }}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Shared work needs clear boundaries. Project permissions in
            {BRAND} help control who can view, edit and manage your work.
          </motion.p>
        </div>

        {/* three trust columns */}
        <div className="mt-14 grid gap-10 md:mt-16 md:grid-cols-3 md:gap-0">
          {ITEMS.map((item, i) => (
            <motion.div
              key={item.title}
              data-col
              className="relative pl-6 md:pl-6"
              initial="hidden"
              whileInView="show"
              whileHover="hover"
              viewport={{ once: true, amount: 0.5 }}
              variants={{
                hidden: { opacity: 0, y: 30 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    delay: i * 0.15,
                    duration: 0.7,
                    ease: [0.22, 1, 0.36, 1],
                    delayChildren: 0.25 + i * 0.15,
                  },
                },
              }}
            >
              {/* soft glow that follows the cursor (GSAP) */}
              <div
                data-glow
                aria-hidden
                className="pointer-events-none absolute left-0 top-0 h-[300px] w-[300px] rounded-full opacity-0"
                style={{
                  background:
                    "radial-gradient(closest-side, rgba(18,48,255,0.12), transparent)",
                }}
              />

              {/* left rule draws downward */}
              <motion.span
                aria-hidden
                className="absolute bottom-0 left-0 top-0 w-px"
                style={{ background: RULE, transformOrigin: "top" }}
                variants={{
                  hidden: { scaleY: 0 },
                  show: { scaleY: 1, transition: { duration: 0.9, ease: "easeOut" } },
                }}
              />

              <div data-icon className="h-14 w-14">
                {ICONS[item.icon]}
              </div>

              <h3 className="mt-12 max-w-[210px] text-[24px] font-medium leading-[1.2] tracking-[-0.01em] md:mt-[52px] md:text-[26px]">
                {item.title}
              </h3>
              <p
                className="mt-4 max-w-[250px] pb-1 text-[15px] leading-[1.4]"
                style={{ color: MUTED }}
              >
                {item.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}