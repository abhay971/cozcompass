"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import { smoothScrollTo } from "@/lib/smoothScrollTo";
import styles from "./Pricing.module.css";

/**
 * Section 08 — "Flexible engagement" (deck S19). LIGHT section. Three engagement
 * models as editorial full-width rows (Project / Retainer / Outcome) — big names,
 * hairline dividers, hover reveal. No invented prices.
 */

const MODELS = [
  {
    name: "Project-Based",
    accent: "var(--blue)",
    how: "Fixed scope, timeline and price — a defined deliverable, start to finish.",
    forList: ["Website / app build", "Compliance audit", "Recruitment drive", "Market research"],
  },
  {
    name: "Retainer",
    accent: "var(--orange)",
    how: "A monthly engagement with dedicated resources for ongoing operations.",
    forList: ["Virtual assistance", "Finance & bookkeeping", "IT support", "HR & payroll"],
  },
  {
    name: "Outcome-Based",
    accent: "var(--green)",
    how: "You pay per result — aligned entirely to the outcomes we deliver.",
    forList: ["Medical billing", "Lead generation", "Recruitment (per hire)", "Sales (commission)"],
  },
];

export default function Pricing() {
  const root = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const ctx = gsap.context((self) => {
      const q = self.selector!;

      gsap.from(q("[data-pr-head] > *"), {
        opacity: 0,
        y: 28,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: root.current, start: "top 76%" },
      });

      gsap.from(q("[data-pr-row]"), {
        opacity: 0,
        y: 38,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.14,
        scrollTrigger: { trigger: q("[data-pr-rows]")[0], start: "top 80%" },
      });

      gsap.from(q("[data-pr-foot]"), {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: q("[data-pr-foot]")[0], start: "top 92%" },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section id="pricing" ref={root} className={styles.section}>
      <div className={styles.container}>
        <header className={styles.head} data-pr-head>
          <span className={styles.eyebrow}>
            <span className={styles.eyebrowIndex}>08</span> FLEXIBLE ENGAGEMENT
          </span>
          <h2 className={styles.headline}>
            Pay the way that <span className={styles.accent}>fits</span>.
          </h2>
          <p className={styles.sub}>
            Three ways to work with us — start with one and switch as your needs change.
            No long lock-ins, no capital outlay.
          </p>
        </header>

        <div className={styles.rows} data-pr-rows>
          {MODELS.map((m, i) => (
            <button
              key={m.name}
              type="button"
              data-pr-row
              className={styles.row}
              style={{ ["--accent" as string]: m.accent }}
              onClick={() => smoothScrollTo("contact")}
            >
              <span className={styles.index} aria-hidden>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className={styles.nameWrap}>
                <span className={styles.name}>{m.name}</span>
                <span className={styles.dot} aria-hidden />
              </span>
              <span className={styles.how}>{m.how}</span>
              <span className={styles.forCol}>
                <span className={styles.forLabel}>Best for</span>
                <span className={styles.forItems}>{m.forList.join(" · ")}</span>
              </span>
              <span className={styles.arrow} aria-hidden>↗</span>
            </button>
          ))}
        </div>

        <p className={styles.foot} data-pr-foot>
          Not sure which fits?{" "}
          <button type="button" className={styles.footLink} onClick={() => smoothScrollTo("contact")}>
            Tell us the outcome you need
          </button>{" "}
          — we&rsquo;ll recommend the model.
        </p>
      </div>
    </section>
  );
}
