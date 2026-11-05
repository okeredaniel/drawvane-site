"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import Image from "next/image";
import { animate, motion, useInView } from "motion/react";

const SECTION_BG = "#1D46FF";
const CARD_BG = "#FAFBFF";
const INK = "#0B0F1A";
const MONO =
  "var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, monospace";

type Story = {
  name: string;
  text: string;
  value: number;
  label: string;
  glyph: "snow" | "pinwheel" | "dots" | "stripes";
  logo?: string;
};

const STORIES: Story[] = [
  {
    name: "Contractors",
    text: "Review project drawings, discuss the details with your team and keep relevant documents close to the work on site.",
    value: 1,
    label: "Contractors",
    glyph: "snow",
  },
  {
    name: "Surveyors",
    text: "Measure lengths, areas and counts on drawings, keeping your quantities close to the details you need to review.",
    value: 2,
    label: "Quantity surveyors",
    glyph: "pinwheel",
  },
  {
    name: "Designers",
    text: "Explore project information, mark up drawings and share observations so the team can discuss the details behind design decisions.",
    value: 3,
    label: "Design professionals",
    glyph: "dots",
  },
  {
    name: "Project teams",
    text: "Bring people, documents and conversations together, with clear permissions to help everyone access the projects they work on.",
    value: 4,
    label: "Project teams",
    glyph: "stripes",
  },
];

const DOTS = (() => {
  const pts: Array<[number, number]> = [];
  for (let x = 0; x < 7; x++)
    for (let y = 0; y < 7; y++) {
      const d = Math.hypot(x - 3, y - 3);
      if (d <= 3.2) pts.push([x * 3.6 + 3.4, y * 3.6 + 3.4]);
    }
  return pts;
})();

function Glyph({ kind }: { kind: Story["glyph"] }) {
  const common = { width: 28, height: 28, viewBox: "0 0 28 28", "aria-hidden": true };
  let body: ReactNode = null;

  if (kind === "snow")
    body = (
      <>
        <g stroke={INK} strokeWidth="3" strokeLinecap="round">
          <path d="M14 3v22M3 14h22M6.2 6.2l15.6 15.6M21.8 6.2L6.2 21.8" />
        </g>
        <circle cx="14" cy="14" r="3.4" fill={INK} />
      </>
    );
  if (kind === "pinwheel")
    body = (
      <g fill={INK}>
        <path d="M3 3h9L3 12z" />
        <path d="M25 3v9l-9-9z" />
        <path d="M25 25h-9l9-9z" />
        <path d="M3 25v-9l9 9z" />
      </g>
    );
  if (kind === "dots")
    body = (
      <g fill={INK}>
        {DOTS.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="1.35" />
        ))}
      </g>
    );
  if (kind === "stripes")
    body = (
      <>
        <circle cx="14" cy="14" r="12.5" fill={INK} />
        <path d="M0 10h28M0 14h28M0 18h28" stroke={CARD_BG} strokeWidth="1.2" />
      </>
    );

  return <svg {...common}>{body}</svg>;
}

function CountUp({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = `${Math.round(v)}`.padStart(2, "0");
      },
    });
    return () => controls.stop();
  }, [inView, to]);

  return <span ref={ref}>00</span>;
}

function StoryCard({ story, index }: { story: Story; index: number }) {
  return (
    <motion.article
      className="relative flex min-h-[250px] flex-col justify-between rounded-2xl p-4 md:min-h-[240px]"
      style={{ background: CARD_BG, color: INK }}
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
        delay: (index % 2) * 0.12 + Math.floor(index / 2) * 0.12,
      }}
      whileHover={{ y: -6 }}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <motion.div
          className="h-7 w-7"
          whileHover={{ rotate: 90 }}
          transition={{ type: "spring", stiffness: 160, damping: 14 }}
        >
          {story.logo ? (
            <Image
              src={story.logo}
              alt={story.name}
              width={28}
              height={28}
              className="h-7 w-7 object-contain"
            />
          ) : (
            <Glyph kind={story.glyph} />
          )}
        </motion.div>
        <p className="pl-0 text-[15px] leading-[1.4] text-[#2B3040] md:pl-3 md:text-[16px]">
          {story.text}
        </p>
      </div>

      <div>
        <div className="text-[44px] font-medium leading-none tracking-[-0.02em] md:text-[48px]">
          <CountUp to={story.value} />
        </div>
        <div className="mt-2 text-[14px] uppercase text-[#4A5163]">{story.label}</div>
      </div>
    </motion.article>
  );
}

export default function CustomerStories() {
  return (
    <section
      id="customer-stories"
      className="relative overflow-hidden"
      style={{ background: SECTION_BG }}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-40 -top-40 h-[560px] w-[560px] rounded-full blur-3xl"
        style={{ background: "rgba(0,20,160,0.45)" }}
        animate={{ x: [0, 80, 0], y: [0, 50, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -bottom-52 -right-40 h-[620px] w-[620px] rounded-full blur-3xl"
        style={{ background: "rgba(90,130,255,0.5)" }}
        animate={{ x: [0, -90, 0], y: [0, -40, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.20) 1px, transparent 1.3px)",
          backgroundSize: "4px 4px",
          mixBlendMode: "soft-light",
        }}
        animate={{ backgroundPosition: ["0px 0px", "48px 48px"] }}
        transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(rgba(0,10,120,0.22) 1px, transparent 1.3px)",
          backgroundSize: "4px 4px",
          backgroundPosition: "2px 2px",
        }}
      />

      <div className="relative mx-auto max-w-[1280px] px-4 py-20 md:px-6 md:py-24">
        <div className="text-center text-white">
          <motion.div
            className="inline-flex items-center gap-2 text-[13px] font-medium uppercase tracking-wide text-white/85"
            style={{ fontFamily: MONO }}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
          >
            <motion.span
              aria-hidden
              className="inline-block h-[9px] w-[9px] rounded-full"
              style={{ border: "2px solid rgba(255,255,255,0.9)" }}
              animate={{ scale: [1, 1.35, 1], opacity: [1, 0.6, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            />
            Project workflows
          </motion.div>

          <motion.h2
            className="mt-3 text-[34px] font-medium leading-[1.1] tracking-[-0.02em] md:text-[52px]"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            Built For Your Work
          </motion.h2>
        </div>

        <div className="mt-12 grid gap-4 md:mt-16 md:grid-cols-2 md:gap-5">
          {STORIES.map((s, i) => (
            <StoryCard key={s.name} story={s} index={i} />
          ))}
        </div>

        <div className="mt-12 text-center md:mt-14">
          <motion.a
            href="/contact"
            className="inline-flex h-11 items-center gap-2 rounded-full px-5 text-[13px] font-semibold uppercase tracking-wide"
            style={{
              fontFamily: MONO,
              background: "rgba(255,255,255,0.62)",
              color: INK,
              backdropFilter: "blur(6px)",
            }}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            whileHover={{ scale: 1.06, backgroundColor: "rgba(255,255,255,1)" }}
            whileTap={{ scale: 0.96 }}
            transition={{ duration: 0.4 }}
          >
            <span
              aria-hidden
              className="inline-block h-[9px] w-[9px] rounded-full"
              style={{ border: `2px solid ${INK}`, opacity: 0.45 }}
            />
            Book demo
          </motion.a>
        </div>
      </div>
    </section>
  );
}
