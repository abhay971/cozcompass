"use client";

import { useEffect, useRef } from "react";

export type PointerState = {
  /** pixel cursor position */
  px: number;
  py: number;
  /** normalized -1..1 across the viewport */
  mx: number;
  my: number;
  /** true while hovering an element flagged [data-hover] */
  hover: boolean;
  /** true once any real pointer movement / touch has happened */
  active: boolean;
};

/**
 * Global pointer tracker. State is stored in a mutable ref so high-frequency
 * mousemove updates never trigger React re-renders — animation loops read the
 * ref directly inside their own requestAnimationFrame.
 */
export function usePointer() {
  const ref = useRef<PointerState>({
    px: -100,
    py: -100,
    mx: 0,
    my: 0,
    hover: false,
    active: false,
  });

  useEffect(() => {
    const s = ref.current;

    const onMove = (e: MouseEvent) => {
      s.px = e.clientX;
      s.py = e.clientY;
      s.mx = (e.clientX / window.innerWidth) * 2 - 1;
      s.my = (e.clientY / window.innerHeight) * 2 - 1;
      s.active = true;
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as Element | null;
      s.hover = !!(t && t.closest && t.closest("[data-hover]"));
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
    };
  }, []);

  return ref;
}
