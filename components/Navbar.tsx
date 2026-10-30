"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const LINKS = [
  { label: "Home", href: "/#home" },
  { label: "Features", href: "/#features" },
  { label: "Results", href: "/#team" },
  { label: "FAQ", href: "/#faq" },
  { label: "Pricing", href: "/pricing" },
  { label: "Book a demo", href: "/contact" },
];

// The full link row needs about 1280px to fit next to the logo and buttons,
// so below that (phones, tablets, small laptops) the menu button is used.
// This is the Tailwind `xl` breakpoint. If you change it, change every `xl:`
// in this file to the same breakpoint.

function NavLink({
  href,
  className,
  onClick,
  children,
}: {
  href: string;
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  // Section links use a plain <a>: the browser loads the homepage straight at
  // the section, so there is no flash of the top of the page.
  if (href.startsWith("/#")) {
    // eslint-disable-next-line @next/next/no-html-link-for-pages
    return (
      <a href={href} className={className} onClick={onClick}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}

function PilotButton({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/contact"
      className={`relative isolate inline-flex overflow-hidden rounded-full p-[1.5px] transition-opacity hover:opacity-90 ${className}`}
    >
      <motion.span
        aria-hidden
        className="absolute left-1/2 top-1/2 aspect-square w-[300%]"
        style={{
          x: "-50%",
          y: "-50%",
          background:
            "conic-gradient(from 0deg, transparent 0deg, transparent 280deg, #F5C93C 330deg, #0b0f14 350deg, transparent 360deg)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 3, ease: "linear", repeat: Infinity }}
      />
      <span className="relative w-full whitespace-nowrap rounded-full bg-accent px-4 py-2 text-center text-[14px] font-semibold text-black sm:px-5 sm:py-2.5 sm:text-[15px]">
        Request a pilot
      </span>
    </Link>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);

  // Close the menu with Escape, and when the screen grows into the full nav
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const mq = window.matchMedia("(min-width: 1280px)");
    const onChange = () => {
      if (mq.matches) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onChange);
    return () => {
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onChange);
    };
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-neutral-200 bg-white">
      <div className="mx-auto flex h-[66px] max-w-[1900px] items-center justify-between gap-3 px-4 sm:px-6 md:px-10 2xl:px-[96px]">
        <NavLink href="/#home" className="flex shrink-0 items-center gap-2.5">
         <img src="/stratora-logo.png" alt="Stratora" className="h-7 w-auto" />
        </NavLink>

        <nav className="hidden items-center gap-6 xl:flex 2xl:gap-8" aria-label="Main">
          {LINKS.map((l) => (
           <NavLink
              key={l.href}
              href={l.href}
              className="whitespace-nowrap text-[15px] text-slate-300 transition-colors hover:text-white"
            >
              {l.label}
           </NavLink>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {/* On very small phones the button lives in the menu instead */}
          <div className="hidden sm:block">
            <PilotButton />
          </div>
          <button
            type="button"
            className="grid size-10 place-items-center rounded-lg xl:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
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

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            key="mobile-menu"
            aria-label="Mobile"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="max-h-[calc(100dvh-66px)] overflow-y-auto overscroll-contain border-t border-neutral-200 bg-white px-4 pb-5 pt-2 sm:px-6 md:px-10 xl:hidden"
          >
            {LINKS.map((l) => (
              <NavLink
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block border-b border-neutral-100 py-3.5 text-[16px] text-slate-200 last:border-b-0"
              >
                {l.label}
              </NavLink>
            ))}
            <div className="mt-4 sm:hidden">
              <PilotButton className="w-full" />
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}