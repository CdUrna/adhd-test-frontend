import styles from "./accordion-item.module.css";
import type { AccordionItemProps } from "./accordion-item.types";

export function AccordionItem({ answer, defaultOpen = false, question }: AccordionItemProps) {
  return (
    <details className={styles.item} open={defaultOpen}>
      <summary className={styles.trigger}>{question}</summary>
      <p className={styles.content}>{answer}</p>
    </details>
  );
}
