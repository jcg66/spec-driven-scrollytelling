export const REPOSITORY_NAME = "spec-driven-scrollytelling";
export const DEFAULT_BASE_PATH = `/${REPOSITORY_NAME}`;
export const DEFAULT_SITE_ORIGIN = "https://example.github.io";
export const PRODUCTION_URL_SHAPE = `https://<account>.github.io/${REPOSITORY_NAME}/`;

export function normalizeBasePath(input?: string | null): string {
  if (!input) {
    return "";
  }

  const trimmed = input.trim();

  if (!trimmed || trimmed === "/") {
    return "";
  }

  const withLeadingSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;

  return withLeadingSlash.replace(/\/+$/, "");
}

export function normalizeSlug(input?: string | null): string {
  if (!input) {
    return "";
  }

  return input
    .trim()
    .replace(/^\/+/, "")
    .replace(/\/+$/, "")
    .replace(/\/{2,}/g, "/");
}

export function normalizeAssetPath(input: string): string {
  const trimmed = input.trim();

  if (!trimmed) {
    throw new Error("Asset path cannot be empty.");
  }

  return `/${trimmed.replace(/^\/+/, "")}`;
}

export function normalizeSiteOrigin(input?: string | null): string {
  const candidate = input?.trim() || DEFAULT_SITE_ORIGIN;
  const parsed = new URL(candidate);

  return parsed.origin;
}

export function getConfiguredBasePath(env: NodeJS.ProcessEnv = process.env): string {
  return normalizeBasePath(env.NEXT_PUBLIC_BASE_PATH ?? env.BASE_PATH) || DEFAULT_BASE_PATH;
}

export function getConfiguredSiteOrigin(env: NodeJS.ProcessEnv = process.env): string {
  return normalizeSiteOrigin(env.NEXT_PUBLIC_SITE_ORIGIN ?? env.SITE_ORIGIN);
}

export function createRoutePath(slug?: string | null, basePath = getConfiguredBasePath()): string {
  const normalizedBasePath = normalizeBasePath(basePath);
  const normalizedSlug = normalizeSlug(slug);
  const routePath = normalizedSlug ? `/${normalizedSlug}/` : "/";

  return normalizedBasePath ? `${normalizedBasePath}${routePath}` : routePath;
}

export function createAssetPath(assetPath: string, basePath = getConfiguredBasePath()): string {
  const normalizedBasePath = normalizeBasePath(basePath);
  const normalizedAssetPath = normalizeAssetPath(assetPath);

  return normalizedBasePath ? `${normalizedBasePath}${normalizedAssetPath}` : normalizedAssetPath;
}

export function createImagePath(assetPath: string, basePath = getConfiguredBasePath()): string {
  return createAssetPath(assetPath, basePath);
}

export function createMetadataUrl(
  slug?: string | null,
  options?: {
    basePath?: string;
    siteOrigin?: string;
  },
): URL {
  const pathname = createRoutePath(slug, options?.basePath);
  const origin = normalizeSiteOrigin(options?.siteOrigin);

  return new URL(pathname, `${origin}/`);
}

export function createCanonicalUrl(
  slug?: string | null,
  options?: {
    basePath?: string;
    siteOrigin?: string;
  },
): string {
  return createMetadataUrl(slug, options).toString();
}
