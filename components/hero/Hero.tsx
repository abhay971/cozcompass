"use client";

import { useEffect, useRef, useState } from "react";
import { useMagnetic } from "@/lib/useMagnetic";
import { HERO_PROOF } from "@/lib/brand";
import { compass } from "@/lib/compass";
import SplashScreen from "./SplashScreen";
import Nav from "./Nav";
import Noise from "../Noise";
import { smoothScrollTo as scrollTo } from "@/lib/smoothScrollTo";
import styles from "./Hero.module.css";

export default function Hero() {
  const headingRef = useRef<HTMLSpanElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const primaryCta = useMagnetic<HTMLButtonElement>(0.3);

  const [lit, setLit] = useState(false);

  // Register the HUD heading element so the shared compass can write to it.
  useEffect(() => {
    compass.headingEl = headingRef.current;
    return () => {
      if (compass.headingEl === headingRef.current) compass.headingEl = null;
    };
  }, []);

  // NOTE: the hero compass target is set by the splash on reveal, and restored by
  // the promise section's scrub trigger at progress 0 when you scroll back up — so
  // the hero must NOT set it on a global resize listener (that re-applied the hero
  // position while you were in other sections, fighting their triggers).

  // Lightweight scroll parallax on the hero copy.
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const sy = window.scrollY;
        if (sy < window.innerHeight * 1.2 && contentRef.current) {
          contentRef.current.style.transform = `translateY(${sy * 0.22}px)`;
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className={`${styles.root} hero-reveals ${lit ? "is-lit" : ""}`}>
      <SplashScreen onReveal={() => setLit(true)} />

      <section id="hero" className={styles.hero}>
        {/* left-dark readability scrim (content is on the left; compass on the right) */}
        <div className={styles.scrim} aria-hidden />
        <Nav />

        {/* headline block */}
        <div ref={contentRef} className={styles.content}>
          <div className={styles.eyebrow} data-fade>
            <span className={styles.eyebrowRule} />
            <span>360° SOFT SOLUTIONS — FROM VISION TO EXECUTION</span>
          </div>

          <h1 className={styles.headline}>
            <span className={styles.lineMask}>
              <span className={styles.line} data-line>
                <i>Your</i> GCC
              </span>
            </span>
            <span className={styles.lineMask}>
              <span className={`${styles.line} ${styles.lineDelay}`} data-line>
                <i>in</i> INDIA,
              </span>
            </span>
            <span className={styles.lineMask}>
              <span className={`${styles.line} ${styles.lineDelay2}`} data-line>
                <i>without</i> THE <span className={styles.strokeOrange}>SETUP</span>
              </span>
            </span>
          </h1>

          <p className={styles.lede} data-fade>
            A curated network of{" "}
            <span style={{ color: "var(--blue-soft)" }}>verified Indian providers</span>, managed
            end-to-end as <span style={{ color: "var(--orange-soft)" }}>one accountable partner</span>.
          </p>

          <div className={styles.actions} data-fade>
            <button
              ref={primaryCta}
              data-hover
              className={styles.ctaPrimary}
              onClick={() => scrollTo("contact")}
            >
              START YOUR GCC <span aria-hidden>→</span>
            </button>
            <button data-hover className={styles.ctaGhost} onClick={() => scrollTo("services")}>
              EXPLORE SERVICES
            </button>
          </div>

          <ul className={styles.proof} data-fade>
            {HERO_PROOF.map((p) => (
              <li key={p} className={styles.proofItem}>
                {p}
              </li>
            ))}
          </ul>
        </div>

        {/* side HUD heading readout */}
        <div className={styles.hud} data-fade>
          <div className={styles.hudLabel}>HDG</div>
          <div className={styles.hudValue}>
            <span ref={headingRef}>000.0</span>°
          </div>
        </div>
      </section>

      <Noise />
    </div>
  );
}
