"use client";

import { useState } from "react";
import { motion } from "motion/react";

// Put the two images in /public/scattered/ as before.jpg and after.jpg.
// If yours are .png or .webp, change the extension in the paths below.
const BEFORE = {
  src: "/scattered/before.jpg",
  alt: "A pile of scattered paper drawings",
};
const AFTER = {
  src: "/scattered/after.jpg",
  alt: "Drawings linked into one project set",
};
const CAPTION = "Every sheet, spec and RFI, linked.";

const EASE = [0.22, 1, 0.36, 1] as const;

function Panel({
  src,
  alt,
  from,
  delay,
}: {
  src: string;
  alt: string;
  from: "left" | "right";
  delay: number;
}) {
  const [missing, setMissing] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, x: from === "left" ? -60 : 60 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-120px" }}
      transition={{ duration: 1, ease: EASE, delay }}
      className="relative aspect-[2.3/1] w-full overflow-hidden rounded-[18px] bg-[#0d1117] md:aspect-auto md:h-[340px]"
    >
      {!missing && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
          draggable={false}
          onError={() => setMissing(true)}
        />
      )}
    </motion.div>
  );
}

export default function Scattered() {
  return (
    <section
      id="scattered"
      className="bg-background px-6 py-[120px] md:px-24 md:py-[190px]"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: EASE }}
        className="text-center"
      >
        <h2 className="text-[clamp(2.5rem,4vw,3.5rem)] font-medium leading-[1.05] tracking-[-0.04em] text-white">
          From scattered files
        </h2>
        <p className="text-[clamp(2.5rem,4vw,3.5rem)] font-medium leading-[1.05] tracking-[-0.04em] text-[#7d8794]">
          To one linked project set
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, ease: EASE }}
        className="mt-14 rounded-[28px] border border-[#242d38] bg-[#0b0f14] p-5 shadow-[0_0_40px_rgba(0,0,0,0.5)] md:mt-[56px] md:p-8"
      >
        <div className="grid items-center gap-4 md:grid-cols-[1fr_auto_1fr] md:gap-[20px]">
          <Panel {...BEFORE} from="left" delay={0.25} />

          <motion.div
            initial={{ opacity: 0, scale: 0.4 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.9 }}
            className="mx-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#161c24] text-white"
            aria-hidden="true"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="rotate-90 md:rotate-0"
            >
              <path d="M5 12h14" />
              <path d="m13 6 6 6-6 6" />
            </svg>
          </motion.div>

          <Panel {...AFTER} from="right" delay={0.25} />
        </div>

        <p className="mt-8 text-center text-lg text-[#7d8794]">{CAPTION}</p>
      </motion.div>
    </section>
  );
}
