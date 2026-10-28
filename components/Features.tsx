"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

// Each item: title, one-line description, and the image shown on the right.
// Put the images in /public/features/ (feature-1.jpg, feature-2.jpg, feature-3.jpg).
// If yours are .png or .webp, change the extension in the `image` path.
// The descriptions for items 2 and 3 are placeholders: replace with your own copy.
const ITEMS = [
  {
    title: "Flag conflicts",
    text: "Plans checked against specs, in context.",
    image: "/features/feature-1.avif",
  },
  {
    title: "Compare revisions",
    text: "See exactly what changed between two sets.",
    image: "/features/feature-2.avif",
  },
  {
    title: "Measure takeoffs",
    text: "Quantities pulled straight from the drawings.",
    image: "/features/feature-3.avif",
  },
];

// ILLUSTRATIVE EXAMPLE: the sheet numbers and dollar amounts below are made up.
// Replace them with a real example from your product before publishing.
const STEPS = [
  {
    title: "A revision is issued",
    text: "Sheet A-301 lowers the corridor ceiling from 9'-0\" to 8'-6\".",
  },
  {
    title: "The evidence is found",
    text: "The change also shows up in spec 09 51 00 and in RFI-042, each linked to its page.",
  },
  {
    title: "The scope is traced",
    text: "Four floors are affected: ceiling grid, light fixtures and sprinkler drops.",
  },
  {
    title: "A person decides",
    text: "The estimator reviews the numbers and approves or adjusts them.",
  },
];

const COSTS = [
  { label: "Ceiling grid and tile rework", amount: "$18,400" },
  { label: "Light fixture relocation", amount: "$9,600" },
  { label: "Sprinkler drop adjustments", amount: "$6,200" },
  { label: "Review and coordination", amount: "$2,800" },
];
const TOTAL = "$37,000";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Features() {
  const [active, setActive] = useState(0);
  const [failed, setFailed] = useState<Record<string, boolean>>({});

  return (
    <section
      id="features"
      // overflow-x-clip: the two columns slide in from the sides, and before
      // they animate the right one sits 40px off to the right, which was
      // creating a sideways scrollbar on small screens.
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
          Precision search
        </h2>
        <p className="text-[clamp(2.5rem,4vw,3.5rem)] font-medium leading-[1.05] tracking-[-0.04em] text-neutral-400">
          Every clause, every sheet
        </p>
      </motion.div>

      <div className="mt-14 grid items-center gap-10 md:mt-[56px] md:grid-cols-2 md:gap-[40px]">
        <motion.ul
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: EASE }}
          className="order-2 md:order-1"
        >
          {ITEMS.map((item, i) => {
            const open = i === active;
            return (
              <li key={item.title} className="border-b border-neutral-200">
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  aria-expanded={open}
                  className="block w-full py-6 text-left"
                >
                  <span
                    className={`block tracking-[-0.03em] transition-all duration-300 ${
                      open
                        ? "text-[28px] font-medium text-neutral-900"
                        : "text-xl text-neutral-400 hover:text-neutral-700"
                    }`}
                  >
                    {item.title}
                  </span>
                  <motion.span
                    initial={false}
                    animate={{
                      height: open ? "auto" : 0,
                      opacity: open ? 1 : 0,
                    }}
                    transition={{ duration: 0.4, ease: EASE }}
                    className="block overflow-hidden"
                  >
                    <span className="block pt-3 text-lg text-neutral-500">
                      {item.text}
                    </span>
                  </motion.span>
                </button>
              </li>
            );
          })}
        </motion.ul>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: EASE }}
          className="order-1 md:order-2"
        >
          <div className="rounded-[28px] border border-neutral-200 bg-white p-2 shadow-[0_4px_20px_-8px_rgba(15,23,42,0.15)]">
            <div className="relative aspect-[1.8/1] overflow-hidden rounded-[22px] bg-neutral-100">
              <AnimatePresence initial={false}>
                <motion.div
                  key={active}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: EASE }}
                  className="absolute inset-0"
                >
                  {!failed[ITEMS[active].image] && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={ITEMS[active].image}
                      alt={ITEMS[active].title}
                      className="h-full w-full object-cover"
                      draggable={false}
                      onError={() =>
                        setFailed((f) => ({ ...f, [ITEMS[active].image]: true }))
                      }
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>

      {/* One revision, traced end to end */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, ease: EASE }}
        className="mx-auto mt-[120px] max-w-[1200px] md:mt-[160px]"
      >
        <div className="mx-auto max-w-2xl text-center">
          <h3 className="text-[clamp(2rem,3.2vw,2.75rem)] font-medium leading-[1.05] tracking-[-0.04em] text-neutral-900">
            One revision, traced end to end
          </h3>
          <p className="mt-4 text-lg text-neutral-500">
            See what changed, where it shows up, and what it costs.
          </p>
        </div>

        <div className="mt-12 grid items-start gap-8 md:grid-cols-2 md:gap-10">
          <ol>
            {STEPS.map((step, i) => (
              <li key={step.title} className="relative pb-8 pl-14 last:pb-0">
                {i < STEPS.length - 1 && (
                  <span className="absolute bottom-1 left-[17px] top-10 w-px bg-neutral-200" />
                )}
                <span className="absolute left-0 top-0 grid size-9 place-items-center rounded-full bg-accent text-[15px] font-semibold text-black">
                  {i + 1}
                </span>
                <p className="pt-1 text-[20px] font-medium tracking-[-0.02em] text-neutral-900">
                  {step.title}
                </p>
                <p className="mt-1.5 text-[16px] leading-relaxed text-neutral-500">
                  {step.text}
                </p>
              </li>
            ))}
          </ol>

          <div className="rounded-2xl border border-neutral-200 bg-white p-7 shadow-[0_2px_10px_-4px_rgba(15,23,42,0.1)]">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[18px] font-medium tracking-tight text-neutral-900">
                Estimated impact
              </p>
              <span className="rounded-full bg-accent px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-wide text-black">
                Example
              </span>
            </div>

            <ul className="mt-5">
              {COSTS.map((row) => (
                <li
                  key={row.label}
                  className="flex items-center justify-between gap-4 border-b border-dashed border-neutral-200 py-3.5 text-[16px]"
                >
                  <span className="text-neutral-600">{row.label}</span>
                  <span className="font-medium text-neutral-900">{row.amount}</span>
                </li>
              ))}
            </ul>

            <div className="mt-5 flex items-center justify-between gap-4">
              <span className="text-[16px] font-medium text-neutral-900">Total</span>
              <span className="text-[32px] font-medium tracking-tight text-neutral-900">
                {TOTAL}
              </span>
            </div>

            <p className="mt-5 flex items-center gap-2 text-[14px] text-neutral-500">
              <span className="size-2 rounded-full bg-accent" />
              Awaiting estimator approval
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}