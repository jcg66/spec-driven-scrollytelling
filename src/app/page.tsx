import { AppShell } from "@/components/app/AppShell";
import { PageLayoutFactory } from "@/components/layouts";
import { Reveal } from "@/components/motion";
import { VisualizationFrame } from "@/components/visualizations";
import { CANONICAL_NARRATIVE_ROUTE, getHomeDocument } from "@/lib/content";
import { createCanonicalUrl, createRoutePath, DEFAULT_BASE_PATH, PRODUCTION_URL_SHAPE } from "@/lib/site-config";

export default function HomePage() {
  const homeDocument = getHomeDocument();
  const homepagePath = createRoutePath();
  const canonicalUrl = createCanonicalUrl();

  return (
    <AppShell>
      <PageLayoutFactory
        layout={homeDocument.layout}
        title={homeDocument.title}
        summary={homeDocument.summary}
        eyebrow={homeDocument.eyebrow}
      >
        <ul className="list">
          {homeDocument.highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
        <p>
          <a href={createRoutePath(CANONICAL_NARRATIVE_ROUTE)}>Start the canonical narrative</a>
        </p>
        <Reveal>
          <VisualizationFrame
            label={homeDocument.visualization.label}
            description={homeDocument.visualization.description}
          />
        </Reveal>
        <pre className="codeLine">{`${PRODUCTION_URL_SHAPE}\nbasePath=${DEFAULT_BASE_PATH}\nhome=${homepagePath}\ncanonical=${canonicalUrl}`}</pre>
      </PageLayoutFactory>
    </AppShell>
  );
}
