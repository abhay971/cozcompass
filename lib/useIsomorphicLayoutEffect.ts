import { useEffect, useLayoutEffect } from "react";

/**
 * useLayoutEffect on the client (so GSAP can set start states before paint —
 * no flash of unstyled content), useEffect on the server (avoids the SSR
 * warning). Use this for all GSAP setup.
 */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
