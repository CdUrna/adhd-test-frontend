import type { ComponentPropsWithoutRef, ReactNode } from "react";

export type AppHeaderProps = ComponentPropsWithoutRef<"header"> & {
  actions?: ReactNode;
};
