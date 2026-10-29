"use client";

import { motion, useReducedMotion } from "motion/react";

// Same switch as your Hero cards: your laptop has "reduce motion" turned on,
// so this is true to let you see the animation. Set it to false before launch
// so people with that system setting get a still headline.
const IGNORE_REDUCED_MOTION = true;

const EASE = [0.22, 1, 0.36, 1] as const;

// Yellow text with a band of white that sweeps across it
const SHINE =
  "linear-gradient(100deg, #F5C93C 0%, #F5C93C 42%, #FFFFFF 50%, #F5C93C 58%, #F5C93C 100%)";

// Each word sits in a mask so it can slide up. The extra padding (and the
// matching negative margin) keeps the tails of g, y and p, and the right edge
// of the last letter, from being cut off. The headline's tight letter spacing
// makes each word's box a little narrower than its last letter, so the right
// side needs the most room.
const MASK =
  "block overflow-hidden pt-[0.12em] pb-[0.3em] pl-[0.05em] pr-[0.12em] -mt-[0.12em] -mb-[0.3em] -ml-[0.05em] -mr-[0.12em]";

export default function AnimatedHeadline() {
  const systemReduce = !!useReducedMotion();
  const still = systemReduce && !IGNORE_REDUCED_MOTION;

  return (
    <>
      {/* Line 1: "The Construction" slides up word by word */}
      <span aria-hidden className="block">
        {["The", "Construction"].map((w, i) => (
          <span key={w} className="mr-[0.22em] inline-block align-bottom last:mr-0">
            <span className={MASK}>
              <motion.span
                className="inline-block text-neutral-900"
                initial={still ? false : { y: "120%", rotate: 3 }}
                animate={{ y: 0, rotate: 0 }}
                transition={{ duration: 0.9, ease: EASE, delay: 0.05 + i * 0.09 }}
                style={{ transformOrigin: "0% 100%" }}
              >
                {w}
              </motion.span>
            </span>
          </span>
        ))}
      </span>

      {/* Line 2 */}
      <span aria-hidden className="block">
        {/* "Intelligence": yellow, slides up, then a white flash keeps sweeping through it */}
        <span className="mr-[0.22em] inline-block align-bottom">
          <span className={MASK}>
            <motion.span
              className="inline-block"
              style={{
                backgroundImage: SHINE,
                backgroundSize: "300% 100%",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
                WebkitTextFillColor: "transparent",
                transformOrigin: "0% 100%",
                // The gradient only paints inside this box, so the box is made
                // bigger at the bottom and the sides. Otherwise the tail of the
                // "g" and the edge of the last "e" are cut off.
                paddingBottom: "0.24em",
                marginBottom: "-0.24em",
                paddingLeft: "0.05em",
                marginLeft: "-0.05em",
                paddingRight: "0.12em",
                marginRight: "-0.12em",
                // a thin gold edge so the letters stay visible when the white flash passes
                filter: "drop-shadow(0 0.03em 0 rgba(160,115,10,0.6))",
              }}
              initial={still ? false : { y: "120%", rotate: 3, backgroundPosition: "100% 0%" }}
              animate={{
                y: 0,
                rotate: 0,
                backgroundPosition: still ? "100% 0%" : ["100% 0%", "0% 0%"],
              }}
              transition={{
                y: { duration: 0.9, ease: EASE, delay: 0.3 },
                rotate: { duration: 0.9, ease: EASE, delay: 0.3 },
                backgroundPosition: {
                  duration: 1.1,
                  ease: "easeInOut",
                  delay: 1.2,
                  repeat: Infinity,
                  repeatDelay: 0.8,
                },
              }}
            >
              Intelligence
            </motion.span>
          </span>
        </span>

        {/* "Layer": black text on a yellow block that wipes in from the left */}
        <span className="relative inline-block align-bottom px-[0.14em]">
          {/* the block reaches below the text so the tail of the "y" sits inside it */}
          <motion.span
            className="absolute inset-x-0 -bottom-[0.16em] top-[0.02em] origin-left overflow-hidden rounded-[0.14em] bg-accent shadow-[0_14px_34px_-12px_rgba(245,201,60,0.9)]"
            initial={still ? false : { scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.75 }}
          >
            {/* a white glint that glides across the block */}
            {!still && (
              <motion.span
                className="absolute inset-y-0 w-[45%] -skew-x-12 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                initial={{ left: "-60%" }}
                animate={{ left: "130%" }}
                transition={{
                  duration: 1.4,
                  ease: "easeInOut",
                  delay: 1.9,
                  repeat: Infinity,
                  repeatDelay: 2.6,
                }}
              />
            )}
          </motion.span>

          <span className={`relative ${MASK}`}>
            <motion.span
              className="inline-block text-black"
              initial={still ? false : { y: "120%", rotate: 3 }}
              animate={{ y: 0, rotate: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.5 }}
              style={{ transformOrigin: "0% 100%" }}
            >
              Layer
            </motion.span>
          </span>

          {/* a small sparkle that twinkles on the corner of the block */}
          {!still && (
            <motion.span
              className="absolute -right-[0.18em] -top-[0.12em] text-[0.34em] leading-none text-neutral-900"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0.8, 1.25, 0.8], rotate: [0, 25, 0], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 3, delay: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              ✦
            </motion.span>
          )}
        </span>
      </span>
    </>
  );
}