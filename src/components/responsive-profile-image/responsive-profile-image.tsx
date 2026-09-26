import Image from "next/image";
import type { ResponsiveProfileImageProps } from "./responsive-profile-image.types";

export function ResponsiveProfileImage({
  className,
  width,
  height,
  priority = false,
  sizes,
}: ResponsiveProfileImageProps) {
  return (
    <picture>
      <source
        media="(max-width: 600px)"
        srcSet="/images/brine-face-mobile.png"
      />
      <Image
        className={className}
        src="/images/brine-face-desktop.png"
        width={width}
        height={height}
        sizes={sizes}
        alt=""
        aria-hidden="true"
        priority={priority}
      />
    </picture>
  );
}
