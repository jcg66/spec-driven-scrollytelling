import { createCanonicalUrl, createRoutePath, DEFAULT_BASE_PATH, PRODUCTION_URL_SHAPE } from "@/lib/site-config";

export default function HomePage() {
  const homepagePath = createRoutePath();
  const canonicalUrl = createCanonicalUrl();

  return (
    <main className="pageShell">
      <section className="panel">
        <p className="eyebrow">Sprint 01A</p>
        <h1 className="title">Static Export Foundation</h1>
        <p className="lede">
          This bootstrap establishes the GitHub Pages deployment contract before the narrative,
          content system, and presentation layouts are built.
        </p>
        <ul className="list">
          <li>Next.js App Router with TypeScript is configured for static export.</li>
          <li>The default production base path is the repository subpath used by GitHub Pages.</li>
          <li>Images are configured for static hosting with no runtime optimization dependency.</li>
          <li>The exported artifact can be verified from the non-root path it will use in production.</li>
        </ul>
        <pre className="codeLine">{`${PRODUCTION_URL_SHAPE}\nbasePath=${DEFAULT_BASE_PATH}\nhome=${homepagePath}\ncanonical=${canonicalUrl}`}</pre>
      </section>
    </main>
  );
}
