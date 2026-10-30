"use client";

import { useRef, useState } from "react";
import {
  motion,
  type MotionValue,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";

type PanelImage = {
  src?: string;
  alt: string;
};

// Put the two images in /public/scattered/ as before.jpg and after.jpg.
// If yours are .png or .webp, change the extension in the paths below.
const BEFORE: PanelImage = {
  // src: "/scattered/card-2.avif",
  alt: "A pile of scattered paper drawings",
};
const AFTER: PanelImage = {
  // src: "/scattered/card-1.avif",
  alt: "Drawings linked into one project set",
};
const CAPTION = "Every sheet, spec and RFI, linked.";

// What goes into the linked set. Only list document types your product
// really reads.
const RECORD = [
  { label: "Written", items: ["Specifications", "RFIs", "Addenda"] },
  { label: "Drawn", items: ["Sheets", "Details", "Schedules"] },
];

const EASE = [0.22, 1, 0.36, 1] as const;

type ScatteredCard = {
  title: string;
  text: string;
  image?: string;
  from: "left" | "right";
};

// The two cards under the container. Put the images in /public/scattered/
// as card-3.avif and card-4.avif (change the extension here if yours differ).
const CARDS: ScatteredCard[] = [
  {
    title: "RFIs, ready to send",
    text: "References and markups included.",
    // image: "/scattered/card-3.avif",
    from: "left",
  },
  {
    title: "Fits your stack",
    text: "Works with the tools your team already uses.",
    // image: "/scattered/card-4.avif",
    from: "right",
  },
];

/* ---------- the two images: loose on the left, aligned on the right ---------- */

function Panel({
  src,
  alt,
  from,
  delay,
  rotateY,
  rotateZ,
  scale,
}: {
  src?: string;
  alt: string;
  from: "left" | "right";
  delay: number;
  rotateY: MotionValue<number> | number;
  rotateZ: MotionValue<number> | number;
  scale: MotionValue<number> | number;
}) {
  const [missing, setMissing] = useState(false);
  const showImage = !!src && !missing;

  return (
    <motion.div
      initial={{ opacity: 0, x: from === "left" ? -60 : 60 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-120px" }}
      transition={{ duration: 1, ease: EASE, delay }}
      style={{
        rotateY,
        rotateZ,
        scale,
        transformOrigin: from === "left" ? "right center" : "left center",
      }}
      className={`relative aspect-[2.3/1] w-full overflow-hidden rounded-[18px] bg-neutral-100 md:aspect-auto md:h-[340px] ${
        from === "left"
          ? "shadow-[-14px_24px_40px_-24px_rgba(15,23,42,0.35)]"
          : "shadow-[0_28px_50px_-26px_rgba(15,23,42,0.4)]"
      }`}
    >
      {showImage && (
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

/* ---------- a chip that starts out loose, then snaps into place ---------- */

function Chip({ label, index, reduce }: { label: string; index: number; reduce: boolean }) {
  // Fixed offsets, so server and client render the same thing.
  const x = ((index * 7) % 9) * 9 - 36;
  const y = ((index * 5) % 7) * 8 - 24;
  const r = ((index * 3) % 7) * 4 - 12;
  return (
    <motion.li
      initial={reduce ? { opacity: 0 } : { opacity: 0, x, y, rotate: r }}
      whileInView={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={
        reduce
          ? { duration: 0.4 }
          : { type: "spring", stiffness: 130, damping: 13, delay: 0.5 + index * 0.07 }
      }
      className="rounded-full border border-neutral-200 bg-white px-4 py-1.5 text-[15px] text-neutral-900 shadow-sm"
    >
      {label}
    </motion.li>
  );
}

/* ---------- a lower card: tilts toward the pointer ---------- */

function InfoCard({
  title,
  text,
  image,
  from,
  reduce,
}: {
  title: string;
  text: string;
  image?: string;
  from: "left" | "right";
  reduce: boolean;
}) {
  const [missing, setMissing] = useState(false);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 170, damping: 18, mass: 0.6 });
  const sy = useSpring(py, { stiffness: 170, damping: 18, mass: 0.6 });
  const rotateX = useTransform(sy, [-0.5, 0.5], [6, -6]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-7, 7]);
  const gx = useTransform(sx, [-0.5, 0.5], [0, 100]);
  const gy = useTransform(sy, [-0.5, 0.5], [0, 100]);
  const shadowX = useTransform(sx, [-0.5, 0.5], [14, -14]);
  const shadowY = useTransform(sy, [-0.5, 0.5], [30, 14]);
  const glare = useMotionTemplate`radial-gradient(320px circle at ${gx}% ${gy}%, rgba(255,255,255,0.32), transparent 65%)`;
  const shadow = useMotionTemplate`${shadowX}px ${shadowY}px 40px -20px rgba(15,23,42,0.3)`;
  const showImage = !!image && !missing;

  return (
    <motion.article
      initial={{ opacity: 0, x: from === "left" ? "-25vw" : "25vw" }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1.1, ease: EASE }}
      style={{ perspective: 1100 }}
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        px.set((e.clientX - r.left) / r.width - 0.5);
        py.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onPointerLeave={() => {
        px.set(0);
        py.set(0);
      }}
    >
      <motion.div
        style={{ rotateX: reduce ? 0 : rotateX, rotateY: reduce ? 0 : rotateY, boxShadow: shadow }}
        className="group relative h-full overflow-hidden rounded-[28px] border border-neutral-200 bg-white"
      >
        <div className="aspect-[1.77/1] w-full overflow-hidden bg-neutral-100">
          {showImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
              draggable={false}
              onError={() => setMissing(true)}
            />
          )}
        </div>
        <div className="px-7 py-7">
          <h3 className="text-2xl font-medium tracking-[-0.03em] text-neutral-900">{title}</h3>
          <p className="mt-2 text-lg text-neutral-500">{text}</p>
        </div>
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ background: glare }}
        />
      </motion.div>
    </motion.article>
  );
}

/* ---------- section ---------- */

export default function Scattered() {
  const reduce = !!useReducedMotion();
  const boxRef = useRef<HTMLDivElement>(null);

  // 0 when the container enters the screen, 1 once it is about mid-screen.
  const { scrollYProgress } = useScroll({
    target: boxRef,
    offset: ["start 90%", "start 35%"],
  });
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });

  // Left stays a little loose. Right comes square and flat: "linked".
  const beforeY = useTransform(p, [0, 1], [24, 7]);
  const beforeZ = useTransform(p, [0, 1], [-5, -1.5]);
  const beforeS = useTransform(p, [0, 1], [0.94, 0.98]);
  const afterY = useTransform(p, [0, 1], [-24, 0]);
  const afterZ = useTransform(p, [0, 1], [3, 0]);
  const afterS = useTransform(p, [0, 1], [0.94, 1]);

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
        ref={boxRef}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, ease: EASE }}
        className="mt-14 rounded-[28px] border border-neutral-200 bg-white p-5 shadow-[0_4px_20px_-8px_rgba(15,23,42,0.15)] md:mt-[56px] md:p-8"
      >
        <div
          className="grid items-center gap-4 md:grid-cols-[1fr_auto_1fr] md:gap-[20px]"
          style={{ perspective: 1400 }}
        >
          <Panel
            {...BEFORE}
            from="left"
            delay={0.25}
            rotateY={reduce ? 0 : beforeY}
            rotateZ={reduce ? 0 : beforeZ}
            scale={reduce ? 1 : beforeS}
          />

          {/* Arrow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.4 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.9 }}
            className="mx-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent text-black shadow-[0_10px_24px_-8px_rgba(15,23,42,0.4)]"
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

          <Panel
            {...AFTER}
            from="right"
            delay={0.25}
            rotateY={reduce ? 0 : afterY}
            rotateZ={reduce ? 0 : afterZ}
            scale={reduce ? 1 : afterS}
          />
        </div>

        <p className="mt-8 text-center text-lg text-neutral-500">{CAPTION}</p>

        {/* Written and drawn, in one record */}
        <div className="mt-8 border-t border-dashed border-neutral-200 pt-8">
          <div className="grid gap-4 md:grid-cols-2">
            {RECORD.map((group, gi) => (
              <div
                key={group.label}
                className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6"
              >
                <p className="flex items-center gap-2 text-sm text-neutral-600">
                  <span className="size-1.5 rounded-full bg-accent" />
                  {group.label}
                </p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {group.items.map((item, ci) => (
                    <Chip key={item} label={item} index={gi * 3 + ci} reduce={reduce} />
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
          <InfoCard key={card.title} {...card} reduce={reduce} />
        ))}
      </div>
    </section>
  );
}