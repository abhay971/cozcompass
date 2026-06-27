"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import styles from "./Vetting.module.css";

/**
 * Section 06 — "Vetted & accountable" (deck S17). LIGHT section. A horizontal
 * 4-stage vetting pipeline (Discover → Assess → Verify → Onboard) with a rail that
 * draws on scroll, then an accountability band — the "we stay accountable after
 * onboarding" point. Distinct from the Process section's vertical timeline.
 */

const STAGES = [
  { t: "Discover", d: "We identify qualified Indian providers through trusted networks, referrals and deep research.", accent: "var(--orange)" },
  { t: "Assess", d: "We evaluate capability, past-work quality, team credentials and domain expertise.", accent: "var(--blue)" },
  { t: "Verify", d: "Background checks, legal validation, client references and a full compliance audit.", accent: "var(--green)" },
  { t: "Onboard", d: "NDAs, SLAs and KPIs in place — then integrated into the COZ COMPASS ecosystem.", accent: "var(--ink-900)" },
];

const GUARANTEES = [
  { k: "SLAs", v: "Delivery measured against agreed service levels." },
  { k: "KPIs", v: "Performance tracked and reviewed continuously." },
  { k: "QA", v: "Ongoing quality checks on every engagement." },
];

export default function Vetting() {
  const root = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const ctx = gsap.context((self) => {
      const q = self.selector!;

      gsap.from(q("[data-vt-head] > *"), {
        opacity: 0,
        y: 28,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: root.current, start: "top 74%" },
      });

      gsap.fromTo(
        q("[data-vt-rail]"),
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          transformOrigin: "left center",
          scrollTrigger: { trigger: q("[data-vt-steps]")[0], start: "top 78%", end: "top 40%", scrub: true },
        },
      );

      gsap.from(q("[data-vt-step]"), {
        opacity: 0,
        y: 34,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: { trigger: q("[data-vt-steps]")[0], start: "top 80%" },
      });

      gsap.from(q("[data-vt-acc]"), {
        opacity: 0,
        y: 36,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: q("[data-vt-acc]")[0], start: "top 86%" },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section id="vetting" ref={root} className={styles.section}>
      <div className={styles.container}>
        <header className={styles.head} data-vt-head>
          <span className={styles.eyebrow}>
            <span className={styles.eyebrowIndex}>06</span> VETTED &amp; ACCOUNTABLE
          </span>
          <h2 className={styles.headline}>
            Only the <span className={styles.accent}>proven</span> make the cut.
          </h2>
          <p className={styles.sub}>
            Every provider clears a four-stage vetting process before they ever touch your
            work — and we stay accountable long after they&rsquo;re in.
          </p>
        </header>

        <div className={styles.steps} data-vt-steps>
          <span className={styles.rail} data-vt-rail aria-hidden />
          {STAGES.map((s, i) => (
            <div key={s.t} className={styles.step} data-vt-step style={{ ["--accent" as string]: s.accent }}>
              <span className={styles.node} aria-hidden>
                <span className={styles.nodeNo}>{String(i + 1).padStart(2, "0")}</span>
              </span>
              <h3 className={styles.stepTitle}>{s.t}</h3>
              <p className={styles.stepDesc}>{s.d}</p>
            </div>
          ))}
        </div>

        <div className={styles.accountability} data-vt-acc>
          <div className={styles.accLead}>
            <span className={styles.accTag}>After onboarding</span>
            <h3 className={styles.accTitle}>
              Onboarded isn&rsquo;t the finish line.
            </h3>
            <p className={styles.accDesc}>
              We monitor delivery, run continuous quality assurance, and remain your single
              accountable partner for every outcome — not just an introduction service.
            </p>
          </div>
          <ul className={styles.accGrid}>
            {GUARANTEES.map((g) => (
              <li key={g.k} className={styles.accItem}>
                <span className={styles.accKey}>{g.k}</span>
                <span className={styles.accVal}>{g.v}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
