import styles from "./report-disclaimer.module.css";
import type { ReportDisclaimerProps } from "./report-disclaimer.types";

export function ReportDisclaimer({ children }: ReportDisclaimerProps) {
  return (
    <aside className={styles.disclaimer} aria-label="Medical disclaimer">
      <p>{children}</p>
    </aside>
  );
}
