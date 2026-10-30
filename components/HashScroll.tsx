"use client";
import { useEffect } from "react";
export default function HashScroll() {
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    try {
      document
        .getElementById(decodeURIComponent(hash))
        ?.scrollIntoView({ behavior: "instant", block: "start" });
    } catch {
      /* Ignore malformed fragments. */
    }
  }, []);
  return null;
}
