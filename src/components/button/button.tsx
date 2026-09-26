import styles from "./button.module.css";
import type { ButtonProps } from "./button.types";

export function Button({
  variant = "primary",
  size = "default",
  className,
  ...props
}: ButtonProps) {
  const classes = [
    styles.button,
    styles[variant],
    size === "compact" && styles.compact,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <button className={classes} {...props} />;
}
