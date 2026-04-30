import { describe, expect, it } from "vitest";

import { getHomeDocument, getRouteDocumentBySlug, listRouteDocuments } from "@/lib/content";

describe("content repository seams", () => {
  it("returns a stable home document for the app shell", () => {
    const document = getHomeDocument();

    expect(document.layout).toBe("standard");
    expect(document.highlights.length).toBeGreaterThan(0);
    expect(document.visualization.label).toBe("Architecture Seam");
  });

  it("exposes no route documents before Spec 02 content wiring begins", () => {
    expect(listRouteDocuments()).toEqual([]);
    expect(getRouteDocumentBySlug(["future", "page"])).toBeNull();
  });
});
