import { describe, expect, it } from "vitest";

import { CONTENT_ROUTE_DYNAMIC_PARAMS, createStaticRouteParams, listRouteDocuments, type RouteDocument } from "@/lib/content";

function createRouteDocument(overrides: Partial<RouteDocument> & Pick<RouteDocument, "slug" | "sourcePath">): RouteDocument {
  return {
    title: "Example",
    summary: "Example summary",
    layout: "standard",
    body: "Example body",
    ...overrides,
  };
}

describe("content route param helpers", () => {
  it("disable runtime dynamic params for future content routes", () => {
    expect(CONTENT_ROUTE_DYNAMIC_PARAMS).toBe(false);
  });

  it("produce static route params from validated Markdown content", () => {
    expect(createStaticRouteParams(listRouteDocuments())).toEqual([
      {
        slug: ["agentic-ai-context"],
      },
      {
        slug: ["inside-the-agentic-brain"],
      },
    ]);
  });

  it("rejects duplicate route slugs before static generation", () => {
    expect(() =>
      createStaticRouteParams([
        createRouteDocument({ slug: "stories/agent-loop", sourcePath: "content/pages/first.md" }),
        createRouteDocument({ slug: "stories/agent-loop", sourcePath: "content/pages/second.md" }),
      ]),
    ).toThrow(/Route slug "stories\/agent-loop" duplicates/);
  });

  it("rejects app-owned route slugs before static generation", () => {
    expect(() =>
      createStaticRouteParams([createRouteDocument({ slug: "404", sourcePath: "content/pages/not-found.md" })]),
    ).toThrow(/Route slug "404" is reserved for app-owned routes\./);
  });
});
