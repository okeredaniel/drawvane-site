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

const BLUE = "#1f3dff";
const mono = {
  fontFamily:
    'var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
};

type AuthorKey = "daniel" | "maya";

const AUTHORS: Record<AuthorKey, { name: string; role: string; avatar: string }> = {
  daniel: { name: "Daniel Mercer", role: "Founder & CEO", avatar: "/journal/daniel-mercer.avif" },
  maya: { name: "Maya Chen", role: "Head of Product", avatar: "/journal/maya-chen.avif" },
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
  slug: "announcing-stratora-1-0",
  title: "Announcing Stratora 1.0 — planning that writes itself",
  excerpt:
    "Meet the connected planning workspace that turns goals, context, and team decisions into clear, actionable plans.",
  date: "Oct 7, 2026",
  author: "daniel",
  image: "/journal/announcing-stratora-1-0.avif",
  href: "/team-alignment",
};

const POSTS: Post[] = [
  {
    slug: "ai-planning-human-decisions",
    title: "AI Planning, Human Decisions",
    excerpt:
      "Use AI to build a strong first draft while your team keeps ownership of estimates, tradeoffs, and final calls.",
    date: "Oct 7, 2026",
    author: "maya",
    image: "/journal/ai-planning-human-decisions.avif",
    href: "#",
  },
  {
    slug: "strategy-into-weekly-work",
    title: "Strategy Into Weekly Work",
    excerpt:
      "Turn product strategy into clear outcomes, milestones, and the next actions your team can start this week.",
    date: "Oct 7, 2026",
    author: "maya",
    image: "/journal/strategy-into-weekly-work.avif",
    href: "#",
  },
  {
    slug: "reviews-that-end-in-decisions",
    title: "Reviews That End in Decisions",
    excerpt:
      "Replace status-heavy meetings with focused reviews that surface changes, blockers, owners, and next steps.",
    date: "Oct 7, 2026",
    author: "maya",
    image: "/journal/reviews-that-end-in-decisions.avif",
    href: "#",
  },
  {
    slug: "spot-dependencies-earlier",
    title: "Spot Dependencies Earlier",
    excerpt:
      "Make cross-team dependencies visible early enough to clarify ownership, adjust timing, and prevent blockers.",
    date: "Oct 7, 2026",
    author: "daniel",
    image: "/journal/spot-dependencies-earlier.avif",
    href: "#",
  },
  {
    slug: "briefs-that-stay-useful",
    title: "Briefs That Stay Useful",
    excerpt:
      "Keep the problem, evidence, scope, and key decisions connected as an initiative moves from planning to delivery.",
    date: "Oct 7, 2026",
    author: "maya",
    image: "/journal/briefs-that-stay-useful.avif",
    href: "#",
  },
  {
    slug: "requests-arent-commitments",
    title: "Requests Aren’t Commitments",
    excerpt:
      "Create a clear path from customer feedback to product decisions without treating every request as a promise.",
    date: "Oct 7, 2026",
    author: "maya",
    image: "/journal/requests-arent-commitments.avif",
    href: "#",
  },
  {
    slug: "launch-with-less-chaos",
    title: "Launch With Less Chaos",
    excerpt:
      "Prepare owners, dependencies, communication, and fallback decisions before release week becomes urgent.",
    date: "Oct 7, 2026",
    author: "daniel",
    image: "/journal/launch-with-less-chaos.avif",
    href: "#",
  },
  {
    slug: "keep-decision-context",
    title: "Keep Decision Context",
    excerpt:
      "Preserve the reasoning behind priorities and tradeoffs so growing teams can act without repeated alignment.",
    date: "Oct 7, 2026",
    author: "daniel",
    image: "/journal/keep-decision-context.avif",
    href: "#",
  },
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
      className={`jr-pic absolute inset-0 flex items-center justify-center p-4 text-center text-[11px] uppercase text-[#1f3dff]/70 ${className}`}
      style={{
        ...mono,
        background: `linear-gradient(${125 + tint * 23}deg,#e6ebff 0%,#c4d1ff 55%,#a5b8ff 100%)`,
      }}
    >
      <span className="rounded-lg border-2 border-dashed border-[#1f3dff]/30 px-3 py-2">
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
        <Image src={a.avatar} alt={a.name} fill sizes="34px" className="object-cover" />
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
      className="bg-[#eef0f5] px-6 pb-24 pt-[84px] text-[#0b0b12]"
    >
      <div className="mx-auto max-w-[1160px]">
        <div className="flex flex-col items-center text-center">
          <div
            className="jr-eyebrow flex items-center gap-2 text-[12px] uppercase"
            style={{ ...mono, color: BLUE }}
          >
            <span
              aria-hidden
              className="inline-block h-[8px] w-[8px] rounded-full border-2"
              style={{ borderColor: BLUE }}
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
          className="jr-feature group mt-14 grid overflow-hidden rounded-[20px] bg-[#fbfcff] lg:grid-cols-[540px_1fr]"
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
              style={{ ...mono, color: BLUE }}
            >
              <span
                aria-hidden
                className="inline-block h-[8px] w-[8px] rounded-full border-2 transition-transform duration-300 group-hover:scale-150"
                style={{ borderColor: "#7d8fff" }}
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
              className="jr-card group flex flex-col overflow-hidden rounded-[20px] bg-[#fbfcff] will-change-transform"
              onMouseEnter={(e) => hover(e, true, true)}
              onMouseLeave={(e) => hover(e, false, true)}
            >
              <div className="relative h-[209px] shrink-0 overflow-hidden">
                <PostImage post={p} tint={i + 1} />
                <span
                  aria-hidden
                  className="absolute right-3 top-3 flex h-9 w-9 scale-50 items-center justify-center rounded-full bg-white text-[15px] opacity-0 shadow-sm transition-all duration-300 group-hover:scale-100 group-hover:opacity-100"
                  style={{ color: BLUE }}
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
