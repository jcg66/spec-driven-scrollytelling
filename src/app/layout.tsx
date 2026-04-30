import type { Metadata } from "next";
import type { ReactNode } from "react";

import "@/app/globals.css";
import { createMetadataUrl } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Spec-Driven Scrollytelling",
  description: "Static-export foundation for a GitHub Pages scrollytelling site about agentic AI.",
  metadataBase: createMetadataUrl(),
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
