"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";

/* ------------------------------------------------------------------ */
/* Small inline app icons (swap for real files any time)               */
/* ------------------------------------------------------------------ */

function SlackIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-7" aria-hidden>
      <rect x="10" y="1.5" width="4" height="9" rx="2" fill="#36C5F0" />
      <rect x="13.5" y="10" width="9" height="4" rx="2" fill="#2EB67D" />
      <rect x="10" y="13.5" width="4" height="9" rx="2" fill="#ECB22E" />
      <rect x="1.5" y="10" width="9" height="4" rx="2" fill="#E01E5A" />
    </svg>
  );
}

function NotionIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-7" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="3.5" fill="#fff" stroke="#111" strokeWidth="1.6" />
      <path d="M8.5 16.5V7.5l7 9v-9" fill="none" stroke="#111" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function LaunchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-7" aria-hidden>
      <path d="M12 2l4 6-4 4-4-4z" fill="#34C28B" />
      <path d="M2 11l6-3 4 4-4 4z" fill="#3B82F6" />
      <path d="M12 12l4-4 6 3-6 5z" fill="#7C5CFF" />
      <path d="M12 12l4 4-4 6-4-6z" fill="#F5B73B" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-7" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="3" fill="#fff" stroke="#4285F4" strokeWidth="1.6" />
      <path d="M3 7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v1H3z" fill="#4285F4" />
      <text x="12" y="18" textAnchor="middle" fontSize="8" fontWeight="700" fill="#4285F4" fontFamily="sans-serif">31</text>
    </svg>
  );
}

function DocsIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-7" aria-hidden>
      <path d="M6 2h8l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" fill="#4285F4" />
      <path d="M14 2l5 5h-4a1 1 0 0 1-1-1z" fill="#A8C7FA" />
      <rect x="7.5" y="11" width="9" height="1.6" rx=".8" fill="#fff" />
      <rect x="7.5" y="14.2" width="9" height="1.6" rx=".8" fill="#fff" />
      <rect x="7.5" y="17.4" width="6" height="1.6" rx=".8" fill="#fff" />
    </svg>
  );
}

function GmailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-7" aria-hidden>
      <path d="M2 6.5A1.5 1.5 0 0 1 3.5 5H5l7 5.5L19 5h1.5A1.5 1.5 0 0 1 22 6.5V18a1 1 0 0 1-1 1h-3V10.2l-6 4.5-6-4.5V19H3a1 1 0 0 1-1-1z" fill="#EA4335" />
      <path d="M2 6.5L5 5v14H3a1 1 0 0 1-1-1z" fill="#C5221F" opacity=".85" />
      <path d="M22 6.5L19 5v14h2a1 1 0 0 0 1-1z" fill="#C5221F" opacity=".85" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Card data                                                            */
/* ------------------------------------------------------------------ */

type CardData = {
  id: string;
  icon: React.ReactNode;
  /** desktop position inside the board area */
  pos: string;
  from: "left" | "right";
  parallax: number; // px travelled up/down while scrolling
  floatY: number;
  floatDuration: number;
  delay: number;
  body: React.ReactNode;
};

const Dot = ({ color }: { color: string }) => (
  <span className="relative flex size-1.5">
    <span
      className="absolute inline-flex size-full animate-ping rounded-full opacity-60"
      style={{ background: color }}
    />
    <span className="relative inline-flex size-1.5 rounded-full" style={{ background: color }} />
  </span>
);

const Chip = ({ children }: { children: React.ReactNode }) => (
  <span className="mt-1.5 inline-block rounded-md bg-[#e9ecf3] px-2 py-0.5 text-[11px] text-[#5b6072]">
    {children}
  </span>
);

const CARDS: CardData[] = [
  {
    id: "slack",
    icon: <SlackIcon />,
    pos: "md:left-0 md:top-0",
    from: "left",
    parallax: 38,
    floatY: 7,
    floatDuration: 5.2,
    delay: 0.1,
    body: (
      <>
        <div className="flex items-center justify-between text-[10px] text-[#6b7083]">
          <span>#Project</span>
          <span>11:48 AM</span>
        </div>
        <p className="text-[13px] font-semibold text-[#0b0d1a]">Alex</p>
        <p className="text-[11px] leading-snug text-[#5b6072]">Have we checked the new plan?</p>
      </>
    ),
  },
  {
    id: "notion",
    icon: <NotionIcon />,
    pos: "md:right-0 md:top-0",
    from: "right",
    parallax: -34,
    floatY: 6,
    floatDuration: 6.1,
    delay: 0.2,
    body: (
      <>
        <p className="text-[13px] font-semibold text-[#0b0d1a]">Project Brief</p>
        <p className="text-[11px] text-[#5b6072]">Scope, requirements, deliverables</p>
        <Chip>Updated 2h ago</Chip>
      </>
    ),
  },
  {
    id: "launch",
    icon: <LaunchIcon />,
    pos: "md:left-[3%] md:top-[36%]",
    from: "left",
    parallax: 12,
    floatY: 8,
    floatDuration: 5.6,
    delay: 0.3,
    body: (
      <>
        <p className="text-[13px] font-semibold text-[#0b0d1a]">Drawing review</p>
        <div className="mt-1 flex items-center gap-1.5 text-[11px] text-[#5b6072]">
          <span className="flex -space-x-1.5">
            {["#f59e8b", "#8ab4f8", "#c4a484"].map((c) => (
              <span key={c} className="size-4 rounded-full ring-2 ring-white" style={{ background: c }} />
            ))}
          </span>
          3/7
        </div>
        <div className="mt-2 flex items-center gap-1.5 border-t border-[#eceef4] pt-2 text-[11px] text-[#3a3f52]">
          <Dot color="#e5322d" /> Review pending
        </div>
      </>
    ),
  },
  {
    id: "calendar",
    icon: <CalendarIcon />,
    pos: "md:right-[3%] md:top-[36%]",
    from: "right",
    parallax: -14,
    floatY: 7,
    floatDuration: 6.6,
    delay: 0.4,
    body: (
      <>
        <p className="text-[13px] font-semibold text-[#0b0d1a]">Site Review</p>
        <p className="text-[11px] text-[#5b6072]">Tomorrow, 10:00 AM</p>
        <div className="mt-2 flex items-center gap-1.5 border-t border-[#eceef4] pt-2 text-[11px] text-[#3a3f52]">
          <Dot color="#f09a1a" /> Drawing clarification
        </div>
      </>
    ),
  },
  {
    id: "docs",
    icon: <DocsIcon />,
    pos: "md:left-0 md:top-[72%]",
    from: "left",
    parallax: -30,
    floatY: 6,
    floatDuration: 5.8,
    delay: 0.5,
    body: (
      <>
        <p className="text-[13px] font-semibold text-[#0b0d1a]">A-102 · Rev C</p>
        <p className="text-[11px] text-[#5b6072]">Ground floor drawing notes</p>
        <Chip>Edited 5h ago</Chip>
      </>
    ),
  },
  {
    id: "gmail",
    icon: <GmailIcon />,
    pos: "md:right-0 md:top-[72%]",
    from: "right",
    parallax: 32,
    floatY: 8,
    floatDuration: 6.4,
    delay: 0.6,
    body: (
      <>
        <div className="flex items-center justify-between">
          <p className="text-[13px] font-semibold text-[#0b0d1a]">Approval request</p>
          <span className="text-[10px] text-[#6b7083]">2 Days Ago</span>
        </div>
        <p className="text-[11px] text-[#5b6072]">from Jane</p>
        <p className="mt-1 text-[11px] leading-snug text-[#5b6072]">Please review the revised plan.</p>
      </>
    ),
  },
];

/* ------------------------------------------------------------------ */
/* Floating card: parallax > entrance > idle float                      */
/* ------------------------------------------------------------------ */

function FloatingCard({
  card,
  progress,
  reduce,
}: {
  card: CardData;
  progress: MotionValue<number>;
  reduce: boolean;
}) {
  const y = useTransform(progress, [0, 1], reduce ? [0, 0] : [card.parallax, -card.parallax]);
  const fromX = card.from === "left" ? -90 : 90;

  return (
    <div className={`md:absolute md:w-[23%] md:min-w-[220px] ${card.pos}`}>
      <motion.div style={{ y }}>
        <motion.div
          initial={reduce ? false : { opacity: 0, x: fromX, scale: 0.9, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, x: 0, scale: 1, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{
            type: "spring",
            stiffness: 70,
            damping: 15,
            delay: card.delay,
            filter: { duration: 0.6, delay: card.delay },
            opacity: { duration: 0.5, delay: card.delay },
          }}
        >
          <motion.div
            animate={reduce ? undefined : { y: [0, -card.floatY, 0, card.floatY, 0] }}
            transition={{
              duration: card.floatDuration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: card.delay + 0.8,
            }}
          >
            <div className="flex items-start gap-2.5 rounded-2xl bg-white/90 p-3 shadow-[0_10px_40px_-12px_rgba(96,74,0,0.25)] ring-1 ring-white/80 backdrop-blur transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_18px_48px_-12px_rgba(96,74,0,0.38)]">
              <div className="mt-0.5 shrink-0">{card.icon}</div>
              <div className="min-w-0 flex-1">{card.body}</div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Section                                                              */
/* ------------------------------------------------------------------ */

const line = {
  hidden: { y: "110%" },
  show: (i: number) => ({
    y: "0%",
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const, delay: 0.15 + i * 0.12 },
  }),
};

export default function Problem() {
  const reduce = useReducedMotion() ?? false;
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  const boardY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [40, -40]);
  const boardScale = useTransform(scrollYProgress, [0, 0.5, 1], reduce ? [1, 1, 1] : [0.97, 1, 1.03]);

  return (
    <section
      ref={ref}
      id="problem"
      style={{ colorScheme: "light" }}
      className="bg-[#f5f4ef] px-3 py-3 text-[#0b0d1a] md:px-5"
    >
      <div className="mx-auto max-w-[1280px] overflow-hidden rounded-2xl bg-[#ecebe5] px-5 pb-14 pt-12 md:px-10 md:pb-16 md:pt-16">
        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-4 inline-flex items-center gap-2 font-mono text-[13px] font-semibold uppercase tracking-wide text-[#d62b27]"
          >
            <span className="relative flex size-3 items-center justify-center">
              <span className="absolute inline-flex size-full animate-ping rounded-full border border-[#d62b27] opacity-50" />
              <span className="relative inline-flex size-3 rounded-full border-2 border-[#d62b27]" />
            </span>
            The Problem
          </motion.div>

          <h2 className="text-[1rem] font-semibold leading-[0.96] tracking-[-0.04em] text-[#0b0d1a] md:text-[3rem]">
            {["The work connects.", "The information should too."].map((text, i) => (
              <span key={text} className="block overflow-hidden pb-1">
                <motion.span
                  className="block"
                  variants={line}
                  custom={i}
                  initial={reduce ? "show" : "hidden"}
                  whileInView="show"
                  viewport={{ once: true, margin: "-60px" }}
                >
                  {text}
                </motion.span>
              </span>
            ))}
          </h2>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="mx-auto mt-4 max-w-xl text-[17px] leading-relaxed text-[#555a6e] md:text-[15px]"
          >
            Drawings, quantities, documents, and conversations live in different places. Teams
            spend more time searching than building.
          </motion.p>
        </div>

        {/* Board + cards */}
        <div className="relative mx-auto mt-12 max-w-[1000px] md:mt-16 md:h-[560px]">
          {/* soft blob so the layout holds even before the image is added */}
          <div
            aria-hidden
            className="absolute left-1/2 top-1/2 h-[75%] w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgba(96,74,0,0.35),rgba(96,74,0,0))] blur-2xl"
          />

          <motion.div
            style={{ y: boardY, scale: boardScale }}
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1.1, ease: "easeOut" }}
            className="relative mx-auto w-full max-w-[760px] md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2"
          >
            <Image
              src="/problem-board.avif"
              alt=""
              width={1400}
              height={1000}
              priority={false}
              className="h-auto w-full select-none"
              draggable={false}
            />
          </motion.div>

          {/* Cards: stacked list on mobile, scattered over the board on md+ */}
          <div className="relative mt-6 grid gap-3 sm:grid-cols-2 md:static md:mt-0 md:block">
            {CARDS.map((card) => (
              <FloatingCard key={card.id} card={card} progress={scrollYProgress} reduce={reduce} />
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-10 flex justify-center md:mt-14"
        >
          <motion.a
            href="#solution"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="group inline-flex items-center gap-2.5 rounded-full bg-[#ffc800] px-6 py-3.5 font-mono text-[13px] font-medium uppercase tracking-wide text-[#0b0b12] shadow-[0_10px_30px_-8px_rgba(96,74,0,0.6)] transition-colors hover:bg-[#e6b400]"
          >
            <span className="size-2.5 rounded-full border-2 border-white/90" />
            Our Solutions
            <motion.svg
              viewBox="0 0 16 16"
              className="size-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              animate={reduce ? undefined : { y: [0, 3, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
              aria-hidden
            >
              <path d="M8 3v10M3.5 8.5L8 13l4.5-4.5" />
            </motion.svg>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
