import fs from "node:fs";

import { normalizeSlug } from "@/lib/site-config";

import { HOME_SOURCE_PATH, listRoutePageSourcePaths } from "./source-paths";
import { type HomeDocument, type RouteDocument, validateHomeDocumentSource, validateRouteDocumentSource } from "./schema";

function readSourceFile(sourcePath: string): string {
  return fs.readFileSync(sourcePath, "utf8");
}

export function getHomeDocument(): HomeDocument {
  return validateHomeDocumentSource(readSourceFile(HOME_SOURCE_PATH), HOME_SOURCE_PATH);
}

export function listRouteDocuments(): RouteDocument[] {
  return listRoutePageSourcePaths()
    .map((sourcePath) => validateRouteDocumentSource(readSourceFile(sourcePath), sourcePath))
    .filter((document) => document.draft !== true);
}

export function getRouteDocumentBySlug(slugSegments: string[]): RouteDocument | null {
  const normalizedSlug = normalizeSlug(slugSegments.join("/"));

  return listRouteDocuments().find((document) => normalizeSlug(document.slug) === normalizedSlug) ?? null;
}
