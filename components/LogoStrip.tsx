"use client";

import { useEffect, useRef, useState } from "react";

// Your customers. For each one: `name` is shown as text until the image
// exists, and `src` is where the logo file will go (inside /public/logos/).
// When you add the real file, the logo appears in place of the name.
// To change a customer, edit its name and src, or add/remove lines.
const LOGOS: { name: string; src: string }[] = [
  { name: "Customer 1", src: "/logos/customer-1.svg" },
  { name: "Customer 2", src: "/logos/customer-2.svg" },
  { name: "Customer 3", src: "/logos/customer-3.svg" },
  { name: "Customer 4", src: "/logos/customer-4.svg" },
  { name: "Customer 5", src: "/logos/customer-5.svg" },
  { name: "Customer 6", src: "/logos/customer-6.svg" },
];

// The small line above the logos. Change or clear it as you like.
const LABEL = "Trusted by AEC teams";

// Repeat the list so one row is always wider than the screen
const copies = Math.max(1, Math.ceil(20 / LOGOS.length));
const ROW = Array.from({ length: copies }, () => LOGOS).flat();

function Logo({
  name,
  src,
  decorative,
}: {
  name: string;
  src: string;
  decorative: boolean;
}) {
  const img = useRef<HTMLImageElement>(null);
  const [missing, setMissing] = useState(false);

  // If the file failed before React attached, catch it here
  useEffect(() => {
    const el = img.current;
    if (el && el.complete && el.naturalWidth === 0) setMissing(true);
  }, []);

  // No image yet: show the name as text, in the same muted grey
  if (missing) {
    return (
      <span className="flex h-14 shrink-0 items-center whitespace-nowrap text-[22px] font-semibold tracking-tight text-white/35 transition-colors hover:text-white/70">
        {name}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={img}
      src={src}
      alt={decorative ? "" : name}
      onError={() => setMissing(true)}
      className="h-14 w-auto shrink-0 opacity-35 brightness-0 invert transition-opacity hover:opacity-70"
      draggable={false}
    />
  );
}

function Row({ hidden = false }: { hidden?: boolean }) {
  return (
    <div
      className="flex shrink-0 items-center gap-28 pr-28"
      aria-hidden={hidden || undefined}
    >
      {ROW.map((logo, i) => (
        <Logo key={i} name={logo.name} src={logo.src} decorative={hidden} />
      ))}
    </div>
  );
}

export default function LogoStrip() {
  return (
    <section
      id="logos"
      aria-label="Customers"
      className="border-y border-[#242d38] bg-background py-32"
    >
      <p className="text-center font-mono text-xs uppercase tracking-[0.2em] text-[#59616b]">
        {LABEL}
      </p>

      <div className="marquee fade-edges mt-10 h-14 overflow-hidden">
        {/* two identical rows; sliding by exactly one row makes a seamless loop */}
        <div className="marquee-track flex w-max">
          <Row />
          <Row hidden />
        </div>
      </div>
    </section>
  );
}