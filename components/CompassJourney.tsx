"use client";

import { useEffect } from "react";
import { gsap } from "@/lib/gsap";
import { compass, setCompassTarget, type CompassTarget } from "@/lib/compass";

/**
 * The compass "journey" — a single deterministic controller for where the shared
 * 3D compass sits. Each section has an anchor target. The compass is PINNED at the
 * active section's anchor while that section is in view, and only moves in a short
 * transition band (BAND) around the boundary between two sections — so it holds
 * still while you scroll through a section and only travels when the section
 * switches. Pure function of scroll ⇒ identical up and down. Light sections use
 * opacity 0. Gated by `compass.live` so the splash owns the compass until reveal.
 */

type Anchor = { id: string; t: CompassTarget };

function anchors(desktop: boolean): Anchor[] {
  return desktop
    ? [
        { id: "hero", t: { xFrac: 0.715, yFrac: 0.52, scale: 1, opacity: 1 } },
        { id: "promise", t: { xFrac: 0.8, yFrac: 0.55, scale: 1.1, opacity: 1 } },
        // light sections are invisible — give them the SAME position as the dark
        // section they hand off to, so the compass fades in/out IN PLACE (no slide)
        { id: "why-us", t: { xFrac: 0.8, yFrac: 0.55, scale: 1.1, opacity: 0 } },
        { id: "services", t: { xFrac: 0.82, yFrac: 0.6, scale: 1.06, opacity: 0 } },
        { id: "process", t: { xFrac: 0.82, yFrac: 0.6, scale: 1.06, opacity: 1 } },
        // vetting is light again → fade the compass out in place (same spot as process)
        { id: "vetting", t: { xFrac: 0.82, yFrac: 0.6, scale: 1.06, opacity: 0 } },
        // markets/pricing are light (hidden); pricing matches the CTA so the compass
        // fades back IN PLACE, centred, as it "settles" on the contact section
        { id: "markets", t: { xFrac: 0.5, yFrac: 0.5, scale: 1.15, opacity: 0 } },
        { id: "pricing", t: { xFrac: 0.5, yFrac: 0.5, scale: 1.15, opacity: 0 } },
        { id: "contact", t: { xFrac: 0.5, yFrac: 0.5, scale: 1.15, opacity: 1 } },
        { id: "footer", t: { xFrac: 0.5, yFrac: 0.5, scale: 1.15, opacity: 0 } },
      ]
    : [
        { id: "hero", t: { xFrac: 0.5, yFrac: 0.2, scale: 0.7, opacity: 1 } },
        { id: "promise", t: { xFrac: 0.5, yFrac: 0.18, scale: 0.6, opacity: 0.4 } },
        { id: "why-us", t: { xFrac: 0.5, yFrac: 0.18, scale: 0.6, opacity: 0 } },
        { id: "services", t: { xFrac: 0.5, yFrac: 0.5, scale: 0.72, opacity: 0 } },
        { id: "process", t: { xFrac: 0.5, yFrac: 0.5, scale: 0.72, opacity: 0.28 } },
        { id: "vetting", t: { xFrac: 0.5, yFrac: 0.5, scale: 0.72, opacity: 0 } },
        { id: "markets", t: { xFrac: 0.5, yFrac: 0.5, scale: 0.78, opacity: 0 } },
        { id: "pricing", t: { xFrac: 0.5, yFrac: 0.5, scale: 0.78, opacity: 0 } },
        { id: "contact", t: { xFrac: 0.5, yFrac: 0.42, scale: 0.8, opacity: 0.32 } },
        { id: "footer", t: { xFrac: 0.5, yFrac: 0.42, scale: 0.8, opacity: 0 } },
      ];
}

const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
const lerpT = (a: CompassTarget, b: CompassTarget, p: number): CompassTarget => ({
  xFrac: lerp(a.xFrac, b.xFrac, p),
  yFrac: lerp(a.yFrac, b.yFrac, p),
  scale: lerp(a.scale, b.scale, p),
  opacity: lerp(a.opacity, b.opacity, p),
});

export default function CompassJourney() {
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 901px)").matches;
    const list = anchors(desktop);

    const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

    const update = () => {
      if (!compass.live) return;
      const scroll = window.scrollY;
      const vh = window.innerHeight;
      const ref = scroll + vh / 2; // viewport centre line, in document coords
      const BAND = vh * 0.6; // how much scroll the section-to-section move takes

      // section bounds (top/bottom in document coords) + their anchor
      const secs: { top: number; bot: number; t: CompassTarget }[] = [];
      for (const a of list) {
        const el = document.getElementById(a.id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top + window.scrollY;
        secs.push({ top, bot: top + el.offsetHeight, t: a.t });
      }
      if (!secs.length) return;

      // clamp at the ends
      if (ref <= secs[0].top) return setCompassTarget(secs[0].t);
      const lastSec = secs[secs.length - 1];
      if (ref >= lastSec.bot) return setCompassTarget(lastSec.t);

      // active section = the one whose bounds contain the viewport centre
      let i = secs.length - 1;
      for (let k = 0; k < secs.length; k++) {
        if (ref >= secs[k].top && ref < secs[k].bot) {
          i = k;
          break;
        }
      }
      const cur = secs[i];

      // within BAND/2 of the boundary to the NEXT section → transition cur → next
      if (i < secs.length - 1 && cur.bot - ref < BAND / 2) {
        const f = clamp01((ref - (cur.bot - BAND / 2)) / BAND);
        return setCompassTarget(lerpT(cur.t, secs[i + 1].t, f));
      }
      // within BAND/2 of the boundary to the PREVIOUS section → transition prev → cur
      if (i > 0 && ref - cur.top < BAND / 2) {
        const f = clamp01((ref - (cur.top - BAND / 2)) / BAND);
        return setCompassTarget(lerpT(secs[i - 1].t, cur.t, f));
      }
      // otherwise PINNED at the active section's anchor (no drift)
      setCompassTarget(cur.t);
    };

    gsap.ticker.add(update);
    return () => gsap.ticker.remove(update);
  }, []);

  return null;
}
