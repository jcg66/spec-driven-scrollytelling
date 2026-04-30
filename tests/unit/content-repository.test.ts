import { describe, expect, it } from "vitest";

import {
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
} from "@/lib/content";

describe("content repository seams", () => {
  it("loads the homepage from the dedicated Markdown source", () => {
    const document = getHomeDocument();

    expect(document.layout).toBe("standard");
    expect(document.highlights.length).toBeGreaterThan(0);
    expect(document.visualization.label).toBe("Content Contract");
    expect(document.sourcePath).toBe(HOME_SOURCE_PATH);
    expect(document.body).toContain("Spec 02A establishes the authoring contract");
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

  it("loads routeable documents from published Markdown sources only", () => {
    const documents = listRouteDocuments();

    expect(documents).toHaveLength(1);
    expect(documents[0]?.slug).toBe("inside-the-agentic-brain");
    expect(documents[0]?.layout).toBe("presentation");
    expect(getRouteDocumentBySlug(["inside-the-agentic-brain"])?.title).toBe("Inside the Agentic Brain");
    expect(getRouteDocumentBySlug(["future", "page"])).toBeNull();
  });
});
