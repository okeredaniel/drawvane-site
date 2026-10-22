"use client";

import { useEffect, useRef } from "react";
import { animate, motion, useInView } from "motion/react";

// PLACEHOLDER FIGURES. These came from the template and are not measured results.
// Replace them with numbers you can back up before the site goes public.
// `value` is what the number counts up to, `suffix` is what follows it.
const STATS = [
  { value: 30, suffix: "x", text: "faster document review on a 200-sheet set." },
  { value: 11, suffix: " min", text: "average to draft and send a fully referenced RFI." },
  { value: 4, suffix: " hrs", text: "instead of 4 days to answer an owner's scope question." },
  { value: 92, suffix: "%", text: "of conflicts caught before they became RFIs." },
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
      aria-label="Results"
      className="border-y border-[#242d38] bg-[#0a0d12] px-6 py-[120px] md:px-24 md:py-[190px]"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.text}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: EASE, delay: i * 0.12 }}
            className="flex flex-col rounded-[22px] border border-[#1c232d] bg-[#0d1117] p-7"
          >
            <p className="text-[clamp(2.75rem,3.6vw,3.5rem)] font-medium leading-none tracking-[-0.045em] text-[#eef1f5]">
              <CountUp value={stat.value} suffix={stat.suffix} delay={i * 0.12} />
            </p>
            <p className="mt-5 text-base leading-relaxed text-[#8b95a1]">
              {stat.text}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
