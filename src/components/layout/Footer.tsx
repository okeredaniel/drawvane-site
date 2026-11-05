"use client";

import Link from "next/link";
import { motion } from "motion/react";

import { LogoMark } from "@/components/ui/Logo";
import { BRAND, TAGLINE } from "@/lib/site";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Solutions", href: "/#solution" },
      { label: "Features", href: "/#features" },
      { label: "Integrations", href: "/#integration" },
      { label: "Pricing", href: "/#pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About us", href: "/about" },
      { label: "Case studies", href: "/case-studies" },
      { label: "Journal", href: "/journal" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy policy", href: "/privacy" },
      { label: "Terms of service", href: "/terms" },
      { label: "Data security", href: "/#security" },
    ],
  },
];

const SOCIALS = [
  {
    label: "Instagram",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="size-[22px]">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "X",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-[22px]">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className="size-[22px]">
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <path d="M8 10.5V16M8 7.6v.01M11.5 16v-5.5M11.5 13c0-1.5 1-2.5 2.25-2.5S16 11.5 16 13v3" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="overflow-hidden bg-[#f5f4ef] text-[#0b1020]">
      <div className="mx-auto max-w-[1280px] px-6 pt-20">
        <div className="grid gap-14 lg:grid-cols-2">
          <div className="flex flex-col justify-between gap-12">
            <div>
              <LogoMark className="size-11" />
              <p className="mt-5 max-w-[350px] text-[15px] leading-[1.45]">
                {BRAND} is the construction intelligence layer. Bring drawings,
                documents, quantities and conversations together to understand
                the detail and move work forward.
              </p>
            </div>

            <div className="flex items-center gap-5">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="transition duration-200 hover:-translate-y-0.5 hover:text-[#755b00]"
                >
                  {s.icon}
                </a>
              ))}
              <span className="font-mono text-[11px] font-medium uppercase tracking-wide">
                Follow us on socials
              </span>
            </div>
          </div>

          <div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3">
              {COLUMNS.map((col) => (
                <div key={col.title}>
                  <h3 className="text-base">{col.title}</h3>
                  <ul className="mt-5 space-y-[18px]">
                    {col.links.map((l) => (
                      <li key={l.label}>
                        <Link
                          href={l.href}
                          className="group relative inline-block font-mono text-[13px] font-medium uppercase tracking-wide"
                        >
                          {l.label}
                          <span
                            aria-hidden
                            className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100"
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-14 flex items-center gap-3 rounded-2xl border border-slate-900/10 bg-white/40 p-2.5 pl-4">
              <LogoMark className="size-8" />
              <p className="flex-1 text-[15px]">Ready to see {BRAND} in action?</p>
              <Link
                href="/contact"
                className="group inline-flex h-11 shrink-0 items-center gap-2.5 rounded-full bg-[#ffc800] px-5 font-mono text-[13px] font-medium uppercase tracking-wide text-[#0b0b12] transition duration-200 hover:bg-[#e6b400] active:scale-[0.97]"
              >
                <span className="grid size-3 place-items-center rounded-full border-2 border-[#0b0b12]/80">
                  <span className="size-1 rounded-full bg-white/0 transition-colors duration-200 group-hover:bg-[#0b0b12]" />
                </span>
                Get demo
              </Link>
            </div>

            <div className="mt-2 flex justify-between font-mono text-[11px] font-medium uppercase tracking-wide">
              <span>{TAGLINE}</span>
            </div>
          </div>
        </div>
      </div>

      <motion.div
        aria-hidden
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        className="mt-16 h-[7vw] select-none overflow-hidden"
      >
        <motion.div
          variants={{ hidden: { y: "55%" }, visible: { y: 0 } }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="whitespace-nowrap text-center text-[12.5vw] font-semibold uppercase leading-[0.85] tracking-tighter text-[#dad6c9]"
        >
          {BRAND}
        </motion.div>
      </motion.div>
    </footer>
  );
}
