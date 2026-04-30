import type { ReactNode } from "react";

import type { LayoutMode } from "@/lib/content";

import { PresentationLayout } from "./PresentationLayout";
import { StandardLayout } from "./StandardLayout";

type PageLayoutFactoryProps = {
  layout: LayoutMode;
  title: string;
  summary: string;
  eyebrow?: string;
  children?: ReactNode;
};

export function PageLayoutFactory({
  layout,
  title,
  summary,
  eyebrow,
  children,
}: PageLayoutFactoryProps) {
  if (layout === "presentation") {
    return (
      <PresentationLayout title={title} summary={summary} eyebrow={eyebrow}>
        {children}
      </PresentationLayout>
    );
  }

  return (
    <StandardLayout title={title} summary={summary} eyebrow={eyebrow}>
      {children}
    </StandardLayout>
  );
}
