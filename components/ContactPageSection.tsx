"use client";

import { useState } from "react";

// TODO: replace these with your real details
const EMAIL = "hello@yourdomain.com";
const SOCIALS = [
  { label: "X", href: "#", icon: "x" },
  { label: "Instagram", href: "#", icon: "instagram" },
  { label: "LinkedIn", href: "#", icon: "linkedin" },
  { label: "Facebook", href: "#", icon: "facebook" },
] as const;

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
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

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
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="min-h-screen bg-neutral-50 px-6 pb-20 pt-[66px] text-neutral-900 md:px-10">
      <div className="mx-auto grid max-w-[1200px] gap-12 pt-16 lg:grid-cols-2 lg:gap-16">
        {/* Left column */}
        <div className="flex flex-col justify-between gap-16">
          <div>
            <span className="inline-block rounded-full bg-transparent text-[14px] font-black uppercase tracking-[0.16em] text-accent">
              CONTACT
            </span>
            <h1 className="mt-5 text-[44px] font-medium leading-[1.05] tracking-tight sm:text-[56px]">
              Request a pilot.
            </h1>
            <p className="mt-6 max-w-[480px] text-[17px] leading-relaxed text-neutral-600">
              Send us one project. In a week you will know exactly what it finds. Tell us a little about your team and we will be in touch.
            </p>

            <div className="mt-8 flex gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="grid size-12 place-items-center rounded-full border border-neutral-200 bg-white text-neutral-900 transition hover:border-neutral-900"
                >
                  <SocialIcon icon={s.icon} />
                </a>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="keep-white grid size-[100px] shrink-0 place-items-center rounded-full bg-linear-to-br from-neutral-950 to-neutral-600 text-white sm:size-[130px]">
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3 7 9 6 9-6" />
              </svg>
            </div>
            <div>
              <p className="font-mono text-[13px] uppercase tracking-wide text-neutral-600">
                Direct contact:
              </p>
              <a
                href={`mailto:${EMAIL}`}
                className="mt-1 block text-[22px] font-medium underline underline-offset-4 sm:text-[26px]"
              >
                {EMAIL}
              </a>
            </div>
          </div>
        </div>

        {/* Form card */}
        <form
          onSubmit={onSubmit}
          className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8"
        >
          <h2 className="text-[26px] font-medium tracking-tight">Tell us about your company</h2>
          <p className="mt-3 text-[15px] text-neutral-600">&quot;*&quot; indicates required fields</p>
          <div className="my-6 border-t border-dashed border-neutral-200" />

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
              rows={6}
              placeholder="Leave your message here..."
              className={`${input} resize-y`}
            />
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button
              type="submit"
              disabled={status === "sending"}
              className="keep-white rounded-full bg-neutral-950 px-6 py-3 text-[15px] font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
            >
              {status === "sending" ? "Sending..." : "Send message"}
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
        </form>
      </div>
    </section>
  );
}