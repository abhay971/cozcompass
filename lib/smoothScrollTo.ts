import type Lenis from "lenis";

/** Scroll to a section by id, using Lenis when available (falls back to native). */
export function smoothScrollTo(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const lenis = (window as unknown as { lenis?: Lenis }).lenis;
  if (lenis) {
    lenis.scrollTo(el, { offset: -10 });
  } else {
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 10, behavior: "smooth" });
  }
}
