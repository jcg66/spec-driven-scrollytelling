import type { Metadata } from "next";

import { createCanonicalUrl, createImagePath } from "@/lib/site-config";

import { getRouteDocumentBySlug } from "./content-repository";
import { parseMarkdownBlocks } from "./markdown-parser";
import type { ParsedMarkdownDocument } from "./markdown-parser";
import type { RouteDocument } from "./schema";

export type NarrativeChapter = {
  key: string;
  title: string;
  summary: string;
};

export const CANONICAL_NARRATIVE_SPINE: readonly NarrativeChapter[] = [
  {
    key: "spark",
    title: "Spark",
    summary: "The story starts with a request and a single page opens around it.",
  },
  {
    key: "deconstruction",
    title: "Deconstruction",
    summary: "The request becomes smaller tasks, dependencies, and constraints.",
  },
  {
    key: "digital-eye",
    title: "Digital Eye",
    summary: "The agent reads the visible interface and stays aligned with the situation.",
  },
  {
    key: "execution-loop",
    title: "Execution Loop",
    summary: "The agent acts, checks feedback, and keeps moving.",
  },
  {
    key: "outcome",
    title: "Outcome",
    summary: "The page closes by showing the result and what the viewer should understand from it.",
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
