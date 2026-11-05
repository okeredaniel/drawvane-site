"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ContactUs from "@/components/sections/ContactUs";

gsap.registerPlugin(ScrollTrigger);

const ACCENT = "#ffc800";
const ACCENT_INK = "#755b00";
const mono = {
  fontFamily:
    'var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
};

/* Author photos live in public/journal/. Empty avatar = initials placeholder. */
const AUTHORS = {
  stratora: { name: "Stratora", role: "Construction intelligence", avatar: "/logo.png" },
};

export type JournalArticleData = {
  category: string;
  title: string;
  subtitle: string;
  image: string;
  author: keyof typeof AUTHORS;
  intro: string;
  sections: { heading: string; paragraphs: string[] }[];
};

function Social({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      aria-label={label}
      className="flex h-8 w-8 items-center justify-center text-[#0b0b12] transition-colors duration-200 hover:text-[#755b00]"
    >
      {children}
    </a>
  );
}

function AuthorCard({ who }: { who: keyof typeof AUTHORS }) {
  const a = AUTHORS[who];
  const initials = a.name
    .split(" ")
    .map((p) => p[0])
    .join("");

  return (
    <div className="mt-12 flex items-center gap-4 rounded-[20px] border border-[#e0e3ee] bg-[#fdfcf8] p-4">
      <div className="relative h-[52px] w-[52px] shrink-0 overflow-hidden rounded-[10px]">
        {a.avatar ? (
          <Image src={a.avatar} alt={a.name} fill sizes="52px" className="object-contain p-1" />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center text-[16px] font-semibold text-[#0b0b12]"
            style={{ background: "linear-gradient(135deg,#ffe680,#ffc800)" }}
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


    </div>
  );
}

export default function JournalArticle({ article }: { article: JournalArticleData }) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
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

      gsap.to(".ar-pic", {
        yPercent: 6,
        ease: "none",
        scrollTrigger: { trigger: ".ar-frame", start: "top bottom", end: "bottom top", scrub: true },
      });

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

  const words = article.title.split(" ");

  return (
    <>
      <article ref={root} className="bg-[#f5f4ef] px-6 pb-24 pt-[128px] text-[#0b0b12]">
        <header className="mx-auto flex max-w-[1160px] flex-col items-center text-center">
          <div
            className="ar-eyebrow flex items-center gap-2 text-[12px] uppercase"
            style={{ ...mono, color: ACCENT_INK }}
          >
            <span
              aria-hidden
              className="inline-block h-[8px] w-[8px] rounded-full border-2"
              style={{ borderColor: ACCENT }}
            />
            {article.category}
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
            {article.subtitle}
          </p>
        </header>

        <div className="mx-auto mt-14 max-w-[1280px] rounded-[22px] border border-[#e0e3ee] bg-[#f6f7fb] p-[3px]">
          <div className="ar-frame relative h-[260px] overflow-hidden rounded-[19px] sm:h-[420px] lg:h-[540px]">
            {article.image ? (
              <Image
                src={article.image}
                alt={article.title}
                fill
                priority
                sizes="(max-width: 1280px) 94vw, 1280px"
                className="ar-pic scale-[1.08] object-cover"
              />
            ) : (
              <div className="ar-pic absolute inset-0 bg-[linear-gradient(125deg,#fff6d6,#ffda57)]" />
            )}
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-[680px]">
          <p className="text-[17px] leading-[1.75] text-[#0b0b12]">{article.intro}</p>

          {article.sections.map((s) => (
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
            <AuthorCard who={article.author} />
          </div>
        </div>
      </article>

      <ContactUs />
    </>
  );
}


