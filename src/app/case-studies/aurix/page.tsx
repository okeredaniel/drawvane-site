"use client";

import Image from "next/image";
import Link from "next/link";
import type { ComponentType } from "react";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ContactUs from "@/components/sections/ContactUs";

gsap.registerPlugin(ScrollTrigger);

const ACCENT = "#ffc800";
const ACCENT_INK = "#755b00";
const mono = {
  fontFamily: 'var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
};

const svgProps = {
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "currentColor",
  "aria-hidden": true,
} as const;

const PAPER = "#fdfcf8";

function Snowflake() {
  return (
    <svg {...svgProps}>
      <g stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
        {[0, 60, 120].map((a) => (
          <line key={a} x1="12" y1="2.5" x2="12" y2="21.5" transform={`rotate(${a} 12 12)`} />
        ))}
      </g>
      <circle cx="12" cy="12" r="2.6" />
    </svg>
  );
}

function Pinwheel() {
  return (
    <svg {...svgProps}>
      <path d="M3 3h8L3 11z M21 3v8l-8-8z M21 21h-8l8-8z M3 21v-8l8 8z" />
    </svg>
  );
}

function Ring() {
  return (
    <svg {...svgProps}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="5.2" fill={PAPER} />
      <circle cx="12" cy="12" r="2.6" />
    </svg>
  );
}

type Section = {
  id: string;
  title: string;
  text: string;
  cards?: { title: string; text: string }[];
};

type Related = {
  slug: string;
  name: string;
  Icon: ComponentType;
  text: string;
  n: number;
  suffix: string;
  label: string;
};

const STORY = {
  name: "Aurix",
  Logo: Ring,
  wordmark: "font-sans text-[26px] font-extrabold uppercase tracking-tight",
  headline: "How Aurix surfaced sprint dependencies",
  intro:
    "Aurix connected planning across four engineering squads, reducing late dependency discoveries by 30% before sprint commitment.",
  heroImage: "/case-studies/northway.avif" as string | undefined,
  stats: [
    { n: 30, suffix: "%", label: "Fewer surprises" },
    { n: 4, suffix: "", label: "Engineering squads" },
    { n: 58, suffix: "", label: "Team size" },
  ],
  meta: {
    industry: "Engineering software",
    useCase: "Dependency planning · Sprint readiness",
    client: "Aurix",
  },
  quote: {
    text: "Dependencies became part of planning instead of a problem we discovered after commitment.",
    name: "Nina Patel",
    role: "VP of Engineering",
    avatar: undefined as string | undefined,
  },
  sections: [
    {
      id: "overview",
      title: "Company overview",
      text: "Aurix is a 58-person engineering software company with four squads contributing to a connected product platform.",
    },
    {
      id: "challenge",
      title: "The challenge",
      text: "Squads planned independently and discussed shared dependencies only after sprint scopes were mostly set. A small platform change could create unexpected work for several teams.",
    },
    {
      id: "process",
      title: "The process",
      text: "Aurix mapped cross-squad dependencies during planning, linked them to shared milestones, and required an owner and resolution date before sprint commitment.",
    },
    {
      id: "solution",
      title: "The solution",
      text: "Stratora made dependencies visible beside the objectives and tasks they affected. Engineering leads could review impact without rebuilding a separate coordination board.",
      cards: [
        { title: "Shared context", text: "Keep the objective, brief, and delivery plan connected." },
        { title: "Clear ownership", text: "Give each milestone an accountable owner and a next action." },
        { title: "Human review", text: "Review AI planning suggestions with the people doing the work." },
      ],
    },
    {
      id: "results",
      title: "The results",
      text: "Late dependency discoveries fell by 30% across four engineering squads. The 58-person team entered sprint planning with clearer sequencing and fewer surprise blockers.",
    },
  ] as Section[],
  related: [
    {
      slug: "northway",
      name: "Northway",
      Icon: Snowflake,
      text: "Northway brought product goals, milestones, and dependencies into one shared plan, reducing weekly preparation time by 38%.",
      n: 38,
      suffix: "%",
      label: "Less preparation",
    },
    {
      slug: "neurova",
      name: "Neurova",
      Icon: Pinwheel,
      text: "Neurova connected implementation decisions with delivery plans, cutting avoidable revisions by 29% across eight client projects.",
      n: 29,
      suffix: "%",
      label: "Fewer revisions",
    },
  ] as Related[],
};

function CountUp({ n, suffix }: { n: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const obj = { v: 0 };
    el.textContent = `0${suffix}`;
    let tween: gsap.core.Tween | undefined;
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 92%",
      once: true,
      onEnter: () => {
        tween = gsap.to(obj, {
          v: n,
          duration: 1.5,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = `${Math.round(obj.v)}${suffix}`;
          },
        });
      },
    });
    return () => {
      st.kill();
      tween?.kill();
      el.textContent = `${n}${suffix}`;
    };
  }, [n, suffix]);

  return <span ref={ref}>{`${n}${suffix}`}</span>;
}

function Words({ text, cls }: { text: string; cls: string }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((w, i) => (
        <span key={`${w}-${i}`}>
          <span className="inline-block overflow-hidden pb-[0.12em] align-top">
            <span className={`${cls} inline-block`}>{w}</span>
          </span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </>
  );
}

function ImagePlaceholder({ file }: { file: string }) {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center p-4 text-center text-[11px] uppercase text-[#755b00]/70"
      style={{ ...mono, background: "linear-gradient(135deg,#fff6d6 0%,#ffe799 55%,#ffda57 100%)" }}
    >
      <span className="rounded-lg border-2 border-dashed border-[#ffc800]/30 px-4 py-3">
        Add image
        <br />
        public{file}
      </span>
    </div>
  );
}

export default function AurixCaseStudyPage() {
  const root = useRef<HTMLElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const itemRefs = useRef<Record<string, HTMLLIElement | null>>({});
  const [active, setActive] = useState(STORY.sections[0].id);

  const Logo = STORY.Logo;

  useEffect(() => {
    const els = STORY.sections
      .map((s) => document.getElementById(s.id))
      .filter((e): e is HTMLElement => !!e);
    if (els.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-20% 0px -65% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const item = itemRefs.current[active];
    const bar = barRef.current;
    if (!item || !bar) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.to(bar, {
      y: item.offsetTop,
      height: item.offsetHeight,
      opacity: 1,
      duration: reduce ? 0 : 0.45,
      ease: "power3.out",
      overwrite: "auto",
    });
  }, [active]);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".cs-logo", { y: 14, opacity: 0, duration: 0.6 })
        .from(".cs-word", { yPercent: 115, duration: 0.9, stagger: 0.07, ease: "power4.out" }, "-=0.3")
        .from(".cs-intro", { y: 18, opacity: 0, duration: 0.7 }, "-=0.55")
        .fromTo(
          ".cs-frame",
          { clipPath: "inset(0% 0% 100% 0% round 16px)", opacity: 0.4 },
          { clipPath: "inset(0% 0% 0% 0% round 16px)", opacity: 1, duration: 1.3, ease: "power4.inOut", clearProps: "clipPath" },
          "-=0.4"
        )
        .from(".cs-hero-pic", { scale: 1.25, duration: 1.7 }, "<");

      gsap.fromTo(
        ".cs-hero-par",
        { yPercent: -5 },
        {
          yPercent: 5,
          ease: "none",
          scrollTrigger: { trigger: ".cs-frame", start: "top bottom", end: "bottom top", scrub: 0.6 },
        }
      );

      gsap.from(".cs-stats", {
        y: 50,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ".cs-stats", start: "top 90%", once: true },
      });
      gsap.from(".cs-stat", {
        y: 26,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        delay: 0.2,
        ease: "power3.out",
        scrollTrigger: { trigger: ".cs-stats", start: "top 90%", once: true },
      });
      gsap.fromTo(
        ".cs-stats-bg",
        { xPercent: -4 },
        {
          xPercent: 4,
          ease: "none",
          scrollTrigger: { trigger: ".cs-stats", start: "top bottom", end: "bottom top", scrub: 0.6 },
        }
      );

      gsap.from(".cs-side", {
        x: -30,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ".cs-side", start: "top 90%", once: true },
      });

      gsap.from(".cs-quote", {
        y: 50,
        opacity: 0,
        scale: 0.98,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ".cs-quote", start: "top 88%", once: true },
      });
      gsap.from(".cs-qword", {
        yPercent: 115,
        duration: 0.8,
        stagger: 0.03,
        delay: 0.25,
        ease: "power4.out",
        scrollTrigger: { trigger: ".cs-quote", start: "top 88%", once: true },
      });
      gsap.from(".cs-quote-who", {
        y: 14,
        opacity: 0,
        duration: 0.6,
        delay: 0.9,
        scrollTrigger: { trigger: ".cs-quote", start: "top 88%", once: true },
      });

      gsap.set(".cs-reveal, .cs-sol-card, .cs-rel", { opacity: 0, y: 36 });
      ScrollTrigger.batch(".cs-reveal, .cs-sol-card, .cs-rel", {
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
        },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  const jump = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <main
        ref={root}
        style={{ colorScheme: "light" }}
        className="overflow-x-clip bg-[#f5f4ef] px-6 pb-24 pt-28 text-[#0b0b12] md:pt-32"
      >
        <div className="mx-auto max-w-[1280px]">
          <header>
            <div className="cs-logo flex items-center gap-2">
              <Logo />
              <span className={STORY.wordmark}>{STORY.name}</span>
            </div>

            <h1 className="mt-6 max-w-[620px] text-[40px] font-medium leading-[1.12] tracking-[-0.02em] md:text-[56px]">
              <Words text={STORY.headline} cls="cs-word" />
            </h1>

            <p className="cs-intro mt-8 max-w-[640px] text-[17px] leading-[1.5] text-[#4a4c5c]">{STORY.intro}</p>
          </header>

          <div className="cs-frame mt-8 rounded-2xl border border-black/10 p-[3px]">
            <div className="relative aspect-[16/8] w-full overflow-hidden rounded-[13px]">
              <div className="cs-hero-par absolute inset-x-0 -inset-y-[6%]">
                {STORY.heroImage ? (
                  <Image
                    src={STORY.heroImage}
                    alt={`${STORY.name} team planning session`}
                    fill
                    priority
                    sizes="(max-width: 1280px) 92vw, 1280px"
                    className="cs-hero-pic object-cover"
                  />
                ) : (
                  <ImagePlaceholder file="/case-studies/aurix.avif" />
                )}
              </div>
            </div>
          </div>

          <div className="cs-stats relative mt-12 overflow-hidden rounded-2xl bg-[#ffc800] px-8 py-9 text-[#0b0b12] md:px-12">
            <div aria-hidden className="cs-stats-bg absolute -inset-x-[6%] inset-y-0">
              {STORY.heroImage && (
                <Image
                  src={STORY.heroImage}
                  alt=""
                  fill
                  sizes="1280px"
                  className="object-cover opacity-30 mix-blend-luminosity"
                />
              )}
            </div>
            <dl className="relative grid gap-8 sm:grid-cols-3">
              {STORY.stats.map((s) => (
                <div key={s.label} className="cs-stat">
                  <dd className="text-[44px] font-medium leading-none tracking-tight md:text-[48px]">
                    <CountUp n={s.n} suffix={s.suffix} />
                  </dd>
                  <dt className="mt-2 text-[16px] text-white/90">{s.label}</dt>
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-16 grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-14">
            <aside className="cs-side self-start rounded-2xl border border-black/10 p-4 lg:sticky lg:top-28">
              <dl className="space-y-4 text-[13px]">
                <div>
                  <dt className="text-[11px] uppercase" style={{ ...mono, color: ACCENT_INK }}>
                    Industry
                  </dt>
                  <dd className="mt-1.5">{STORY.meta.industry}</dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase" style={{ ...mono, color: ACCENT_INK }}>
                    Use case
                  </dt>
                  <dd className="mt-1.5 leading-snug">{STORY.meta.useCase}</dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase" style={{ ...mono, color: ACCENT_INK }}>
                    Client
                  </dt>
                  <dd className="mt-1.5">{STORY.meta.client}</dd>
                </div>
              </dl>

              <div className="mt-5 text-[11px] uppercase" style={{ ...mono, color: ACCENT_INK }}>
                In this story
              </div>
              <ul className="relative mt-2.5 hidden lg:block">
                <span
                  ref={barRef}
                  aria-hidden
                  className="absolute left-0 top-0 w-[2px] rounded-full opacity-0"
                  style={{ backgroundColor: ACCENT, height: 20 }}
                />
                {STORY.sections.map((s) => (
                  <li
                    key={s.id}
                    ref={(node) => {
                      itemRefs.current[s.id] = node;
                    }}
                  >
                    <a
                      href={`#${s.id}`}
                      onClick={(e) => jump(e, s.id)}
                      className={`block py-[5px] pl-[10px] text-[13px] transition-colors duration-300 hover:text-[#0b0b12] ${
                        active === s.id ? "text-[#0b0b12]" : "text-[#4a4c5c]"
                      }`}
                    >
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </aside>

            <div className="min-w-0">
              <figure className="cs-quote rounded-2xl bg-[#03040f] p-6 text-white">
                <svg viewBox="0 0 24 24" className="size-6 text-white/40" fill="currentColor" aria-hidden>
                  <path d="M4 5h6v6c0 3.3-2 6-5 7l-.8-1.6C5.700 15.700 6.400 14.500 6.400 13H4zM14 5h6v6c0 3.3-2 6-5 7l-.8-1.6c1.500-.7 2.200-1.900 2.200-3.400H14z" />
                </svg>
                <blockquote className="mt-6 text-[22px] font-medium leading-[1.3] md:text-[24px]">
                  <Words text={STORY.quote.text} cls="cs-qword" />
                </blockquote>
                <figcaption className="cs-quote-who mt-6 flex items-center gap-3">
                  <span className="relative size-9 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-[#ffe799] to-[#ffc800]">
                    {STORY.quote.avatar ? (
                      <Image src={STORY.quote.avatar} alt={STORY.quote.name} fill sizes="36px" className="object-cover" />
                    ) : (
                      <span className="flex size-full items-center justify-center text-[11px] font-medium text-white">
                        {STORY.quote.name
                          .split(" ")
                          .map((p) => p[0])
                          .join("")}
                      </span>
                    )}
                  </span>
                  <span>
                    <span className="block text-[15px] font-medium leading-tight">{STORY.quote.name}</span>
                    <span className="mt-1 block text-[11px] uppercase text-white/60" style={mono}>
                      {STORY.quote.role}
                    </span>
                  </span>
                </figcaption>
              </figure>

              <div className="mt-10 space-y-10">
                {STORY.sections.map((s) => (
                  <section key={s.id} id={s.id} className="scroll-mt-28">
                    <h2 className="cs-reveal text-[28px] font-medium leading-tight tracking-[-0.01em]">{s.title}</h2>
                    <p className="cs-reveal mt-4 text-[17px] leading-[1.75] text-[#1a1b26]">{s.text}</p>

                    {s.cards && (
                      <div className="mt-6 grid gap-3 sm:grid-cols-3">
                        {s.cards.map((c) => (
                          <div
                            key={c.title}
                            className="cs-sol-card rounded-xl bg-[#fdfcf8] p-4 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_-18px_rgba(96,74,0,0.35)]"
                          >
                            <h3 className="text-[15px] font-medium">{c.title}</h3>
                            <p className="mt-4 text-[13px] leading-[1.35] text-[#4a4c5c]">{c.text}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                ))}
              </div>
            </div>
          </div>

          <section className="mt-28">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <div className="cs-reveal flex items-center gap-2 text-[12px] uppercase" style={{ ...mono, color: ACCENT_INK }}>
                  <span
                    aria-hidden
                    className="inline-block h-[8px] w-[8px] rounded-full border-2"
                    style={{ borderColor: ACCENT }}
                  />
                  Related stories
                </div>
                <h2 className="cs-reveal mt-3 text-[34px] font-medium leading-[1.1] tracking-[-0.02em] md:text-[44px]">
                  More teams. Shared direction.
                </h2>
              </div>

              <Link
                href="/case-studies"
                style={{ ...mono, backgroundColor: ACCENT }}
                className="cs-reveal group/btn relative inline-flex h-[40px] items-center gap-2 overflow-hidden rounded-full px-5 text-[12px] font-semibold uppercase tracking-wide text-[#0b0b12] hover:text-white"
              >
                <span
                  aria-hidden
                  className="absolute inset-0 translate-y-full bg-[#0b0b12] transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover/btn:translate-y-0"
                />
                <span
                  aria-hidden
                  className="relative inline-block h-[8px] w-[8px] rounded-full border-2 border-white/80 transition-transform duration-300 group-hover/btn:scale-125"
                />
                <span className="relative">View more</span>
              </Link>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {STORY.related.map(({ slug, name, Icon, text, n, suffix, label }) => (
                <Link
                  key={slug}
                  href={`/case-studies/${slug}`}
                  className="cs-rel group/card flex min-h-[240px] flex-col justify-between rounded-2xl border border-transparent bg-[#fdfcf8] p-4 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1.5 hover:border-[#b9bfd6] hover:shadow-[0_20px_40px_-22px_rgba(96,74,0,0.35)]"
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex transition-transform duration-500 group-hover/card:rotate-90">
                        <Icon />
                      </span>
                      <span className="font-serif text-[21px] tracking-tight">{name}</span>
                    </div>
                    <p className="text-[15px] leading-[1.35] text-[#4a4c5c]">{text}</p>
                  </div>
                  <div>
                    <div className="text-[40px] font-medium leading-none tracking-tight">
                      <CountUp n={n} suffix={suffix} />
                    </div>
                    <div className="mt-1.5 text-[13px] uppercase text-[#2b2d3a]">{label}</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>

      <ContactUs peek={false} />
    </>
  );
}

