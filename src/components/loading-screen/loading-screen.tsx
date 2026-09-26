import styles from "./loading-screen.module.css";
import type { LoadingScreenProps } from "./loading-screen.types";

// just for testing
export function LoadingScreen({ className, ...props }: LoadingScreenProps) {
  const classes = [styles.root, className].filter(Boolean).join(" ");
  return <main className={classes} {...props} />;
}
