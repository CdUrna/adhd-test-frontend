import type { ComponentPropsWithoutRef } from "react";

export type AppFooterProps = ComponentPropsWithoutRef<"footer"> & {
  copyright?: string;
};
