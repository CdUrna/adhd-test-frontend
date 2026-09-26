import styles from "./page-shell.module.css";
import type { PageShellProps } from "./page-shell.types";

export function PageShell({
  layout = "grid",
  className,
  ...props
}: PageShellProps) {
  const classes = [styles.root, styles[layout], className]
    .filter(Boolean)
    .join(" ");

  return <main className={classes} {...props} />;
}
