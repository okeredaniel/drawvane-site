"use client";

import { useState } from "react";
import { motion } from "motion/react";

// Put the two images in /public/scattered/ as before.jpg and after.jpg.
// If yours are .png or .webp, change the extension in the paths below.
const BEFORE = { src: "/scattered/card-2.avif", alt: "A pile of scattered paper drawings" };
const AFTER = { src: "/scattered/card-1.avif", alt: "Drawings linked into one project set" };
const CAPTION = "Every sheet, spec and RFI, linked.";

// What goes into the linked set. Only list document types your product
// really reads.
const RECORD = [
  { label: "Written", items: ["Specifications", "RFIs", "Addenda"] },
  { label: "Drawn", items: ["Sheets", "Details", "Schedules"] },
];

const EASE = [0.22, 1, 0.36, 1] as const;

// The two cards under the container. Put the images in /public/scattered/
// as card-3.avif and card-4.avif (change the extension here if yours differ).
const CARDS = [
  {
    title: "RFIs, ready to send",
    text: "References and markups included.",
    image: "/scattered/card-3.avif",
    from: "left" as const,
  },
  {
    title: "Fits your stack",
    text: "Works with the tools your team already uses.",
    image: "/scattered/card-4.avif",
    from: "right" as const,
  },
];

function InfoCard({
  title,
  text,
  image,
  from,
}: {
  title: string;
  text: string;
  image: string;
  from: "left" | "right";
}) {
  const [missing, setMissing] = useState(false);
  return (
    <motion.article
      initial={{ opacity: 0, x: from === "left" ? "-25vw" : "25vw" }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1.1, ease: EASE }}
      className="overflow-hidden rounded-[28px] border border-neutral-200 bg-white shadow-[0_4px_20px_-8px_rgba(15,23,42,0.15)]"
    >
      <div className="aspect-[1.77/1] w-full bg-neutral-100">
        {!missing && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover"
            draggable={false}
            onError={() => setMissing(true)}
          />
        )}
      </div>
      <div className="px-7 py-7">
        <h3 className="text-2xl font-medium tracking-[-0.03em] text-neutral-900">
          {title}
        </h3>
        <p className="mt-2 text-lg text-neutral-500">{text}</p>
      </div>
    </motion.article>
  );
}

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
      className="relative aspect-[2.3/1] w-full overflow-hidden rounded-[18px] bg-neutral-100 md:aspect-auto md:h-[340px]"
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
      className="overflow-x-clip bg-background px-6 py-[120px] md:px-24 md:py-[190px]"
    >
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: EASE }}
        className="text-center"
      >
        <h2 className="text-[clamp(2.5rem,4vw,3.5rem)] font-medium leading-[1.05] tracking-[-0.04em] text-neutral-900">
          From scattered files
        </h2>
        <p className="text-[clamp(2.5rem,4vw,3.5rem)] font-medium leading-[1.05] tracking-[-0.04em] text-neutral-400">
          To one linked project set
        </p>
      </motion.div>

      {/* Container */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, ease: EASE }}
        className="mt-14 rounded-[28px] border border-neutral-200 bg-white p-5 shadow-[0_4px_20px_-8px_rgba(15,23,42,0.15)] md:mt-[56px] md:p-8"
      >
        <div className="grid items-center gap-4 md:grid-cols-[1fr_auto_1fr] md:gap-[20px]">
          <Panel {...BEFORE} from="left" delay={0.25} />

          {/* Arrow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.4 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.9 }}
            className="mx-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent text-black"
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

        <p className="mt-8 text-center text-lg text-neutral-500">{CAPTION}</p>

        {/* Written and drawn, in one record */}
        <div className="mt-8 border-t border-dashed border-neutral-200 pt-8">
          <div className="grid gap-4 md:grid-cols-2">
            {RECORD.map((group) => (
              <div
                key={group.label}
                className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6"
              >
                <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-neutral-600">
                  <span className="size-1.5 rounded-full bg-accent" />
                  {group.label}
                </p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-neutral-200 bg-white px-4 py-1.5 text-[15px] text-neutral-900"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-5 text-center text-[15px] text-neutral-500">
            What is written and what is drawn, in one connected record.
          </p>
        </div>
      </motion.div>

      {/* Two cards under the container */}
      <div className="mt-14 grid gap-4 md:mt-[56px] md:grid-cols-2 md:gap-4">
        {CARDS.map((card) => (
          <InfoCard key={card.title} {...card} />
        ))}
      </div>
    </section>
  );
}