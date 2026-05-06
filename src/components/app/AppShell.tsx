import type { ReactNode } from "react";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <>
      <a className="skipLink" href="#main-content">
        Skip to main content
      </a>
      <main className="pageShell" id="main-content" tabIndex={-1}>
        <div className="shellFrame">{children}</div>
      </main>
    </>
  );
}
