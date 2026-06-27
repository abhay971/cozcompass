"use client";

import { useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import styles from "./Services.module.css";

/**
 * Section 04 — "What we deliver" / 360° Soft Solutions (deck S10–16). LIGHT
 * section. An accordion explorer: each of the 6 service pillars expands to reveal
 * its services, with its own brand accent. Compass fades out while here (perf).
 */

type Pillar = { name: string; tag: string; accent: string; services: string[] };

const PILLARS: Pillar[] = [
  {
    name: "Information Technology",
    tag: "Built smart. Secured tight.",
    accent: "var(--blue)",
    services: ["AI, ML & Automation", "Cybersecurity & Threat Mgmt", "Cloud & Infrastructure", "Data Analytics & BI", "Full-Stack Web & App Dev", "ERP & CRM Implementation", "API Integration", "UI / UX Design", "Software QA & Testing", "Blockchain & Emerging Tech"],
  },
  {
    name: "Sales & Marketing",
    tag: "Pipeline to profit.",
    accent: "var(--orange)",
    services: ["Lead Generation & Pipeline", "CRM Setup & Reporting", "SEO & Search Marketing", "Content & Copywriting", "Email Campaigns", "Ad Campaign Optimization", "Social Media Management", "Market & Competitor Research", "Customer Care", "Brand Strategy"],
  },
  {
    name: "Finance & Accounting",
    tag: "Numbers that work for you.",
    accent: "var(--green)",
    services: ["Bookkeeping & General Ledger", "Accounts Payable & Receivable", "Bank Reconciliation", "Payroll Tax & Compliance", "Financial Reports", "Budgeting & Forecasting", "Tax Preparation", "Cash Flow Analysis", "Audit Support", "IFRS / GAAP Reporting"],
  },
  {
    name: "Human Resources",
    tag: "People first. Always.",
    accent: "var(--orange)",
    services: ["Talent Recruitment", "Onboarding & Offboarding", "Payroll Processing", "HR Policy & Compliance", "Contract Drafting", "Background Checks", "Training & Development", "Employee Engagement", "Performance Management", "Labour Law Advisory"],
  },
  {
    name: "Supply Chain Management",
    tag: "Source. Move. Deliver.",
    accent: "var(--blue)",
    services: ["Strategic Sourcing", "Vendor Management", "Inventory Planning", "PO & Contract Management", "Origin-to-Destination Logistics", "Customs & Trade Compliance", "Quality Control & Assurance", "Freight & Carrier", "Reverse Logistics", "Supplier Performance"],
  },
  {
    name: "R&D Services",
    tag: "Where ideas become industries.",
    accent: "var(--green)",
    services: ["Market Research", "Product Innovation", "Competitive Intelligence", "Feasibility & Pilot Testing", "IP Research & Patents", "Technology Scouting", "Concept Validation", "Industry Trend Analysis", "Innovation Workshops", "Lab-to-Market Support"],
  },
];

export default function Services() {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(-1); // nothing open until hovered

  useIsomorphicLayoutEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const ctx = gsap.context((self) => {
      const q = self.selector!;

      gsap.from(q("[data-svc-head] > *"), {
        opacity: 0,
        y: 28,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: root.current, start: "top 74%" },
      });

      gsap.from(q("[data-svc-row]"), {
        opacity: 0,
        y: 32,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.07,
        scrollTrigger: { trigger: q("[data-svc-list]")[0], start: "top 82%" },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section id="services" ref={root} className={styles.section}>
      <div className={styles.container}>
        <header className={styles.head} data-svc-head>
          <span className={styles.eyebrow}>
            <span className={styles.eyebrowIndex}>04</span> WHAT WE DELIVER
          </span>
          <h2 className={styles.headline}>
            360° <span className={styles.accent}>Soft Solutions.</span>
          </h2>
          <p className={styles.sub}>
            Six service pillars, delivered through our verified Indian network — from one
            service to your full back office.
          </p>
        </header>

        <div className={styles.list} data-svc-list onMouseLeave={() => setOpen(-1)}>
          {PILLARS.map((p, i) => {
            const isOpen = open === i;
            return (
              <div
                key={p.name}
                data-svc-row
                className={`${styles.row} ${isOpen ? styles.open : ""}`}
                style={{ ["--accent" as string]: p.accent }}
                onMouseEnter={() => setOpen(i)}
              >
                <button
                  className={styles.rowHead}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                >
                  <span className={styles.rowNo}>{String(i + 1).padStart(2, "0")}</span>
                  <span className={styles.rowName}>{p.name}</span>
                  <span className={styles.rowTag}>{p.tag}</span>
                  <span className={styles.rowIcon} aria-hidden />
                </button>

                <div className={styles.rowBody}>
                  <div className={styles.rowBodyInner}>
                    <ul className={styles.services}>
                      {p.services.map((s) => (
                        <li key={s} className={styles.service}>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
