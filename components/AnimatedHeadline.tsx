"use client";

import { useEffect, type ReactNode } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";

// Same switch as your Hero cards: your laptop has "reduce motion" turned on,
// so this is true to let you see the animation. Set it to false before launch
// so people with that system setting get a still headline.
const IGNORE_REDUCED_MOTION = true;

// Yellow text with a soft, narrow glint that passes through it.
// To make the gloss stronger: widen the band (for example 44% and 56%),
// or change #FFF4C2 to #FFFFFF.
const SHINE =
  "linear-gradient(100deg, #F5C93C 0%, #F5C93C 46%, #FFF4C2 50%, #F5C93C 54%, #F5C93C 100%)";

const REVEAL_SECONDS = 1.1;
const GLINT_SECONDS = 1.4; // how long one pass takes
const GLINT_PAUSE = 3.5; // seconds of rest between passes

// One line of text, revealed left to right by a thin plotter line.
// The reveal edge and the line both read from the same `edge` value, so the
// line always sits exactly on the edge of the text.
function PlotReveal({
  children,
  delay,
  still,
  gloss = false,
  className = "",
}: {
  children: ReactNode;
  delay: number;
  still: boolean;
  gloss?: boolean;
  className?: string;
}) {
  const p = useMotionValue(still ? 1 : 0);

  useEffect(() => {
    if (still) {
      p.set(1);
      return;
    }
    const controls = animate(p, 1, {
      duration: REVEAL_SECONDS,
      ease: [0.65, 0, 0.35, 1],
      delay,
    });
    return () => controls.stop();
  }, [still, p, delay]);

  // Edge position as a % of the text width: starts just left of the text and
  // ends a little past the last letter, so nothing at the end is ever cut off.
  const edge = useTransform(p, (v) => -4 + v * 110);
  const clip = useTransform(edge, (e) => `inset(-25% ${100 - e}% -35% -4%)`);
  const left = useTransform(edge, (e) => `${e}%`);
  const lineOpacity = useTransform(p, [0, 0.001, 0.92, 1], [0, 1, 1, 0]);

  return (
    <span className="relative inline-block">
      <motion.span style={{ clipPath: clip }} className={`inline-block ${className}`}>
        {gloss ? (
          <motion.span
            className="inline-block"
            style={{
              backgroundImage: SHINE,
              backgroundSize: "300% 100%",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
              WebkitTextFillColor: "transparent",
              // The gradient only paints inside its own box, so the box is
              // made bigger at the bottom and the sides (and pulled back with
              // matching negative margins so nothing moves). Otherwise the
              // tail of the "g" and the last letter would be cut off.
              paddingBottom: "0.24em",
              marginBottom: "-0.24em",
              paddingLeft: "0.05em",
              marginLeft: "-0.05em",
              paddingRight: "0.12em",
              marginRight: "-0.12em",
              // a very thin gold edge so the letters stay visible when the glint passes
              filter: "drop-shadow(0 0.02em 0 rgba(160,115,10,0.4))",
            }}
            initial={{ backgroundPosition: "100% 0%" }}
            animate={{
              backgroundPosition: still ? "100% 0%" : ["100% 0%", "0% 0%"],
            }}
            transition={
              still
                ? { duration: 0 }
                : {
                    duration: GLINT_SECONDS,
                    ease: "easeInOut",
                    delay: delay + REVEAL_SECONDS + 0.4,
                    repeat: Infinity,
                    repeatDelay: GLINT_PAUSE,
                  }
            }
          >
            {children}
          </motion.span>
        ) : (
          children
        )}
      </motion.span>

      {/* the plotter line, riding exactly on the reveal edge */}
      <motion.span
        aria-hidden
        style={{ left, opacity: lineOpacity }}
        className="pointer-events-none absolute -top-[0.08em] -bottom-[0.2em] w-[3px] -translate-x-1/2 bg-neutral-900"
      />
    </span>
  );
}

export default function AnimatedHeadline() {
  const systemReduce = !!useReducedMotion();
  const still = systemReduce && !IGNORE_REDUCED_MOTION;

  return (
    <>
      <span className="block">
        <PlotReveal delay={0.1} still={still} className="text-neutral-900">
          The Construction
        </PlotReveal>
      </span>

      <span className="block">
        <PlotReveal delay={0.55} still={still} gloss>
          Intelligence Layer
        </PlotReveal>
      </span>
    </>
  );
} 