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
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="text-center"
      >
        <h2 className="text-[clamp(2.5rem,4vw,3.5rem)] font-medium leading-[1.05] tracking-[-0.04em] text-white">
          Precision search
        </h2>
        <p className="text-[clamp(2.5rem,4vw,3.5rem)] font-medium leading-[1.05] tracking-[-0.04em] text-[#7d8794]">
          Every clause, every sheet
        </p>
      </motion.div>

      <div className="mt-14 grid items-center gap-10 md:mt-[56px] md:grid-cols-2 md:gap-[40px]">
        <motion.ul
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="order-2 md:order-1"
        >
          {ITEMS.map((item, i) => {
            const open = i === active;
            return (
              <li key={item.title} className="border-b border-[#242d38]">
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  aria-expanded={open}
                  className="block w-full py-6 text-left"
                >
                  <span
                    className={`block tracking-[-0.03em] transition-all duration-300 ${
                      open
                        ? "text-[28px] font-medium text-white"
                        : "text-xl text-[#7d8794] hover:text-[#aab3be]"
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
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="block overflow-hidden"
                  >
                    <span className="block pt-3 text-lg text-[#7d8794]">
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
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="order-1 md:order-2"
        >
          <div className="rounded-[28px] border border-[#242d38] bg-[#0b0f14] p-2 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
            <div className="relative aspect-[1.8/1] overflow-hidden rounded-[22px] bg-[#0d1117]">
              <AnimatePresence initial={false}>
                <motion.div
                  key={active}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
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
    </section>
  );
}