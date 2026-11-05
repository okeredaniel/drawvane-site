"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";

/* ------------------------------------------------------------------ */
/*  Settings                                                           */
/* ------------------------------------------------------------------ */

const BRAND = "Stratora";
const ACCENT = "#ffc800";
const ACCENT_INK = "#755b00";
const RED = "#D14B4B";
const PAGE_BG = "#f5f4ef";
const INK = "#0B0F1A";
const LINE = "rgba(20,30,80,0.07)";
const HIGHLIGHT_BG = "#ece9df";
const HIGHLIGHT_BORDER = "#e8d28a";
const MONO =
  "var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, monospace";

/* 16x16 line icons, drawn with stroke="currentColor" */
const ICONS: Record<string, ReactNode> = {
  sparkles: (
    <>
      <path d="M6.5 2.5l1 2.6 2.6 1-2.6 1-1 2.6-1-2.6-2.6-1 2.6-1z" />
      <path d="M11.5 9.5l.6 1.4 1.4.6-1.4.6-.6 1.4-.6-1.4-1.4-.6 1.4-.6z" />
    </>
  ),
  checklist: (
    <>
      <path d="M2 4l1.2 1.2L5.2 3M2 9.5l1.2 1.2 2-2.2" />
      <path d="M7.5 4.2h6M7.5 9.7h6M7.5 13h4" />
    </>
  ),
  users: (
    <>
      <circle cx="6" cy="5.5" r="2.2" />
      <path d="M2 13c0-2.3 1.8-4 4-4s4 1.7 4 4" />
      <circle cx="11.5" cy="6" r="1.7" />
      <path d="M11.5 9.3c1.7 0 3 1.2 3 3.2" />
    </>
  ),
  flag: (
    <>
      <path d="M3.5 14V2.5" />
      <path d="M3.5 3h8l-1.8 2.7L11.5 8.5h-8" />
    </>
  ),
  calendar: (
    <>
      <rect x="2" y="3" width="12" height="11" rx="1.5" />
      <path d="M2 6.5h12M5 1.8v2.4M11 1.8v2.4M5 9h.01M8 9h.01M11 9h.01M5 11.5h.01M8 11.5h.01" />
    </>
  ),
  chart: (
    <>
      <path d="M2 2v12h12" />
      <path d="M4.5 10.5l3-3 2 2 3.5-4" />
    </>
  ),
  file: (
    <>
      <path d="M4 1.8h5l3 3v9.4H4z" />
      <path d="M9 1.8v3h3M6 8h4M6 10.5h4" />
    </>
  ),
  target: (
    <>
      <circle cx="8" cy="8" r="6" />
      <circle cx="8" cy="8" r="3.4" />
      <circle cx="8" cy="8" r=".8" />
    </>
  ),
  dependency: (
    <>
      <rect x="2" y="2" width="4" height="4" rx="1" />
      <rect x="10" y="10" width="4" height="4" rx="1" />
      <path d="M4 6v3.5A1.5 1.5 0 0 0 5.5 11H10" />
    </>
  ),
  search: (
    <>
      <circle cx="7" cy="7" r="4.5" />
      <path d="M10.5 10.5L14 14" />
    </>
  ),
  table: (
    <>
      <rect x="2" y="2.5" width="12" height="11" rx="2" />
      <path d="M2 6h12M6 6v7.5" />
    </>
  ),
  columns: (
    <>
      <rect x="2" y="2.5" width="12" height="11" rx="2" />
      <path d="M6 2.5v11M10 2.5v11" />
    </>
  ),
};

function Icon({ name, size = 15 }: { name: string; size?: number }) {
  return (
    <svg
      aria-hidden
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {ICONS[name]}
    </svg>
  );
}

/* Columns: [Drawing review, Quantity takeoff, Project discussions] */
type Row = { label: string; icon: string; vals: [boolean, boolean, boolean] };

const ROWS: Row[] = [
  { label: "Drawing markups", icon: "sparkles", vals: [true, false, false] },
  { label: "Project context", icon: "checklist", vals: [true, true, true] },
  { label: "Project access", icon: "users", vals: [true, true, true] },
  { label: "Human review", icon: "flag", vals: [true, true, true] },
  { label: "Drawing detail", icon: "calendar", vals: [true, true, false] },
  { label: "Visual context", icon: "chart", vals: [true, true, false] },
  { label: "Drawing callouts", icon: "file", vals: [true, false, false] },
  { label: "Length measurement", icon: "target", vals: [false, true, false] },
  { label: "Area measurement", icon: "dependency", vals: [false, true, false] },
  { label: "Drawing counts", icon: "users", vals: [false, true, false] },
  { label: "Team conversations", icon: "search", vals: [false, false, true] },
];

/* ------------------------------------------------------------------ */
/*  Marks (draw in when the row scrolls into view)                     */
/* ------------------------------------------------------------------ */

const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  show: (i: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: { delay: 0.1 + i * 0.12, duration: 0.55, ease: "easeOut" as const },
  }),
};

const pop = {
  hidden: { scale: 0.4, opacity: 0 },
  show: (i: number) => ({
    scale: 1,
    opacity: 1,
    transition: {
      delay: 0.1 + i * 0.12,
      type: "spring" as const,
      stiffness: 380,
      damping: 16,
    },
  }),
};

function Mark({ ok, col }: { ok: boolean; col: number }) {
  const color = ok ? ACCENT_INK : RED;
  return (
    <motion.svg
      aria-label={ok ? "Included" : "Not included"}
      role="img"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke={color}
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      variants={pop}
      custom={col}
    >
      <motion.circle cx="8" cy="8" r="6.2" variants={draw} custom={col} />
      {ok ? (
        <motion.path d="M5.2 8.2l1.9 1.9 3.5-3.7" variants={draw} custom={col} />
      ) : (
        <motion.path d="M5.5 8h5" variants={draw} custom={col} />
      )}
    </motion.svg>
  );
}

/* Small stacked-layers mark for the Stratora column header.
   Swap this for your own logo image if you want. */
function BrandMark() {
  return (
    <motion.svg
      aria-hidden
      width="22"
      height="22"
      viewBox="0 0 22 22"
      animate={{ y: [0, -2.5, 0] }}
      transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
    >
      <rect x="1" y="1" width="20" height="20" rx="6" fill={ACCENT} />
      <rect x="1" y="1" width="20" height="8" rx="4" fill="#fff" opacity="0.35" />
      <path
        d="M6.5 14.2l2.4 2.4 5.2-5.4"
        stroke="#0b0b12"
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </motion.svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Section                                                            */
/* ------------------------------------------------------------------ */

export default function Comparison() {
  // column width: 64px on phones, 160px from md up
  const colClass = "[--c:64px] md:[--c:160px]";
  const gridStyle = { gridTemplateColumns: "minmax(0,1fr) repeat(3,var(--c))" };

  return (
    <section
      id="comparison"
      className="relative"
      style={{ background: PAGE_BG, color: INK }}
    >
      <div className="mx-auto max-w-[1000px] px-4 py-20 md:px-6 md:py-28">
        {/* heading */}
        <div className="text-center">
          <motion.div
            className="inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-wide"
            style={{ color: ACCENT_INK, fontFamily: MONO }}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
          >
            <motion.span
              aria-hidden
              className="inline-block h-[9px] w-[9px] rounded-full"
              style={{ border: `2px solid ${ACCENT}` }}
              animate={{ scale: [1, 1.35, 1], opacity: [1, 0.6, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            />
            Workflow coverage
          </motion.div>

          <motion.h2
            className="mt-3 text-[32px] font-medium leading-[1.1] tracking-[-0.02em] md:text-[44px]"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            How {BRAND} connects
          </motion.h2>
        </div>

        {/* table card */}
        <motion.div
          className={`relative mt-10 rounded-2xl border md:mt-14 ${colClass}`}
          style={{ borderColor: LINE }}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* highlighted Stratora column: grows down from the top */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -top-px bottom-[-1px] z-0 rounded-[14px] border"
            style={{
              right: "calc(var(--c) * 2)",
              width: "var(--c)",
              background: HIGHLIGHT_BG,
              borderColor: HIGHLIGHT_BORDER,
              transformOrigin: "top",
            }}
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          />

          {/* header row */}
          <div
            className="relative z-10 grid h-[92px] items-center border-b md:h-[86px]"
            style={{ ...gridStyle, borderColor: LINE }}
          >
            <div />
            {[
              { name: "Review", icon: null },
              { name: "Takeoff", icon: "table" },
              { name: "Discuss", icon: "columns" },
            ].map((c, i) => (
              <div
                key={c.name}
                className="flex flex-col items-center justify-center gap-1.5 px-1 text-center"
              >
                <span style={{ color: ACCENT_INK }}>
                  {c.icon ? <Icon name={c.icon} size={18} /> : <BrandMark />}
                </span>
                <span
                  className={`text-[11px] font-semibold leading-tight md:text-[15px] ${
                    i === 0 ? "" : ""
                  }`}
                >
                  {c.name}
                </span>
              </div>
            ))}
          </div>

          {/* feature rows */}
          {ROWS.map((row, ri) => (
            <motion.div
              key={row.label}
              className="relative z-10 grid h-[52px] items-center transition-colors hover:bg-[rgba(96,74,0,0.035)] md:h-[51px]"
              style={{
                ...gridStyle,
                borderTop: ri === 0 ? undefined : `1px solid ${LINE}`,
                borderRadius: ri === ROWS.length - 1 ? "0 0 16px 16px" : undefined,
              }}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.8 }}
            >
              <div className="flex items-center gap-2.5 pl-3 pr-1 text-[12px] md:gap-3 md:pl-2.5 md:text-[14px]">
                <span className="shrink-0" style={{ color: ACCENT_INK }}>
                  <Icon name={row.icon} size={14} />
                </span>
                <span className="leading-tight">{row.label}</span>
              </div>

              {row.vals.map((ok, ci) => (
                <div key={ci} className="flex items-center justify-center">
                  <Mark ok={ok} col={ci} />
                </div>
              ))}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
