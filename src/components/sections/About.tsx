"use client";

import Image from "next/image";
import Link from "next/link";
import type { ComponentType, ReactNode } from "react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/* YOUR IMAGES                                                         */
/* Save pictures in public/about/ and put each path below              */
/* (e.g. "/about/story.jpg"). Empty = shows a placeholder.             */
/* ------------------------------------------------------------------ */
const STORY_BG = "/about/story.avif"; 

const PEOPLE = [
  {
    name: "Daniel Mercer",
    role: "Founder & CEO",
    avatar: "",
    text: "Product builder focused on turning complex ideas into clear plans, bringing strategy, priorities and execution together in one connected workspace.",
  },
  {
    name: "Maya Chen",
    role: "Head of Product",
    avatar: "",
    text: "Product leader focused on turning complex ideas into clear plans, bringing strategy, priorities and execution together in one connected workspace.",
  },
];

const INVESTORS = [
  { name: "Maya Ellis", photo: "" },
  { name: "Adrian Cole", photo: "" },
  { name: "Julian Brooks", photo: "" },
  { name: "Nina Patel", photo: "" },
  { name: "Elena Ross", photo: "" },
];

const BLUE = "#1f3dff";
const PAPER = "#fbfcff";
const mono = {
  fontFamily:
    'var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
};

/* ------------------------------------------------------------------ */
/* Icons                                                               */
/* ------------------------------------------------------------------ */

function LineIcon({ children }: { children: ReactNode }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {children}
    </svg>
  );
}

const IconSparkle = () => (
  <LineIcon>
    <path d="M10 3l1.8 5.2L17 10l-5.2 1.8L10 17l-1.8-5.2L3 10l5.2-1.8L10 3z" />
    <path d="M18 14l.8 2.2L21 17l-2.2.8L18 20l-.8-2.2L15 17l2.2-.8L18 14z" />
  </LineIcon>
);
const IconLayers = () => (
  <LineIcon>
    <path d="M12 3L3 8l9 5 9-5-9-5z" />
    <path d="M3 12l9 5 9-5" />
    <path d="M3 16l9 5 9-5" />
  </LineIcon>
);
const IconRefresh = () => (
  <LineIcon>
    <path d="M20 11a8 8 0 0 0-14-4" />
    <path d="M4 4v4h4" />
    <path d="M4 13a8 8 0 0 0 14 4" />
    <path d="M20 20v-4h-4" />
  </LineIcon>
);
const IconChecklist = () => (
  <LineIcon>
    <path d="M4 6l1.5 1.5L8 5" />
    <path d="M4 12l1.5 1.5L8 11" />
    <path d="M4 18l1.5 1.5L8 17" />
    <path d="M12 6h8M12 12h8M12 18h8" />
  </LineIcon>
);
const IconHistory = () => (
  <LineIcon>
    <path d="M3 12a9 9 0 1 0 3-6.7" />
    <path d="M3 4v4h4" />
    <path d="M12 7v5l3 2" />
  </LineIcon>
);
const IconShield = () => (
  <LineIcon>
    <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" />
    <path d="M8.5 12l2.5 2.5 4.5-5" />
  </LineIcon>
);

const lp = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "currentColor",
  "aria-hidden": true,
} as const;

const Snowflake = () => (
  <svg {...lp}>
    <g stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      {[0, 60, 120].map((a) => (
        <line key={a} x1="12" y1="2.5" x2="12" y2="21.5" transform={`rotate(${a} 12 12)`} />
      ))}
    </g>
    <circle cx="12" cy="12" r="2.6" />
  </svg>
);
const Pinwheel = () => (
  <svg {...lp}>
    <path d="M3 3h8L3 11z M21 3v8l-8-8z M21 21h-8l8-8z M3 21v-8l8 8z" />
  </svg>
);
const DotBars = () => {
  const xs = Array.from({ length: 8 }, (_, i) => 3.2 + i * 2.5);
  return (
    <svg {...lp}>
      {xs.map((x) => {
        const h = 2 * Math.sqrt(Math.max(0, 100 - (x + 0.9 - 12) ** 2));
        return <rect key={x} x={x} y={12 - h / 2} width="1.8" height={h} rx="0.6" />;
      })}
    </svg>
  );
};
const StripedDisc = () => (
  <svg {...lp}>
    <circle cx="12" cy="12" r="10" />
    <g fill={PAPER} opacity="0.55">
      <rect x="3" y="9" width="18" height="1" />
      <rect x="2.5" y="12" width="19" height="1" />
      <rect x="3" y="15" width="18" height="1" />
    </g>
  </svg>
);
const Bend = () => (
  <svg {...lp}>
    <path d="M13 3h8v6l-8 7v5H3v-7l6-4h4z" />
  </svg>
);
const Asterisk = () => (
  <svg {...lp}>
    <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      {[0, 45, 90, 135].map((a) => (
        <line key={a} x1="12" y1="3" x2="12" y2="21" transform={`rotate(${a} 12 12)`} />
      ))}
    </g>
  </svg>
);
const Ring = () => (
  <svg {...lp}>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="5.2" fill={PAPER} />
    <circle cx="12" cy="12" r="2.6" />
  </svg>
);
const Diamonds = () => (
  <svg {...lp}>
    <g transform="rotate(45 12 12)">
      <rect x="4.5" y="4.5" width="6" height="6" />
      <rect x="13.5" y="4.5" width="6" height="6" />
      <rect x="4.5" y="13.5" width="6" height="6" />
      <rect x="13.5" y="13.5" width="6" height="6" />
    </g>
  </svg>
);

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */

type Why = { title: string; text: string; bullets: string[]; Icon: ComponentType };

const WHY: Why[] = [
  {
    title: "AI-Native Planning",
    text: "Turn goals and conversations into structured plans your team can act on.",
    bullets: ["Roadmaps generated in seconds", "Milestones and priorities built in", "Every goal linked to execution"],
    Icon: IconSparkle,
  },
  {
    title: "One Shared Context",
    text: "Keep plans, decisions, owners, and progress together in one dependable workspace.",
    bullets: ["One source of truth", "Clear ownership and status", "Less searching across tools"],
    Icon: IconLayers,
  },
  {
    title: "Built for Change",
    text: "Update direction without rebuilding the plan. Stratora keeps every dependency connected.",
    bullets: ["Plans adapt as work changes", "Dependencies stay visible", "Teams see impact instantly"],
    Icon: IconRefresh,
  },
  {
    title: "Execution Clarity",
    text: "Give every teammate a clear next step while leaders keep the full picture.",
    bullets: ["Actionable task boards", "Live progress and risks", "Focused weekly reviews"],
    Icon: IconChecklist,
  },
  {
    title: "Decision Memory",
    text: "Preserve the reasoning behind priorities so important context stays with the work.",
    bullets: ["Decisions captured in context", "History stays searchable", "Faster team handoffs"],
    Icon: IconHistory,
  },
  {
    title: "Enterprise Ready",
    text: "Scale planning across teams with reliable controls, security, and support.",
    bullets: ["Role-based access", "Secure shared workspaces", "Priority onboarding and support"],
    Icon: IconShield,
  },
];

const PARTNERS: { name: string; type: string; Icon: ComponentType }[] = [
  { name: "Northway", type: "B2B software", Icon: Snowflake },
  { name: "Neurova", type: "Health technology", Icon: Pinwheel },
  { name: "Menlo", type: "Logistics technology", Icon: DotBars },
  { name: "Ovo Studio", type: "Creative production", Icon: StripedDisc },
  { name: "Patgency", type: "Digital agency", Icon: Bend },
  { name: "Skullbox", type: "Product consultancy", Icon: Asterisk },
  { name: "Aurix", type: "Engineering software", Icon: Ring },
  { name: "Verdan", type: "Analytics software", Icon: Diamonds },
];

const STORY_HEADLINE = "Planning is one of the hardest parts of turning ideas into progress".split(" ");
const WHY_HEADLINE = ["Built", "for", "enterprise.", "Trusted", "globally."];

function Words({ words, cls }: { words: string[]; cls: string }) {
  return (
    <>
      {words.map((w, i) => (
        <span key={`${w}-${i}`} className="inline-block overflow-hidden pb-1 align-top">
          <span className={`${cls} inline-block`}>{w}</span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </>
  );
}

function Eyebrow({ children, light }: { children: ReactNode; light?: boolean }) {
  return (
    <div
      className="flex items-center gap-2 text-[12px] uppercase"
      style={{ ...mono, color: light ? "rgba(255,255,255,0.85)" : BLUE }}
    >
      <span
        aria-hidden
        className="inline-block h-[8px] w-[8px] rounded-full border-2"
        style={{ borderColor: light ? "rgba(255,255,255,0.85)" : BLUE }}
      />
      {children}
    </div>
  );
}

function Avatar({ name, src }: { name: string; src: string }) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .join("");

  return (
    <div className="ab-avatar relative h-[36px] w-[36px] shrink-0 overflow-hidden rounded-[7px]">
      {src ? (
        <Image src={src} alt={name} fill sizes="36px" className="object-cover" />
      ) : (
        <div
          className="flex h-full w-full items-center justify-center text-[12px] font-semibold text-white"
          style={{ background: "linear-gradient(135deg,#6f86ff,#1f3dff)" }}
        >
          {initials}
        </div>
      )}
    </div>
  );
}

function InvestorCard({ name, photo, i }: { name: string; photo: string; i: number }) {
  return (
    <div className="relative h-[238px] w-[336px] shrink-0 overflow-hidden rounded-[18px] border border-black/10">
      {photo ? (
        <Image src={photo} alt={name} fill sizes="336px" className="object-cover" />
      ) : (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center text-[11px] uppercase text-[#1f3dff]/70"
          style={{
            ...mono,
            background: `linear-gradient(${130 + i * 28}deg,#e6ebff 0%,#c4d1ff 55%,#a5b8ff 100%)`,
          }}
        >
          <span className="text-[18px] normal-case tracking-tight text-[#1f3dff]">{name}</span>
          <span className="rounded-lg border-2 border-dashed border-[#1f3dff]/30 px-3 py-2">
            Add image
            <br />
            public/about/investor-{i + 1}.jpg
          </span>
        </div>
      )}
    </div>
  );
}

export default function About() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".ab-bg-inner", { scale: 1.18, opacity: 0, duration: 2, ease: "power2.out" })
        .from(".ab-hero-word", { yPercent: 110, duration: 0.9, stagger: 0.05, ease: "power4.out" }, "-=1.5")
        .from(".ab-hero-p", { y: 28, opacity: 0, duration: 0.8, stagger: 0.12 }, "-=0.5");

      gsap.to(".ab-bg", {
        yPercent: 10,
        ease: "none",
        scrollTrigger: { trigger: ".ab-hero", start: "top top", end: "bottom top", scrub: true },
      });

      const wordsOnScroll = (words: string, trigger: string) =>
        gsap.from(words, {
          yPercent: 110,
          duration: 0.9,
          stagger: 0.07,
          ease: "power4.out",
          scrollTrigger: { trigger, start: "top 82%", once: true },
        });
      wordsOnScroll(".ab-people-word", ".ab-people-head");
      wordsOnScroll(".ab-why-word", ".ab-why-head");
      wordsOnScroll(".ab-partners-word", ".ab-partners-head");

      const reveal = (sel: string, extra?: (batch: Element[]) => void) => {
        gsap.set(sel, { opacity: 0, y: 50 });
        ScrollTrigger.batch(sel, {
          start: "top 90%",
          once: true,
          onEnter: (batch) => {
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.1,
              ease: "power3.out",
              overwrite: true,
            });
            extra?.(batch as Element[]);
          },
        });
      };

      reveal(".ab-person", (batch) =>
        gsap.from(
          batch.map((card) => (card as HTMLElement).querySelector(".ab-avatar")),
          { scale: 0, duration: 0.5, stagger: 0.1, delay: 0.3, ease: "back.out(2.4)" }
        )
      );

      reveal(".ab-why", (batch) => {
        gsap.from(
          batch.map((card) => (card as HTMLElement).querySelector(".ab-tile")),
          { scale: 0, rotate: -90, duration: 0.7, stagger: 0.1, delay: 0.2, ease: "back.out(2.2)" }
        );
        gsap.from(
          batch.flatMap((card) => Array.from((card as HTMLElement).querySelectorAll(".ab-bullet"))),
          { x: -12, opacity: 0, duration: 0.5, stagger: 0.03, delay: 0.4 }
        );
      });

      reveal(".ab-partner", (batch) =>
        gsap.from(
          batch.map((card) => (card as HTMLElement).querySelector(".ab-logo")),
          { scale: 0, duration: 0.5, stagger: 0.06, delay: 0.2, ease: "back.out(2.4)" }
        )
      );

      gsap.from(".ab-investors-copy", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        scrollTrigger: { trigger: ".ab-investors-copy", start: "top 88%", once: true },
      });
      gsap.from(".ab-marquee", {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".ab-marquee", start: "top 92%", once: true },
      });
      gsap.from(".ab-cta", {
        scale: 0.8,
        opacity: 0,
        duration: 0.7,
        ease: "back.out(2)",
        scrollTrigger: { trigger: ".ab-cta", start: "top 95%", once: true },
      });
    }, el);

    const track = el.querySelector<HTMLElement>(".ab-track");
    const wrap = el.querySelector<HTMLElement>(".ab-marquee");
    let drift: gsap.core.Tween | undefined;
    const slow = () => {
      if (drift) gsap.to(drift, { timeScale: 0, duration: 0.6 });
    };
    const resume = () => {
      if (drift) gsap.to(drift, { timeScale: 1, duration: 0.6 });
    };

    if (track && wrap) {
      drift = gsap.to(track, { xPercent: -50, duration: 50, ease: "none", repeat: -1 });
      wrap.addEventListener("mouseenter", slow);
      wrap.addEventListener("mouseleave", resume);
    }

    return () => {
      if (wrap) {
        wrap.removeEventListener("mouseenter", slow);
        wrap.removeEventListener("mouseleave", resume);
      }
      drift?.kill();
      ctx.revert();
    };
  }, []);

  const lift = (e: React.MouseEvent<HTMLElement>, on: boolean, tileSel: string, px: number) => {
    const card = e.currentTarget;
    if (px) {
      gsap.to(card, {
        y: on ? -px : 0,
        duration: on ? 0.4 : 0.7,
        ease: on ? "power3.out" : "elastic.out(1,0.55)",
        overwrite: "auto",
      });
    }
    const tile = card.querySelector(tileSel);
    if (tile) {
      gsap.to(tile, {
        rotate: on ? -8 : 0,
        scale: on ? 1.12 : 1,
        duration: 0.45,
        ease: "back.out(2)",
        overwrite: "auto",
      });
    }
  };

  const fade = "linear-gradient(to bottom, #000 62%, transparent 100%)";

  return (
    <div ref={root} id="about" className="bg-[#eef0f5] text-[#0b0b12]">
      <section className="ab-hero relative overflow-hidden">
        <div
          aria-hidden
          className="ab-bg pointer-events-none absolute inset-x-0 -top-[6%] h-[112%]"
          style={{ maskImage: fade, WebkitMaskImage: fade }}
        >
          <div className="ab-bg-inner absolute inset-0">
            {STORY_BG ? (
              <>
                <Image
                  src={STORY_BG}
                  alt=""
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover brightness-95 contrast-105 saturate-100"
                />
                <div className="absolute inset-0 bg-[#eef0f5]/5" />
              </>
            ) : (
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse at 18% 28%, #aebfff 0%, transparent 55%), radial-gradient(ellipse at 82% 18%, #a2baff 0%, transparent 50%), linear-gradient(180deg,#bfd0ff 0%,#d8e2ff 100%)",
                }}
              >
                <span
                  className="absolute left-6 top-28 rounded-lg border-2 border-dashed border-[#1f3dff]/30 px-3 py-2 text-[11px] uppercase text-[#1f3dff]/70"
                  style={mono}
                >
                  Add image: public/about/story.jpg
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="relative mx-auto max-w-[600px] px-6 pb-[120px] pt-[190px] sm:pt-[230px]">
          <h1 className="text-[40px] font-medium leading-[1.2] tracking-[-0.02em] sm:text-[54px]">
            <Words words={STORY_HEADLINE} cls="ab-hero-word" />
          </h1>
          <p className="ab-hero-p mt-10 text-[21px] leading-[1.3] sm:text-[24px]">
            Teams rarely struggle because they lack ideas. The problem starts when those ideas become
            scattered across documents, meetings, tasks and tools. Priorities shift, context gets lost,
            and the original plan slowly becomes disconnected from the work actually happening.
          </p>
          <p className="ab-hero-p mt-8 text-[17px] leading-[1.5] text-[#45475a]">
            Stratora is built around a different idea. Planning shouldn’t be a document you create once
            and then maintain manually. It should be a living system that understands the goal, turns it
            into clear objectives and milestones, and stays connected to the team as the work moves
            forward.
          </p>
          <p className="ab-hero-p mt-6 text-[17px] leading-[1.5] text-[#45475a]">
            Our goal is to make planning feel less like managing another tool and more like having a
            shared understanding of what matters, what comes next, and where attention is needed.
          </p>
          <p className="ab-hero-p mt-6 text-[17px] font-semibold leading-[1.5] text-[#2b2d3a]">
            The plan should move with the work. That’s what Stratora is built for.
          </p>
        </div>
      </section>

      <div className="mx-auto h-px max-w-[1280px] bg-black/5" />

      <section className="px-6 py-[84px]">
        <div className="ab-people-head flex flex-col items-center text-center">
          <Eyebrow>Behind product</Eyebrow>
          <h2 className="mt-4 text-[40px] font-medium leading-[1.1] tracking-[-0.02em] sm:text-[46px]">
            <Words words={["Meet", "the", "people", "behind", "Stratora"]} cls="ab-people-word" />
          </h2>
        </div>

        <div className="mx-auto mt-14 grid max-w-[812px] gap-3 sm:grid-cols-2">
          {PEOPLE.map((p) => (
            <article
              key={p.name}
              className="ab-person rounded-2xl bg-[#e6e8f1] p-4 will-change-transform"
              onMouseEnter={(e) => lift(e, true, ".ab-avatar", 6)}
              onMouseLeave={(e) => lift(e, false, ".ab-avatar", 6)}
            >
              <div className="flex items-center gap-3">
                <Avatar name={p.name} src={p.avatar} />
                <div>
                  <div className="text-[16px] leading-tight">{p.name}</div>
                  <div className="mt-[3px] text-[11px] uppercase leading-none text-[#55576a]" style={mono}>
                    {p.role}
                  </div>
                </div>
              </div>
              <p className="mt-5 text-[17px] leading-[1.45] text-[#1a1b26]">{p.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="px-6 py-[72px] text-white" style={{ backgroundColor: BLUE }}>
        <div className="mx-auto max-w-[1280px]">
          <div className="ab-why-head flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div>
              <Eyebrow light>Why us</Eyebrow>
              <h2 className="mt-3 max-w-[420px] text-[40px] font-medium leading-[1.05] tracking-[-0.02em] sm:text-[46px]">
                <Words words={WHY_HEADLINE} cls="ab-why-word" />
              </h2>
            </div>
            <p className="max-w-[300px] text-[15px] font-medium leading-[1.4] lg:mb-3">
              Built with enterprise-grade security, privacy, and reliability, Stratora keeps teams
              connected wherever work happens.
            </p>
          </div>

          <div className="mt-16 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {WHY.map(({ title, text, bullets, Icon }) => (
              <article
                key={title}
                className="ab-why rounded-2xl bg-[#fbfcff] p-4 text-[#0b0b12] will-change-transform"
                onMouseEnter={(e) => lift(e, true, ".ab-tile", 6)}
                onMouseLeave={(e) => lift(e, false, ".ab-tile", 6)}
              >
                <div
                  className="ab-tile flex h-11 w-11 items-center justify-center rounded-xl text-white"
                  style={{ backgroundColor: BLUE }}
                >
                  <Icon />
                </div>
                <h3 className="mt-6 text-[24px] font-medium leading-tight tracking-[-0.01em]">{title}</h3>
                <p className="mt-2 text-[15px] leading-[1.35] text-[#55576a]">{text}</p>
                <ul className="mt-5 space-y-[10px]">
                  {bullets.map((b) => (
                    <li key={b} className="ab-bullet flex items-center gap-3 text-[15px]">
                      <span
                        aria-hidden
                        className="inline-block h-[8px] w-[8px] shrink-0 rounded-full border-2 border-[#0b0b12]"
                      />
                      {b}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="overflow-hidden px-6 pb-[88px] pt-[88px]">
        <div className="mx-auto max-w-[1280px]">
          <div className="ab-partners-head flex flex-col items-center text-center">
            <Eyebrow>Investors</Eyebrow>
            <h2 className="mt-4 text-[40px] font-medium leading-[1.1] tracking-[-0.02em] sm:text-[46px]">
              <Words words={["Our", "Partners", "&", "Investors"]} cls="ab-partners-word" />
            </h2>
            <p className="mt-5 max-w-[500px] text-[15.5px] leading-[1.35]">
              Our company network includes <strong className="font-semibold">Northway</strong> (B2B
              software), <strong className="font-semibold">Neurova</strong> (health technology) and{" "}
              <strong className="font-semibold">Menlo</strong> (logistics technology), alongside teams in
              design, engineering and analytics—all working toward calmer, more connected product
              development.
            </p>
          </div>

          <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PARTNERS.map(({ name, type, Icon }, i) => (
              <div
                key={name}
                className={`ab-partner flex h-[96px] items-center gap-4 rounded-xl bg-[#e6e8f1] p-4 transition-colors duration-300 hover:bg-[#dde1ee] will-change-transform ${
                  i === PARTNERS.length - 1 ? "lg:col-span-2" : ""
                }`}
                onMouseEnter={(e) => lift(e, true, ".ab-logo", 0)}
                onMouseLeave={(e) => lift(e, false, ".ab-logo", 0)}
              >
                <div className="ab-logo flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-lg bg-white text-[#0b0b12]">
                  <Icon />
                </div>
                <div>
                  <div className="text-[22px] leading-tight tracking-[-0.01em]">{name}</div>
                  <div className="mt-[2px] text-[15px] text-[#55576a]">{type}</div>
                </div>
              </div>
            ))}
          </div>

          <p className="ab-investors-copy mx-auto mt-16 max-w-[500px] text-center text-[15.5px] leading-[1.35]">
            Stratora brings together independent investors including{" "}
            <strong className="font-semibold">Maya Ellis</strong> (Product Leader and Advisor),{" "}
            <strong className="font-semibold">Adrian Cole</strong> (Founder and Technology Investor),{" "}
            <strong className="font-semibold">Nina Patel</strong> (Startup Mentor),{" "}
            <strong className="font-semibold">Julian Brooks</strong> (Software Entrepreneur), and{" "}
            <strong className="font-semibold">Elena Ross</strong> (Early-stage Investor).
          </p>
        </div>

        <div className="ab-marquee mt-10 -mx-6 overflow-hidden">
          <div className="ab-track flex w-max">
            {[0, 1].map((half) => (
              <div key={half} className="flex shrink-0 gap-4 pr-4" aria-hidden={half === 1}>
                {INVESTORS.map((p, i) => (
                  <InvestorCard key={`${half}-${p.name}`} name={p.name} photo={p.photo} i={i} />
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex justify-center">
          <Link
            href="/contact"
            style={{ ...mono, backgroundColor: BLUE }}
            className="ab-cta group relative inline-flex h-[40px] items-center gap-2 overflow-hidden rounded-full px-5 text-[13px] font-semibold uppercase tracking-wide text-white"
          >
            <span
              aria-hidden
              className="absolute inset-0 translate-y-full bg-[#0b0b12] transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-y-0"
            />
            <span
              aria-hidden
              className="relative inline-block h-[8px] w-[8px] rounded-full border-2 border-white/80 transition-transform duration-300 group-hover:scale-125"
            />
            <span className="relative">Become investor</span>
            <span
              aria-hidden
              className="relative -ml-1 w-0 -translate-x-2 overflow-hidden opacity-0 transition-all duration-300 group-hover:ml-0 group-hover:w-4 group-hover:translate-x-0 group-hover:opacity-100"
            >
              →
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
