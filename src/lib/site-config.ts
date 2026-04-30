export const REPOSITORY_NAME = "spec-driven-scrollytelling";
export const DEFAULT_BASE_PATH = `/${REPOSITORY_NAME}`;
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

export function getConfiguredBasePath(env: NodeJS.ProcessEnv = process.env): string {
  return normalizeBasePath(env.NEXT_PUBLIC_BASE_PATH ?? env.BASE_PATH) || DEFAULT_BASE_PATH;
}
