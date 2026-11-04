"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ContactUs from "@/components/sections/ContactUs";

gsap.registerPlugin(ScrollTrigger);

const BLUE = "#1f3dff";
const mono = {
  fontFamily:
    'var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
};

/* ------------------------------------------------------------------ */
/* THIS ARTICLE'S CONTENT - to reuse for another article, change this */
/* ------------------------------------------------------------------ */

const ARTICLE = {
  category: "AI & Work",
  title: "AI Planning, Human Decisions",
  subtitle:
    "Use AI to build a strong first draft while your team keeps ownership of estimates, tradeoffs, and final calls.",
  image: "/journal/ai-planning-human-decisions.avif",
  author: {
    name: "Maya Chen",
    role: "Head of Product",
    avatar: "/journal/maya-chen.avif",
    instagram: "#",
    x: "#",
    linkedin: "#",
  },
  intro:
    "An AI-generated plan can make a blank page easier to approach. It can suggest milestones, break down a broad objective, and surface questions for discussion. But a detailed draft can also look more certain than the information behind it. Treating that draft as a proposal keeps the team responsible for what it commits to deliver.",
  sections: [
    {
      heading: "Give the draft useful context",
      paragraphs: [
        "Describe the customer problem, the desired outcome, and the constraints that matter. Include team capacity, known dependencies, and what is outside the scope. Without those boundaries, a plausible plan may describe a project your team cannot realistically undertake.",
        "Ask for assumptions to be listed separately from tasks. This makes it easier to distinguish information supplied by the team from details that were inferred to fill a gap.",
      ],
    },
    {
      heading: "Review the risky parts first",
      paragraphs: [
        "Start with estimates, sequencing, permissions, and dependencies. The people closest to the work should check whether the proposed steps are feasible. A task that sounds reasonable may still depend on access, research, or another team’s decision.",
        "Use the draft to improve the conversation. Ask what is missing, what could be removed, and which milestone needs evidence before a date is assigned. Do not equate a longer task list with a more reliable plan.",
      ],
    },
    {
      heading: "Keep a person accountable",
      paragraphs: [
        "Give each accepted milestone a named owner. That person is responsible for maintaining the plan and raising uncertainty, even when several people contribute to delivery. AI assistance does not replace that accountability.",
        "When the plan changes, record the reason. A reviewed decision history is more useful than repeatedly generating a fresh plan that forgets the tradeoffs the team has already made.",
      ],
    },
    {
      heading: "A practical next step",
      paragraphs: [
        "For your next planning session, bring an AI draft alongside a short list of assumptions. Judge the session by the decisions the team resolves, not the number of tasks it accepts.",
      ],
    },
  ],
};

/* ------------------------------------------------------------------ */
/* Small pieces                                                        */
/* ------------------------------------------------------------------ */

function Social({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      aria-label={label}
      className="jr-social flex h-8 w-8 items-center justify-center text-[#0b0b12] transition-colors duration-200 hover:text-[#1f3dff]"
    >
      {children}
    </a>
  );
}

function AuthorCard() {
  const a = ARTICLE.author;
  const initials = a.name
    .split(" ")
    .map((p) => p[0])
    .join("");

  return (
    <div className="jr-author mt-12 flex items-center gap-4 rounded-[20px] border border-[#e0e3ee] bg-[#fbfcff] p-4">
      <div className="relative h-[52px] w-[52px] shrink-0 overflow-hidden rounded-[10px]">
        {a.avatar ? (
          <Image src={a.avatar} alt={a.name} fill sizes="52px" className="object-cover" />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center text-[16px] font-semibold text-white"
            style={{ background: "linear-gradient(135deg,#6f86ff,#1f3dff)" }}
          >
            {initials}
          </div>
        )}
      </div>

      <div className="min-w-0">
        <div className="text-[18px] leading-tight text-[#0b0b12]">{a.name}</div>
        <div className="mt-1 text-[13px] uppercase leading-none text-[#55576a]" style={mono}>
          {a.role}
        </div>
      </div>

      <div className="ml-auto flex items-center gap-1">
        <Social href={a.instagram} label="Instagram">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
          </svg>
        </Social>
        <Social href={a.x} label="X">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </Social>
        <Social href={a.linkedin} label="LinkedIn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2.5" />
            <path d="M8 11v5M8 8v.01M12 16v-5m0 2.5c0-1.4 1-2.5 2.4-2.5s2.1 1 2.1 2.5V16" />
          </svg>
        </Social>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function ArticlePage() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // One orchestrated opening: label, headline words, subtitle, then the photo opens up.
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".ar-eyebrow", { y: 12, opacity: 0, duration: 0.5 })
        .from(".ar-word", { yPercent: 110, duration: 0.9, stagger: 0.07, ease: "power4.out" }, "-=0.25")
        .from(".ar-sub", { y: 16, opacity: 0, duration: 0.7 }, "-=0.5")
        .from(
          ".ar-frame",
          { clipPath: "inset(0% 0% 100% 0%)", duration: 1.3, ease: "power4.inOut" },
          "-=0.4"
        )
        .from(".ar-pic", { scale: 1.2, duration: 1.7 }, "<");

      // Photo drifts slightly slower than the page as you read.
      gsap.to(".ar-pic", {
        yPercent: 6,
        ease: "none",
        scrollTrigger: { trigger: ".ar-frame", start: "top bottom", end: "bottom top", scrub: true },
      });

      // Headings and author card ease in when reached. Body text stays still so it is easy to read.
      gsap.utils.toArray<HTMLElement>(".ar-reveal").forEach((node) => {
        gsap.from(node, {
          y: 24,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: node, start: "top 90%", once: true },
        });
      });
    }, el);

    return () => ctx.revert();
  }, []);

  const words = ARTICLE.title.split(" ");

  return (
    <>
      <article ref={root} className="bg-[#eef0f5] px-6 pb-24 pt-[128px] text-[#0b0b12]">
        <header className="mx-auto flex max-w-[1160px] flex-col items-center text-center">
          <div
            className="ar-eyebrow flex items-center gap-2 text-[12px] uppercase"
            style={{ ...mono, color: BLUE }}
          >
            <span
              aria-hidden
              className="inline-block h-[8px] w-[8px] rounded-full border-2"
              style={{ borderColor: BLUE }}
            />
            {ARTICLE.category}
          </div>

          <h1 className="mt-4 text-[40px] font-medium leading-[1.1] tracking-[-0.02em] sm:text-[52px]">
            {words.map((w, i) => (
              <span key={w + i} className="inline-block overflow-hidden pb-1 align-top">
                <span className="ar-word inline-block">{w}</span>
                {i < words.length - 1 ? "\u00A0" : ""}
              </span>
            ))}
          </h1>

          <p className="ar-sub mt-5 max-w-[760px] text-[17px] leading-[1.5] text-[#3b3d4f]">
            {ARTICLE.subtitle}
          </p>
        </header>

        <div className="mx-auto mt-14 max-w-[1280px] rounded-[22px] border border-[#e0e3ee] bg-[#f6f7fb] p-[3px]">
          <div className="ar-frame relative h-[260px] overflow-hidden rounded-[19px] sm:h-[420px] lg:h-[540px]">
            {ARTICLE.image ? (
              <Image
                src={ARTICLE.image}
                alt={ARTICLE.title}
                fill
                priority
                sizes="(max-width: 1280px) 94vw, 1280px"
                className="ar-pic scale-[1.08] object-cover"
              />
            ) : (
              <div className="ar-pic absolute inset-0 bg-[linear-gradient(125deg,#e6ebff,#a5b8ff)]" />
            )}
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-[680px]">
          <p className="text-[17px] leading-[1.75] text-[#0b0b12]">{ARTICLE.intro}</p>

          {ARTICLE.sections.map((s) => (
            <section key={s.heading}>
              <h2 className="ar-reveal mt-9 text-[28px] font-medium leading-[1.2] tracking-[-0.01em]">
                {s.heading}
              </h2>
              {s.paragraphs.map((p, i) => (
                <p key={i} className="mt-4 text-[17px] leading-[1.75] text-[#0b0b12]">
                  {p}
                </p>
              ))}
            </section>
          ))}

          <div className="ar-reveal">
            <AuthorCard />
          </div>
        </div>
      </article>

      <ContactUs peek={false} />
    </>
  );
}
