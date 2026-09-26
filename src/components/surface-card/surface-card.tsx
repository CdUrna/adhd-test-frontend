import styles from "./surface-card.module.css";
import type { SurfaceCardProps } from "./surface-card.types";

export function SurfaceCard({
  size = "default",
  className,
  ...props
}: SurfaceCardProps) {
  const classes = [styles.root, size === "compact" && styles.compact, className]
    .filter(Boolean)
    .join(" ");

  return <section className={classes} {...props} />;
}
