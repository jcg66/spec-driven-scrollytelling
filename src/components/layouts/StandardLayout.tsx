import type { ReactNode } from "react";

type StandardLayoutProps = {
  title: string;
  summary: string;
  eyebrow?: string;
  children?: ReactNode;
};

export function StandardLayout({ title, summary, eyebrow, children }: StandardLayoutProps) {
  return (
    <article className="panel sceneSurface">
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h1 className="title">{title}</h1>
      <p className="lede">{summary}</p>
      {children ? <div className="contentStack">{children}</div> : null}
    </article>
  );
}
