"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/* YOUR IMAGES                                                         */
/* Save pictures in public/journal/ and put each path in `image` below */
/* (e.g. "/journal/ai-planning.jpg"). Empty = shows a placeholder.     */
/* Author photos: fill `avatar` in AUTHORS (e.g. "/journal/daniel.jpg").*/
/* ------------------------------------------------------------------ */

const ACCENT = "#ffc800";
const ACCENT_INK = "#755b00";
const mono = {
  fontFamily:
    'var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
};

type AuthorKey = "stratora";

const AUTHORS: Record<AuthorKey, { name: string; role: string; avatar: string }> = {
  stratora: { name: "Stratora", role: "Construction intelligence", avatar: "/logo.png" },
};

type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: AuthorKey;
  image: string;
  // Article pages don't exist yet. Change to `/journal/${slug}` when they do.
  href: string;
};

const FEATURED: Post = {
  "slug": "announcing-stratora-1-0",
  "title": "Construction intelligence, connected.",
  "excerpt": "Drawings, documents, quantities and conversations, brought closer to the decisions that matter.",
  "date": "Nov 5, 2026",
  "author": "stratora",
  "image": "/construction/site-review.webp",
  "href": "/team-alignment"
};

const POSTS: Post[] = [
  {
    "slug": "ai-planning-human-decisions",
    "title": "AI answers. Professional judgment.",
    "excerpt": "Use project intelligence to find the detail, then check the evidence before you act.",
    "date": "Nov 5, 2026",
    "author": "stratora",
    "image": "/construction/hero-bg-2.webp",
    "href": "/journal/ai-planning-human-decisions"
  },
  {
    "slug": "strategy-into-weekly-work",
    "title": "A clearer weekly site review",
    "excerpt": "Bring current drawings, open questions and accountable next steps into one focused conversation.",
    "date": "Nov 5, 2026",
    "author": "stratora",
    "image": "/construction/site-review.webp",
    "href": "/journal/strategy-into-weekly-work"
  },
  {
    "slug": "reviews-that-end-in-decisions",
    "title": "Drawing reviews that move work forward",
    "excerpt": "Turn markups into clear questions, useful conversations and documented next steps.",
    "date": "Nov 5, 2026",
    "author": "stratora",
    "image": "/construction/solution-plan.webp",
    "href": "/journal/reviews-that-end-in-decisions"
  },
  {
    "slug": "spot-dependencies-earlier",
    "title": "Find the gap between disciplines",
    "excerpt": "Read the architectural, structural and services information together before the detail reaches site.",
    "date": "Nov 5, 2026",
    "author": "stratora",
    "image": "/construction/problem-board.webp",
    "href": "/journal/spot-dependencies-earlier"
  },
  {
    "slug": "briefs-that-stay-useful",
    "title": "Project briefs that stay useful",
    "excerpt": "Keep scope, source information and key decisions clear as a construction project develops.",
    "date": "Nov 5, 2026",
    "author": "stratora",
    "image": "/construction/about-hero.webp",
    "href": "/journal/briefs-that-stay-useful"
  },
  {
    "slug": "requests-arent-commitments",
    "title": "An RFI is a question, not an instruction",
    "excerpt": "Keep requests, responses and authorized changes distinct throughout the project.",
    "date": "Nov 5, 2026",
    "author": "stratora",
    "image": "/construction/solution-align.webp",
    "href": "/journal/requests-arent-commitments"
  },
  {
    "slug": "launch-with-less-chaos",
    "title": "A better handover starts earlier",
    "excerpt": "Organize current documents and open items before the last week of a construction stage.",
    "date": "Nov 5, 2026",
    "author": "stratora",
    "image": "/construction/contact-notebook.webp",
    "href": "/journal/launch-with-less-chaos"
  },
  {
    "slug": "keep-decision-context",
    "title": "Keep the reasoning with the drawing",
    "excerpt": "Record why a decision was made so the next person does not have to reconstruct it.",
    "date": "Nov 5, 2026",
    "author": "stratora",
    "image": "/construction/features-align.webp",
    "href": "/journal/keep-decision-context"
  }
];

/* ------------------------------------------------------------------ */
/* Pieces                                                              */
/* ------------------------------------------------------------------ */

/** Fills its (relative, overflow-hidden) parent with the photo, or a placeholder. */
function PostImage({
  post,
  tint,
  className = "",
}: {
  post: Post;
  tint: number;
  className?: string;
}) {
  if (post.image) {
    return (
      <Image
        src={post.image}
        alt={post.title}
        fill
        sizes="(max-width: 1024px) 90vw, 540px"
        className={`jr-pic object-cover ${className}`}
      />
    );
  }
  return (
    <div
      className={`jr-pic absolute inset-0 flex items-center justify-center p-4 text-center text-[11px] uppercase text-[#755b00]/70 ${className}`}
      style={{
        ...mono,
        background: `linear-gradient(${125 + tint * 23}deg,#fff6d6 0%,#ffe799 55%,#ffda57 100%)`,
      }}
    >
      <span className="rounded-lg border-2 border-dashed border-[#ffc800]/30 px-3 py-2">
        Add image
        <br />
        public/journal/{post.slug}.avif
      </span>
    </div>
  );
}

function Avatar({ who }: { who: AuthorKey }) {
  const a = AUTHORS[who];
  const initials = a.name
    .split(" ")
    .map((p) => p[0])
    .join("");

  return (
    <div className="jr-avatar relative h-[34px] w-[34px] shrink-0 overflow-hidden rounded-[7px]">
      {a.avatar ? (
        <Image src={a.avatar} alt={a.name} fill sizes="34px" className="object-contain p-1" />
      ) : (
        <div
          className="flex h-full w-full items-center justify-center text-[12px] font-semibold text-[#0b0b12]"
          style={{ background: "linear-gradient(135deg,#ffe680,#ffc800)" }}
        >
          {initials}
        </div>
      )}
    </div>
  );
}

function Author({ who }: { who: AuthorKey }) {
  const a = AUTHORS[who];
  return (
    <div className="flex items-center gap-3">
      <Avatar who={who} />
      <div>
        <div className="text-[15px] leading-tight text-[#0b0b12]">{a.name}</div>
        <div className="mt-[3px] text-[11px] uppercase leading-none text-[#55576a]" style={mono}>
          {a.role}
        </div>
      </div>
    </div>
  );
}

function DateLine({ date }: { date: string }) {
  return (
    <div className="flex items-center gap-2 text-[13px] uppercase text-[#2b2d3a]" style={mono}>
      <span aria-hidden className="inline-block h-[8px] w-[8px] rounded-full border-2 border-[#0b0b12]" />
      {date}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */

export default function Journal() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".jr-eyebrow", { y: 12, opacity: 0, duration: 0.5 })
        .from(".jr-word", { yPercent: 110, duration: 0.9, stagger: 0.09, ease: "power4.out" }, "-=0.25")
        .from(".jr-feature", { y: 70, opacity: 0, scale: 0.97, duration: 1 }, "-=0.5")
        .from(
          ".jr-feat-frame",
          { clipPath: "inset(0% 100% 0% 0%)", duration: 1.2, ease: "power4.inOut" },
          "-=0.8"
        )
        .from(".jr-feat-pic", { scale: 1.25, duration: 1.6 }, "<")
        .from(".jr-feat-item", { y: 22, opacity: 0, duration: 0.6, stagger: 0.09 }, "-=1.1");

      gsap.set(".jr-card", { opacity: 0, y: 60 });
      ScrollTrigger.batch(".jr-card", {
        start: "top 90%",
        once: true,
        onEnter: (batch) => {
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.85,
            stagger: 0.12,
            ease: "power3.out",
            overwrite: true,
          });
          gsap.from(
            batch.map((c) => (c as HTMLElement).querySelector(".jr-pic")),
            { scale: 1.2, duration: 1.3, stagger: 0.12, ease: "power2.out" }
          );
          gsap.from(
            batch.map((c) => (c as HTMLElement).querySelector(".jr-avatar")),
            { scale: 0, duration: 0.5, stagger: 0.12, delay: 0.4, ease: "back.out(2.4)" }
          );
        },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  const hover = (e: React.MouseEvent<HTMLElement>, on: boolean, lift: boolean) => {
    const card = e.currentTarget;
    if (lift) {
      gsap.to(card, {
        y: on ? -8 : 0,
        duration: on ? 0.4 : 0.7,
        ease: on ? "power3.out" : "elastic.out(1,0.55)",
        overwrite: "auto",
      });
    }
    gsap.to(card.querySelector(".jr-pic"), {
      scale: on ? 1.07 : 1,
      duration: on ? 0.9 : 0.7,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  const title = ["News", "&", "insights"];

  return (
    <section
      id="journal"
      ref={root}
      className="bg-[#f5f4ef] px-6 pb-24 pt-[84px] text-[#0b0b12]"
    >
      <div className="mx-auto max-w-[1160px]">
        <div className="flex flex-col items-center text-center">
          <div
            className="jr-eyebrow flex items-center gap-2 text-[12px] uppercase"
            style={{ ...mono, color: ACCENT_INK }}
          >
            <span
              aria-hidden
              className="inline-block h-[8px] w-[8px] rounded-full border-2"
              style={{ borderColor: ACCENT }}
            />
            Our journal
          </div>
          <h1 className="mt-4 text-[44px] font-medium leading-[1.1] tracking-[-0.02em]">
            {title.map((w, i) => (
              <span key={w + i} className="inline-block overflow-hidden pb-1 align-top">
                <span className="jr-word inline-block">{w}</span>
                {i < title.length - 1 ? " " : ""}
              </span>
            ))}
          </h1>
        </div>

        <Link
          href={FEATURED.href}
          className="jr-feature group mt-14 grid overflow-hidden rounded-[20px] bg-[#fdfcf8] lg:grid-cols-[540px_1fr]"
          onMouseEnter={(e) => hover(e, true, false)}
          onMouseLeave={(e) => hover(e, false, false)}
        >
          <div className="jr-feat-frame relative min-h-[280px] overflow-hidden lg:min-h-[460px]">
            <PostImage post={FEATURED} tint={0} className="jr-feat-pic" />
          </div>

          <div className="flex flex-col p-8 lg:px-10 lg:py-12">
            <div className="jr-feat-item">
              <DateLine date={FEATURED.date} />
            </div>
            <h2 className="jr-feat-item mt-5 max-w-[540px] text-[34px] font-medium leading-[1.15] tracking-[-0.015em] lg:text-[36px]">
              {FEATURED.title}
            </h2>
            <p className="jr-feat-item mt-5 max-w-[540px] text-[18px] leading-[1.45] text-[#55576a]">
              {FEATURED.excerpt}
            </p>
            <div className="jr-feat-item mt-6">
              <Author who={FEATURED.author} />
            </div>
            <div
              className="jr-feat-item mt-10 flex items-center gap-2 text-[13px] uppercase lg:mt-auto"
              style={{ ...mono, color: ACCENT_INK }}
            >
              <span
                aria-hidden
                className="inline-block h-[8px] w-[8px] rounded-full border-2 transition-transform duration-300 group-hover:scale-150"
                style={{ borderColor: "#ffda57" }}
              />
              Read article
              <span
                aria-hidden
                className="inline-block transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-1"
              >
                ↗
              </span>
            </div>
          </div>
        </Link>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {POSTS.map((p, i) => (
            <Link
              key={p.slug}
              href={`/journal/${p.slug}`}
              className="jr-card group flex flex-col overflow-hidden rounded-[20px] bg-[#fdfcf8] will-change-transform"
              onMouseEnter={(e) => hover(e, true, true)}
              onMouseLeave={(e) => hover(e, false, true)}
            >
              <div className="relative h-[209px] shrink-0 overflow-hidden">
                <PostImage post={p} tint={i + 1} />
                <span
                  aria-hidden
                  className="absolute right-3 top-3 flex h-9 w-9 scale-50 items-center justify-center rounded-full bg-white text-[15px] opacity-0 shadow-sm transition-all duration-300 group-hover:scale-100 group-hover:opacity-100"
                  style={{ color: ACCENT_INK }}
                >
                  ↗
                </span>
              </div>
              <div className="flex flex-1 flex-col justify-center gap-4 p-6">
                <DateLine date={p.date} />
                <h3 className="text-[28px] font-medium leading-[1.2] tracking-[-0.01em]">{p.title}</h3>
                <p className="text-[16.5px] leading-[1.5] text-[#55576a]">{p.excerpt}</p>
                <Author who={p.author} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}


