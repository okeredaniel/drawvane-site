"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/* YOUR IMAGES AND LINKS                                               */
/* Save pictures in public/team-alignment/ and paste the paths here.   */
/* Empty = shows a placeholder.                                        */
/* ------------------------------------------------------------------ */
const HERO_IMAGE = ""; // big photo under the title, e.g. "/team-alignment/hero.jpg"
const AUTHOR_AVATAR = ""; // e.g. "/team-alignment/daniel.jpg"

// Social links on the author card. Put real profile URLs in.
const SOCIALS = {
  instagram: "#",
  x: "#",
  linkedin: "#",
};

const ACCENT = "#ffc800";
const ACCENT_INK = "#755b00";
const mono = {
  fontFamily:
    'var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
};

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */

const TITLE = ["Announcing", "Stratora", "1.0", "—", "planning", "that", "writes", "itself"];
const SUBTITLE =
  "Meet the connected planning workspace that turns goals, context, and team decisions into clear, actionable plans.";

const INTRO =
  "Meet Stratora, a connected planning workspace built for teams that need clarity without adding more process. It brings strategy, priorities, milestones, documents, and active work into one place, then uses AI to help turn that shared context into a plan people can act on.";

const SECTIONS: { heading: string; paragraphs: string[] }[] = [
  {
    heading: "Start with the outcome",
    paragraphs: [
      "Stratora begins with what the team is trying to achieve. Describe the outcome, add the context that matters, and Stratora structures the work into priorities, milestones, dependencies, and clear next steps.",
      "The result is a practical first plan that your team can review and shape together. AI handles the initial structure while people keep ownership of scope, estimates, tradeoffs, and commitments.",
    ],
  },
  {
    heading: "Keep planning and execution connected",
    paragraphs: [
      "Plans lose value when the brief, roadmap, and daily work drift apart. Stratora keeps goals linked to the initiatives, milestones, tasks, owners, and documents that move them forward.",
      "When priorities change, teams can see what is affected, who needs to respond, and which decisions still need attention. The current plan stays visible without losing the reasoning behind it.",
    ],
  },
  {
    heading: "Use AI without giving up judgment",
    paragraphs: [
      "Stratora uses workspace context to suggest structure, surface dependencies, and identify missing ownership. Suggestions are designed to support a team’s decisions, not replace them.",
      "Every recommendation can be reviewed, adjusted, or rejected. Teams stay responsible for the plan while spending less time rebuilding it across disconnected tools.",
    ],
  },
  {
    heading: "A calmer way to move work forward",
    paragraphs: [
      "Stratora gives product teams one clear place to plan, decide, and follow through. Start with a goal, bring in the context your team already has, and turn it into work everyone can understand and own.",
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Small pieces                                                        */
/* ------------------------------------------------------------------ */

function Social({ href, label, children }: { href: string; label: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-lg text-[#0b0b12] transition-all duration-300 hover:-translate-y-1 hover:bg-[#ffc800]/10 hover:text-[#755b00]"
    >
      {children}
    </Link>
  );
}

const InstagramIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
  </svg>
);
const XIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
const LinkedInIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="3" y="3" width="18" height="18" rx="3" />
    <path d="M8 11v5" />
    <circle cx="8" cy="8" r="0.6" fill="currentColor" />
    <path d="M12 16v-5m0 2a2.5 2.5 0 0 1 5 0v3" />
  </svg>
);

/* ------------------------------------------------------------------ */
/* Page content                                                        */
/* ------------------------------------------------------------------ */

export default function TeamAlignment() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".ta-eyebrow", { y: 12, opacity: 0, duration: 0.5 })
        .from(".ta-word", { yPercent: 110, duration: 0.9, stagger: 0.06, ease: "power4.out" }, "-=0.25")
        .from(".ta-sub", { y: 20, opacity: 0, duration: 0.7 }, "-=0.5")
        .from(
          ".ta-frame",
          { clipPath: "inset(0% 0% 100% 0% round 20px)", duration: 1.3, ease: "power4.inOut" },
          "-=0.4"
        )
        .from(".ta-pic", { scale: 1.25, duration: 1.8 }, "<");

      gsap.set(".ta-reveal", { opacity: 0, y: 28 });
      ScrollTrigger.batch(".ta-reveal", {
        start: "top 92%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.08,
            ease: "power3.out",
            overwrite: true,
          }),
      });

      gsap.to(".ta-progress", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { trigger: ".ta-article", start: "top 85%", end: "bottom 60%", scrub: true },
      });

      gsap.from(".ta-avatar", {
        scale: 0,
        rotate: -90,
        duration: 0.7,
        ease: "back.out(2.2)",
        scrollTrigger: { trigger: ".ta-author", start: "top 92%", once: true },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="team-alignment" className="bg-[#f5f4ef] px-6 pb-[110px] pt-[84px] text-[#0b0b12]">
      <div
        aria-hidden
        className="ta-progress pointer-events-none fixed left-0 top-0 z-[60] h-[3px] w-full"
        style={{ backgroundColor: ACCENT, transform: "scaleX(0)", transformOrigin: "0 50%" }}
      />

      <div className="mx-auto flex max-w-[860px] flex-col items-center text-center">
        <div
          className="ta-eyebrow flex items-center gap-2 text-[12px] uppercase"
          style={{ ...mono, color: ACCENT_INK }}
        >
          <span
            aria-hidden
            className="inline-block h-[8px] w-[8px] rounded-full border-2"
            style={{ borderColor: ACCENT }}
          />
          Team alignment
        </div>
        <h1 className="mt-5 text-[38px] font-medium leading-[1.15] tracking-[-0.02em] sm:text-[52px]">
          {TITLE.map((w, i) => (
            <span key={`${w}-${i}`} className="inline-block overflow-hidden pb-1 align-top">
              <span className="ta-word inline-block">{w}</span>
              {i < TITLE.length - 1 ? " " : ""}
            </span>
          ))}
        </h1>
        <p className="ta-sub mt-6 max-w-[780px] text-[16px] leading-[1.5] text-[#45475a]">{SUBTITLE}</p>
      </div>

      <div className="ta-frame mx-auto mt-[64px] max-w-[1280px] rounded-[22px] border border-black/10 p-[3px]">
        <div className="relative aspect-[16/9] overflow-hidden rounded-[19px] lg:aspect-[2/1]">
          {HERO_IMAGE ? (
            <Image
              src={HERO_IMAGE}
              alt="Stratora team planning session"
              fill
              priority
              sizes="(max-width: 1280px) 94vw, 1280px"
              className="ta-pic object-cover"
            />
          ) : (
            <div
              className="ta-pic absolute inset-0 flex items-center justify-center p-4 text-center text-[11px] uppercase text-[#755b00]/70"
              style={{
                ...mono,
                background: "linear-gradient(135deg,#fff6d6 0%,#ffe799 50%,#ffe799 100%)",
              }}
            >
              <span className="rounded-lg border-2 border-dashed border-[#ffc800]/30 px-4 py-3">
                Add image
                <br />
                public/team-alignment/hero.jpg
              </span>
            </div>
          )}
        </div>
      </div>

      <article className="ta-article mx-auto mt-[76px] max-w-[680px]">
        <p className="ta-reveal text-[17px] leading-[1.75]">{INTRO}</p>

        {SECTIONS.map((s) => (
          <div key={s.heading}>
            <h2 className="ta-reveal mt-9 text-[28px] font-medium leading-tight tracking-[-0.01em]">
              {s.heading}
            </h2>
            {s.paragraphs.map((p) => (
              <p key={p.slice(0, 24)} className="ta-reveal mt-5 text-[17px] leading-[1.75]">
                {p}
              </p>
            ))}
          </div>
        ))}

        <div className="ta-reveal ta-author mt-12 flex items-center justify-between rounded-2xl border border-black/10 bg-[#fdfcf8] p-4">
          <div className="flex items-center gap-4">
            <div className="ta-avatar relative h-[52px] w-[52px] shrink-0 overflow-hidden rounded-xl">
              {AUTHOR_AVATAR ? (
                <Image src={AUTHOR_AVATAR} alt="Daniel Mercer" fill sizes="52px" className="object-cover" />
              ) : (
                <div
                  className="flex h-full w-full items-center justify-center text-[16px] font-semibold text-[#0b0b12]"
                  style={{ background: "linear-gradient(135deg,#ffe680,#ffc800)" }}
                >
                  DM
                </div>
              )}
            </div>
            <div>
              <div className="text-[18px] leading-tight">Daniel Mercer</div>
              <div className="mt-1 text-[13px] uppercase leading-none text-[#45475a]" style={mono}>
                Founder &amp; CEO
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Social href={SOCIALS.instagram} label="Instagram">
              <InstagramIcon />
            </Social>
            <Social href={SOCIALS.x} label="X">
              <XIcon />
            </Social>
            <Social href={SOCIALS.linkedin} label="LinkedIn">
              <LinkedInIcon />
            </Social>
          </div>
        </div>
      </article>
    </section>
  );
}

