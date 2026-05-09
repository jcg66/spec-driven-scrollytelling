import { describe, expect, it } from "vitest";

import {
  createAssetPath,
  createCanonicalUrl,
  createImagePath,
  createMetadataUrl,
  createRoutePath,
  DEFAULT_BASE_PATH,
  DEFAULT_SITE_ORIGIN,
  getConfiguredBasePath,
  getConfiguredSiteOrigin,
  normalizeAssetPath,
  normalizeBasePath,
  normalizeSiteOrigin,
  normalizeSlug,
} from "@/lib/site-config";

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

describe("normalizeSlug", () => {
  it("returns an empty string for root-like values", () => {
    expect(normalizeSlug()).toBe("");
    expect(normalizeSlug("")).toBe("");
    expect(normalizeSlug("/")).toBe("");
  });

  it("removes leading and trailing slashes and collapses doubles", () => {
    expect(normalizeSlug("chapter-one")).toBe("chapter-one");
    expect(normalizeSlug("/chapter-one/")).toBe("chapter-one");
    expect(normalizeSlug(" section//part-2/ ")).toBe("section/part-2");
  });
});

describe("normalizeAssetPath", () => {
  it("normalizes leading slashes for asset references", () => {
    expect(normalizeAssetPath("images/hero.png")).toBe("/images/hero.png");
    expect(normalizeAssetPath("/images/hero.png")).toBe("/images/hero.png");
  });

  it("rejects empty asset paths", () => {
    expect(() => normalizeAssetPath("   ")).toThrow("Asset path cannot be empty.");
  });
});

describe("normalizeSiteOrigin", () => {
  it("defaults to the placeholder origin", () => {
    expect(normalizeSiteOrigin()).toBe(DEFAULT_SITE_ORIGIN);
  });

  it("strips paths from configured origins", () => {
    expect(normalizeSiteOrigin("https://demo.github.io/some/path/")).toBe("https://demo.github.io");
  });
});

describe("getConfiguredBasePath", () => {
  it("defaults to the repository subpath", () => {
    expect(getConfiguredBasePath({} as NodeJS.ProcessEnv)).toBe(DEFAULT_BASE_PATH);
  });

  it("prefers NEXT_PUBLIC_BASE_PATH when provided", () => {
    const env = {
      NODE_ENV: "test",
      NEXT_PUBLIC_BASE_PATH: "/custom-path/",
    };

    expect(
      getConfiguredBasePath(env as NodeJS.ProcessEnv),
    ).toBe("/custom-path");
  });

  it("falls back to BASE_PATH when NEXT_PUBLIC_BASE_PATH is absent", () => {
    const env = {
      NODE_ENV: "test",
      BASE_PATH: "preview-site",
    };

    expect(
      getConfiguredBasePath(env as NodeJS.ProcessEnv),
    ).toBe("/preview-site");
  });
});

describe("getConfiguredSiteOrigin", () => {
  it("defaults to the placeholder site origin", () => {
    expect(getConfiguredSiteOrigin({} as NodeJS.ProcessEnv)).toBe(DEFAULT_SITE_ORIGIN);
  });

  it("prefers NEXT_PUBLIC_SITE_ORIGIN when provided", () => {
    const env = {
      NODE_ENV: "test",
      NEXT_PUBLIC_SITE_ORIGIN: "https://course-site.github.io",
    };

    expect(
      getConfiguredSiteOrigin(env as NodeJS.ProcessEnv),
    ).toBe("https://course-site.github.io");
  });
});

describe("createRoutePath", () => {
  it("creates repository-prefixed homepage and content routes", () => {
    expect(createRoutePath()).toBe("/spec-driven-scrollytelling/");
    expect(createRoutePath("chapters/intro")).toBe("/spec-driven-scrollytelling/chapters/intro/");
  });

  it("supports root deployments when the base path is empty", () => {
    expect(createRoutePath("chapters/intro", "")).toBe("/chapters/intro/");
  });
});

describe("createAssetPath", () => {
  it("prefixes static assets with the configured base path", () => {
    expect(createAssetPath("images/hero.png")).toBe("/spec-driven-scrollytelling/images/hero.png");
    expect(createImagePath("/images/hero.png")).toBe("/spec-driven-scrollytelling/images/hero.png");
  });

  it("supports root deployments when the base path is empty", () => {
    expect(createAssetPath("images/hero.png", "")).toBe("/images/hero.png");
  });
});

describe("createMetadataUrl", () => {
  it("builds absolute URLs from the configured origin and base path", () => {
    expect(
      createMetadataUrl("chapters/intro", {
        basePath: "/preview-site",
        siteOrigin: "https://demo.github.io",
      }).toString(),
    ).toBe("https://demo.github.io/preview-site/chapters/intro/");
  });
});

describe("createCanonicalUrl", () => {
  it("returns a canonical string URL for the homepage", () => {
    expect(
      createCanonicalUrl(undefined, {
        basePath: "/preview-site",
        siteOrigin: "https://demo.github.io",
      }),
    ).toBe("https://demo.github.io/preview-site/");
  });
});
