"use client";

import Image from "next/image";
import { smoothScrollTo } from "@/lib/smoothScrollTo";
import styles from "./Footer.module.css";

/**
 * Footer — dark, bold closing block (flows on from the dark CTA). Logo, a big
 * sign-off line + email, compact nav, and an oversized faded brand mark.
 * Opaque dark, so it covers the compass and ends the page decisively.
 */

const EMAIL = "coz.compasss@gmail.com";
const YEAR = new Date().getFullYear();

const NAV: { label: string; id: string }[] = [
  { label: "The Promise", id: "promise" },
  { label: "Why COZ COMPASS", id: "why-us" },
  { label: "What We Deliver", id: "services" },
  { label: "How We Work", id: "process" },
  { label: "Vetted & Accountable", id: "vetting" },
  { label: "Who We Serve", id: "markets" },
  { label: "Engagement", id: "pricing" },
];

export default function Footer() {
  return (
    <footer id="footer" className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.top}>
          <div className={styles.lead}>
            <Image
              src="/assets/coz-compass-white.png"
              alt="COZ COMPASS"
              width={236}
              height={37}
              className={styles.logo}
            />
            <h2 className={styles.headline}>
              Let&rsquo;s chart your <span className={styles.accent}>course</span>.
            </h2>
            <div className={styles.actions}>
              <a className={styles.email} href={`mailto:${EMAIL}?subject=Building%20our%20GCC`}>
                {EMAIL}
                <span className={styles.emailArrow} aria-hidden>→</span>
              </a>
              <p className={styles.leadNote}>
                Your GCC in India — without the setup. Zero capital, live in days.
              </p>
            </div>
          </div>

          <nav className={styles.nav} aria-label="Footer">
            <span className={styles.colLabel}>Explore</span>
            <ul className={styles.navList}>
              {NAV.map((n) => (
                <li key={n.id}>
                  <button type="button" onClick={() => smoothScrollTo(n.id)}>
                    {n.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className={styles.markRow} aria-hidden>
          <span className={styles.bigMark}>COZ&nbsp;COMPASS</span>
        </div>

        <div className={styles.bottom}>
          <span className={styles.copy}>© {YEAR} COZ COMPASS — 360° Soft Solutions.</span>
          <div className={styles.bottomRight}>
            <span className={styles.northTag}>Calibrating true north</span>
            <button type="button" className={styles.toTop} onClick={() => smoothScrollTo("hero")}>
              Back to top <span aria-hidden>↑</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
