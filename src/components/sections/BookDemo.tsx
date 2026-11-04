"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";

/* ------------------------------------------------------------------ */
/* SETUP: things only you can fill in                                  */
/* ------------------------------------------------------------------ */

// 1. Where the form should be sent. Paste a form service URL here
//    (Formspree, Getform, your own API route like "/api/contact", ...).
//    It receives JSON: { name, email, phone, type, message }.
//    While this is empty, nothing is sent anywhere.
const FORM_ENDPOINT = "";

// 2. Your booking link for the "Book a call" tab (Calendly, Cal.com, ...).
//    Empty = shows a placeholder.
const CALENDAR_URL = "";

// 3. The picture behind the form card (the blue-tinted photo in the reference).
//    It's a normal image that fills the whole card and is cropped to fit, with
//    the white form sitting on top of it. Save it in public/contact/ and paste
//    the path, e.g. "/contact/form-image.jpg". Any size works; a tall or square
//    picture shows best because the card is taller than it is wide.
const FORM_IMAGE = "";

// 4. Privacy policy page the checkbox text links to.
const PRIVACY_HREF = "/privacy";

const BLUE = "#1f3dff";
const PAPER = "#fbfcff";
const mono = {
  fontFamily:
    'var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
};

const REQUEST_TYPES = [
  "Book a demo",
  "Pricing question",
  "Enterprise plan",
  "Partnership",
  "Investor enquiry",
  "Support",
  "Something else",
];

const BULLETS: { lead: string; rest: string }[] = [
  { lead: "Turn strategy into action", rest: " by connecting your product goals to clear roadmaps and everyday work." },
  { lead: "Keep plans in sync", rest: " with shared priorities, clear ownership, and visibility across your product team." },
  { lead: "Keep context close", rest: " by bringing briefs, documents, and decisions into the same workspace as your plans." },
  {
    lead: "Align your team",
    rest: " around one shared direction—with strategy, roadmaps, documents, and daily work in one calm place, and AI to help keep them in agreement.",
  },
];

const HEADLINE = ["Connect", "with", "the", "Stratora", "team"];

/* ------------------------------------------------------------------ */
/* Logos (stand-ins, swap for the real marks when you have them)       */
/* ------------------------------------------------------------------ */

const lp = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": true } as const;

const RingMark = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden>
    <defs>
      <linearGradient id="bd-ring" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#0b0b12" />
        <stop offset="1" stopColor="#8d90a0" />
      </linearGradient>
    </defs>
    <circle cx="12" cy="12" r="10" fill="url(#bd-ring)" />
    <circle cx="12" cy="12" r="5" fill="#eef0f5" />
  </svg>
);
const GearMark = () => (
  <svg {...lp} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="5" />
    {[0, 45, 90, 135].map((a) => (
      <line key={a} x1="12" y1="2" x2="12" y2="5" transform={`rotate(${a} 12 12)`} />
    ))}
    {[180, 225, 270, 315].map((a) => (
      <line key={a} x1="12" y1="2" x2="12" y2="5" transform={`rotate(${a} 12 12)`} />
    ))}
  </svg>
);
const Snowflake = () => (
  <svg {...lp}>
    <g stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      {[0, 60, 120].map((a) => (
        <line key={a} x1="12" y1="2.5" x2="12" y2="21.5" transform={`rotate(${a} 12 12)`} />
      ))}
    </g>
    <circle cx="12" cy="12" r="2.6" />
  </svg>
);
const Diamonds = () => (
  <svg {...lp}>
    <g transform="rotate(45 12 12)">
      <rect x="4.5" y="4.5" width="6" height="6" />
      <rect x="13.5" y="4.5" width="6" height="6" />
      <rect x="4.5" y="13.5" width="6" height="6" />
      <rect x="13.5" y="13.5" width="6" height="6" />
    </g>
  </svg>
);
const Pinwheel = () => (
  <svg {...lp}>
    <path d="M3 3h8L3 11z M21 3v8l-8-8z M21 21h-8l8-8z M3 21v-8l8 8z" />
  </svg>
);

/* ------------------------------------------------------------------ */
/* Form bits                                                           */
/* ------------------------------------------------------------------ */

type FieldKey = "name" | "email" | "phone" | "type" | "message" | "consent";
type Errors = Partial<Record<FieldKey, string>>;

const inputCls =
  "w-full rounded-lg border bg-[#fbfcff] px-3 text-[14px] text-[#0b0b12] outline-none transition-all duration-200 placeholder:text-[#6b6d80] focus:border-[#1f3dff] focus:ring-4 focus:ring-[#1f3dff]/10";

function Field({
  label,
  id,
  error,
  children,
}: {
  label: string;
  id: FieldKey;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="bd-field" data-invalid={error ? "true" : "false"}>
      <label htmlFor={id} className="mb-2 block text-[11px] font-semibold uppercase" style={mono}>
        {label} <span className="text-[#e5484d]">*</span>
      </label>
      {children}
      {error && (
        <p role="alert" className="mt-1.5 text-[12px] text-[#e5484d]">
          {error}
        </p>
      )}
    </div>
  );
}

const border = (err?: string) => (err ? "border-[#e5484d]" : "border-black/10");

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */

export default function BookDemo() {
  const root = useRef<HTMLElement>(null);
  const [tab, setTab] = useState<"form" | "call">("form");
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [sentName, setSentName] = useState<string | null>(null);

  /* tab indicator */
  const tabRefs = useRef<Record<"form" | "call", HTMLButtonElement | null>>({ form: null, call: null });
  const indRef = useRef<HTMLSpanElement>(null);
  const tabMounted = useRef(false);

  useLayoutEffect(() => {
    const b = tabRefs.current[tab];
    if (!b || !indRef.current) return;
    gsap.to(indRef.current, {
      x: b.offsetLeft,
      width: b.offsetWidth,
      duration: tabMounted.current ? 0.5 : 0,
      ease: "power3.out",
    });
    tabMounted.current = true;
  }, [tab]);

  /* panel cross-fade on tab change */
  const panelMounted = useRef(false);
  useEffect(() => {
    if (!panelMounted.current) {
      panelMounted.current = true;
      return;
    }
    gsap.fromTo(".bd-panel", { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" });
  }, [tab]);

  /* entrance */
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".bd-eyebrow", { y: 12, opacity: 0, duration: 0.5 })
        .from(".bd-word", { yPercent: 110, duration: 0.9, stagger: 0.07, ease: "power4.out" }, "-=0.2")
        .from(".bd-bullet", { x: -24, opacity: 0, duration: 0.7, stagger: 0.1 }, "-=0.5")
        .from(".bd-trusted", { y: 16, opacity: 0, duration: 0.6 }, "-=0.5")
        .from(".bd-logo", { y: 14, opacity: 0, scale: 0.8, duration: 0.5, stagger: 0.07, ease: "back.out(2)" }, "-=0.3")
        .from(".bd-card", { x: 80, opacity: 0, duration: 1 }, 0.25)
        .from(".bd-bg", { clipPath: "inset(0% 0% 100% 0% round 24px)", duration: 1.1, ease: "power4.inOut" }, 0.45)
        .from(".bd-tabs", { y: -20, opacity: 0, scale: 0.9, duration: 0.6, ease: "back.out(1.8)" }, 0.9)
        .from(".bd-form-card", { y: 40, opacity: 0, duration: 0.8 }, 0.9)
        .from(".bd-field", { y: 18, opacity: 0, duration: 0.5, stagger: 0.07 }, 1.1)
        .from(".bd-submit", { y: 16, opacity: 0, duration: 0.5 }, "-=0.3");
    }, el);

    return () => ctx.revert();
  }, []);

  const shakeInvalid = () => {
    requestAnimationFrame(() => {
      const bad = root.current?.querySelectorAll('[data-invalid="true"]');
      if (bad && bad.length) {
        gsap.fromTo(
          bad,
          { x: -8 },
          { x: 0, duration: 0.6, ease: "elastic.out(1,0.3)", stagger: 0.04, clearProps: "x" }
        );
      }
    });
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    const v = (k: string) => String(f.get(k) ?? "").trim();

    const next: Errors = {};
    if (!v("name")) next.name = "Please enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v("email"))) next.email = "Please enter a valid email address.";
    if (v("phone").replace(/\D/g, "").length < 6) next.phone = "Please enter a valid phone number.";
    if (!v("type")) next.type = "Please choose an inquiry type.";
    if (v("message").length < 5) next.message = "Please tell us a little about what you need.";
    if (!f.get("consent")) next.consent = "Please agree to continue.";

    setErrors(next);
    if (Object.keys(next).length) {
      shakeInvalid();
      return;
    }

    setSending(true);
    try {
      if (FORM_ENDPOINT) {
        const res = await fetch(FORM_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            name: v("name"),
            email: v("email"),
            phone: v("phone"),
            type: v("type"),
            message: v("message"),
          }),
        });
        if (!res.ok) throw new Error(String(res.status));
      } else {
        console.warn("BookDemo: FORM_ENDPOINT is empty, so this message was not sent anywhere.");
        await new Promise((r) => setTimeout(r, 900));
      }
      setSentName(v("name").split(" ")[0]);
      requestAnimationFrame(() => {
        gsap.fromTo(".bd-ok-circle", { scale: 0, rotate: -90 }, { scale: 1, rotate: 0, duration: 0.7, ease: "back.out(2)" });
        gsap.fromTo(".bd-ok-check", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.6, delay: 0.35, ease: "power2.out" });
        gsap.from(".bd-ok-text", { y: 16, opacity: 0, duration: 0.6, stagger: 0.1, delay: 0.3 });
      });
    } catch {
      setErrors({ message: "Something went wrong sending your message. Please try again." });
    } finally {
      setSending(false);
    }
  };

  return (
    <section
      id="book-demo"
      ref={root}
      className="bg-[#eef0f5] px-6 pb-[100px] pt-[88px] text-[#0b0b12]"
    >
      <div className="mx-auto grid max-w-[1280px] gap-10 lg:grid-cols-[minmax(0,1fr)_740px]">
        {/* ------------------------- left ------------------------- */}
        <div className="flex flex-col justify-between gap-14">
          <div>
            <div
              className="bd-eyebrow flex items-center gap-2 text-[12px] uppercase"
              style={{ ...mono, color: BLUE }}
            >
              <span
                aria-hidden
                className="inline-block h-[8px] w-[8px] rounded-full border-2"
                style={{ borderColor: BLUE }}
              />
              Contact us
            </div>
            <h1 className="mt-4 max-w-[340px] text-[40px] font-medium leading-[1.1] tracking-[-0.02em] sm:text-[44px]">
              {HEADLINE.map((w, i) => (
                <span key={w} className="inline-block overflow-hidden pb-1 align-top">
                  <span className="bd-word inline-block">{w}</span>
                  {i < HEADLINE.length - 1 ? " " : ""}
                </span>
              ))}
            </h1>
          </div>

          <ul className="space-y-[14px]">
            {BULLETS.map((b) => (
              <li key={b.lead} className="bd-bullet flex gap-3 text-[16px] leading-[1.35]">
                <span
                  aria-hidden
                  className="mt-[6px] inline-block h-[9px] w-[9px] shrink-0 rounded-full border-2 border-[#0b0b12]"
                />
                <span className="text-[#1a1b26]">
                  <strong className="font-semibold text-[#0b0b12]">{b.lead}</strong>
                  {b.rest}
                </span>
              </li>
            ))}
          </ul>

          <div>
            <p className="bd-trusted text-[16px]">Trusted by more than 29,000 companies:</p>
            <div
              className="mt-5 overflow-hidden"
              style={{
                maskImage: "linear-gradient(to right, #000 82%, transparent 100%)",
                WebkitMaskImage: "linear-gradient(to right, #000 82%, transparent 100%)",
              }}
            >
              <div className="flex items-center gap-6 whitespace-nowrap text-[#0b0b12]">
                <span className="bd-logo flex items-center gap-2">
                  <RingMark />
                  <span className="text-[19px] font-extrabold tracking-tight">AURIX</span>
                </span>
                <span className="bd-logo flex items-center gap-2">
                  <GearMark />
                  <span className="font-serif text-[18px]">Lunair</span>
                </span>
                <span className="bd-logo flex items-center gap-2">
                  <Snowflake />
                  <span className="font-serif text-[18px]">Northway</span>
                </span>
                <span className="bd-logo flex items-center gap-2">
                  <Diamonds />
                  <span className="font-serif text-[18px]">Verdan</span>
                </span>
                <span className="bd-logo flex items-center gap-2">
                  <Pinwheel />
                  <span className="font-serif text-[18px]">Neurova</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------- right ------------------------- */}
        <div className="bd-card relative overflow-hidden rounded-[24px] p-4">
          {/* photo behind (or blue placeholder) */}
          <div aria-hidden className="bd-bg absolute inset-0">
            {FORM_IMAGE ? (
              <Image
                src={FORM_IMAGE}
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 740px"
                className="object-cover object-center"
              />
            ) : (
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse at 15% 10%, #8ea4ff 0%, transparent 55%), radial-gradient(ellipse at 90% 85%, #3f5cff 0%, transparent 55%), linear-gradient(160deg,#7f98ff 0%,#4c68ff 100%)",
                }}
              >
                <span
                  className="absolute right-6 top-5 rounded-lg border-2 border-dashed border-white/50 px-3 py-2 text-right text-[11px] uppercase text-white/80"
                  style={mono}
                >
                  Add image
                  <br />
                  public/contact/form-image.jpg
                </span>
              </div>
            )}
          </div>

          <div className="relative">
            {/* tabs */}
            <div className="bd-tabs relative mb-4 flex w-max gap-4" style={mono}>
              <span
                ref={indRef}
                aria-hidden
                className="absolute left-0 top-0 z-10 h-full rounded-full bg-[#0b0b12]"
                style={{ width: 0 }}
              />
              {(
                [
                  ["form", "Fill a form"],
                  ["call", "Book a call"],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  ref={(n) => {
                    tabRefs.current[key] = n;
                  }}
                  type="button"
                  onClick={() => setTab(key)}
                  aria-pressed={tab === key}
                  className={`relative rounded-full bg-white px-3 py-[13px] text-[13px] font-semibold uppercase transition-colors duration-300 ${
                    tab === key ? "text-white" : "text-[#0b0b12]"
                  }`}
                >
                  <span className="relative z-20">{label}</span>
                </button>
              ))}
            </div>

            <div className="bd-form-card rounded-[18px] bg-[#fbfcff] p-4">
              <div className="bd-panel">
                {tab === "form" ? (
                  sentName !== null ? (
                    /* ---- success ---- */
                    <div className="flex min-h-[620px] flex-col items-center justify-center text-center">
                      <svg className="bd-ok-circle" width="72" height="72" viewBox="0 0 72 72" fill="none" aria-hidden>
                        <circle cx="36" cy="36" r="34" fill={BLUE} />
                        <path
                          className="bd-ok-check"
                          d="M22 37l10 10 18-20"
                          stroke="#fff"
                          strokeWidth="4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          pathLength={1}
                          strokeDasharray={1}
                        />
                      </svg>
                      <h2 className="bd-ok-text mt-6 text-[28px] font-medium tracking-tight">
                        Thanks{sentName ? `, ${sentName}` : ""}.
                      </h2>
                      <p className="bd-ok-text mt-2 max-w-[360px] text-[16px] text-[#55576a]">
                        We’ve got your message and will be in touch soon.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setSentName(null);
                          setErrors({});
                        }}
                        className="bd-ok-text mt-6 text-[13px] uppercase underline underline-offset-4"
                        style={{ ...mono, color: BLUE }}
                      >
                        Send another message
                      </button>
                    </div>
                  ) : (
                    /* ---- form ---- */
                    <form onSubmit={onSubmit} noValidate className="space-y-4">
                      <Field label="Full name" id="name" error={errors.name}>
                        <input
                          id="name"
                          name="name"
                          autoComplete="name"
                          placeholder="Junior Carter"
                          className={`${inputCls} h-[41px] ${border(errors.name)}`}
                        />
                      </Field>
                      <Field label="Email" id="email" error={errors.email}>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          placeholder="info@example.com"
                          className={`${inputCls} h-[41px] ${border(errors.email)}`}
                        />
                      </Field>
                      <Field label="Phone number" id="phone" error={errors.phone}>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          autoComplete="tel"
                          placeholder="Phone Number"
                          className={`${inputCls} h-[41px] ${border(errors.phone)}`}
                        />
                      </Field>
                      <Field label="Request type" id="type" error={errors.type}>
                        <div className="relative">
                          <select
                            id="type"
                            name="type"
                            defaultValue=""
                            className={`${inputCls} h-[41px] cursor-pointer appearance-none pr-10 ${border(errors.type)}`}
                          >
                            <option value="" disabled>
                              Select inquiry type
                            </option>
                            {REQUEST_TYPES.map((t) => (
                              <option key={t} value={t}>
                                {t}
                              </option>
                            ))}
                          </select>
                          <svg
                            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#55576a]"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden
                          >
                            <path d="M6 9l6 6 6-6" />
                          </svg>
                        </div>
                      </Field>
                      <Field label="Your message" id="message" error={errors.message}>
                        <textarea
                          id="message"
                          name="message"
                          placeholder="Message us"
                          className={`${inputCls} h-[148px] resize-y py-3 ${border(errors.message)}`}
                        />
                      </Field>

                      <div className="bd-field" data-invalid={errors.consent ? "true" : "false"}>
                        <label className="flex cursor-pointer items-start gap-3">
                          <input type="checkbox" name="consent" id="consent" className="peer sr-only" />
                          <span
                            aria-hidden
                            className={`mt-[2px] flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border bg-white transition-all duration-200 peer-checked:border-[#1f3dff] peer-checked:bg-[#1f3dff] peer-focus-visible:ring-4 peer-focus-visible:ring-[#1f3dff]/20 [&>svg]:scale-0 peer-checked:[&>svg]:scale-100 ${
                              errors.consent ? "border-[#e5484d]" : "border-black/20"
                            }`}
                          >
                            <svg
                              className="transition-transform duration-200"
                              width="10"
                              height="10"
                              viewBox="0 0 12 12"
                              fill="none"
                              stroke="#fff"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M2.5 6.5l2.5 2.5 4.5-5" />
                            </svg>
                          </span>
                          <span className="text-[10.5px] uppercase leading-[1.35] tracking-wide text-[#2b2d3a]" style={mono}>
                            By submitting this form, you agree to the processing of your information as described
                            in our{" "}
                            <Link href={PRIVACY_HREF} className="underline-offset-2 hover:underline" style={{ color: BLUE }}>
                              Privacy Policy
                            </Link>
                            .
                          </span>
                        </label>
                        {errors.consent && (
                          <p role="alert" className="mt-1.5 text-[12px] text-[#e5484d]">
                            {errors.consent}
                          </p>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={sending}
                        style={{ ...mono, backgroundColor: BLUE }}
                        className="bd-submit group relative flex h-[40px] w-full items-center justify-center gap-2 overflow-hidden rounded-full text-[13px] font-semibold uppercase tracking-wide text-white disabled:opacity-80"
                      >
                        <span
                          aria-hidden
                          className="absolute inset-0 translate-y-full bg-[#0b0b12] transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-y-0"
                        />
                        <span
                          aria-hidden
                          className={`relative inline-block h-[8px] w-[8px] rounded-full border-2 border-white/80 transition-transform duration-300 group-hover:scale-125 ${
                            sending ? "animate-spin border-t-transparent" : ""
                          }`}
                        />
                        <span className="relative">{sending ? "Sending…" : "Submit"}</span>
                      </button>
                    </form>
                  )
                ) : (
                  /* ---- book a call ---- */
                  <div className="min-h-[620px]">
                    {CALENDAR_URL ? (
                      <iframe
                        src={CALENDAR_URL}
                        title="Book a call with the Stratora team"
                        className="h-[620px] w-full rounded-xl border-0"
                      />
                    ) : (
                      <div
                        className="flex h-[620px] flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-[#1f3dff]/30 p-6 text-center text-[12px] uppercase text-[#1f3dff]/80"
                        style={mono}
                      >
                        Add your booking link
                        <span className="max-w-[320px] normal-case tracking-normal text-[#55576a]">
                          Paste your Calendly or Cal.com link into CALENDAR_URL at the top of BookDemo.tsx and it
                          shows up here.
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}