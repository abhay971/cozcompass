import styles from "./Noise.module.css";

/** Fixed film-grain overlay — adds analogue texture over the whole page. */
export default function Noise() {
  return <div className={styles.noise} aria-hidden="true" />;
}
