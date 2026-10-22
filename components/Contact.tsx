"use client";

import { useState, type FormEvent } from "react";
import { motion } from "motion/react";

// ---- Things you will want to change -------------------------------------

// Where the form is sent. Put the address of your form tool, email service or
// API route here, for example "/api/pilot". It receives a POST with JSON:
// { name, company, email, role }.
// While this is empty NOTHING is sent. In development the form still shows its
// success message so you can see it. On the live site it shows an error instead,
// so visitors are never told their request went through when it didn't.
const SUBMIT_ENDPOINT = "";

// Placeholder roles. Replace with your own list.
const ROLES = [
  "Architect",
  "Engineer",
  "Contractor",
  "Owner or developer",
  "Project manager",
  "Other",
];

// Optional background image: put it in /public/contact/ as bg.jpg
// (change the extension here if yours differs). Without it you get a dark glow.
const BG_IMAGE = "/contact/bg.jpg";

const HEADING = "Run it on your own plan set.";
const SUBLINE = "Send one project. In a week you will know exactly what it finds.";

const EASE = [0.22, 1, 0.36, 1] as const;

type Values = { name: string; company: string; email: string; role: string };
type Errors = Partial<Record<keyof Values, string>>;

function validate(v: Values): Errors {
  const e: Errors = {};
  if (!v.name.trim()) e.name = "Please enter your name.";
  if (!v.company.trim()) e.company = "Please enter your company.";
  if (!v.email.trim()) e.email = "Please enter your work email.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim()))
    e.email = "That email doesn't look right.";
  if (!v.role) e.role = "Please choose a role.";
  return e;
}

const fieldClass =
  "h-10 w-full rounded-xl border border-[#1c232d] bg-[#0b0f14] px-4 text-sm text-[#eef1f5] placeholder:text-[#6b7480] outline-none transition-colors focus:border-[#3b5bff] aria-[invalid=true]:border-[#d9534f]";

export default function Contact() {
  const [values, setValues] = useState<Values>({
    name: "",
    company: "",
    email: "",
    role: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [bgMissing, setBgMissing] = useState(false);

  function set<K extends keyof Values>(key: K, value: string) {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  async function onSubmit(ev: FormEvent) {
    ev.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) return;

    setStatus("sending");
    try {
      if (!SUBMIT_ENDPOINT) {
        if (process.env.NODE_ENV === "production") throw new Error("not connected");
        console.warn("Contact form: SUBMIT_ENDPOINT is empty, nothing was sent.");
        await new Promise((r) => setTimeout(r, 500));
      } else {
        const res = await fetch(SUBMIT_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      }
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  const fields: {
    key: keyof Values;
    label: string;
    type?: string;
    placeholder?: string;
  }[] = [
    { key: "name", label: "Name", placeholder: "Full Name" },
    { key: "company", label: "Company", placeholder: "Company Name" },
    { key: "email", label: "Work Email", type: "email", placeholder: "name@company.com" },
  ];

  return (
    <section
      id="contact"
      data-keep-dark
      aria-label="Request a pilot"
      className="relative overflow-hidden border-b border-[#242d38] bg-background px-6 py-[120px] md:px-24 md:py-[190px]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 520px 620px at 8% 55%, rgba(255,255,255,0.07), transparent 70%), radial-gradient(ellipse 700px 320px at 50% 52%, rgba(37,99,235,0.22), transparent 70%)",
        }}
      />
      {!bgMissing && (
        <img
          src={BG_IMAGE}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          draggable={false}
          onError={() => setBgMissing(true)}
        />
      )}

      <div className="relative mx-auto max-w-[990px]">
        {status === "sent" ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            role="status"
            className="rounded-2xl border border-[#1c232d] bg-[#0b0f14]/80 px-8 py-14 text-center backdrop-blur"
          >
            <p className="text-2xl font-medium tracking-[-0.03em] text-[#eef1f5]">
              Thanks, we got your request.
            </p>
            <p className="mt-3 text-base text-[#8b95a1]">
              We'll be in touch at {values.email.trim()}.
            </p>
          </motion.div>
        ) : (
          <form onSubmit={onSubmit} noValidate className="space-y-5">
            {fields.map((f, i) => (
              <motion.div
                key={f.key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, ease: EASE, delay: i * 0.1 }}
              >
                <label
                  htmlFor={`contact-${f.key}`}
                  className="mb-2 block text-xs text-[#9aa3ae]"
                >
                  {f.label}
                </label>
                <input
                  id={`contact-${f.key}`}
                  name={f.key}
                  type={f.type ?? "text"}
                  value={values[f.key]}
                  onChange={(e) => set(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  autoComplete={
                    f.key === "name" ? "name" : f.key === "email" ? "email" : "organization"
                  }
                  aria-invalid={errors[f.key] ? true : undefined}
                  aria-describedby={errors[f.key] ? `contact-${f.key}-err` : undefined}
                  className={fieldClass}
                />
                {errors[f.key] && (
                  <p id={`contact-${f.key}-err`} className="mt-1.5 text-xs text-[#ef7b77]">
                    {errors[f.key]}
                  </p>
                )}
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.3 }}
            >
              <label htmlFor="contact-role" className="mb-2 block text-xs text-[#9aa3ae]">
                Role
              </label>
              <div className="relative">
                <select
                  id="contact-role"
                  name="role"
                  value={values.role}
                  onChange={(e) => set("role", e.target.value)}
                  aria-invalid={errors.role ? true : undefined}
                  aria-describedby={errors.role ? "contact-role-err" : undefined}
                  className={`${fieldClass} appearance-none pr-10 ${
                    values.role ? "" : "text-[#6b7480]"
                  }`}
                >
                  <option value="" disabled>
                    Select...
                  </option>
                  {ROLES.map((r) => (
                    <option key={r} value={r} className="text-black">
                      {r}
                    </option>
                  ))}
                </select>
                <svg
                  aria-hidden="true"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#9aa3ae"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>
              {errors.role && (
                <p id="contact-role-err" className="mt-1.5 text-xs text-[#ef7b77]">
                  {errors.role}
                </p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.4 }}
            >
              <button
                type="submit"
                disabled={status === "sending"}
                className="h-10 w-full rounded-full bg-[#3b5bff] text-sm font-semibold text-white transition-colors hover:bg-[#506cff] disabled:opacity-60"
              >
                {status === "sending" ? "Sending..." : "Submit"}
              </button>
              {status === "error" && (
                <p role="alert" className="mt-3 text-center text-sm text-[#ef7b77]">
                  Something went wrong sending your request. Please try again.
                </p>
              )}
            </motion.div>
          </form>
        )}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.5 }}
          className="mt-[70px] text-center"
        >
          <h2 className="text-[clamp(2.2rem,4.5vw,4rem)] font-medium leading-[1] tracking-[-0.05em] text-white">
            {HEADING}
          </h2>
          <p className="mt-6 text-lg text-[#eef1f5] md:text-xl">{SUBLINE}</p>
        </motion.div>
      </div>
    </section>
  );
}
