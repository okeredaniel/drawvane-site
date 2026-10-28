"use client";

import { useEffect } from "react";

export default function HashScroll() {
  useEffect(() => {
    const root = document.documentElement;
    const reveal = () => root.classList.remove("hash-pending");
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) {
      reveal();
      return;
    }

    const previous = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";

    const align = () =>
      document
        .getElementById(id)
        ?.scrollIntoView({ block: "start", behavior: "instant" });

    const events = ["wheel", "touchstart", "keydown", "mousedown"] as const;
    const observer = new ResizeObserver(align);
    const timers: ReturnType<typeof setTimeout>[] = [];

    const stop = () => {
      observer.disconnect();
      timers.forEach(clearTimeout);
      events.forEach((e) => window.removeEventListener(e, stop));
      root.style.scrollBehavior = previous;
      reveal();
    };

    align();
    observer.observe(document.body);
    events.forEach((e) => window.addEventListener(e, stop, { passive: true }));
    timers.push(setTimeout(reveal, 250));
    timers.push(setTimeout(stop, 2500));

    return stop;
  }, []);

  return null;
}
