import { describe, expect, it } from "vitest";

import { DEFAULT_BASE_PATH, getConfiguredBasePath, normalizeBasePath } from "@/lib/site-config";

describe("normalizeBasePath", () => {
  it("returns an empty string for root-like values", () => {
    expect(normalizeBasePath()).toBe("");
    expect(normalizeBasePath("")).toBe("");
    expect(normalizeBasePath("/")).toBe("");
  });

  it("adds a leading slash and removes trailing slashes", () => {
    expect(normalizeBasePath("repo")).toBe("/repo");
    expect(normalizeBasePath("/repo/")).toBe("/repo");
    expect(normalizeBasePath(" nested/path// ")).toBe("/nested/path");
  });
});

describe("getConfiguredBasePath", () => {
  it("defaults to the repository subpath", () => {
    expect(getConfiguredBasePath({} as NodeJS.ProcessEnv)).toBe(DEFAULT_BASE_PATH);
  });

  it("prefers NEXT_PUBLIC_BASE_PATH when provided", () => {
    expect(
      getConfiguredBasePath({
        NEXT_PUBLIC_BASE_PATH: "/custom-path/",
      } as NodeJS.ProcessEnv),
    ).toBe("/custom-path");
  });

  it("falls back to BASE_PATH when NEXT_PUBLIC_BASE_PATH is absent", () => {
    expect(
      getConfiguredBasePath({
        BASE_PATH: "preview-site",
      } as NodeJS.ProcessEnv),
    ).toBe("/preview-site");
  });
});
