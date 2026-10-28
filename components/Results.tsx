"use client";

import { useEffect, useRef } from "react";
import { animate, motion, useInView } from "motion/react";

// No measured results are published here yet. Each card shows a short word
// (`headline`) instead of a number.
// When you have real, approved figures, give a card `value` and `suffix`
// (and remove its `headline`), for example:
//   { value: 12, suffix: " min", text: "average to draft a referenced RFI." }
// Cards with a `value` count up when they scroll into view.
type Stat = {
  value?: number;
  suffix?: string;
  headline?: string;
  text: string;
};

const HEADING = "What you can count on.";
const STATS: Stat[] = [
  { headline: "Cited", text: "Every answer links back to the sheet or spec it came from." },
  { headline: "Traced", text: "A change is followed across drawings, specs and RFIs." },
  { headline: "Reviewed", text: "People approve the numbers before anyone relies on them." },
  { headline: "Private", text: "Your documents are never used to train models." },
];

const EASE = [0.22, 1, 0.36, 1] as const;

function CountUp({
  value,
  suffix,
  delay,
}: {
  value: number;
  suffix: string;
  delay: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!inView || !ref.current) return;
    const el = ref.current;
    const controls = animate(0, value, {
      duration: 1.6,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        el.textContent = `${Math.round(v)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, value, suffix, delay]);

  return <span ref={ref}>{`${value}${suffix}`}</span>;
}

export default function Results() {
  return (
    <section
      id="results"
      aria-label="What you can count on"
      className="border-y border-neutral-200 bg-neutral-50 px-6 py-[120px] md:px-24 md:py-[190px]"
    >
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: EASE }}
        className="text-center text-[clamp(2.25rem,3.4vw,3rem)] font-medium leading-[1.05] tracking-[-0.04em] text-neutral-900"
      >
        {HEADING}
      </motion.h2>

      <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.text}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: EASE, delay: i * 0.12 }}
            className="flex flex-col rounded-[22px] border border-neutral-200 bg-white p-7 shadow-[0_2px_10px_-4px_rgba(15,23,42,0.1)]"
          >
            <span className="size-2 rounded-full bg-accent" />
            <p className="mt-5 text-[clamp(2.5rem,3.4vw,3.25rem)] font-medium leading-none tracking-[-0.045em] text-neutral-900">
              {stat.value !== undefined ? (
                <CountUp value={stat.value} suffix={stat.suffix ?? ""} delay={i * 0.12} />
              ) : (
                stat.headline
              )}
            </p>
            <p className="mt-5 text-base leading-relaxed text-neutral-500">
              {stat.text}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}