import { AccordionItem } from "@/components/accordion-item";
import styles from "./faq-section.module.css";
import type { FaqSectionProps } from "./faq-section.types";

export function FaqSection({ items }: FaqSectionProps) {
  return (
    <section className={styles.faq}>
      <h2>Frequently asked questions</h2>
      <div className={styles.questions}>
        {items.map((item, index) => (
          <AccordionItem
            key={item.question}
            question={item.question}
            answer={item.answer}
            defaultOpen={index === 0}
          />
        ))}
      </div>
    </section>
  );
}
