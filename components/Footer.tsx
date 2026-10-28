"use client";

import Link from "next/link";
import { motion } from "motion/react";

const BRAND = "Drawvane";
const TAGLINE = "AI that reads the drawing set, with the receipts.";
const YEAR = new Date().getFullYear();

// Optional "what's coming" line. Leave it empty to hide it. Only mention
// things you really plan to build, for example:
// "In development: more document types and deeper review tools."
const ROADMAP_NOTE = "";

const LINKS = [
  { label: "Product", href: "/#features" },
  { label: "Roles", href: "/#how-it-works" },
  { label: "Results", href: "/#results" },
  { label: "Security", href: "/#security" },
  { label: "FAQ", href: "/#faq" },
];

// PLACEHOLDERS: there are no privacy or terms pages yet, so these links do
// nothing. When you have the pages, give each one a real href (for example
// "/privacy") and remove `placeholder: true`.
const LEGAL = [
  { label: "Privacy", href: "#", placeholder: true },
  { label: "Terms", href: "#", placeholder: true },
];

const EASE = [0.22, 1, 0.36, 1] as const;

// Section links (/#...) use a plain <a> so they load the homepage straight at
// the section, same as the navbar. Page links use Link.
function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const className =
    "text-base text-neutral-500 transition-colors hover:text-neutral-900";
  if (href.startsWith("/#")) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.8, ease: EASE }}
      className="border-t border-neutral-200 bg-background px-6 pt-[60px] md:px-24"
    >
      <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/25 ring-1 ring-accent/60"
            >
              <span className="h-2 w-2 rounded-full bg-accent" />
            </span>
            <span className="text-lg font-medium tracking-[-0.02em] text-neutral-900">
              {BRAND}
            </span>
          </div>
          <p className="mt-4 text-base text-neutral-500">{TAGLINE}</p>
          {ROADMAP_NOTE && (
            <p className="mt-3 flex items-center gap-2 text-sm text-neutral-500">
              <span className="size-1.5 rounded-full bg-accent" />
              {ROADMAP_NOTE}
            </p>
          )}
        </div>

        <nav aria-label="Footer">
          <ul className="space-y-3 md:text-right">
            {LINKS.map((l) => (
              <li key={l.label}>
                <FooterLink href={l.href}>{l.label}</FooterLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="mt-12 flex flex-col gap-4 border-t border-neutral-200 py-6 md:mt-[50px] md:flex-row md:items-center md:justify-between">
        <p className="font-mono text-xs uppercase tracking-[0.15em] text-neutral-500">
          {YEAR} {BRAND}. All rights reserved.
        </p>
        <ul className="flex gap-8 font-mono text-xs uppercase tracking-[0.15em] text-neutral-500">
          {LEGAL.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                onClick={l.placeholder ? (e) => e.preventDefault() : undefined}
                className="transition-colors hover:text-neutral-900"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </motion.footer>
  );
}