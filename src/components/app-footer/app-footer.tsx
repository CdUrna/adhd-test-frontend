import { Brand } from "../brand";
import styles from "./app-footer.module.css";
import type { AppFooterProps } from "./app-footer.types";

export function AppFooter({
  className,
  copyright = "All rights reserved 2026",
  ...props
}: AppFooterProps) {
  const classes = [styles.footer, className].filter(Boolean).join(" ");

  return (
    <footer className={classes} {...props}>
      <div className={styles.content}>
        <Brand tone="inverse" />
        <span>{copyright}</span>
      </div>
    </footer>
  );
}
