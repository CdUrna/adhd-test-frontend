import type { Metadata } from "next";
import "@fontsource/geologica/300.css";
import "@fontsource/geologica/500.css";
import "@fontsource/geologica/600.css";
import "@fontsource/geologica/700.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/700.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "ADHD Trait Profile",
  description: "Discover your ADHD trait profile",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
