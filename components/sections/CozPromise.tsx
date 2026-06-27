"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import styles from "./CozPromise.module.css";

/**
 * Section 02 — "The COZ COMPASS Promise" (deck S7). A dark, transparent section
 * that reveals the shared CompassStage behind it. As it scrolls in, the compass
 * sweeps from its hero position (right) across to the left; the brand promise and
 * five pillars reveal on the right. No new WebGL context — only target/transform
 * updates, so it stays smooth.
 */

const PILLARS = [
  { t: "Curated Solutions", d: "Rigorously vetted experts across technology, finance, operations & global trade." },
  { t: "Quality Assurance", d: "Structured support tailored to your business needs and growth stage." },
  { t: "Seamless Delivery", d: "Standardized frameworks ensuring compliance, risk control & reliability." },
  { t: "Customer Centric", d: "Unified operational support that lets you scale with speed." },
  { t: "Verified Providers", d: "Customized solutions with full, end-to-end accountability." },
];

export default function CozPromise() {
  const root = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const ctx = gsap.context((self) => {
      const q = self.selector!;

      // ---- content reveals (own attr names — NOT data-line/data-fade, which are
      // global hero-only utilities that would pin these elements hidden) ----
      gsap.from(q("[data-rline]"), {
        opacity: 0,
        y: 44,
        duration: 1,
        ease: "power3.out",
        stagger: 0.09,
        scrollTrigger: { trigger: root.current, start: "top 72%" },
      });
      gsap.from(q("[data-rfade]"), {
        opacity: 0,
        y: 24,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: root.current, start: "top 72%" },
      });
      gsap.from(q("[data-pillar]"), {
        opacity: 0,
        y: 28,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: { trigger: root.current, start: "top 48%" },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section id="promise" ref={root} className={styles.section}>
      <div className={styles.scrim} aria-hidden />
      <div className={styles.container}>
        <div className={styles.head} data-head>
          <span className={styles.label} data-rfade>
            <span className={styles.labelIndex}>02</span> THE COZ COMPASS PROMISE
          </span>

          <h2 className={styles.headline}>
            <span className={styles.line} data-rline>
              One accountable <span className={styles.accent}>partner.</span>
            </span>
          </h2>

          <p className={styles.tagline} data-rfade>
            From vision to execution. From design to delivery. From lead to logistics —
            one team owns the outcome.
          </p>
        </div>

        <ul className={styles.pillars} data-pillars>
          {PILLARS.map((p, i) => (
            <li key={p.t} className={styles.pillar} data-pillar>
              <span className={styles.pillarNo}>{String(i + 1).padStart(2, "0")}</span>
              <div className={styles.pillarBody}>
                <h3 className={styles.pillarTitle}>{p.t}</h3>
                <p className={styles.pillarDesc}>{p.d}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
