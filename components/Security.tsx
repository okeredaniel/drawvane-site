"use client";

import { motion } from "motion/react";

// Only publish claims that are true for your product.
// Change the wording of any card here, for example if you don't have an audit yet.
const HEADING = "Your drawings stay yours.";
const CARDS = [
  { label: "Audited", title: "Independent security audit" },
  { label: "Privacy", title: "Never trained on" },
  { label: "Access", title: "SSO and roles" },
  { label: "Encryption", title: "Encrypted always" },
];

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Security() {
  return (
    <section
      id="security"
      aria-label="Security"
      className="bg-background px-6 py-[120px] md:px-24 md:py-[190px]"
    >
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: EASE }}
        className="text-center text-[clamp(2.25rem,3.4vw,3rem)] font-medium leading-[1.05] tracking-[-0.04em] text-[#eef1f5]"
      >
        {HEADING}
      </motion.h2>

      <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        {CARDS.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.15 + i * 0.12 }}
            className="group rounded-[26px] border border-[#1c232d] bg-[#0d1117] px-7 pb-14 pt-7 transition-colors duration-300 hover:border-[#2f4fd6]/70"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#5b7cff]">
              {card.label}
            </p>
            <h3 className="mt-5 text-[22px] font-medium leading-tight tracking-[-0.03em] text-[#eef1f5]">
              {card.title}
            </h3>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
