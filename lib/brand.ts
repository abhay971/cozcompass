/**
 * COZ COMPASS — brand tokens & shared content.
 * Single source of truth for colours, service pillars and hero copy.
 * Content is drawn from the product deck (slides 4–19); the parent-company
 * COZ CLUB slides (1–3) are intentionally excluded. See docs/deck-content.md.
 * Keep hex values here in sync with the CSS custom properties in globals.css.
 */

export const COLORS = {
  // surfaces
  ink: "#0A0C0E", // primary background
  inkDeep: "#07090B", // preloader / deepest
  panel: "#0C0E11",
  panelHover: "#11141A",
  // text
  text: "#EDEFF1",
  textBright: "#F4F6F8",
  textHi: "#F7F8FA",
  muted: "#98A2AC",
  muted2: "#8E98A2",
  faint: "#5E6770",
  faintest: "#4E575F",
  // brand accents
  orange: "#FF7F32",
  orangeSoft: "#FF8A45",
  blue: "#298FC2",
  blueSoft: "#4FA2D6",
  green: "#6CC24A",
  light: "#E8EBEE",
} as const;

/**
 * The six service pillars of the 360° Soft Solutions portfolio (deck S10–S16),
 * each with its tagline and an accent colour. Reused by the hero marquee and
 * the future Services section.
 */
export const SERVICE_PILLARS = [
  { label: "Information Technology", tagline: "Built Smart. Secured Tight.", color: COLORS.blueSoft },
  { label: "Sales & Marketing", tagline: "Pipeline to Profit.", color: COLORS.orange },
  { label: "Finance & Accounting", tagline: "Numbers That Work For You.", color: COLORS.green },
  { label: "Human Resources", tagline: "People First. Always.", color: COLORS.orangeSoft },
  { label: "Supply Chain Management", tagline: "Source. Move. Deliver.", color: COLORS.blue },
  { label: "R&D Services", tagline: "Where Ideas Become Industries.", color: COLORS.light },
] as const;

/** Hero marquee — the six service domains, uppercased, accent-coloured. */
export const MARQUEE_WORDS = SERVICE_PILLARS.map((p) => ({
  word: p.label.toUpperCase(),
  color: p.color,
}));

/** Compact proof points shown beneath the hero CTAs (deck S5/S6). */
export const HERO_PROOF = [
  "ZERO CAPITAL",
  "LIVE IN DAYS",
  "40–70% LOWER COST",
] as const;

/** Primary navigation links. `target` maps to a section id. */
export const NAV_LINKS = [
  { label: "SERVICES", target: "services" },
  { label: "HOW WE WORK", target: "process" },
  { label: "MARKETS", target: "markets" },
] as const;
