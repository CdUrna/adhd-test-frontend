import type { ComponentPropsWithoutRef } from "react";

export type SurfaceCardProps = ComponentPropsWithoutRef<"section"> & {
  size?: "default" | "compact";
};
