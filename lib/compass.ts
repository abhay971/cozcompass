/**
 * Shared state for the single persistent 3D compass (CompassStage). The splash,
 * hero and any dark "compass section" set a target; the stage lerps toward it,
 * so one WebGL context travels across the page instead of many.
 *
 * Position is expressed as viewport fractions (0..1): xFrac 0=left,1=right;
 * yFrac 0=top,1=bottom. scale multiplies the base size; opacity fades the canvas.
 */
export type CompassTarget = { xFrac: number; yFrac: number; scale: number; opacity: number };

export const compass: { target: CompassTarget; headingEl: HTMLElement | null; live: boolean } = {
  target: { xFrac: 0.5, yFrac: 0.5, scale: 1, opacity: 0 },
  headingEl: null,
  live: false, // false during the splash (splash owns the compass); true once revealed
};

export function setCompassTarget(t: Partial<CompassTarget>) {
  Object.assign(compass.target, t);
}

/** Centered and a touch smaller — used by the splash intro. */
export function splashTarget(): CompassTarget {
  return { xFrac: 0.5, yFrac: 0.44, scale: 0.82, opacity: 1 };
}

/** Right of the copy on desktop; upper-centre + smaller on mobile (matches the hero). */
export function heroTarget(): CompassTarget {
  const small = typeof window !== "undefined" && window.innerWidth < 760;
  return small
    ? { xFrac: 0.5, yFrac: 0.2, scale: 0.7, opacity: 1 }
    : { xFrac: 0.715, yFrac: 0.52, scale: 1, opacity: 1 };
}
