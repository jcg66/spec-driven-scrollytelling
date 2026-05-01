import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AppShell } from "@/components/app/AppShell";
import { PresentationContent } from "@/components/content/PresentationContent";
import { MarkdownContent } from "@/components/content/MarkdownContent";
import { PageLayoutFactory } from "@/components/layouts";
import { createContentRouteMetadata, createContentRoutePageModel, createStaticRouteParams, listRouteDocuments } from "@/lib/content";
import { createRoutePath } from "@/lib/site-config";

type ContentRoutePageProps = {
  params: Promise<{
    slug: string[];
  }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  return createStaticRouteParams(listRouteDocuments());
}

export async function generateMetadata({ params }: ContentRoutePageProps): Promise<Metadata> {
  const { slug } = await params;
  const pageModel = createContentRoutePageModel(slug);

  if (!pageModel) {
    notFound();
  }

  return createContentRouteMetadata(pageModel.document);
}

export default async function ContentRoutePage({ params }: ContentRoutePageProps) {
  const { slug } = await params;
  const pageModel = createContentRoutePageModel(slug);

  if (!pageModel) {
    notFound();
  }

  return (
    <AppShell>
      <PageLayoutFactory
        layout={pageModel.document.layout}
        title={pageModel.document.title}
        summary={pageModel.document.summary}
      >
        {pageModel.document.layout === "presentation" ? (
          <PresentationContent blocks={pageModel.parsedContent.blocks} />
        ) : (
          <MarkdownContent blocks={pageModel.parsedContent.blocks} />
        )}
        <p>
          <a href={createRoutePath()}>Return Home</a>
        </p>
      </PageLayoutFactory>
    </AppShell>
  );
}
