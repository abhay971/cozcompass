"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Site-wide buttery smooth scrolling (Lenis) driven by GSAP's ticker so
 * ScrollTrigger stays perfectly in sync. Disabled for reduced-motion users.
 * Renders nothing — mount once near the root.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 3), // easeOutCubic
      smoothWheel: true,
    });

    // expose for programmatic scrolls (nav links / CTAs)
    (window as unknown as { lenis?: Lenis }).lenis = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const onTick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    // Recalculate ScrollTrigger start/end positions once layout settles (fonts,
    // splash, async) — otherwise some reveals can cache stale positions and never fire.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh);
    const t1 = window.setTimeout(refresh, 1400);
    const t2 = window.setTimeout(refresh, 3600);

    return () => {
      gsap.ticker.remove(onTick);
      window.removeEventListener("load", refresh);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      lenis.destroy();
      delete (window as unknown as { lenis?: Lenis }).lenis;
    };
  }, []);

  return null;
}
