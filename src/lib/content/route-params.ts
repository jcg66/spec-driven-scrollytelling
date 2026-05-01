import { normalizeSlug } from "@/lib/site-config";

import { createRouteRegistry } from "./content-repository";
import type { RouteDocument } from "./schema";

export const CONTENT_ROUTE_DYNAMIC_PARAMS = false;

export function createStaticRouteParams(documents: readonly RouteDocument[]) {
  return createRouteRegistry(documents).map((routeEntry) => ({
    slug: normalizeSlug(routeEntry.slug).split("/"),
  }));
}
