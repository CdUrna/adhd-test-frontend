import type { ComponentPropsWithoutRef } from "react";

export type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  variant?: "primary" | "link" | "outline" | "ghost";
  size?: "default" | "compact";
};
