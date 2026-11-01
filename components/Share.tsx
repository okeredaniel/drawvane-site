"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type ShareImage = {
  src?: string;
  alt: string;
};

// Put the image in /public/share/ as share.avif.
// If yours is .png, .jpg or .webp, change the extension here.
// Change the alt text to describe your own image.
const IMAGE: ShareImage = {
  // src: "/share/share.avif",
  alt: "A shared answer with its source sheet attached",
};

// PLACEHOLDER CONTENT: replace the link, people and benefit copy with your own.
const SHARE_LINK = "app.example.com/a/7f3k2";
const PEOPLE = ["PM", "ES", "SU", "SC"];
const SOURCE_CHIP = "A-301 · page 4";
const BENEFITS = [
  {
    title: "Source attached",
    text: "Every shared answer links to the exact sheet or clause it came from.",
  },
  {
    title: "One answer for everyone",
    text: "The estimator, the super and the sub all open the same thing, not a copy.",
  },
  {
    title: "You choose who sees it",
    text: "Send a link to the whole team or to one person, and change it any time.",
  },
];

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Share() {
  const root = useRef<HTMLElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const tilt = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLDivElement>(null);
  const [missing, setMissing] = useState(false);
  const [copied, setCopied] = useState(false);

  // Scroll: the card starts tipped back and small, then rises to face you
  // while the picture inside slowly zooms.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          desktop: "(min-width: 768px)",
          motion: "(prefers-reduced-motion: no-preference)",
        },
        (ctx) => {
          const { desktop, motion: ok } = ctx.conditions as {
            desktop: boolean;
            motion: boolean;
          };
          if (!ok) return;

          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: card.current,
              start: "top 92%",
              end: "center 50%",
              scrub: 0.6,
            },
          });

          tl.fromTo(
            card.current,
            {
              scale: desktop ? 0.8 : 0.92,
              rotationX: desktop ? 26 : 16,
              y: 50,
              transformOrigin: "50% 100%",
              transformPerspective: 1400,
            },
            { scale: 1, rotationX: 0, y: 0 },
            0
          ).fromTo(img.current, { scale: 1 }, { scale: 1.1, transformOrigin: "50% 50%" }, 0);
        }
      );

      return () => mm.revert();
    },
    { scope: root }
  );

  // Hover: pointer tilts the frame, moves a light across it, and feeds
  // --px / --py to the floating layers so they slide against the image.
  useEffect(() => {
    const el = tilt.current;
    if (!el) return;
    const ok = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)"
    );
    if (!ok.matches) return;

    gsap.set(el, { transformPerspective: 1300 });
    const rx = gsap.quickTo(el, "rotationX", { duration: 0.6, ease: "power3.out" });
    const ry = gsap.quickTo(el, "rotationY", { duration: 0.6, ease: "power3.out" });

    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      ry((px - 0.5) * 10);
      rx((0.5 - py) * 7);
      el.style.setProperty("--mx", `${px * 100}%`);
      el.style.setProperty("--my", `${py * 100}%`);
      el.style.setProperty("--px", String(px - 0.5));
      el.style.setProperty("--py", String(py - 0.5));
    };
    const enter = () => el.style.setProperty("--glare", "1");
    const leave = () => {
      rx(0);
      ry(0);
      el.style.setProperty("--glare", "0");
      el.style.setProperty("--px", "0");
      el.style.setProperty("--py", "0");
    };

    el.addEventListener("pointermove", move);
    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointerleave", leave);
    };
  }, []);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(SHARE_LINK);
    } catch {
      // clipboard can be blocked; the button still confirms below
    }
    setCopied(true);
  };

  return (
    <section
      ref={root}
      id="share"
      className="overflow-x-clip bg-background px-6 py-[120px] md:px-24 md:py-[190px]"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: EASE }}
        className="text-center"
      >
        <h2 className="text-[clamp(2.5rem,4vw,3.5rem)] font-medium leading-[1.05] tracking-[-0.04em] text-neutral-900">
          Share the answer
        </h2>
        <p className="text-[clamp(2.5rem,4vw,3.5rem)] font-medium leading-[1.05] tracking-[-0.04em] text-neutral-400">
          Keep the project aligned
        </p>
      </motion.div>

      {/* Stage */}
      <div className="mt-14 md:mt-[100px]">
        <div
          ref={card}
          className="relative mx-auto w-full max-w-[1200px] [transform-style:preserve-3d] will-change-transform"
        >
          {/* shadow on the floor under the card */}
          <div
            aria-hidden
            className="absolute inset-x-[7%] -bottom-6 h-12 rounded-full bg-neutral-900/20 blur-3xl"
          />

          <div
            ref={tilt}
            className="relative rounded-[28px] border border-neutral-200 bg-white p-2 shadow-[0_30px_70px_-30px_rgba(15,23,42,0.35)] [transform-style:preserve-3d]"
          >
            <div className="relative aspect-[1.9/1] overflow-hidden rounded-[22px] bg-gradient-to-b from-neutral-100 to-neutral-200">
              <div ref={img} className="absolute inset-0 will-change-transform">
                {!missing && IMAGE.src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={IMAGE.src}
                    alt={IMAGE.alt}
                    className="h-full w-full object-cover"
                    draggable={false}
                    onError={() => setMissing(true)}
                  />
                ) : null}
              </div>
            </div>



            {/* share sheet: floats over the image on desktop, sits under it on phones */}
            <div className="relative mt-2 rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_24px_50px_-20px_rgba(15,23,42,0.35)] md:absolute md:-bottom-10 md:right-8 md:mt-0 md:w-[360px] md:[transform:translate3d(calc(var(--px,0)*-20px),calc(var(--py,0)*-14px),100px)]">
              <p className="text-[18px] font-medium tracking-tight text-neutral-900">
                Share this answer
              </p>

              <div className="mt-4 flex items-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 p-1.5 pl-3.5">
                <span className="min-w-0 flex-1 truncate text-[15px] text-neutral-500">
                  {SHARE_LINK}
                </span>
                <button
                  type="button"
                  onClick={copyLink}
                  className="relative grid h-9 min-w-[92px] place-items-center rounded-lg bg-accent px-3 text-[15px] font-semibold text-black outline-none transition-transform active:scale-95 focus-visible:ring-2 focus-visible:ring-neutral-900/40"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={copied ? "copied" : "copy"}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.18 }}
                      aria-live="polite"
                    >
                      {copied ? "Copied" : "Copy link"}
                    </motion.span>
                  </AnimatePresence>
                </button>
              </div>

            </div>

            {/* moving light */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-[28px] opacity-[var(--glare,0)] transition-opacity duration-500"
              style={{
                background:
                  "radial-gradient(560px circle at var(--mx,50%) var(--my,0%), rgba(255,255,255,0.45), transparent 45%)",
              }}
            />
          </div>
        </div>
      </div>

      {/* Why it helps */}
      <motion.ul
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        transition={{ staggerChildren: 0.12 }}
        className="mx-auto mt-16 grid max-w-[1200px] gap-8 md:mt-[110px] md:grid-cols-3 md:gap-0 md:divide-x md:divide-neutral-200"
      >
        {BENEFITS.map((b) => (
          <motion.li
            key={b.title}
            variants={{
              hidden: { opacity: 0, y: 24 },
              show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
            }}
            className="border-t border-neutral-200 pt-6 md:border-t-0 md:px-8 md:pt-0 md:first:pl-0 md:last:pr-0"
          >
            <p className="text-[22px] font-medium tracking-[-0.03em] text-neutral-900">
              {b.title}
            </p>
            <p className="mt-2 max-w-[34ch] text-[17px] leading-relaxed text-neutral-500">
              {b.text}
            </p>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}