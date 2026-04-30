import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
};

export function Reveal({ children }: RevealProps) {
  return <div className="revealFrame">{children}</div>;
}
