"use client";
import { useSiteMotion } from "./SiteMotion";

import Link from "next/link";
import { useRef, useState } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import type { ReactNode } from "react";

// especially the storage, onboarding, training and approval ones.
const HEADING = "Questions teams ask first.";
const FAQS: { q: string; a: ReactNode }[] = [
  {
    q: "Does it replace our design software or document control?",
    a: "Stratora is intended to support document review alongside your existing tools. Confirm supported document types, storage and integrations when scoping an engagement.",
  },
  {
    q: "Where do our documents live?",
    a: "Storage location, retention and access arrangements should be confirmed for your engagement before you share project documents. Ask the team for the applicable data-handling terms.",
  },
  {
    q: "How long does onboarding take?",
    a: "Timing depends on the agreed workflow and document set. We will scope onboarding with you before work begins.",
  },
  {
    q: "What if the answer is not in the documents?",
    a: "Treat an answer without supporting source material as unverified. Your evaluation should test missing information, conflicting documents and incorrect citations as well as successful answers.",
  },
  {
    q: "Who approves the numbers?",
    a: "A qualified person on your team should verify quantities and impact figures against the issued documents before relying on them. Agree how this review is recorded in your workflow.",
  },
  {
    q: "Are our documents used to train AI models?",
    a: "Request the model-data policy and provider terms for your engagement before uploading confidential documents. The prepared examples on this website do not process your documents.",
  },
  {
    q: "How is pricing structured?",
    a: (
      <>
        We scope pilots and wider engagements around your requirements. Currency, pricing and deliverables are confirmed in writing. See the{" "}
        <Link href="/pricing" className="font-medium text-neutral-900 underline underline-offset-4">
          Pricing page
        </Link>{" "}
        for details, or{" "}
        <Link href="/contact?topic=question" className="font-medium text-neutral-900 underline underline-offset-4">
          get in touch
        </Link>{" "}
        and we will help you pick one.
      </>
    ),
  },
];

const EASE = [0.22, 1, 0.36, 1] as const;

/* The one orchestrated moment: sheets fold down from their top edge, one after another. */
const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};
const sheetVariants = {
  hidden: { opacity: 0, y: 40, rotateX: -28 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.9, ease: EASE },
  },
};

function FaqCard({
  item,
  i,
  isOpen,
  onToggle,
  reduce,
}: {
  item: (typeof FAQS)[number];
  i: number;
  isOpen: boolean;
  onToggle: () => void;
  reduce: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // pointer position inside the card, 0..1
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);

  const spring = { stiffness: 170, damping: 18, mass: 0.6 };
  const rotateX = useSpring(useTransform(py, [0, 1], [4, -4]), spring);
  const rotateY = useSpring(useTransform(px, [0, 1], [-5, 5]), spring);

  // soft spotlight that follows the cursor
  const gx = useTransform(px, (v) => `${v * 100}%`);
  const gy = useTransform(py, (v) => `${v * 100}%`);
  const spotlight = useMotionTemplate`radial-gradient(380px circle at ${gx} ${gy}, rgba(0,0,0,0.045), transparent 65%)`;

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const onLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <motion.li
      variants={sheetVariants}
      style={{ transformOrigin: "50% 0%", transformPerspective: 1200 }}
      className="list-none"
    >
      <motion.div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={
          reduce
            ? undefined
            : { rotateX, rotateY, transformStyle: "preserve-3d", transformPerspective: 1000 }
        }
        animate={reduce ? undefined : { z: isOpen ? 28 : 0, scale: isOpen ? 1.012 : 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 24 }}
        className={`relative overflow-hidden rounded-2xl border transition-[background-color,border-color,box-shadow] duration-500 ${
          isOpen
            ? "border-neutral-900/15 bg-white shadow-[0_30px_60px_-20px_rgba(0,0,0,0.25),0_8px_18px_-8px_rgba(0,0,0,0.12)]"
            : "border-neutral-200 bg-white/60 shadow-[0_1px_0_rgba(0,0,0,0.03)] hover:border-neutral-300 hover:bg-white"
        }`}
      >
        {!reduce && (
          <motion.div
            aria-hidden="true"
            style={{ background: spotlight }}
            className="pointer-events-none absolute inset-0"
          />
        )}

        <h3 className="relative">
          <button
            type="button"
            id={`faq-q-${i}`}
            aria-expanded={isOpen}
            aria-controls={`faq-a-${i}`}
            onClick={onToggle}
            className="flex w-full items-center justify-between gap-6 px-6 py-6 text-left outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 md:px-8 md:py-7"
          >
            <span className="text-lg font-medium tracking-[-0.02em] text-neutral-900 md:text-xl">
              {item.q}
            </span>
            <span
              aria-hidden="true"
              className={`keep-white relative grid h-10 w-10 shrink-0 place-items-center rounded-full border transition-all duration-500 ${
                isOpen
                  ? "rotate-180 border-neutral-900 bg-neutral-900 text-white"
                  : "border-neutral-300 text-neutral-500"
              }`}
            >
              <span className="absolute h-px w-4 bg-current" />
              <span
                className={`absolute h-4 w-px bg-current transition-transform duration-500 ${
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
          animate={
            isOpen
              ? { height: "auto", opacity: 1, visibility: "visible" }
              : { height: 0, opacity: 0, transitionEnd: { visibility: "hidden" } }
          }
          transition={{ duration: 0.45, ease: EASE }}
          className="relative overflow-hidden"
        >
          <div className="px-6 pb-8 md:px-8">
            <div className="mb-5 h-px w-full bg-neutral-200" />
            <div className="max-w-[620px] text-base leading-relaxed text-neutral-500 md:text-lg">
              {item.a}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.li>
  );
}

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const { paused: reduce } = useSiteMotion();

  return (
    <section
      id="faq"
      aria-label="Frequently asked questions"
      className="relative overflow-hidden bg-background px-6 py-20 md:px-24 md:py-28"
    >
      {/* faint drawing-sheet grid that fades out toward the edges */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(0,0,0,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.045) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 45%, black, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 45%, black, transparent 80%)",
        }}
      />

      <div className="relative mx-auto grid max-w-[1280px] gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        {/* left: sticky heading */}
        <div className="lg:sticky lg:top-32 lg:self-start">
          <motion.h2
            initial={reduce ? false : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: EASE }}
            className="text-[clamp(2.25rem,4.2vw,3.75rem)] font-medium leading-[1.02] tracking-[-0.045em] text-neutral-900"
          >
            {HEADING}
          </motion.h2>

          <p className="mt-6 max-w-[360px] text-lg leading-relaxed text-neutral-500">
            Have a different question? Tell us about your workflow.
          </p>

          <Link
            href="/contact?topic=question"
            className="group mt-8 inline-flex items-center gap-3 rounded-full bg-neutral-900 px-6 py-3.5 text-base font-medium text-white keep-white transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
          >
            Ask a question
            <span
              aria-hidden="true"
              className="inline-block transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </div>

        {/* right: stack of 3D sheets */}
        <motion.ul
          variants={listVariants}
          initial={reduce ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          style={{ perspective: 1400 }}
          className="flex flex-col gap-3"
        >
          {FAQS.map((item, i) => (
            <FaqCard
              key={item.q}
              item={item}
              i={i}
              isOpen={open === i}
              onToggle={() => setOpen(open === i ? null : i)}
              reduce={reduce}
            />
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
