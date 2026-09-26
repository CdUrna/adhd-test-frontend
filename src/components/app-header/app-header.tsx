import { Brand } from "../brand";
import styles from "./app-header.module.css";
import type { AppHeaderProps } from "./app-header.types";

export function AppHeader({ actions, className, ...props }: AppHeaderProps) {
  const classes = [styles.header, className].filter(Boolean).join(" ");

  return (
    <header className={classes} {...props}>
      <Brand />
      {actions ? <div className={styles.actions}>{actions}</div> : null}
    </header>
  );
}
