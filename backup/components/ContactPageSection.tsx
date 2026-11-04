"use client";

import { useState } from "react";

// TODO: replace these with your real details
const EMAIL = "hello@yourdomain.com";
const SOCIALS = [
  { label: "X", href: "#" },
  { label: "Instagram", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "Facebook", href: "#" },
] as const;

const TOPICS = [
  {
    id: "pilot",
    label: "Request a pilot",
    title: "Request a pilot",
    text: "Send us one project. In a week you will know exactly what it finds. Tell us a little about your team and we will be in touch.",
  },
  {
    id: "demo",
    label: "Book a demo",
    title: "Book a demo",
    text: "Tell us about your team and we will walk you through Stratora and answer your questions.",
  },
  {
    id: "question",
    label: "Ask a question",
    title: "Ask us anything",
    text: "Security, pricing or how it works. Send your question and we will reply by email.",
  },
] as const;

// TODO: confirm these steps match how you really work with new customers
const NEXT_STEPS = [
  { title: "We write back", text: "A person from the team replies to you by email." },
  { title: "You pick one project", text: "Start with a single drawing set, nothing more." },
  { title: "You see what it finds", text: "Cited answers you can check against the sheets." },
];

const label = "mb-1.5 block text-sm font-medium text-neutral-800";
const input =
  "w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-[15px] text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-2 focus:ring-accent/60";

export default function ContactPageSection() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [topicId, setTopicId] = useState<(typeof TOPICS)[number]["id"]>("pilot");

  const topic = TOPICS.find((t) => t.id === topicId) ?? TOPICS[0];

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
      setTopicId("pilot");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section
      aria-label="Contact"
      className="bg-white px-6 py-20 text-neutral-900 md:px-10 md:py-28"
    >
      <div className="mx-auto grid max-w-[1200px] gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        {/* Left: context */}
        <div>
          <p className="text-sm font-semibold text-accent">Contact</p>
          <h1 className="mt-3 text-[clamp(2rem,4vw,3rem)] font-semibold leading-tight tracking-tight">
            {topic.title}
          </h1>
          <p className="mt-4 max-w-md text-lg leading-relaxed text-neutral-600">{topic.text}</p>

          <div className="mt-12 border-t border-neutral-200 pt-8">
            <h2 className="text-sm font-semibold">What happens next</h2>
            <ol className="mt-5 space-y-5">
              {NEXT_STEPS.map((s, i) => (
                <li key={s.title} className="flex gap-4">
                  <span className="mt-0.5 w-5 shrink-0 text-sm tabular-nums text-neutral-400">
                    {i + 1}.
                  </span>
                  <div>
                    <p className="font-medium">{s.title}</p>
                    <p className="mt-0.5 text-[15px] text-neutral-600">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-10 border-t border-neutral-200 pt-8">
            <h2 className="text-sm font-semibold">Prefer email?</h2>
            <a
              href={`mailto:${EMAIL}`}
              className="mt-2 inline-block text-lg font-medium underline underline-offset-4 hover:text-neutral-600"
            >
              {EMAIL}
            </a>
            <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[15px] text-neutral-600">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a href={s.href} className="hover:text-neutral-900 hover:underline underline-offset-4">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right: form */}
        <form
          onSubmit={onSubmit}
          onChange={() => {
            if (status === "sent" || status === "error") setStatus("idle");
          }}
          className="rounded-3xl border border-neutral-200 bg-neutral-50 p-6 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.12)] sm:p-8 lg:self-start"
        >
          <fieldset>
            <legend className={label}>What do you need?</legend>
            <div className="mt-2 flex flex-wrap gap-2">
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
                  <span className="inline-flex rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition hover:border-neutral-900 peer-checked:border-neutral-900 peer-checked:bg-neutral-900 peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-accent">
                    {t.label}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="mt-7 grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="firstName" className={label}>First name</label>
              <input id="firstName" name="firstName" required autoComplete="given-name" className={input} />
            </div>
            <div>
              <label htmlFor="lastName" className={label}>Last name</label>
              <input id="lastName" name="lastName" required autoComplete="family-name" className={input} />
            </div>
            <div>
              <label htmlFor="email" className={label}>Work email</label>
              <input id="email" name="email" type="email" required autoComplete="email" className={input} />
            </div>
            <div>
              <label htmlFor="phone" className={label}>Phone</label>
              <input id="phone" name="phone" type="tel" required autoComplete="tel" className={input} />
            </div>
          </div>

          <div className="mt-5">
            <label htmlFor="message" className={label}>
              How can we help? <span className="font-normal text-neutral-500">(optional)</span>
            </label>
            <textarea id="message" name="message" rows={5} className={`${input} resize-y`} />
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button
              type="submit"
              disabled={status === "sending"}
              className="inline-flex items-center rounded-full bg-accent px-7 py-3 text-[15px] font-semibold text-black transition hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:opacity-60"
            >
              {status === "sending" ? "Sending..." : "Send message"}
            </button>
            {status === "sent" && (
              <p role="status" className="text-sm text-neutral-700">
                Thanks, we will be in touch soon.
              </p>
            )}
            {status === "error" && (
              <p role="alert" className="text-sm text-red-600">
                Something went wrong. Please try again.
              </p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}