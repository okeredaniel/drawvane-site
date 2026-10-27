"use client";

import { useState } from "react";
import { motion } from "motion/react";

// PLACEHOLDER ANSWERS. I only had the questions, so these are generic.
// Replace each answer with your real wording, especially the onboarding and pricing ones.
const HEADING = "Questions teams ask first.";
const FAQS = [
  {
    q: "Does it replace our design software or document control?",
    a: "No. It works alongside the tools your team already uses and reads the documents they produce. Your drawings and specs stay where they are.",
  },
  {
    q: "Where do our documents live?",
    a: "Your documents are stored securely in your own workspace and are only available to the people you give access to. Replace this with your real storage details.",
  },
  {
    q: "How long does onboarding take?",
    a: "Replace this with your real onboarding timeline, for example how long it takes to upload a first project set and start asking questions.",
  },
  {
    q: "What if the answer is not in the documents?",
    a: "You're told that the documents don't contain it, instead of getting a guess. Every answer links back to the sheet or spec it came from, so your team can check it.",
  },
  {
    q: "How is pricing structured?",
    a: "Replace this with your real pricing model. Pilot requests are a good place to point people who want details.",
  },
];

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Faq() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section
      id="faq"
      aria-label="Frequently asked questions"
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

      <ul className="mt-14 border-b border-[#242d38] md:mt-[80px]">
        {FAQS.map((item, i) => {
          const isOpen = open === i;
          return (
            <motion.li
              key={item.q}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease: EASE, delay: i * 0.08 }}
              className="border-t border-[#242d38]"
            >
              <h3>
                <button
                  type="button"
                  id={`faq-q-${i}`}
                  aria-expanded={isOpen}
                  aria-controls={`faq-a-${i}`}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-6 py-7 text-left"
                >
                  <span className="text-xl font-medium tracking-[-0.03em] text-[#eef1f5] md:text-2xl">
                    {item.q}
                  </span>
                  <span
                    aria-hidden="true"
                    className="relative h-4 w-4 shrink-0 text-[#8b95a1]"
                  >
                    <span className="absolute left-0 top-1/2 h-px w-4 -translate-y-1/2 bg-current" />
                    <span
                      className={`absolute left-1/2 top-0 h-4 w-px -translate-x-1/2 bg-current transition-transform duration-300 ${
                        isOpen ? "scale-y-0" : "scale-y-100"
                      }`}
                    />
                  </span>
                </button>
              </h3>

              <motion.div
                id={`faq-a-${i}`}
                role="region"
                aria-labelledby={`faq-q-${i}`}
                initial={false}
                animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="overflow-hidden"
              >
                <p className="max-w-[760px] pb-7 text-lg leading-relaxed text-[#8b95a1]">
                  {item.a}
                </p>
              </motion.div>
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
}
