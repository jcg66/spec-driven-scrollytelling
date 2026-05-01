import type { Metadata } from "next";

import { createCanonicalUrl, createImagePath } from "@/lib/site-config";

import { getRouteDocumentBySlug } from "./content-repository";
import { parseMarkdownBlocks } from "./markdown-parser";
import type { ParsedMarkdownDocument } from "./markdown-parser";
import type { RouteDocument } from "./schema";

export const CANONICAL_NARRATIVE_ROUTE = "inside-the-agentic-brain";

export type NarrativeChapter = {
  key: string;
  title: string;
  summary: string;
};

export const CANONICAL_NARRATIVE_SPINE: readonly NarrativeChapter[] = [
  {
    key: "intent",
    title: "User Intent",
    summary: "The story starts with a request and the goal the agent has to satisfy.",
  },
  {
    key: "planning",
    title: "Planning",
    summary: "The agent breaks the request into a sequence of decisions and constraints.",
  },
  {
    key: "grounding",
    title: "Visual Grounding",
    summary: "The narrative shows how the agent aligns what it plans with what it can observe.",
  },
  {
    key: "execution",
    title: "Execution",
    summary: "The agent acts in the environment and uses feedback to keep moving.",
  },
  {
    key: "outcome",
    title: "Outcome",
    summary: "The route closes by showing the result and what the viewer should understand from it.",
  },
] as const;

export type ContentRoutePageModel = {
  document: RouteDocument;
  parsedContent: ParsedMarkdownDocument;
  metadata: Metadata;
};

export function createContentRouteMetadata(
  document: RouteDocument,
  options?: {
    basePath?: string;
    siteOrigin?: string;
  },
): Metadata {
  const pageTitle = document.seoTitle ?? document.title;
  const pageDescription = document.seoDescription ?? document.summary;
  const canonicalUrl = createCanonicalUrl(document.slug, options);
  const heroImageUrl = document.heroImage ? createImagePath(document.heroImage, options?.basePath) : undefined;

  return {
    title: pageTitle,
    description: pageDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: canonicalUrl,
      images: heroImageUrl
        ? [
            {
              url: heroImageUrl,
              alt: document.title,
            },
          ]
        : undefined,
    },
  };
}

export function createContentRoutePageModel(
  slugSegments: string[],
  options?: {
    basePath?: string;
    siteOrigin?: string;
  },
): ContentRoutePageModel | null {
  const document = getRouteDocumentBySlug(slugSegments);

  if (!document) {
    return null;
  }

  return {
    document,
    parsedContent: parseMarkdownBlocks(document.body),
    metadata: createContentRouteMetadata(document, options),
  };
}

export function getCanonicalNarrativeRouteDocument() {
  return getRouteDocumentBySlug([CANONICAL_NARRATIVE_ROUTE]);
}
