import Image from "next/image";
import styles from "./report-list-section.module.css";
import type { ReportListSectionProps } from "./report-list-section.types";

export function ReportListSection({ section, variant }: ReportListSectionProps) {
  const items = section.items ?? [];
  const hasItems = items.length > 0;
  const classes = [
    styles.section,
    variant === "strengths" ? styles.sectionStrengths : styles.sectionEmotional,
    hasItems ? styles.sectionWithItems : "",
  ].join(" ");

  return (
    <section className={classes}>
      <div className={styles.sectionHeading}>
        <h2>{section.title}</h2>
        {hasItems && section.content ? <p>{section.content}</p> : null}
      </div>
      {!hasItems && section.content ? <p className={styles.sectionBody}>{section.content}</p> : null}
      {hasItems ? (
        <ul className={styles.sectionList}>
          {items.map((item) => (
            <li className={styles.sectionItem} key={item}>
              <span className={styles.sectionMarker} aria-hidden="true">
                {variant === "strengths" ? (
                  <Image src="/images/report-check.svg" width={16} height={16} alt="" />
                ) : null}
              </span>
              <span className={styles.sectionText}>{item}</span>
            </li>
          ))}
        </ul>
      ) : null}
      {section.outro ? <p className={styles.sectionOutro}>{section.outro}</p> : null}
    </section>
  );
}
