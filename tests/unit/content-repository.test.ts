import { describe, expect, it } from "vitest";

import {
  createRouteRegistry,
  getHomeDocument,
  getRouteDocumentBySlug,
  HOME_SOURCE_PATH,
  isReferenceSourcePath,
  listPublishedContentSourcePaths,
  listReferenceSourcePaths,
  listRouteDocuments,
  listRoutePageSourcePaths,
  REFERENCE_CONTENT_DIRECTORY,
  ROUTE_PAGE_CONTENT_DIRECTORY,
  type RouteDocument,
} from "@/lib/content";

function createRouteDocument(overrides: Partial<RouteDocument> & Pick<RouteDocument, "slug" | "sourcePath">): RouteDocument {
  return {
    title: "Example",
    summary: "Example summary",
    layout: "standard",
    body: "Example body",
    ...overrides,
  };
}

describe("content repository seams", () => {
  it("loads the homepage from the dedicated Markdown source", () => {
    const document = getHomeDocument();

    expect(document.layout).toBe("presentation");
    expect(document.highlights.length).toBeGreaterThan(0);
    expect(document.visualization.label).toBe("Agent Core Overview");
    expect(document.sourcePath).toBe(HOME_SOURCE_PATH);
    expect(document.body).toContain("The homepage is the canonical public story route.");
  });

  it("keeps homepage, routeable pages, and reference sources separate", () => {
    const publishedPaths = listPublishedContentSourcePaths();
    const routePagePaths = listRoutePageSourcePaths();
    const referencePaths = listReferenceSourcePaths();

    expect(publishedPaths).toContain(HOME_SOURCE_PATH);
    expect(routePagePaths.every((sourcePath) => sourcePath.startsWith(ROUTE_PAGE_CONTENT_DIRECTORY))).toBe(true);
    expect(referencePaths.every((sourcePath) => sourcePath.startsWith(REFERENCE_CONTENT_DIRECTORY))).toBe(true);
    expect(publishedPaths.some((sourcePath) => isReferenceSourcePath(sourcePath))).toBe(false);
  });

  it("filters draft route pages out of the public registry", () => {
    const routePagePaths = listRoutePageSourcePaths();
    const documents = listRouteDocuments();

    expect(routePagePaths.some((sourcePath) => sourcePath.endsWith("draft-story.md"))).toBe(true);
    expect(documents).toHaveLength(2);
    expect(documents.map((document) => document.slug)).toEqual(["agentic-ai-context", "inside-the-agentic-brain"]);
  });

  it("loads routeable documents from published Markdown sources only", () => {
    const documents = listRouteDocuments();

    expect(documents).toHaveLength(2);
    expect(documents[0]?.slug).toBe("agentic-ai-context");
    expect(documents[0]?.layout).toBe("standard");
    expect(documents[1]?.slug).toBe("inside-the-agentic-brain");
    expect(documents[1]?.layout).toBe("standard");
    expect(getRouteDocumentBySlug(["inside-the-agentic-brain"])?.title).toBe("Story Guide");
    expect(getRouteDocumentBySlug(["future", "page"])).toBeNull();
  });

  it("orders the route registry deterministically by slug", () => {
    const registry = createRouteRegistry([
      createRouteDocument({ slug: "zeta/last", sourcePath: "content/pages/zeta-last.md" }),
      createRouteDocument({ slug: "alpha/first", sourcePath: "content/pages/alpha-first.md" }),
    ]);

    expect(registry.map((routeEntry) => routeEntry.slug)).toEqual(["alpha/first", "zeta/last"]);
  });

  it("rejects duplicate route slugs", () => {
    expect(() =>
      createRouteRegistry([
        createRouteDocument({ slug: "stories/agent-loop", sourcePath: "content/pages/first.md" }),
        createRouteDocument({ slug: "stories/agent-loop", sourcePath: "content/pages/second.md" }),
      ]),
    ).toThrow(/Route slug "stories\/agent-loop" duplicates/);
  });

  it("rejects app-owned route slugs", () => {
    expect(() =>
      createRouteRegistry([createRouteDocument({ slug: "404", sourcePath: "content/pages/not-found.md" })]),
    ).toThrow(/Route slug "404" is reserved for app-owned routes\./);
  });
});
