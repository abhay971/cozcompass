import styles from "./SectionLabel.module.css";

/** Numbered section label sitting under a section's top divider. */
export default function SectionLabel({
  index,
  title,
  note,
}: {
  index: string;
  title: string;
  note?: string;
}) {
  return (
    <div className={styles.row}>
      <span className={styles.index}>{index}</span>
      <span className={styles.title}>{title}</span>
      {note ? <span className={styles.note}>{note}</span> : null}
    </div>
  );
}
