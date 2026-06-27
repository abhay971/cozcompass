"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import { smoothScrollTo } from "@/lib/smoothScrollTo";
import SectionLabel from "@/components/SectionLabel";
import styles from "./Gap.module.css";

/**
 * "The Gap" (deck S6) — a scroll-driven manifesto. The statement fills in
 * word-by-word as you scroll (the words go from faint to solid), with the
 * cost numbers and the COZ COMPASS payoff lighting up. No tables, no columns.
 */

type Tok = { t: string; cls?: "num" | "accent" };
const words = (s: string): Tok[] => s.split(" ").map((t) => ({ t }));

const TOKENS: Tok[] = [
  ...words("Building a GCC of your own costs"),
  { t: "$6M", cls: "num" },
  ...words("in capital,"),
  { t: "200+", cls: "num" },
  ...words("specialists, and"),
  { t: "18", cls: "num" },
  { t: "months", cls: "num" },
  ...words("you don’t have."),
  { t: "COZ", cls: "accent" },
  { t: "COMPASS", cls: "accent" },
  ...words("gives you the same capability — verified, accountable, and live in"),
  { t: "days.", cls: "accent" },
];

const PUNCH: Tok[] = [
  ...words("Your GCC,"),
  { t: "without", cls: "accent" },
  { t: "the", cls: "accent" },
  { t: "setup.", cls: "accent" },
];

export default function Gap() {
  const root = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context((self) => {
      const q = self.selector!;
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // top meta fades in
        gsap.from(q("[data-fade]"), {
          opacity: 0,
          y: 18,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: { trigger: root.current, start: "top 80%" },
        });

        // word-by-word fill, scrubbed to scroll
        const fill = (sel: string, trigger: Element) => {
          const w = q(sel);
          gsap.set(w, { opacity: 0.14 });
          gsap.to(w, {
            opacity: 1,
            ease: "none",
            stagger: { each: 0.5 },
            scrollTrigger: { trigger, start: "top 78%", end: "top 32%", scrub: true },
          });
        };
        fill("[data-statement] [data-word]", q("[data-statement]")[0]);
        fill("[data-punch] [data-word]", q("[data-punch]")[0]);
      });
    }, root);

    return () => ctx.revert();
  }, []);

  const render = (toks: Tok[]) =>
    toks.map((tok, i) => (
      <span
        key={i}
        data-word
        className={`${styles.word} ${tok.cls === "num" ? styles.num : ""} ${
          tok.cls === "accent" ? styles.accent : ""
        }`}
      >
        {tok.t}
      </span>
    ));

  return (
    <section id="gap" ref={root} className={styles.section}>
      <div className={styles.container}>
        <SectionLabel index="01" title="The SMB / SME Gap" note="Why most businesses never get a GCC" />

        <p className={styles.statement} data-statement>
          {render(TOKENS)}
        </p>

        <p className={styles.punch} data-punch>
          {render(PUNCH)}
        </p>

        <div className={styles.footer} data-fade>
          <button className={styles.cta} onClick={() => smoothScrollTo("services")}>
            Explore the services <span aria-hidden>&rarr;</span>
          </button>
        </div>
      </div>
    </section>
  );
}
