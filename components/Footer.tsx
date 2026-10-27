"use client";

import { motion } from "motion/react";

// ---- Things you will want to change -------------------------------------

const BRAND = "Drawvane";
const TAGLINE = "AI that reads the drawing set, with the receipts.";
const YEAR = new Date().getFullYear();

// The five links on the right. They jump to the sections on this page.
// Change any href if the section IDs on your page are different.
const LINKS = [
  { label: "Product", href: "#features" },
  { label: "Roles", href: "#how-it-works" },
  { label: "Results", href: "#results" },
  { label: "Security", href: "#security" },
  { label: "FAQ", href: "#faq" },
];

// PLACEHOLDERS: there are no privacy or terms pages yet, so these links do
// nothing. When you have the pages, give each one a real href (for example
// "/privacy") and remove `placeholder: true`.
const LEGAL = [
  { label: "Privacy", href: "#", placeholder: true },
  { label: "Terms", href: "#", placeholder: true },
];

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.8, ease: EASE }}
      className="bg-background px-6 pt-[60px] md:px-24"
    >
      <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#3b5bff] bg-[#13245f]"
            >
              <span className="h-2 w-2 rounded-full bg-[#4d6bff]" />
            </span>
            <span className="text-lg font-medium tracking-[-0.02em] text-[#eef1f5]">
              {BRAND}
            </span>
          </div>
          <p className="mt-4 text-base text-[#8b95a1]">{TAGLINE}</p>
        </div>

        <nav aria-label="Footer">
          <ul className="space-y-3 md:text-right">
            {LINKS.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  className="text-base text-[#8b95a1] transition-colors hover:text-white"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="mt-12 flex flex-col gap-4 border-t border-[#1c232d] py-6 md:mt-[50px] md:flex-row md:items-center md:justify-between">
        <p className="font-mono text-xs uppercase tracking-[0.15em] text-[#6b7480]">
          {YEAR} {BRAND}. All rights reserved.
        </p>
        <ul className="flex gap-8 font-mono text-xs uppercase tracking-[0.15em] text-[#6b7480]">
          {LEGAL.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                onClick={l.placeholder ? (e) => e.preventDefault() : undefined}
                className="transition-colors hover:text-white"
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
