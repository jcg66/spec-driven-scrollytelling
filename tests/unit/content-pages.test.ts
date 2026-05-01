import { describe, expect, it } from "vitest";

import { createContentRouteMetadata, createContentRoutePageModel } from "@/lib/content";

describe("content route pages", () => {
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
});
