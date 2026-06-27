import { MARQUEE_WORDS } from "@/lib/brand";
import styles from "./Marquee.module.css";

/**
 * Infinite bottom rail cycling the four pillars. The track holds two copies of
 * the word list and translates -50% so the loop is seamless.
 */
export default function Marquee() {
  const items = Array.from({ length: 6 }).flatMap((_, rep) =>
    MARQUEE_WORDS.map(({ word, color }) => ({ word, color, key: `${rep}-${word}` })),
  );
  const track = [...items, ...items];

  return (
    <div className={styles.wrap}>
      <div className={styles.track}>
        {track.map((it, i) => (
          <span key={`${it.key}-${i}`} className={styles.cell}>
            <span className={styles.word} style={{ color: it.color }}>
              {it.word}
            </span>
            <span className={styles.star}>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
