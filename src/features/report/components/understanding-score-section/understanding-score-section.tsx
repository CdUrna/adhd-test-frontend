import styles from "./understanding-score-section.module.css";
import type { UnderstandingScoreSectionProps } from "./understanding-score-section.types";

export function UnderstandingScoreSection({ section }: UnderstandingScoreSectionProps) {
  return (
    <section className={styles.section}>
      <h2>{section.title}</h2>
      <p>{section.content}</p>
    </section>
  );
}
