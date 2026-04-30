import { describe, expect, it } from "vitest";

import { CONTENT_ROUTE_DYNAMIC_PARAMS, createStaticRouteParams, listRouteDocuments } from "@/lib/content";

describe("content route param helpers", () => {
  it("disable runtime dynamic params for future content routes", () => {
    expect(CONTENT_ROUTE_DYNAMIC_PARAMS).toBe(false);
  });

  it("produce static route params from validated Markdown content", () => {
    expect(createStaticRouteParams(listRouteDocuments())).toEqual([
      {
        slug: ["inside-the-agentic-brain"],
      },
    ]);
  });
});
