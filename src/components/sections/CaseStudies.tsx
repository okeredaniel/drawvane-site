"use client";

import Image from "next/image";
import Link from "next/link";
import type { ComponentType } from "react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FEATURED_IMAGE = "/construction/site-review.webp";

const ACCENT = "#ffc800";
const ACCENT_INK = "#755b00";
const mono = {
  fontFamily:
    'var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
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

function DotBars() {
  const xs = Array.from({ length: 8 }, (_, i) => 3.2 + i * 2.5);
  return (
    <svg {...svgProps}>
      {xs.map((x) => {
        const h = 2 * Math.sqrt(Math.max(0, 100 - (x + 0.9 - 12) ** 2));
        return <rect key={x} x={x} y={12 - h / 2} width="1.8" height={h} rx="0.6" />;
      })}
    </svg>
  );
}

function StripedDisc() {
  return (
    <svg {...svgProps}>
      <circle cx="12" cy="12" r="10" />
      <g fill={PAPER} opacity="0.55">
        <rect x="3" y="9" width="18" height="1" />
        <rect x="2.5" y="12" width="19" height="1" />
        <rect x="3" y="15" width="18" height="1" />
      </g>
    </svg>
  );
}

function Bend() {
  return (
    <svg {...svgProps}>
      <path d="M13 3h8v6l-8 7v5H3v-7l6-4h4z" />
    </svg>
  );
}

function Asterisk() {
  return (
    <svg {...svgProps}>
      <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        {[0, 45, 90, 135].map((a) => (
          <line key={a} x1="12" y1="3" x2="12" y2="21" transform={`rotate(${a} 12 12)`} />
        ))}
      </g>
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

function Diamonds() {
  return (
    <svg {...svgProps}>
      <g transform="rotate(45 12 12)">
        <rect x="4.5" y="4.5" width="6" height="6" />
        <rect x="13.5" y="4.5" width="6" height="6" />
        <rect x="4.5" y="13.5" width="6" height="6" />
        <rect x="13.5" y="13.5" width="6" height="6" />
      </g>
    </svg>
  );
}

type Story = {
  slug: string;
  name: string;
  text: string;
  n: number;
  suffix: string;
  label: string;
  Icon: ComponentType;
};

const STORIES: Story[] = [
  { slug: "drawing-review", name: "Drawing review", text: "Bring a drawing question into focus with a clear location, markup and conversation.", n: 1, suffix: "", label: "Drawing review", Icon: Snowflake },
  { slug: "quantity-takeoff", name: "Quantity takeoff", text: "Review lengths, areas and counts alongside the detail they describe.", n: 2, suffix: "", label: "Quantity takeoff", Icon: Pinwheel },
  { slug: "project-answers", name: "Project answers", text: "Use a focused question to navigate project documents and inspect the supporting information.", n: 3, suffix: "", label: "Project answers", Icon: DotBars },
  { slug: "team-coordination", name: "Team coordination", text: "Bring people into the same conversation around the documents they are working with.", n: 4, suffix: "", label: "Team coordination", Icon: StripedDisc },
  { slug: "rfi-preparation", name: "RFI preparation", text: "Gather the relevant drawing and specification detail before preparing a formal request.", n: 5, suffix: "", label: "RFI preparation", Icon: Bend },
  { slug: "specification-review", name: "Specification review", text: "Bring related document requirements together before making a material or installation decision.", n: 6, suffix: "", label: "Specification review", Icon: Asterisk },
  { slug: "organization-workspace", name: "Organization workspaces", text: "Give an organization a clearer structure for the projects and people working within it.", n: 7, suffix: "", label: "Organization workspaces", Icon: Ring },
  { slug: "project-handover", name: "Project handover", text: "Prepare the project record so the people receiving it can find the detail and understand its status.", n: 8, suffix: "", label: "Project handover", Icon: Diamonds }
];

const FEATURED = { name: "Drawing review", text: "A clearer question starts with the right detail. Bring the drawing, the markup and the people reviewing it into one focused conversation.", stats: [{ n: 1, suffix: "", label: "Locate" }, { n: 2, suffix: "", label: "Review" }, { n: 3, suffix: "", label: "Discuss" }], href: "/case-studies/drawing-review" };

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

function FeaturedImage() {
  if (FEATURED_IMAGE) {
    return (
      <Image
        src={FEATURED_IMAGE}
        alt="Illustrative construction drawing review on site"
        fill
        sizes="(max-width: 1024px) 90vw, 500px"
        className="cs-feat-pic object-cover"
      />
    );
  }
  return (
    <div
      className="cs-feat-pic absolute inset-0 flex items-center justify-center p-4 text-center text-[11px] uppercase text-[#755b00]/70"
      style={{
        ...mono,
        background: "linear-gradient(135deg,#fff6d6 0%,#ffe799 55%,#ffda57 100%)",
      }}
    >
      <span className="rounded-lg border-2 border-dashed border-[#ffc800]/30 px-4 py-3">
        Add image
        <br />
        public/case-studies/northway.jpg
      </span>
    </div>
  );
}

export default function CaseStudies() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".cs-eyebrow", { y: 12, opacity: 0, duration: 0.5 })
        .from(".cs-word", { yPercent: 110, duration: 0.9, stagger: 0.09, ease: "power4.out" }, "-=0.25")
        .from(".cs-feature", { y: 70, opacity: 0, scale: 0.97, duration: 1 }, "-=0.5")
        .from(
          ".cs-feat-frame",
          { clipPath: "inset(0% 0% 0% 100% round 12px)", duration: 1.2, ease: "power4.inOut" },
          "-=0.8"
        )
        .from(".cs-feat-pic", { scale: 1.25, duration: 1.6 }, "<")
        .from(".cs-feat-item", { y: 22, opacity: 0, duration: 0.6, stagger: 0.09 }, "-=1.1");

      gsap.set(".cs-card", { opacity: 0, y: 50, scale: 0.96 });
      ScrollTrigger.batch(".cs-card", {
        start: "top 90%",
        once: true,
        onEnter: (batch) => {
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
            overwrite: true,
          });
          gsap.from(
            batch.map((c) => (c as HTMLElement).querySelector(".cs-icon")),
            { scale: 0, rotate: -120, duration: 0.7, stagger: 0.1, delay: 0.2, ease: "back.out(2.2)" }
          );
        },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  const hover = (e: React.MouseEvent<HTMLElement>, on: boolean) => {
    const card = e.currentTarget;
    gsap.to(card, {
      y: on ? -6 : 0,
      duration: on ? 0.35 : 0.6,
      ease: on ? "power3.out" : "elastic.out(1,0.55)",
      overwrite: "auto",
    });
    gsap.to(card.querySelector(".cs-icon"), {
      rotate: on ? 90 : 0,
      scale: on ? 1.15 : 1,
      duration: 0.5,
      ease: "back.out(2)",
      overwrite: "auto",
    });
  };

  const title = ["Built", "for", "the", "work", "you", "do."];

  return (
    <section
      id="case-studies"
      ref={root}
      className="bg-[#f5f4ef] px-6 pb-24 pt-[72px] text-[#0b0b12]"
    >
      <div className="mx-auto max-w-[1024px]">
        <div className="flex flex-col items-center text-center">
          <div
            className="cs-eyebrow flex items-center gap-2 text-[12px] uppercase"
            style={{ ...mono, color: ACCENT_INK }}
          >
            <span
              aria-hidden
              className="inline-block h-[8px] w-[8px] rounded-full border-2"
              style={{ borderColor: ACCENT }}
            />
            Workflow examples
          </div>
          <h1 className="mt-4 text-[40px] font-medium leading-[1.1] tracking-[-0.02em]">
            {title.map((w, i) => (
              <span key={w} className="inline-block overflow-hidden pb-1 align-top">
                <span className="cs-word inline-block">{w}</span>
                {i < title.length - 1 ? "\u00A0" : ""}
              </span>
            ))}
          </h1>
          <p className="mt-5 max-w-[620px] text-[16px] leading-relaxed text-[#55576a]">Practical ways to bring construction information together. These are illustrative workflows, not customer testimonials or measured results.</p>
        </div>

        <article className="cs-feature group mt-14 grid gap-4 rounded-[20px] bg-[#fdfcf8] p-3.5 lg:grid-cols-2">
          <div className="flex min-h-[340px] flex-col justify-between gap-8 p-3 lg:min-h-[380px]">
            <div className="cs-feat-item">
              <div className="flex items-center gap-2 text-[#0b0b12]">
                <Snowflake />
                <span className="font-serif text-[21px] tracking-tight">{FEATURED.name}</span>
              </div>
              <p className="mt-6 max-w-[460px] text-[17px] leading-[1.35] text-[#1a1b26]">
                {FEATURED.text}
              </p>
            </div>

            <dl className="cs-feat-item flex gap-10">
              {FEATURED.stats.map((s) => (
                <div key={s.label}>
                  <dt className="order-2 text-[13px] uppercase text-[#2b2d3a]">{s.label}</dt>
                  <dd className="order-1 mb-1 text-[26px] font-medium leading-none">
                    <CountUp n={s.n} suffix={s.suffix} />
                  </dd>
                </div>
              ))}
            </dl>

            <div className="cs-feat-item">
              <Link
                href={FEATURED.href}
                style={{ ...mono, backgroundColor: ACCENT }}
                className="group/btn relative inline-flex h-[34px] items-center gap-2 overflow-hidden rounded-full px-4 text-[12px] font-semibold uppercase tracking-wide text-[#0b0b12] hover:text-white"
              >
                <span
                  aria-hidden
                  className="absolute inset-0 translate-y-full bg-[#0b0b12] transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover/btn:translate-y-0"
                />
                <span
                  aria-hidden
                  className="relative inline-block h-[8px] w-[8px] rounded-full border-2 border-white/80 transition-transform duration-300 group-hover/btn:scale-125"
                />
                <span className="relative">Explore the workflow</span>
                <span
                  aria-hidden
                  className="relative -ml-1 w-0 -translate-x-2 overflow-hidden opacity-0 transition-all duration-300 group-hover/btn:ml-0 group-hover/btn:w-4 group-hover/btn:translate-x-0 group-hover/btn:opacity-100"
                >
                  →
                </span>
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 p-[3px]">
            <div className="cs-feat-frame relative h-full min-h-[280px] overflow-hidden rounded-[13px] lg:min-h-0">
              <FeaturedImage />
            </div>
          </div>
        </article>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {STORIES.map(({ slug, name, text, n, suffix, label, Icon }) => (
            <Link
              key={name}
              href={`/case-studies/${slug}`}
              className="cs-card flex min-h-[192px] flex-col justify-between rounded-2xl border border-transparent bg-[#fdfcf8] p-4 transition-colors duration-300 hover:border-[#b9bfd6] will-change-transform"
              onMouseEnter={(e) => hover(e, true)}
              onMouseLeave={(e) => hover(e, false)}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <span className="cs-icon inline-flex h-[22px] w-[22px] text-[#0b0b12]">
                  <Icon />
                </span>
                <p className="text-[14px] leading-[1.2] text-[#4a4c5c]">{text}</p>
              </div>
              <div>
                <div className="text-[34px] font-medium leading-none tracking-tight">
                  <CountUp n={n} suffix={suffix} />
                </div>
                <div className="mt-1 text-[12px] uppercase text-[#2b2d3a]">{label}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}


