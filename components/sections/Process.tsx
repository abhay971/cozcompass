"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import styles from "./Process.module.css";

/**
 * Section 05 — "How COZ COMPASS works" (deck S9). DARK · compass section. A
 * vertical process timeline (Align → Scale) on the left; the shared compass
 * fades back in on the right and descends through the steps as you scroll.
 */

const STEPS = [
  { t: "Align", d: "We map your goals, growth stage and service needs — across strategy, operations, compliance, technology and people." },
  { t: "Curate", d: "We select and onboard the right verified providers from the COZ network, tailored to exactly what you need." },
  { t: "Structure", d: "We define scope, timelines, deliverables, commercials and the full execution roadmap up front." },
  { t: "Execute", d: "We coordinate providers, manage workflows and ensure quality-driven delivery — with one accountable owner." },
  { t: "Scale", d: "We continuously optimize operations and expand your capabilities as the business grows." },
];

export default function Process() {
  const root = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const ctx = gsap.context((self) => {
      const q = self.selector!;

      gsap.from(q("[data-pr-head] > *"), {
        opacity: 0,
        y: 30,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: root.current, start: "top 74%" },
      });

      q("[data-pr-step]").forEach((el: Element) => {
        gsap.from(el, {
          opacity: 0,
          y: 40,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 86%" },
        });
      });

      // draw the connecting line as you scroll through
      gsap.fromTo(
        q("[data-pr-line]"),
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          transformOrigin: "top center",
          scrollTrigger: { trigger: q("[data-pr-track]")[0], start: "top 70%", end: "bottom 70%", scrub: true },
        },
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section id="process" ref={root} className={styles.section}>
      {/* left-dark scrim — timeline is on the left; the compass on the RIGHT stays clear/bright */}
      <div className={styles.scrim} aria-hidden />
      <div className={styles.container}>
        <header className={styles.head} data-pr-head>
          <span className={styles.label}>
            <span className={styles.labelIndex}>05</span> HOW WE WORK
          </span>
          <h2 className={styles.headline}>
            From <span className={styles.accent}>align</span> to{" "}
            <span className={styles.accent}>scale</span>.
          </h2>
          <p className={styles.sub}>
            A structured five-step path — from understanding your needs to scaling your
            business, with one team accountable the whole way.
          </p>
        </header>

        <ol className={styles.track} data-pr-track>
          <span className={styles.line} data-pr-line aria-hidden />
          {STEPS.map((s, i) => (
            <li key={s.t} className={styles.step} data-pr-step>
              <span className={styles.node} aria-hidden />
              <span className={styles.stepNo}>{String(i + 1).padStart(2, "0")}</span>
              <div className={styles.stepBody}>
                <h3 className={styles.stepTitle}>{s.t}</h3>
                <p className={styles.stepDesc}>{s.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
