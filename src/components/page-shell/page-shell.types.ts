import type { ComponentPropsWithoutRef } from "react";

export type PageShellProps = ComponentPropsWithoutRef<"main"> & {
  layout?: "grid" | "column";
};
