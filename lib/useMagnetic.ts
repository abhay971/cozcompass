"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

/**
 * Magnetic hover: the element drifts toward the cursor while hovered and
 * springs back on leave. Disabled on coarse pointers. Attach the returned ref
 * to any element you want to "pull".
 */
export function useMagnetic<T extends HTMLElement = HTMLElement>(strength = 0.3) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      gsap.to(el, {
        x: dx * strength * 0.7,
        y: dy * strength,
        duration: 0.4,
        ease: "power3.out",
      });
    };
    const onLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.45)" });
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      gsap.killTweensOf(el);
    };
  }, [strength]);

  return ref;
}
