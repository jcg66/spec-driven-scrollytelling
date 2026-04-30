import type { ReactNode } from "react";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <main className="pageShell">
      <div className="shellFrame">{children}</div>
    </main>
  );
}
