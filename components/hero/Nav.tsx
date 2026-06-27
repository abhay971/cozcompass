"use client";

import Image from "next/image";
import { NAV_LINKS } from "@/lib/brand";
import { useMagnetic } from "@/lib/useMagnetic";
import { smoothScrollTo as scrollTo } from "@/lib/smoothScrollTo";
import styles from "./Nav.module.css";

export default function Nav() {
  const cta = useMagnetic<HTMLButtonElement>(0.32);

  return (
    <nav className={styles.nav} data-fade>
      <button className={styles.brand} data-hover onClick={() => scrollTo("hero")} aria-label="COZ COMPASS — home">
        <Image
          src="/assets/coz-compass-white.png"
          alt="COZ COMPASS"
          width={168}
          height={26}
          priority
          className={styles.logo}
        />
      </button>

      <div className={styles.links}>
        {NAV_LINKS.map((l) => (
          <button
            key={l.target}
            data-hover
            className={styles.link}
            onClick={() => scrollTo(l.target)}
          >
            {l.label}
          </button>
        ))}
        <button
          ref={cta}
          data-hover
          className={styles.cta}
          onClick={() => scrollTo("contact")}
        >
          BOOK A CALL
        </button>
      </div>
    </nav>
  );
}
