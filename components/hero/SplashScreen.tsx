"use client";

import { useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import { compass, setCompassTarget, splashTarget, heroTarget } from "@/lib/compass";
import styles from "./SplashScreen.module.css";

const WORD = "COZ COMPASS";

// Plays once per full page load (survives any remount within the session).
let splashPlayed = false;

/**
 * Splash that drives the shared 3D compass (CompassStage): the compass fades in
 * centered while the wordmark reveals and a counter calibrates, then on exit the
 * compass glides to its hero position and the wordmark/overlay fade out as the
 * hero lights up. No second WebGL context, no flat logo.
 */
export default function SplashScreen({ onReveal }: { onReveal: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = useState(splashPlayed);

  const onRevealRef = useRef(onReveal);
  onRevealRef.current = onReveal;

  useIsomorphicLayoutEffect(() => {
    if (splashPlayed) {
      setCompassTarget(heroTarget());
      compass.live = true;
      onRevealRef.current();
      return;
    }
    splashPlayed = true;

    // splash owns the compass (centred) until the hand-off, then the journey takes over
    compass.live = false;
    setCompassTarget(splashTarget());

    const reveal = () => onRevealRef.current();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context((self) => {
      const q = self.selector!;

      // fail-open: guarantees the splash resolves even if the timeline stalls.
      // MUST be killed on normal completion, or it fires ~6s in and re-sets the
      // hero compass target — clobbering whatever section you've scrolled to.
      let failOpen: gsap.core.Tween | null = null;
      const finish = () => {
        failOpen?.kill();
        setHidden(true);
      };

      if (reduce) {
        setCompassTarget(heroTarget());
        compass.live = true;
        reveal();
        gsap.to(root.current, { autoAlpha: 0, duration: 0.5, delay: 0.3, onComplete: finish });
        return;
      }

      const tl = gsap.timeline();
      tl.from(q("[data-char]"), { yPercent: 115, duration: 0.8, ease: "power3.out", stagger: 0.045 }, 0.4);
      tl.from(q("[data-sub]"), { autoAlpha: 0, y: 10, duration: 0.6, ease: "power2.out" }, 0.9);
      tl.fromTo(q("[data-bar]"), { scaleX: 0 }, { scaleX: 1, duration: 1.5, ease: "power1.inOut" }, 0.4);

      // hand off: glide the compass to the hero spot, hand control to the journey,
      // fade the overlay, light the hero
      tl.add(() => {
        setCompassTarget(heroTarget());
        compass.live = true;
        reveal();
      }, "+=0.3");
      tl.to(q("[data-content]"), { autoAlpha: 0, y: -20, duration: 0.7, ease: "power2.inOut" }, "<");
      tl.add(finish, "+=0.55");

      failOpen = gsap.delayedCall(6, () => {
        setCompassTarget(heroTarget());
        reveal();
        finish();
      });
    }, root);

    return () => ctx.revert();
  }, []);

  if (hidden) return null;

  return (
    <div ref={root} className={styles.splash} aria-hidden>
      <div className={styles.content} data-content>
        <h1 className={styles.wordmark}>
          {WORD.split("").map((c, i) =>
            c === " " ? (
              <span key={i} className={styles.space} />
            ) : (
              <span key={i} className={styles.charMask}>
                <span className={styles.char} data-char>
                  {c}
                </span>
              </span>
            ),
          )}
        </h1>
        <span className={styles.sub} data-sub>
          CALIBRATING TRUE NORTH
        </span>
      </div>

      <div className={styles.barTrack} aria-hidden>
        <span className={styles.bar} data-bar />
      </div>
    </div>
  );
}
