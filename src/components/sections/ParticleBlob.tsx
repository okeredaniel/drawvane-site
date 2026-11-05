"use client";

import { useEffect, useRef } from "react";

type Props = {
  /** Image in /public that gets turned into particles (transparent PNG works best). */
  src?: string;
  /** Size the wrapper, e.g. "h-[360px]". */
  className?: string;
  /** Pixels between particles. Smaller = denser and sharper (and heavier). */
  gap?: number;
  /** How much of the box the shape fills (0-1). */
  fill?: number;
  /** Dot diameter as a fraction of gap (0-1). Lower = more spacing between dots. */
  dot?: number;
  /** Cursor push radius in px. */
  radius?: number;
  /** Seconds between automatic bursts. 0 turns them off. */
  burstEvery?: number;
  /** Number of floating sparkle particles around the blob. 0 turns them off. */
  sparks?: number;
  /** If true, all motion is turned off for visitors whose device has "reduce motion" on. */
  respectReducedMotion?: boolean;
};

type P = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  tx: number;
  ty: number;
  color: string;
  phase: number;
  amp: number;
  speed: number;
  delay: number;
};

type S = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  life: number;
  size: number;
  tw: number;
  color: string;
};

const SPARK_COLORS = ["#ffc800", "#ffd84d", "#ffb300", "#b38600", "#ffe680", "#fff3c4"];

export default function ParticleBlob({
  src = "/d.png",
  className = "h-[360px]",
  gap = 6,
  fill = 0.88,
  dot = 0.8,
  radius = 100,
  burstEvery = 9,
  sparks = 70,
  respectReducedMotion = false,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced =
      respectReducedMotion && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let w = 0; // wrapper size (layout)
    let h = 0;
    let vw = 0; // viewport size (canvas covers the whole screen)
    let vh = 0;
    let particles: P[] = [];
    let sparkList: S[] = [];
    let start = performance.now();
    let last = start;
    let nextBurst = 6500;
    let raf = 0;
    let visible = false;
    let introduced = false;
    let disposed = false;
    let img: HTMLImageElement | null = null;
    const mouse = { x: -9999, y: -9999, vx: 0, vy: 0 };

    const burst = (x: number, y: number, s: number) => {
      for (const p of particles) {
        const dx = p.x - x;
        const dy = p.y - y;
        const m = Math.hypot(dx, dy) || 1;
        const f = (5 + Math.random() * 9) * s;
        p.vx += (dx / m) * f + (Math.random() - 0.5) * 6 * s;
        p.vy += (dy / m) * f + (Math.random() - 0.5) * 6 * s;
      }
    };

    const spawn = (age: number): S | null => {
      if (!particles.length) return null;
      const src = particles[(Math.random() * particles.length) | 0];
      // start slightly outside the shape so sparks are visible against the background
      const a0 = Math.atan2(src.ty - h / 2, src.tx - w / 2);
      const push = Math.random() * 50;
      return {
        x: src.tx + Math.cos(a0) * push,
        y: src.ty + Math.sin(a0) * push,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -(0.25 + Math.random() * 0.7),
        age,
        life: 2200 + Math.random() * 2800,
        size: 2 + Math.random() * 3,
        tw: Math.random() * Math.PI * 2,
        color: SPARK_COLORS[(Math.random() * SPARK_COLORS.length) | 0],
      };
    };

    const build = (intro: boolean) => {
      if (!img) return;
      w = wrap.clientWidth;
      h = wrap.clientHeight;
      if (!w || !h) return;
      vw = window.innerWidth;
      vh = window.innerHeight;
      canvas.width = Math.round(vw * dpr);
      canvas.height = Math.round(vh * dpr);
      canvas.style.width = `${vw}px`;
      canvas.style.height = `${vh}px`;
      const wr = wrap.getBoundingClientRect();
      const far = Math.max(vw, vh);

      const scale = Math.min((w * fill) / img.width, (h * fill) / img.height);
      const dw = Math.max(1, Math.floor(img.width * scale));
      const dh = Math.max(1, Math.floor(img.height * scale));
      const ox = (w - dw) / 2;
      const oy = (h - dh) / 2;

      const off = document.createElement("canvas");
      off.width = dw;
      off.height = dh;
      const octx = off.getContext("2d", { willReadFrequently: true })!;
      octx.drawImage(img, 0, 0, dw, dh);
      const data = octx.getImageData(0, 0, dw, dh).data;

      const next: P[] = [];
      for (let y = 0; y < dh; y += gap) {
        for (let x = 0; x < dw; x += gap) {
          // sample the center of each cell so colors and edges stay exact
          const sx = Math.min(dw - 1, x + (gap >> 1));
          const sy = Math.min(dh - 1, y + (gap >> 1));
          const i = (sy * dw + sx) * 4;
          if (data[i + 3] < 128) continue;

          const tx = ox + x + gap / 2;
          const ty = oy + y + gap / 2;
          // intro: start from beyond every edge of the screen (in wrapper-local coords)
          const ang = Math.random() * Math.PI * 2;
          const r = far * 0.7 + Math.random() * far * 0.4;
          const sx0 = vw / 2 + Math.cos(ang) * r - wr.left;
          const sy0 = vh / 2 + Math.sin(ang) * r - wr.top;

          next.push({
            x: intro ? sx0 : tx,
            y: intro ? sy0 : ty,
            vx: 0,
            vy: 0,
            tx,
            ty,
            color: `rgb(${data[i]},${data[i + 1]},${data[i + 2]})`,
            phase: Math.random() * Math.PI * 2,
            amp: reduced ? 0 : 3 + Math.random() * 4,
            speed: 0.5 + Math.random() * 1.3,
            delay: intro ? Math.random() * 900 : 0,
          });
        }
      }
      particles = next;
      sparkList = [];
      start = performance.now();
      nextBurst = 6500;
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!w) {
        last = now;
        return;
      }
      if (!visible) {
        last = now;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, vw, vh);
        return;
      }
      const rect = wrap.getBoundingClientRect();
      const lx = mouse.x - rect.left; // cursor in wrapper-local coords
      const ly = mouse.y - rect.top;
      const dt = Math.min(2, (now - last) / 16.667);
      last = now;
      const t = now - start;
      const ft = t * 0.001;
      const size = gap * dot;
      const damp = Math.pow(0.86, dt);
      const cxm = w / 2;
      const cym = h / 2;
      const breath = reduced ? 1 : 1 + Math.sin(ft * 0.7) * 0.025;
      const flow = reduced ? 0 : 4.5;
      const sway = reduced ? 0 : Math.sin(ft * 0.5) * 5;
      mouse.vx *= 0.9;
      mouse.vy *= 0.9;

      if (!reduced && burstEvery > 0 && t > nextBurst) {
        burst(w / 2, h / 2, 1);
        nextBurst = t + burstEvery * 1000;
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, vw, vh);
      ctx.setTransform(dpr, 0, 0, dpr, rect.left * dpr, rect.top * dpr);

      for (const p of particles) {
        const e = Math.min(1, Math.max(0, (t - p.delay) / 900));
        const k = 0.006 + e * e * 0.05;

        // idle life: personal wobble + a slow flowing wave + gentle breathing
        const bx =
          cxm + (p.tx - cxm) * breath + Math.sin(p.ty * 0.02 + ft * 0.9) * flow +
          Math.cos(ft * p.speed + p.phase) * p.amp + sway;
        const by =
          cym + (p.ty - cym) * breath + Math.cos(p.tx * 0.02 + ft * 0.8) * flow +
          Math.sin(ft * p.speed * 0.9 + p.phase) * p.amp;
        let ax = (bx - p.x) * k;
        let ay = (by - p.y) * k;

        const dx = p.x - lx;
        const dy = p.y - ly;
        const d2 = dx * dx + dy * dy;
        let near = 0;
        if (d2 < radius * radius && d2 > 0.01) {
          const m = Math.sqrt(d2);
          near = 1 - m / radius;
          // strong scatter away from the cursor, so dots fly off then spring back
          const f = near * near * 6 + near * 1.5;
          ax += (dx / m) * f;
          ay += (dy / m) * f;
          // slight swirl, plus dots get dragged along with the cursor's motion
          ax += (-dy / m) * near * 1.4 + mouse.vx * near * 0.06;
          ay += (dx / m) * near * 1.4 + mouse.vy * near * 0.06;
        }

        p.vx = (p.vx + ax * dt) * damp;
        p.vy = (p.vy + ay * dt) * damp;
        const sp2 = p.vx * p.vx + p.vy * p.vy;
        const cap = e < 1 ? 40 : 16;
        if (sp2 > cap * cap) {
          const c = cap / Math.sqrt(sp2);
          p.vx *= c;
          p.vy *= c;
        }
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        // soft light wave sweeping across the shape
        ctx.globalAlpha = 0.95 + 0.05 * Math.sin(p.tx * 0.025 - p.ty * 0.012 - ft * 1.6 + p.phase * 0.4);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, (size / 2) * (1 + near * 0.5 + Math.min(Math.sqrt(sp2) * 0.04, 0.4)), 0, Math.PI * 2);
        ctx.fill();
      }
      // floating sparkles that drift up from the blob and fade out
      if (!reduced && sparks > 0) {
        while (sparkList.length < sparks) {
          const n = spawn(Math.random() * 3000);
          if (!n) break;
          sparkList.push(n);
        }
        for (let i = 0; i < sparkList.length; i++) {
          const sp = sparkList[i];
          sp.age += dt * 16.667;
          if (sp.age >= sp.life) {
            const n = spawn(0);
            if (n) sparkList[i] = n;
            continue;
          }
          sp.vx += (Math.random() - 0.5) * 0.03 * dt;
          sp.x += sp.vx * dt;
          sp.y += sp.vy * dt;
          const dx = sp.x - lx;
          const dy = sp.y - ly;
          const d2 = dx * dx + dy * dy;
          if (d2 < radius * radius && d2 > 0.01) {
            const m = Math.sqrt(d2);
            const f = (1 - m / radius) * 2 * dt;
            sp.x += (dx / m) * f;
            sp.y += (dy / m) * f;
          }
          const u = sp.age / sp.life;
          const a = Math.sin(Math.PI * u) * (0.75 + 0.25 * Math.sin(sp.age * 0.012 + sp.tw));
          const r = sp.size * (1 - 0.35 * u);
          ctx.fillStyle = sp.color;
          ctx.globalAlpha = a * 0.25;
          ctx.beginPath();
          ctx.arc(sp.x, sp.y, r * 2.6, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = a;
          ctx.beginPath();
          ctx.arc(sp.x, sp.y, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    };

    const setMouse = (e: PointerEvent) => {
      const nx = e.clientX;
      const ny = e.clientY;
      if (mouse.x > -9000) {
        mouse.vx = Math.max(-40, Math.min(40, mouse.vx * 0.5 + (nx - mouse.x) * 0.5));
        mouse.vy = Math.max(-40, Math.min(40, mouse.vy * 0.5 + (ny - mouse.y) * 0.5));
      }
      mouse.x = nx;
      mouse.y = ny;
    };
    const onDown = (e: PointerEvent) => {
      setMouse(e);
      const r = wrap.getBoundingClientRect();
      const m = radius;
      if (e.clientX > r.left - m && e.clientX < r.right + m && e.clientY > r.top - m && e.clientY < r.bottom + m) {
        burst(e.clientX - r.left, e.clientY - r.top, 0.6);
      }
    };
    const onLeave = () => {
      mouse.x = mouse.y = -9999;
    };
    const onUp = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") onLeave();
    };
    if (!reduced) {
      window.addEventListener("pointermove", setMouse, { passive: true });
      window.addEventListener("pointerdown", onDown, { passive: true });
      window.addEventListener("pointerup", onUp, { passive: true });
      document.addEventListener("mouseleave", onLeave);
    }

    // play the entrance the first time the blob is actually on screen
    const maybeIntro = () => {
      if (img && visible && !introduced) {
        introduced = true;
        build(!reduced);
        last = performance.now();
      }
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      maybeIntro();
    });
    io.observe(wrap);

    let resizeTimer: ReturnType<typeof setTimeout> | undefined;
    const schedule = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (!disposed && img && introduced) build(false);
      }, 150);
    };
    const ro = new ResizeObserver(schedule);
    ro.observe(wrap);
    window.addEventListener("resize", schedule);

    const image = new window.Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      if (disposed) return;
      img = image;
      last = performance.now();
      raf = requestAnimationFrame(frame);
      maybeIntro();
    };
    image.src = src;

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      clearTimeout(resizeTimer);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", setMouse);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", schedule);
    };
  }, [src, gap, fill, dot, radius, burstEvery, sparks, respectReducedMotion]);

  return (
    <div ref={wrapRef} className={`relative w-full ${className}`}>
      <canvas ref={canvasRef} className="pointer-events-none fixed inset-0" aria-hidden />
    </div>
  );
}