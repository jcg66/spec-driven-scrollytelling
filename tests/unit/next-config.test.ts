import { describe, expect, it } from "vitest";

import { createNextConfig } from "../../next.config";

describe("createNextConfig", () => {
  it("produces a GitHub Pages-safe export configuration", () => {
    const config = createNextConfig("/spec-driven-scrollytelling");

    expect(config.output).toBe("export");
    expect(config.trailingSlash).toBe(true);
    expect(config.images).toEqual({ unoptimized: true });
    expect(config.basePath).toBe("/spec-driven-scrollytelling");
    expect(config.assetPrefix).toBe("/spec-driven-scrollytelling");
  });

  it("omits basePath and assetPrefix for root deployments", () => {
    const config = createNextConfig("");

    expect(config.basePath).toBeUndefined();
    expect(config.assetPrefix).toBeUndefined();
  });
});
