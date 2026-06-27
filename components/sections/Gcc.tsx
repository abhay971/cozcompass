"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import styles from "./Gcc.module.css";

/**
 * "What is a GCC" (deck S4) — a horizontal scroll gallery. The section pins and
 * the track moves sideways through an intro panel + four benefit cards. Card
 * content reveals via ScrollTrigger `containerAnimation` (triggered by the
 * horizontal scroll), and the big index numbers parallax. Mobile = vertical stack.
 */

type Benefit = { no: string; title: string; desc: string; accent: string };

const BENEFITS: Benefit[] = [
  {
    no: "01",
    title: "Cost Arbitrage",
    desc: "World-class talent at 40–70% lower cost than home markets — with no compromise on quality.",
    accent: "var(--orange)",
  },
  {
    no: "02",
    title: "Operational Excellence",
    desc: "Dedicated teams focused on your core processes — consistency, compliance and scalability, built in.",
    accent: "var(--blue)",
  },
  {
    no: "03",
    title: "Innovation Hub",
    desc: "GCCs grow into R&D and innovation centers that drive product development and digital transformation.",
    accent: "var(--green)",
  },
  {
    no: "04",
    title: "Strategic Control",
    desc: "Unlike outsourcing, a GCC stays fully aligned with your culture, goals and IP.",
    accent: "var(--ink-900)",
  },
];

export default function Gcc() {
  const root = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const desktop = window.matchMedia("(min-width: 901px)").matches;

    const ctx = gsap.context((self) => {
      const q = self.selector!;

      if (desktop) {
        // ===== pinned horizontal scroll =====
        root.current!.classList.add(styles.horizontal);
        const track = q("[data-track]")[0] as HTMLElement;
        const amount = () => track.scrollWidth - window.innerWidth;

        const horiz = gsap.to(track, {
          x: () => -amount(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => "+=" + amount(),
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        // parallax the giant index numbers as cards pass (content stays visible)
        q("[data-bgnum]").forEach((el: Element) => {
          gsap.fromTo(
            el,
            { xPercent: 14 },
            {
              xPercent: -14,
              ease: "none",
              scrollTrigger: {
                trigger: el,
                containerAnimation: horiz,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            },
          );
        });

        // intro reveal (fires before the pin engages)
        gsap.from(q("[data-intro] > *"), {
          y: 40,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: { trigger: root.current, start: "top 75%" },
        });

        // bottom progress bar
        gsap.fromTo(
          q("[data-progress]"),
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            transformOrigin: "left center",
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: () => "+=" + amount(),
              scrub: true,
            },
          },
        );
      } else {
        // ===== mobile: vertical stack reveals =====
        gsap.from(q("[data-intro] > *"), {
          y: 30,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: { trigger: q("[data-intro]")[0], start: "top 82%" },
        });
        // card reveal via a self-contained timeline per card (no shared-state hide)
        q("[data-panel]").forEach((card: Element) => {
          gsap.from(card, {
            y: 40,
            autoAlpha: 0,
            duration: 0.85,
            ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 88%", toggleActions: "play none none none" },
          });
        });
      }
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section id="gcc" ref={root} className={styles.section}>
      <div className={styles.track} data-track>
        {/* intro panel */}
        <div className={styles.intro} data-intro>
          <span className={styles.eyebrow}>
            <span className={styles.eyeIndex}>02</span> WHAT IS A GCC
          </span>
          <h2 className={styles.title}>
            The Global
            <br />
            Capability <span className={styles.titleAccent}>Center.</span>
          </h2>
          <p className={styles.def}>
            An offshore entity that delivers your specialized functions — IT, finance, HR,
            analytics, R&amp;D — with cost efficiency, talent depth and operational agility.
          </p>
          <span className={styles.hint}>
            Four reasons it works <span aria-hidden>&rarr;</span>
          </span>
        </div>

        {/* benefit cards */}
        {BENEFITS.map((b) => (
          <article
            key={b.no}
            className={styles.card}
            data-panel
            style={{ ["--accent" as string]: b.accent }}
          >
            <span className={styles.bgNum} data-bgnum aria-hidden>
              {b.no}
            </span>
            <div className={styles.cardInner}>
              <span className={styles.cardTag}>{b.no} — BENEFIT</span>
              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{b.title}</h3>
                <p className={styles.cardDesc}>{b.desc}</p>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className={styles.progressTrack} aria-hidden>
        <span className={styles.progressFill} data-progress />
      </div>
    </section>
  );
}
