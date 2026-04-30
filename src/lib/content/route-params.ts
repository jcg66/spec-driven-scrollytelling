import { normalizeSlug } from "@/lib/site-config";

import type { RouteDocument } from "./schema";

export const CONTENT_ROUTE_DYNAMIC_PARAMS = false;

export function createStaticRouteParams(documents: readonly RouteDocument[]) {
  return documents.map((document) => ({
    slug: normalizeSlug(document.slug).split("/"),
  }));
}
