"use client";
import Link from "next/link";
import { Suspense, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
const TOPICS = [
  { id: "adapt", label: "ADAPT pilot" },
  { id: "pilot", label: "Request a pilot" },
  { id: "demo", label: "Book a demo" },
  { id: "question", label: "Ask a question" },
] as const;
const input = "site-input";
export default function ContactPageSection({
  available,
}: {
  available: boolean;
}) {
  return (
    <section
      className="site-section contact-layout"
      aria-labelledby="contact-title"
    >
      <div>
        <p className="eyebrow">Start a conversation</p>
        <h1 id="contact-title" className="page-title">
          Bring one project.
          <br />
          Start with one question.
        </h1>
        <p className="section-intro">
          Tell us what your team needs to understand. We can discuss the scope,
          document types and review process before you share a project set.
        </p>
        <ol className="contact-steps">
          <li>
            <span>01</span>
            <div>
              <h2>Describe your workflow</h2>
              <p>
                Your role, project stage and the question that keeps coming up.
              </p>
            </div>
          </li>
          <li>
            <span>02</span>
            <div>
              <h2>Agree the scope</h2>
              <p>Confirm deliverables, access, pricing and timing together.</p>
            </div>
          </li>
          <li>
            <span>03</span>
            <div>
              <h2>Review the evidence</h2>
              <p>
                Evaluate the workflow against an agreed drawing set and
                acceptance criteria.
              </p>
            </div>
          </li>
        </ol>
        <p className="text-sm text-neutral-600">
          Please do not include confidential drawings, passwords or sensitive
          project information in this form.
        </p>
      </div>
      <Suspense
        fallback={
          <p className="contact-card" role="status">
            Loading enquiry form…
          </p>
        }
      >
        <TopicContactForm available={available} />
      </Suspense>
    </section>
  );
}
function TopicContactForm({ available }: { available: boolean }) {
  const params = useSearchParams();
  const requested = params.get("topic");
  const selected = TOPICS.some((t) => t.id === requested)
    ? requested!
    : "pilot";
  return (
    <ContactForm key={selected} initialTopic={selected} available={available} />
  );
}
function ContactForm({
  initialTopic,
  available,
}: {
  initialTopic: string;
  available: boolean;
}) {
  const [topic, setTopic] = useState(initialTopic);
  const [status, setStatus] = useState<
    "idle" | "sending" | "accepted" | "error"
  >("idle");
  const [message, setMessage] = useState("");
  const [copyMessage, setCopyMessage] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const busy = useRef(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy.current || !available) return;
    const values = Object.fromEntries(new FormData(e.currentTarget));
    busy.current = true;
    setStatus("sending");
    setMessage("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, consent: values.consent === "on" }),
        signal: AbortSignal.timeout(15000),
      });
      const result = await res.json();
      if (!res.ok || result.accepted !== true)
        throw new Error(
          result.error ||
            "Your enquiry could not be confirmed. Please try again.",
        );
      setStatus("accepted");
      setMessage(
        "Your enquiry has been accepted for delivery. This is not yet a booking confirmation. Your details remain below for your records.",
      );
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error && error.name !== "TimeoutError"
          ? error.message
          : "We could not confirm delivery. Your details are still here. Please try again.",
      );
    } finally {
      busy.current = false;
    }
  }
  async function copy() {
    if (!formRef.current) return;
    const d = Object.fromEntries(new FormData(formRef.current));
    const text = `Stratora enquiry: ${topic}\nName: ${d.firstName} ${d.lastName}\nEmail: ${d.email}\nCompany: ${d.company}\n\n${d.message}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopyMessage("Enquiry copied. It has not been sent.");
    } catch {
      setCopyMessage(
        "Copy is unavailable. Select the text in the form to save your enquiry.",
      );
    }
  }
  return (
    <form
      ref={formRef}
      onSubmit={submit}
      className="contact-card"
      onChange={() => {
        if (!busy.current) {
          setStatus("idle");
          setMessage("");
          setCopyMessage("");
        }
      }}
    >
      <fieldset disabled={status === "sending"}>
        <legend className="font-semibold">
          What would you like to discuss?
        </legend>
        <div className="my-5 flex flex-wrap gap-2">
          {TOPICS.map((t) => (
            <label className="cursor-pointer" key={t.id}>
              <input
                className="peer sr-only"
                type="radio"
                name="topic"
                value={t.id}
                checked={topic === t.id}
                onChange={() => setTopic(t.id)}
              />
              <span className="topic-chip">{t.label}</span>
            </label>
          ))}
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <label>
            First name
            <input
              className={input}
              name="firstName"
              required
              maxLength={80}
              autoComplete="given-name"
            />
          </label>
          <label>
            Last name
            <input
              className={input}
              name="lastName"
              required
              maxLength={80}
              autoComplete="family-name"
            />
          </label>
          <label className="sm:col-span-2">
            Work email
            <input
              className={input}
              name="email"
              type="email"
              required
              maxLength={254}
              autoComplete="email"
            />
          </label>
          <label className="sm:col-span-2">
            Company <span className="text-neutral-500">(optional)</span>
            <input
              className={input}
              name="company"
              maxLength={120}
              autoComplete="organization"
            />
          </label>
          <label className="sm:col-span-2">
            What would you like to achieve?
            <textarea
              className={input}
              name="message"
              required
              minLength={1}
              maxLength={4000}
              rows={5}
            />
          </label>
        </div>
        <div hidden aria-hidden="true">
          <label>
            Website
            <input
              name="website"
              tabIndex={-1}
              autoComplete="off"
              defaultValue=""
            />
          </label>
        </div>
        <label className="mt-5 flex items-start gap-3 text-sm leading-relaxed text-neutral-600">
          <input
            type="checkbox"
            name="consent"
            required
            className="mt-1 size-4 shrink-0 accent-neutral-900"
          />
          <span>
            I agree to be contacted about this enquiry. Read the{" "}
            <Link href="/privacy" className="underline">
              website privacy notice
            </Link>
            .
          </span>
        </label>
        {!available && (
          <p
            role="status"
            className="mt-5 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-neutral-800"
          >
            Online enquiries are temporarily unavailable. You can prepare and
            copy your enquiry here, but nothing will be sent.
          </p>
        )}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            className="button-primary"
            type="submit"
            disabled={
              !available || status === "sending" || status === "accepted"
            }
          >
            {status === "sending"
              ? "Submitting…"
              : status === "accepted"
                ? "Accepted for delivery"
                : "Send enquiry"}
          </button>
          <button className="button-secondary" type="button" onClick={copy}>
            Copy enquiry
          </button>
        </div>
      </fieldset>
      <p
        className="mt-4 text-sm leading-relaxed"
        role={status === "error" ? "alert" : "status"}
      >
        {message}
      </p>
      <p className="mt-2 text-sm text-neutral-600" role="status">
        {copyMessage}
      </p>
    </form>
  );
}
