"use client";

import { useEffect, useRef } from "react";
import { usePointer } from "@/lib/usePointer";
import styles from "./CustomCursor.module.css";

/**
 * Two-part cursor: a hard dot that tracks 1:1 and a soft ring that lags and
 * swells over interactive elements. Uses mix-blend-mode so it reads on any
 * surface. Self-contained and mounted at the app root so it sits above every
 * section (not trapped in the hero's stacking context). Fine-pointer only.
 */
export default function CustomCursor() {
  const pointer = usePointer();
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let cx = -100;
    let cy = -100;
    let raf = 0;

    const loop = () => {
      raf = requestAnimationFrame(loop);
      const p = pointer.current;
      cx += (p.px - cx) * 0.16;
      cy += (p.py - cy) * 0.16;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${p.px - 4}px, ${p.py - 4}px)`;
      }
      if (ringRef.current) {
        const s = p.hover ? 1.7 : 1;
        ringRef.current.style.transform = `translate(${cx - 19}px, ${cy - 19}px) scale(${s})`;
      }
    };
    loop();
    return () => cancelAnimationFrame(raf);
  }, [pointer]);

  return (
    <>
      <div ref={dotRef} className={styles.dot} aria-hidden="true" />
      <div ref={ringRef} className={styles.ring} aria-hidden="true" />
    </>
  );
}
