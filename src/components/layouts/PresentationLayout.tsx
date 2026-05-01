import type { ReactNode } from "react";

type PresentationLayoutProps = {
  title: string;
  summary: string;
  eyebrow?: string;
  children?: ReactNode;
};

export function PresentationLayout({
  title,
  summary,
  eyebrow = "Presentation Mode",
  children,
}: PresentationLayoutProps) {
  return (
    <article className="panel panelPresentation presentationLayout">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="title">{title}</h1>
      <p className="lede">{summary}</p>
      {children ? <div className="contentStack">{children}</div> : null}
    </article>
  );
}
