"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus_Jakarta_Sans } from "next/font/google";

// Font used for all the navbar text. To try another one, swap the import and
// this line (e.g. Manrope, DM_Sans, Sora, Outfit).
const navFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const LINKS = [
  { label: "Home", href: "/#home" },
  { label: "Features", href: "/#features" },
  { label: "Results", href: "/#team" },
  { label: "FAQ", href: "/#faq" },
  { label: "Adapt ", href: "/adapt" },
  { label: "Pricing", href: "/pricing" },
];

// The full link row needs about 1280px to fit next to the logo and buttons,
// so below that (phones, tablets, small laptops) the menu button is used.
// This is the Tailwind `xl` breakpoint. If you change it, change every `xl:`
// in this file to the same breakpoint.

function NavLink({
  href,
  className,
  onClick,
  onMouseEnter,
  children,
}: {
  href: string;
  className?: string;
  onClick?: () => void;
  onMouseEnter?: () => void;
  children: React.ReactNode;
}) {
  // Section links use a plain <a>: the browser loads the homepage straight at
  // the section, so there is no flash of the top of the page.
  if (href.startsWith("/#")) {
    // eslint-disable-next-line @next/next/no-html-link-for-pages
    return (
      <a href={href} className={className} onClick={onClick} onMouseEnter={onMouseEnter}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className} onClick={onClick} onMouseEnter={onMouseEnter}>
      {children}
    </Link>
  );
}

function PilotButton({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/contact"
      className={`group relative isolate inline-flex overflow-hidden rounded-full p-[1.5px] transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98] ${className}`}
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
      <span className="relative flex w-full items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-accent px-4 py-2 text-center text-[14px] font-semibold text-black shadow-[0_6px_18px_-6px_rgba(245,201,60,0.7)] sm:px-5 sm:py-2.5 sm:text-[15px]">
        Request a pilot
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-transform duration-200 group-hover:translate-x-0.5"
          aria-hidden
        >
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </span>
    </Link>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const pathname = usePathname();

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

  // Make the bar a bit more solid once the page has scrolled
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Stop the page behind the mobile menu from scrolling
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => !href.startsWith("/#") && pathname === href;

  return (
    <header className={`${navFont.className} fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5`}>
      <div
        className={`relative mx-auto flex h-[58px] max-w-[1400px] items-center justify-between gap-3 rounded-full border pl-5 pr-2 backdrop-blur-xl transition-all duration-300 sm:pr-2.5 ${
          scrolled
            ? "border-slate-200 bg-white/90 shadow-[0_10px_30px_-12px_rgba(15,23,42,0.25)]"
            : "border-slate-200/80 bg-white/70 shadow-[0_6px_20px_-12px_rgba(15,23,42,0.18)]"
        }`}
      >
        <NavLink href="/#home" className="flex shrink-0 items-center gap-2.5">
          <img src="/stratora-logo.png" alt="Stratora" className="h-7 w-auto" />
        </NavLink>

        <nav
          className="hidden items-center gap-1 xl:flex"
          aria-label="Main"
          onMouseLeave={() => setHovered(null)}
        >
          {LINKS.map((l) => {
            const isCta = l.href === "/contact";
            return (
              <NavLink
                key={l.href}
                href={l.href}
                onMouseEnter={() => setHovered(l.href)}
                className={`relative whitespace-nowrap rounded-full px-4 py-2 text-[14.5px] font-medium transition-colors duration-200 ${
                  isActive(l.href) || hovered === l.href
                    ? "text-slate-900"
                    : "text-slate-500"
                } ${isCta ? "ml-1 border border-slate-300" : ""}`}
              >
                {hovered === l.href && (
                  <motion.span
                    layoutId="nav-hover"
                    aria-hidden
                    className="absolute inset-0 -z-10 rounded-full bg-slate-900/[0.06]"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                {isActive(l.href) && (
                  <span
                    aria-hidden
                    className="absolute bottom-1 left-1/2 h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-accent"
                  />
                )}
                {l.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {/* On very small phones the button lives in the menu instead */}
          <div className="hidden sm:block">
            <PilotButton />
          </div>
          <button
            type="button"
            className="grid size-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-900 transition-colors hover:bg-slate-50 xl:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 8h16M4 16h16" />
              )}
            </svg>
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.nav
              id="mobile-menu"
              key="mobile-menu"
              aria-label="Mobile"
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute inset-x-0 top-full mt-2 max-h-[calc(100dvh-90px)] overflow-y-auto overscroll-contain rounded-3xl border border-slate-200 bg-white/95 p-3 shadow-[0_24px_60px_-16px_rgba(15,23,42,0.35)] backdrop-blur-xl xl:hidden"
            >
              {LINKS.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.03 * i, duration: 0.2 }}
                >
                  <NavLink
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={`group flex items-center justify-between rounded-2xl px-4 py-3.5 text-[16px] font-medium transition-colors hover:bg-slate-50 ${
                      isActive(l.href) ? "text-slate-900" : "text-slate-700"
                    }`}
                  >
                    {l.label}
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-slate-400 transition-all group-hover:translate-x-0.5 group-hover:text-slate-900"
                      aria-hidden
                    >
                      <path d="M9 6l6 6-6 6" />
                    </svg>
                  </NavLink>
                </motion.div>
              ))}
              <div className="mt-3 border-t border-slate-200 px-1 pt-3 sm:hidden">
                <PilotButton className="w-full" />
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}