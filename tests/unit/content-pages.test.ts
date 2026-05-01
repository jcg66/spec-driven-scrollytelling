import { describe, expect, it } from "vitest";

import {
  CANONICAL_NARRATIVE_SPINE,
  createContentRouteMetadata,
  createContentRoutePageModel,
} from "@/lib/content";
import { getHomeDocument, parseMarkdownBlocks } from "@/lib/content";
import { buildPresentationNarrative } from "@/components/content/PresentationContent";

describe("content route pages", () => {
  it("exposes the canonical narrative on the homepage", () => {
    const homeDocument = getHomeDocument();

    expect(homeDocument.layout).toBe("presentation");

    const narrative = buildPresentationNarrative(parseMarkdownBlocks(homeDocument.body).blocks);

    expect(narrative.chapters.map((chapter) => chapter.title)).toEqual(CANONICAL_NARRATIVE_SPINE.map((chapter) => chapter.title));
  });

  it("creates metadata from validated route documents", () => {
    const pageModel = createContentRoutePageModel(["inside-the-agentic-brain"], {
      basePath: "/preview-site",
      siteOrigin: "https://demo.github.io",
    });

    expect(pageModel?.metadata).toMatchObject({
      title: "Story Guide",
      description: "A supporting reading page that explains the scene map and vocabulary used by the homepage story.",
      alternates: {
        canonical: "https://demo.github.io/preview-site/inside-the-agentic-brain/",
      },
      openGraph: {
        title: "Story Guide",
        description: "A supporting reading page that explains the scene map and vocabulary used by the homepage story.",
        url: "https://demo.github.io/preview-site/inside-the-agentic-brain/",
      },
    });

    expect(pageModel?.metadata.openGraph?.images).toBeUndefined();
    expect(pageModel?.document.layout).toBe("standard");
    expect(pageModel?.parsedContent.blocks[0]).toMatchObject({
      type: "paragraph",
    });
    expect(
      pageModel?.parsedContent.blocks
        .filter((block) => block.type === "heading")
        .map((block) => (block.type === "heading" ? block.inlines[0] : null))
        .filter(Boolean)
        .map((node) => (node && "value" in node ? node.value : "")),
    ).toEqual(["Scene map", "Vocabulary"]);
  });

  it("returns null for unknown content routes", () => {
    expect(createContentRoutePageModel(["missing", "route"])).toBeNull();
  });

  it("can build metadata independently from the route model", () => {
    const pageModel = createContentRoutePageModel(["inside-the-agentic-brain"]);

    expect(pageModel).not.toBeNull();

    if (!pageModel) {
      throw new Error("Expected a route model.");
    }

    expect(createContentRouteMetadata(pageModel.document)).toMatchObject({
      title: "Story Guide",
      description: "A supporting reading page that explains the scene map and vocabulary used by the homepage story.",
    });
  });

  it("defines a deterministic narrative spine for the homepage story", () => {
    expect(CANONICAL_NARRATIVE_SPINE.map((chapter) => chapter.key)).toEqual([
      "spark",
      "deconstruction",
      "digital-eye",
      "execution-loop",
      "outcome",
    ]);
  });

  it("groups the homepage presentation body into an outline and chapter sections", () => {
    const homeDocument = getHomeDocument();
    const narrative = buildPresentationNarrative(parseMarkdownBlocks(homeDocument.body).blocks);

    expect(narrative.introBlocks.length).toBeGreaterThan(0);
    expect(narrative.chapters.map((chapter) => chapter.title)).toEqual(CANONICAL_NARRATIVE_SPINE.map((chapter) => chapter.title));
    expect(narrative.chapters[0]?.blocks.length).toBeGreaterThan(0);
  });
});
