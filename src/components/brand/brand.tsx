import Image from "next/image";
import styles from "./brand.module.css";
import type { BrandProps } from "./brand.types";

export function Brand({ tone = "default" }: BrandProps) {
  return (
    <div
      className={`${styles.brand} ${tone === "inverse" ? styles.inverse : ""}`}
      aria-label="BrainsMate"
    >
      <Image
        className={styles.mark}
        src="/images/brine-logo.svg"
        width={28}
        height={25}
        alt=""
        aria-hidden="true"
      />
      Brains<span>Mate</span>
    </div>
  );
}
