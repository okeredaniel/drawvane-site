"use client";

import { useEffect, useRef, useState } from "react";
import ThemeToggle from "./ThemeToggle";

const LINKS = [
  { label: "Workflow", href: "#how-it-works" },
  { label: "Tools", href: "#features" },
  { label: "For your team", href: "#roles" },
  { label: "Questions", href: "#faq" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    const query = window.matchMedia("(min-width: 1000px)");
    const onChange = () => { if (query.matches) setOpen(false); };
    window.addEventListener("keydown", onKey);
    query.addEventListener("change", onChange);
    return () => {
      window.removeEventListener("keydown", onKey);
      query.removeEventListener("change", onChange);
    };
  }, [open]);

  function followSection() { setOpen(false); }

  return (
    <header className="site-header">
      <div className="nav-inner">
        <a href="#home" className="brand" onClick={followSection} aria-label="Stratora home">
          <span className="brand-mark" aria-hidden="true">s</span><span>Stratora</span>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          {LINKS.map(link => <a key={link.href} href={link.href}>{link.label}</a>)}
        </nav>
        <div className="nav-actions">
          <ThemeToggle />
          <a className="button button-primary nav-contact" href="#contact" onClick={followSection}>Let’s talk <span aria-hidden="true">↗</span></a>
          <button className="icon-button menu-toggle" type="button" ref={trigger} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)}>
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d={open ? "M6 6l12 12M18 6L6 18" : "M4 7h16M4 12h16M4 17h16"} /></svg>
          </button>
        </div>
      </div>
      <nav id="mobile-menu" className="mobile-nav" aria-label="Mobile navigation" hidden={!open}>
        {LINKS.map(link => <a key={link.href} href={link.href} onClick={followSection}>{link.label}</a>)}
        <a href="#demo" onClick={followSection}>Explore the sample</a>
        <a className="mobile-contact" href="#contact" onClick={followSection}>Talk to Stratora ↗</a>
      </nav>
    </header>
  );
}
