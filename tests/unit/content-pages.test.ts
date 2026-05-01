import { describe, expect, it } from "vitest";

import {
  CANONICAL_NARRATIVE_ROUTE,
  CANONICAL_NARRATIVE_SPINE,
  createContentRouteMetadata,
  createContentRoutePageModel,
  getCanonicalNarrativeRouteDocument,
} from "@/lib/content";
import { buildPresentationNarrative } from "@/components/content/PresentationContent";

describe("content route pages", () => {
  it("exposes the canonical narrative route explicitly", () => {
    expect(CANONICAL_NARRATIVE_ROUTE).toBe("inside-the-agentic-brain");
    expect(getCanonicalNarrativeRouteDocument()?.slug).toBe(CANONICAL_NARRATIVE_ROUTE);
  });

  it("creates metadata from validated route documents", () => {
    const pageModel = createContentRoutePageModel(["inside-the-agentic-brain"], {
      basePath: "/preview-site",
      siteOrigin: "https://demo.github.io",
    });

    expect(pageModel?.metadata).toMatchObject({
      title: "Inside the Agentic Brain",
      description: "A presentation-style story explaining the planner, grounder, and action loop inside an AI agent.",
      alternates: {
        canonical: "https://demo.github.io/preview-site/inside-the-agentic-brain/",
      },
      openGraph: {
        title: "Inside the Agentic Brain",
        description: "A presentation-style story explaining the planner, grounder, and action loop inside an AI agent.",
        url: "https://demo.github.io/preview-site/inside-the-agentic-brain/",
      },
    });

    expect(pageModel?.metadata.openGraph?.images).toEqual([
      {
        url: "/preview-site/images/inside-the-agentic-brain-hero.png",
        alt: "Inside the Agentic Brain",
      },
    ]);
    expect(pageModel?.document.layout).toBe("presentation");
    expect(pageModel?.parsedContent.blocks[0]).toMatchObject({
      type: "heading",
      level: 1,
    });
    expect(
      pageModel?.parsedContent.blocks
        .filter((block) => block.type === "heading")
        .map((block) => (block.type === "heading" ? block.inlines[0] : null))
        .filter(Boolean)
        .map((node) => (node && "value" in node ? node.value : "")),
    ).toEqual(["Inside the Agentic Brain", ...CANONICAL_NARRATIVE_SPINE.map((chapter) => chapter.title)]);
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
      title: "Inside the Agentic Brain",
      description: "A presentation-style story explaining the planner, grounder, and action loop inside an AI agent.",
    });
  });

  it("defines a deterministic narrative spine for the canonical route", () => {
    expect(CANONICAL_NARRATIVE_SPINE.map((chapter) => chapter.key)).toEqual([
      "intent",
      "planning",
      "grounding",
      "execution",
      "outcome",
    ]);
  });

  it("groups the canonical presentation body into an outline and chapter sections", () => {
    const pageModel = createContentRoutePageModel([CANONICAL_NARRATIVE_ROUTE]);

    if (!pageModel) {
      throw new Error("Expected a canonical route model.");
    }

    const narrative = buildPresentationNarrative(pageModel.parsedContent.blocks);

    expect(narrative.introBlocks.length).toBeGreaterThan(0);
    expect(narrative.chapters.map((chapter) => chapter.title)).toEqual(CANONICAL_NARRATIVE_SPINE.map((chapter) => chapter.title));
    expect(narrative.chapters[0]?.blocks.length).toBeGreaterThan(0);
  });
});
