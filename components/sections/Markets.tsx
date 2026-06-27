"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import styles from "./Markets.module.css";

/**
 * Section 07 — "Who we serve" (deck S18). LIGHT section. Geographies band +
 * an ideal-client checklist panel + sectors pills. Distinct from the other
 * light sections (bento / accordion / pipeline).
 */

const REGIONS = [
  { flag: "🇺🇸", name: "USA & Canada" },
  { flag: "🇬🇧", name: "UK & Ireland" },
  { flag: "🇦🇺", name: "Australia & NZ" },
  { flag: "🇩🇪", name: "Germany & EU" },
  { flag: "🇸🇬", name: "Singapore & SEA" },
  { flag: "🇦🇪", name: "UAE & GCC" },
];

const FIT = [
  "5–500 employees",
  "$5M–$500M in revenue",
  "Want a 40–70% cost cut",
  "Expanding internationally for the first time",
  "No existing India operations or GCC",
];

const SECTORS = [
  "Healthcare & Life Sciences",
  "Financial Services & Fintech",
  "E-commerce & Retail",
  "Manufacturing & Industrial",
  "Education & EdTech",
  "Professional Services & Consulting",
  "Real Estate",
];

export default function Markets() {
  const root = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const ctx = gsap.context((self) => {
      const q = self.selector!;
      const reveal = (sel: string, trig: string, stagger = 0.08) =>
        gsap.from(q(sel), {
          opacity: 0,
          y: 30,
          duration: 0.8,
          ease: "power3.out",
          stagger,
          scrollTrigger: { trigger: q(trig)[0] || root.current, start: "top 82%" },
        });

      reveal("[data-mk-head] > *", "[data-mk-head]", 0.1);
      reveal("[data-mk-region]", "[data-mk-regions]");
      reveal("[data-mk-panel]", "[data-mk-split]", 0.12);
      reveal("[data-mk-pill]", "[data-mk-sectors]", 0.05);
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section id="markets" ref={root} className={styles.section}>
      <div className={styles.container}>
        <header className={styles.head} data-mk-head>
          <span className={styles.eyebrow}>
            <span className={styles.eyebrowIndex}>07</span> WHO WE SERVE
          </span>
          <h2 className={styles.headline}>
            Built for teams going <span className={styles.accent}>global</span>.
          </h2>
          <p className={styles.sub}>
            Founders and operators scaling across borders — here are the regions, the
            profile and the sectors we know best.
          </p>
        </header>

        <div className={styles.regions} data-mk-regions>
          <span className={styles.blockLabel}>Where we operate</span>
          <ul className={styles.regionGrid}>
            {REGIONS.map((r) => (
              <li key={r.name} className={styles.region} data-mk-region>
                <span className={styles.flag} aria-hidden>{r.flag}</span>
                <span className={styles.regionName}>{r.name}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.split} data-mk-split>
          <div className={`${styles.panel} ${styles.fit}`} data-mk-panel>
            <span className={styles.fitTag}>Sound like you?</span>
            <h3 className={styles.fitTitle}>The ideal COZ COMPASS client.</h3>
            <ul className={styles.fitList}>
              {FIT.map((f) => (
                <li key={f} className={styles.fitItem}>
                  <span className={styles.check} aria-hidden />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <div className={`${styles.panel} ${styles.sectorsPanel}`} data-mk-panel>
            <span className={styles.blockLabel}>Sectors we know</span>
            <ul className={styles.sectors} data-mk-sectors>
              {SECTORS.map((s) => (
                <li key={s} className={styles.pill} data-mk-pill>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
