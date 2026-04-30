import { normalizeSlug } from "@/lib/site-config";

export type LayoutMode = "standard" | "presentation";

export type HomeDocument = {
  title: string;
  summary: string;
  layout: "standard";
  eyebrow: string;
  highlights: string[];
  visualization: {
    label: string;
    description: string;
  };
};

export type RouteDocument = {
  title: string;
  summary: string;
  slug: string;
  layout: LayoutMode;
};

const homeDocument: HomeDocument = {
  title: "Static Export Foundation",
  summary:
    "This bootstrap establishes the GitHub Pages deployment contract before the narrative, content system, and presentation layouts are built.",
  layout: "standard",
  eyebrow: "Sprint 01C",
  highlights: [
    "The app shell is separated from layout selection, motion primitives, and visualization components.",
    "A placeholder content repository exists so later specs can plug in Markdown-driven content without rewriting the routing surface.",
    "Static misses already resolve through a dedicated not-found page, and future content routes have a dedicated static-param helper ready for Spec 02.",
  ],
  visualization: {
    label: "Architecture Seam",
    description:
      "Visualization components will mount inside layout-controlled content regions once Spec 06 adds the Markdown embedding contract.",
  },
};

const routeDocuments: RouteDocument[] = [];

export function getHomeDocument(): HomeDocument {
  return homeDocument;
}

export function listRouteDocuments(): RouteDocument[] {
  return routeDocuments;
}

export function getRouteDocumentBySlug(slugSegments: string[]): RouteDocument | null {
  const normalizedSlug = normalizeSlug(slugSegments.join("/"));

  return routeDocuments.find((document) => normalizeSlug(document.slug) === normalizedSlug) ?? null;
}
