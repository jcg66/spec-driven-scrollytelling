import type { Metadata } from "next";

import { createCanonicalUrl, createImagePath } from "@/lib/site-config";

import { getRouteDocumentBySlug } from "./content-repository";
import { parseMarkdownBlocks } from "./markdown-parser";
import type { ParsedMarkdownDocument } from "./markdown-parser";
import type { RouteDocument } from "./schema";

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
