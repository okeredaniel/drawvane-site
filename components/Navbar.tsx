"use client";

import { useState } from "react";
import { motion } from "motion/react";
import ThemeToggle from "./ThemeToggle";

const LINKS = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Results", href: "#results" },
  { label: "Security", href: "#security" },
  { label: "Customers", href: "#customers" },
  { label: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-background/70 backdrop-blur-md">
      <div className="mx-auto flex h-[66px] max-w-[1500px] items-center justify-between px-6 md:px-[96px]">
        <a href="#home" className="flex items-center gap-2.5">
          <span className="grid size-7 place-items-center rounded-lg bg-accent/25 ring-1 ring-accent/60">
            <span className="size-2 rounded-full bg-accent" />
          </span>
          <span className="text-[17px] font-medium tracking-tight">Drawvane</span>
        </a>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[15px] text-slate-300 transition-colors hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <a
            href="#contact"
            className="relative isolate inline-flex overflow-hidden rounded-full p-[1.5px] transition-opacity hover:opacity-90"
          >
            <motion.span
              aria-hidden
              className="absolute left-1/2 top-1/2 aspect-square w-[300%]"
              style={{
                x: "-50%",
                y: "-50%",
                background:
                  "conic-gradient(from 0deg, transparent 0deg, transparent 280deg, #8fb0ff 330deg, #ffffff 350deg, transparent 360deg)",
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 3, ease: "linear", repeat: Infinity }}
            />
            <span className="keep-white relative rounded-full bg-accent px-5 py-2.5 text-[15px] font-semibold text-white">
              Request a pilot
            </span>
          </a>
          <button
            type="button"
            className="grid size-10 place-items-center rounded-lg md:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav
          className="border-t border-white/10 bg-background/95 px-6 py-4 md:hidden"
          aria-label="Mobile"
        >
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block py-3 text-[16px] text-slate-200"
            >
              {l.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
