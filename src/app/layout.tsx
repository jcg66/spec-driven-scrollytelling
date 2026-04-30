import type { Metadata } from "next";
import type { ReactNode } from "react";

import "@/app/globals.css";
import { PRODUCTION_URL_SHAPE } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Spec-Driven Scrollytelling",
  description: "Static-export foundation for a GitHub Pages scrollytelling site about agentic AI.",
  metadataBase: new URL(PRODUCTION_URL_SHAPE.replace("<account>", "example")),
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
