import fs from "node:fs";

import { normalizeSlug } from "@/lib/site-config";

import { HOME_SOURCE_PATH, listRoutePageSourcePaths } from "./source-paths";
import { type HomeDocument, type RouteDocument, validateHomeDocumentSource, validateRouteDocumentSource } from "./schema";

const RESERVED_ROUTE_SLUGS = new Set(["404"]);

export type RouteRegistryEntry = {
  document: RouteDocument;
  slug: string;
};

function readSourceFile(sourcePath: string): string {
  return fs.readFileSync(sourcePath, "utf8");
}

export function getHomeDocument(): HomeDocument {
  return validateHomeDocumentSource(readSourceFile(HOME_SOURCE_PATH), HOME_SOURCE_PATH);
}

function createContentError(sourcePath: string, message: string): Error {
  return new Error(`${sourcePath}: ${message}`);
}

export function createRouteRegistry(documents: readonly RouteDocument[]): RouteRegistryEntry[] {
  const routeEntries = documents
    .map((document) => ({
      document,
      slug: normalizeSlug(document.slug),
    }))
    .sort((leftEntry, rightEntry) => {
      const slugComparison = leftEntry.slug.localeCompare(rightEntry.slug);

      if (slugComparison !== 0) {
        return slugComparison;
      }

      return leftEntry.document.sourcePath.localeCompare(rightEntry.document.sourcePath);
    });

  const registry = new Map<string, RouteRegistryEntry>();

  for (const routeEntry of routeEntries) {
    if (RESERVED_ROUTE_SLUGS.has(routeEntry.slug)) {
      throw createContentError(routeEntry.document.sourcePath, `Route slug "${routeEntry.slug}" is reserved for app-owned routes.`);
    }

    const existingEntry = registry.get(routeEntry.slug);

    if (existingEntry) {
      throw createContentError(
        routeEntry.document.sourcePath,
        `Route slug "${routeEntry.slug}" duplicates ${existingEntry.document.sourcePath}.`,
      );
    }

    registry.set(routeEntry.slug, routeEntry);
  }

  return [...registry.values()];
}

export function listRouteDocuments(): RouteDocument[] {
  const routeDocuments = listRoutePageSourcePaths()
    .map((sourcePath) => validateRouteDocumentSource(readSourceFile(sourcePath), sourcePath))
    .filter((document) => document.draft !== true);

  return createRouteRegistry(routeDocuments).map((routeEntry) => routeEntry.document);
}

export function getRouteDocumentBySlug(slugSegments: string[]): RouteDocument | null {
  const normalizedSlug = normalizeSlug(slugSegments.join("/"));

  return listRouteDocuments().find((document) => normalizeSlug(document.slug) === normalizedSlug) ?? null;
}
