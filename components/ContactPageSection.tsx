"use client";

import { useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";

// TODO: replace these with your real details
const EMAIL = "hello@yourdomain.com";
const SOCIALS = [
  { label: "X", href: "#", icon: "x" },
  { label: "Instagram", href: "#", icon: "instagram" },
  { label: "LinkedIn", href: "#", icon: "linkedin" },
  { label: "Facebook", href: "#", icon: "facebook" },
] as const;

const TOPICS = [
  {
    id: "pilot",
    label: "Request a pilot",
    title: "Request a pilot.",
    text: "Send us one project. In a week you will know exactly what it finds. Tell us a little about your team and we will be in touch.",
  },
  {
    id: "demo",
    label: "Book a demo",
    title: "Book a demo.",
    text: "Tell us about your team and we will walk you through Stratora and answer your questions.",
  },
  {
    id: "question",
    label: "Ask a question",
    title: "Ask us anything.",
    text: "Security, pricing or how it works. Send your question and we will reply by email.",
  },
] as const;

// TODO: confirm these steps match how you really work with new customers
const NEXT_STEPS = [
  { title: "We write back", text: "A person from the team replies to you by email." },
  { title: "You pick one project", text: "Start with a single drawing set, nothing more." },
  { title: "You see what it finds", text: "Cited answers you can check against the sheets." },
];

const EASE = [0.22, 1, 0.36, 1] as const;

/* ------------------------------------------------------------------ */
/* 3D scene: five drawing sheets start scattered and link into one     */
/* stack as the form is filled in. Each sheet = one part of the form.  */
/* ------------------------------------------------------------------ */

// Where each sheet starts (progress 0). At progress 1 they all sit in a neat stack.
// FIX: the own tilts (rx, ry) are small on purpose. The whole scene is already
// tipped back 52deg, so a big extra tilt turned sheets edge-on (thin slivers).
// The spread (x, y) and the height (z) are also smaller so nothing leaves the frame.
const SHEETS = [
  { id: "P-001", x: -100, y: -75, z: 70, rx: -8, ry: 6, rz: -18, flag: "right-6 top-6 h-8 w-14" },
  { id: "S-102", x: 95, y: -85, z: 100, rx: 7, ry: -8, rz: 14, flag: "left-6 top-8 h-7 w-12" },
  { id: "M-204", x: -90, y: 80, z: 40, rx: 9, ry: 5, rz: 10, flag: "right-8 bottom-12 h-8 w-14" },
  { id: "E-110", x: 100, y: 70, z: 85, rx: -6, ry: -7, rz: -12, flag: "left-8 bottom-10 h-7 w-12" },
  { id: "A-301", x: 5, y: -5, z: 120, rx: 4, ry: 5, rz: 20, flag: "right-8 top-8 h-9 w-16" },
];
const GAP = 34; // space between sheets once stacked

function Sheet({
  sheet,
  index,
  p,
  reduce,
}: {
  sheet: (typeof SHEETS)[number];
  index: number;
  p: MotionValue<number>;
  reduce: boolean;
}) {
  const x = useTransform(p, [0, 1], [sheet.x, 0]);
  const y = useTransform(p, [0, 1], [sheet.y, 0]);
  const z = useTransform(p, [0, 1], [sheet.z, index * GAP]);
  const rotateX = useTransform(p, [0, 1], [sheet.rx, 0]);
  const rotateY = useTransform(p, [0, 1], [sheet.ry, 0]);
  const rotateZ = useTransform(p, [0, 1], [sheet.rz, 0]);
  const tag = useTransform(p, [0.8, 1], [0, 1]);
  const top = index === SHEETS.length - 1;

  return (
    <motion.div
      aria-hidden
      style={{ x, y, z, rotateX, rotateY, rotateZ, transformStyle: "preserve-3d" }}
      className="absolute left-1/2 top-1/2 -ml-[130px] -mt-[85px] h-[170px] w-[260px]"
    >
      <motion.div
        animate={reduce ? undefined : { z: [0, 10, 0] }}
        transition={{ duration: 5 + index, delay: index * 0.4, repeat: Infinity, ease: "easeInOut" }}
        style={{
          backgroundImage:
            "linear-gradient(rgba(15,23,42,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.07) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
        className="relative h-full w-full rounded-lg border border-neutral-300 bg-neutral-50 shadow-[0_30px_50px_-20px_rgba(0,0,0,0.6)]"
      >
        {/* a flagged markup box, like a conflict highlighted on a sheet */}
        <span className={`absolute rounded-sm border-2 border-accent ${sheet.flag}`} />
        <span className="absolute left-3 top-3 h-1.5 w-16 rounded-full bg-neutral-300" />
        <span className="absolute left-3 top-6 h-1.5 w-10 rounded-full bg-neutral-200" />
        <span className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded border border-neutral-300 bg-white px-2 py-1 text-[10px] font-semibold text-neutral-700">
          <span className="size-1.5 bg-accent" />
          {sheet.id}
        </span>
        {top && (
          <motion.span
            style={{ opacity: tag }}
            className="absolute bottom-3 left-3 rounded-full bg-accent px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-black"
          >
            Linked
          </motion.span>
        )}
      </motion.div>
    </motion.div>
  );
}

function Stage({
  p,
  count,
  sent,
  sectionRef,
  reduce,
}: {
  p: MotionValue<number>;
  count: number;
  sent: boolean;
  sectionRef: React.RefObject<HTMLElement | null>;
  reduce: boolean;
}) {
  // Mouse position over the stage (-0.5 to 0.5), smoothed
  const tx = useMotionValue(0);
  const ty = useMotionValue(0);
  const sx = useSpring(tx, { stiffness: 80, damping: 18 });
  const sy = useSpring(ty, { stiffness: 80, damping: 18 });
  const tiltY = useTransform(sx, [-0.5, 0.5], [-10, 10]);
  const tiltX = useTransform(sy, [-0.5, 0.5], [7, -7]);

  // The whole stack slowly turns as the page scrolls
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const sceneRotZ = useTransform(scrollYProgress, [0, 1], [-34, -14]);

  const bar = useTransform(p, (v) => Math.min(1, Math.max(0, v)));

  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    tx.set((e.clientX - r.left) / r.width - 0.5);
    ty.set((e.clientY - r.top) / r.height - 0.5);
  }
  function onLeave() {
    tx.set(0);
    ty.set(0);
  }

  return (
    <div
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="relative isolate h-[400px] overflow-hidden rounded-3xl bg-neutral-950 sm:h-[480px] lg:h-[620px]"
    >
      {/* faint grid + breathing yellow glow */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <motion.div
        aria-hidden
        className="absolute left-1/2 top-1/2 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/25 blur-3xl"
        animate={reduce ? undefined : { scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* 3D scene (smaller on small screens so nothing is cropped) */}
      <div className="absolute inset-0 z-0 scale-[0.55] [transform-style:preserve-3d] sm:scale-[0.75] lg:scale-[0.92]">
        <motion.div
          style={{
            rotateX: reduce ? 0 : tiltX,
            rotateY: reduce ? 0 : tiltY,
            transformPerspective: 1500,
            transformStyle: "preserve-3d",
          }}
          className="absolute inset-0"
        >
          <motion.div
            style={{ rotateX: 52, rotateZ: sceneRotZ, transformStyle: "preserve-3d" }}
            className="absolute left-1/2 top-1/2 h-0 w-0"
          >
            {SHEETS.map((s, i) => (
              <Sheet key={s.id} sheet={s} index={i} p={p} reduce={reduce} />
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* dark fades behind the text so labels stay readable over any sheet */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-20 bg-gradient-to-b from-neutral-950 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-28 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-transparent"
      />

      {/* labels over the scene */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between p-6">
        <span className="rounded-full border border-neutral-700 bg-neutral-950 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-300">
          Your project
        </span>

      </div>

      <div className="absolute inset-x-0 bottom-0 z-20 p-6">
        <div className="flex items-center justify-between text-[13px] text-neutral-300">
          <span>
            {sent
              ? "Sent. Your project is linked into one set."
              : count === 5
                ? "Everything is linked. Send it when you are ready."
                : "Fill in the form and watch the sheets link up."}
          </span>
          <span className="tabular-nums text-neutral-400">{sent ? "5" : count}/5</span>
        </div>
        <div className="mt-3 h-1 overflow-hidden rounded-full bg-neutral-800">
          <motion.div style={{ scaleX: bar }} className="h-full origin-left bg-accent" />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function SocialIcon({ icon }: { icon: (typeof SOCIALS)[number]["icon"] }) {
  const stroke = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  if (icon === "x")
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    );
  if (icon === "instagram")
    return (
      <svg {...stroke}>
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <path d="M17.5 6.5h.01" />
      </svg>
    );
  if (icon === "linkedin")
    return (
      <svg {...stroke}>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    );
  return (
    <svg {...stroke}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

const label = "mb-2 block font-mono text-[13px] uppercase tracking-wide text-neutral-800";
const input =
  "w-full rounded-md border border-neutral-200 bg-neutral-50 px-4 py-3 text-[15px] text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-900 focus:bg-white focus:ring-2 focus:ring-accent/60";

export default function ContactPageSection() {
  const reduce = !!useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [topicId, setTopicId] = useState<(typeof TOPICS)[number]["id"]>("pilot");
  const [count, setCount] = useState(0);

  // How "linked" the sheets are (0 to 1), smoothed with a spring
  const target = useMotionValue(0);
  const p = useSpring(target, { stiffness: 70, damping: 18, mass: 0.8 });

  const topic = TOPICS.find((t) => t.id === topicId) ?? TOPICS[0];

  // Each filled-in part of the form links one more sheet
  function sync(form: HTMLFormElement) {
    const get = (n: string) =>
      form.elements.namedItem(n) as HTMLInputElement | HTMLTextAreaElement | null;
    let n = ["firstName", "lastName", "phone", "message"].filter((k) => get(k)?.value.trim()).length;
    const em = get("email") as HTMLInputElement | null;
    if (em && em.value && em.validity.valid) n += 1;
    setCount(n);
    target.set(n / 5);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");
    try {
      const data = Object.fromEntries(new FormData(form));
      // TODO: send `data` somewhere real (an API route, Formspree, etc.).
      // For now it only simulates sending, nothing is delivered yet.
      console.log(data);
      await new Promise((r) => setTimeout(r, 600));
      form.reset();
      setStatus("sent");
      target.set(1);
    } catch {
      setStatus("error");
    }
  }

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-hidden bg-neutral-50 px-6 pb-24 pt-[85px] text-neutral-900 md:px-10"
    >
      {/* soft yellow glow at the top */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-160px] -z-10 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-accent/25 blur-3xl"
        animate={reduce ? undefined : { scale: [1, 1.12, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="mx-auto max-w-[1280px]">
        {/* Heading */}
        <div className="mx-auto max-w-3xl pt-10 text-center">
          <motion.span
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="inline-block text-[14px] font-black uppercase tracking-[0.16em] text-accent"
          >
            CONTACT
          </motion.span>

          <h1 className="mt-5 text-[clamp(2.5rem,5vw,4rem)] font-medium leading-[1.0] tracking-[-0.04em]">
            <span className="block overflow-hidden pb-[0.12em]">
              <motion.span
                key={topic.id}
                className="block"
                initial={reduce ? false : { y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.7, ease: EASE }}
              >
                {topic.title}
              </motion.span>
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-[560px] text-[17px] leading-relaxed text-neutral-600">
            {topic.text}
          </p>
        </div>

        {/* Scene + form */}
        <div className="mt-14 grid items-start gap-6 lg:grid-cols-[1.05fr_1fr] lg:gap-8">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9, ease: EASE }}
            className="lg:sticky lg:top-[96px]"
          >
            <Stage p={p} count={count} sent={status === "sent"} sectionRef={sectionRef} reduce={reduce} />
          </motion.div>

          <motion.form
            onSubmit={onSubmit}
            onChange={(e) => {
              if (status === "sent" || status === "error") setStatus("idle");
              sync(e.currentTarget);
            }}
            initial={reduce ? false : { opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
            className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-[0_4px_20px_-8px_rgba(15,23,42,0.15)] sm:p-8"
          >
            <h2 className="text-[26px] font-medium tracking-tight">Tell us about your company</h2>

            {/* What do you want to do? */}
            <fieldset className="mt-6">
              <legend className={label}>What do you need?</legend>
              <div className="flex flex-wrap gap-2">
                {TOPICS.map((t) => (
                  <label key={t.id} className="cursor-pointer">
                    <input
                      type="radio"
                      name="topic"
                      value={t.id}
                      checked={topicId === t.id}
                      onChange={() => setTopicId(t.id)}
                      className="peer sr-only"
                    />
                    <span className="inline-flex rounded-full border border-neutral-200 bg-white px-4 py-2 text-[14px] font-medium text-neutral-700 transition hover:border-neutral-900 peer-checked:border-neutral-950 peer-checked:bg-neutral-950 peer-checked:text-neutral-50 peer-focus-visible:ring-2 peer-focus-visible:ring-accent">
                      {t.label}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <p className="mt-6 text-[15px] text-neutral-600">&quot;*&quot; indicates required fields</p>
            <div className="my-5 border-t border-dashed border-neutral-200" />

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className={label}>First name *</label>
                <input id="firstName" name="firstName" required placeholder="First name" className={input} />
              </div>
              <div>
                <label htmlFor="lastName" className={label}>Last name *</label>
                <input id="lastName" name="lastName" required placeholder="Last name" className={input} />
              </div>
              <div>
                <label htmlFor="email" className={label}>Email *</label>
                <input id="email" name="email" type="email" required placeholder="Email address" className={input} />
              </div>
              <div>
                <label htmlFor="phone" className={label}>Number *</label>
                <input id="phone" name="phone" type="tel" required placeholder="Enter phone number" className={input} />
              </div>
            </div>

            <div className="mt-5">
              <label htmlFor="message" className={label}>How can we help?</label>
              <textarea
                id="message"
                name="message"
                rows={5}
                placeholder="Leave your message here..."
                className={`${input} resize-y`}
              />
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button
                type="submit"
                disabled={status === "sending"}
                className="inline-flex items-center rounded-full bg-accent px-7 py-3.5 text-[15px] font-semibold text-black shadow-[0_8px_20px_-8px_rgba(245,201,60,0.8)] transition hover:opacity-90 disabled:opacity-60"
              >
                {status === "sending" ? "Sending..." : "Send message"}
                {status !== "sending" && (
                  <span aria-hidden className="ml-2">→</span>
                )}
              </button>
              {status === "sent" && (
                <p role="status" className="text-[14px] text-neutral-700">
                  Thanks, we will be in touch soon.
                </p>
              )}
              {status === "error" && (
                <p role="alert" className="text-[14px] text-red-600">
                  Something went wrong. Please try again.
                </p>
              )}
            </div>
          </motion.form>
        </div>

        {/* What happens next */}
        <div className="mt-20">
          <motion.h2
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: EASE }}
            className="text-center text-[clamp(1.75rem,3vw,2.5rem)] font-medium tracking-[-0.03em]"
          >
            What happens next
          </motion.h2>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {NEXT_STEPS.map((s, i) => (
              <motion.div
                key={s.title}
                initial={reduce ? false : { opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, ease: EASE, delay: i * 0.12 }}
                className="rounded-2xl border border-neutral-200 bg-white p-7 shadow-[0_2px_10px_-4px_rgba(15,23,42,0.1)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_12px_28px_-12px_rgba(15,23,42,0.22)]"
              >
                <span className="grid size-9 place-items-center rounded-full bg-accent text-[15px] font-semibold text-black">
                  {i + 1}
                </span>
                <p className="mt-5 text-[20px] font-medium tracking-[-0.02em]">{s.title}</p>
                <p className="mt-2 text-[16px] leading-relaxed text-neutral-600">{s.text}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Direct contact band */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: EASE }}
          className="mt-10 flex flex-col gap-8 rounded-3xl bg-neutral-950 p-8 md:flex-row md:items-center md:justify-between md:p-10"
        >
          <div className="flex items-center gap-5">
            <span className="grid size-[64px] shrink-0 place-items-center rounded-full bg-accent text-black">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3 7 9 6 9-6" />
              </svg>
            </span>
            <div>
              <p className="text-[13px] uppercase tracking-wide text-neutral-400">Direct contact</p>
              <a
                href={`mailto:${EMAIL}`}
                className="mt-1 block text-[22px] font-medium text-neutral-50 underline underline-offset-4 sm:text-[26px]"
              >
                {EMAIL}
              </a>
            </div>
          </div>

          <div className="flex gap-3">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="grid size-12 place-items-center rounded-full border border-neutral-700 text-neutral-200 transition hover:border-accent hover:text-accent"
              >
                <SocialIcon icon={s.icon} />
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}