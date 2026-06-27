"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import styles from "./CTA.module.css";

/**
 * Section 09 — "Book a call" (conversion). DARK · compass section. The shared
 * compass settles centred behind the copy (the journey's final anchor — "true
 * north"). A readability scrim keeps the centred copy legible over it.
 */

const EMAIL = "coz.compasss@gmail.com";

export default function CTA() {
  const root = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const ctx = gsap.context((self) => {
      const q = self.selector!;
      gsap.from(q("[data-cta] > *"), {
        opacity: 0,
        y: 34,
        duration: 1,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: { trigger: root.current, start: "top 68%" },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section id="contact" ref={root} className={styles.section}>
      <div className={styles.scrim} aria-hidden />
      <div className={styles.container} data-cta>
        <span className={styles.eyebrow}>Let&rsquo;s set your heading</span>
        <h2 className={styles.headline}>
          Find your <span className={styles.accent}>true north</span>.
        </h2>
        <p className={styles.sub}>
          Tell us what you want to build. We&rsquo;ll map the team, the providers and the
          plan — and you can be live in days, not months.
        </p>

        <div className={styles.actions}>
          <a className={styles.primary} href={`mailto:${EMAIL}?subject=Building%20our%20GCC%20with%20COZ%20COMPASS`}>
            Book a call
            <span className={styles.arrow} aria-hidden>→</span>
          </a>
          <a className={styles.secondary} href={`mailto:${EMAIL}`}>
            {EMAIL}
          </a>
        </div>

        <ul className={styles.assurances}>
          <li>Zero capital</li>
          <li>Live in days</li>
          <li>40–70% lower cost</li>
        </ul>
      </div>
    </section>
  );
}
