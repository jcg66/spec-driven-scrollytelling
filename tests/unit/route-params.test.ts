import { describe, expect, it } from "vitest";

import { CONTENT_ROUTE_DYNAMIC_PARAMS, createStaticRouteParams, listRouteDocuments } from "@/lib/content";

describe("content route param helpers", () => {
  it("disable runtime dynamic params for future content routes", () => {
    expect(CONTENT_ROUTE_DYNAMIC_PARAMS).toBe(false);
  });

  it("produce no route params before content pages exist", () => {
    expect(createStaticRouteParams(listRouteDocuments())).toEqual([]);
  });
});
