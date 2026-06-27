"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import styles from "./WhyUs.module.css";

/**
 * Section 03 — "Why COZ COMPASS" (deck S8). LIGHT section (covers the compass —
 * we fade it out for perf). A bento grid of the 8 differentiators: varied widths,
 * oversized index numbers, three featured cards on subtle solid brand-colour blocks.
 */

type Item = { t: string; d: string; span: 1 | 2; accent?: "orange" | "blue" | "green" };

const ITEMS: Item[] = [
  { t: "Global + Local Expertise", d: "India-based operations with global delivery standards — we understand both markets intimately.", span: 2, accent: "orange" },
  { t: "One Accountable Partner", d: "No vendor juggling. We own end-to-end responsibility for quality and outcomes.", span: 1 },
  { t: "Curated & Verified Network", d: "Every provider is rigorously vetted — no freelancers, no hidden risks.", span: 1 },
  { t: "SMB / SME-Focused", d: "Built for smaller organizations — affordable, scalable, aligned to your growth stage.", span: 1 },
  { t: "AI-Powered Security & Compliance", d: "AI-driven security infrastructure. GDPR, HIPAA & DPDP compliant — your data stays safe.", span: 2, accent: "blue" },
  { t: "Outcome-Driven Commercials", d: "Pay for results — project, retainer, or outcome-based pricing.", span: 1 },
  { t: "Fast Time to Value", d: "Start within days, not months. A pre-built ecosystem means no long setup cycles.", span: 2, accent: "green" },
  { t: "Grow With Us", d: "Start with one service and expand to a full GCC model as you scale globally.", span: 2 },
];

export default function WhyUs() {
  const root = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) return;

    const ctx = gsap.context((self) => {
      const q = self.selector!;

      gsap.from(q("[data-wu-head] > *"), {
        opacity: 0,
        y: 28,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: root.current, start: "top 74%" },
      });

      q("[data-wu-card]").forEach((el: Element) => {
        gsap.from(el, {
          opacity: 0,
          y: 36,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 90%" },
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section id="why-us" ref={root} className={styles.section}>
      <div className={styles.container}>
        <header className={styles.head} data-wu-head>
          <span className={styles.eyebrow}>
            <span className={styles.eyebrowIndex}>03</span> WHY COZ COMPASS
          </span>
          <h2 className={styles.headline}>
            Built different. <span className={styles.accent}>On purpose.</span>
          </h2>
          <p className={styles.sub}>
            Eight reasons global SMBs &amp; SMEs run their offshore capability through one
            partner — not a pile of vendors.
          </p>
        </header>

        <div className={styles.grid}>
          {ITEMS.map((it, i) => (
            <article
              key={it.t}
              data-wu-card
              className={`${styles.card} ${it.accent ? styles[`a_${it.accent}`] : ""}`}
              style={{ gridColumn: `span ${it.span}` }}
            >
              <span className={styles.cardNo}>{String(i + 1).padStart(2, "0")}</span>
              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{it.t}</h3>
                <p className={styles.cardDesc}>{it.d}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
