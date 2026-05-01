import { AppShell } from "@/components/app/AppShell";
import { PresentationContent } from "@/components/content/PresentationContent";
import { PageLayoutFactory } from "@/components/layouts";
import { Reveal } from "@/components/motion";
import { VisualizationFrame } from "@/components/visualizations";
import { getHomeDocument, parseMarkdownBlocks } from "@/lib/content";

export default function HomePage() {
  const homeDocument = getHomeDocument();
  const homeBlocks = parseMarkdownBlocks(homeDocument.body).blocks;

  return (
    <AppShell>
      <PageLayoutFactory
        layout={homeDocument.layout}
        title={homeDocument.title}
        summary={homeDocument.summary}
        eyebrow={homeDocument.eyebrow}
      >
        <Reveal>
          <VisualizationFrame
            label={homeDocument.visualization.label}
            description={homeDocument.visualization.description}
          />
        </Reveal>
        <PresentationContent blocks={homeBlocks} />
      </PageLayoutFactory>
    </AppShell>
  );
}
