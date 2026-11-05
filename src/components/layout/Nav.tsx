"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import Logo from "@/components/ui/Logo";

const BRAND = "Stratora";

const LINKS = [
  { label: "Features", href: "/#features" },
  { label: "Use cases", href: "/case-studies" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Journal", href: "/journal" },
  { label: "About", href: "/about" },
];

const mono = {
  fontFamily:
    'var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
};

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Announcement bar (scrolls away) */}
      <div
        style={{ ...mono, backgroundColor: "#ffc800" }}
        className="flex h-9 items-center justify-center px-4 text-[12px] font-bold uppercase tracking-[0.02em] text-[#0b0b12]"
      >
        <Link href="/team-alignment" className="flex items-center gap-2">
          <span>Discover {BRAND} · Construction intelligence, connected</span>
          <span aria-hidden>→</span>
        </Link>
      </div>

      {/* Sticky nav */}
      <header
        style={{
          backgroundColor: scrolled ? "rgba(245,244,239,0.85)" : "#f5f4ef",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(0,0,0,0.08)" : "1px solid transparent",
        }}
        className="sticky top-0 z-50 transition-colors duration-300"
      >
        <div className="mx-auto flex h-[80px] max-w-[1280px] items-center justify-between px-6">
          <Link href="/" onClick={() => setOpen(false)} className="flex items-center">
            <Logo className="h-7 w-auto sm:h-8" />
          </Link>

          {/* Desktop */}
          <div className="hidden items-center md:flex">
            <nav className="flex items-center gap-6" style={mono}>
              {LINKS.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  className="text-[14px] font-medium uppercase text-[#0b0b12] transition-opacity hover:opacity-60"
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            <Link
              href="/contact"
              style={{ ...mono, backgroundColor: "#ffc800" }}
              className="ml-12 flex h-[41px] items-center gap-2 rounded-full px-4 text-[14px] font-medium uppercase text-[#0b0b12] transition-transform duration-200 hover:scale-[1.03]"
            >
              <span
                aria-hidden
                className="inline-block rounded-full"
                style={{
                  width: 10,
                  height: 10,
                  border: "2px solid rgba(11,11,18,0.85)",
                }}
              />
              Book a demo
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-11 w-11 flex-col items-center justify-center gap-[5px] md:hidden"
          >
            <span
              className="block h-[2px] w-6 bg-[#0b0b12] transition-transform duration-200"
              style={{ transform: open ? "translateY(7px) rotate(45deg)" : "none" }}
            />
            <span
              className="block h-[2px] w-6 bg-[#0b0b12] transition-opacity duration-200"
              style={{ opacity: open ? 0 : 1 }}
            />
            <span
              className="block h-[2px] w-6 bg-[#0b0b12] transition-transform duration-200"
              style={{ transform: open ? "translateY(-7px) rotate(-45deg)" : "none" }}
            />
          </button>
        </div>

        {/* Mobile panel */}
        {open && (
          <div className="border-t border-black/10 bg-[#f5f4ef] px-6 pb-6 pt-4 md:hidden" style={mono}>
            <nav className="flex flex-col gap-4">
              {LINKS.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="text-[15px] font-medium uppercase text-[#0b0b12]"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              style={{ backgroundColor: "#ffc800" }}
              className="mt-5 flex h-[44px] items-center justify-center rounded-full text-[14px] font-medium uppercase text-[#0b0b12]"
            >
              Book a demo
            </Link>
          </div>
        )}
      </header>
    </>
  );
}

