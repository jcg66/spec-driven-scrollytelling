import type { ReactNode } from "react";

import type { MarkdownBlockNode, MarkdownInlineNode } from "@/lib/content";

import { MarkdownContent } from "./MarkdownContent";
import { PresentationMotionTracker } from "../motion";

type PresentationNarrativeChapter = {
  id: string;
  title: string;
  sceneKey: PresentationSceneKey;
  blocks: MarkdownBlockNode[];
};

type PresentationSceneKey =
  | "spark"
  | "deconstruction"
  | "digital-eye"
  | "execution-loop"
  | "outcome";

type PresentationNarrativeModel = {
  introBlocks: MarkdownBlockNode[];
  chapters: PresentationNarrativeChapter[];
};

type PresentationContentProps = {
  blocks: MarkdownBlockNode[];
};

const PRESENTATION_MOTION_CONTAINER_ID = "presentation-story";
const PRESENTATION_SCENE_KEYS: PresentationSceneKey[] = ["spark", "deconstruction", "digital-eye", "execution-loop", "outcome"];

function flattenInlineText(nodes: MarkdownInlineNode[]): string {
  return nodes
    .map((node) => {
      if (node.type === "text") {
        return node.value;
      }

      return flattenInlineText(node.children);
    })
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

function createChapterId(index: number, title: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `presentation-chapter-${index + 1}-${slug || "section"}`;
}

export function buildPresentationNarrative(blocks: MarkdownBlockNode[]): PresentationNarrativeModel {
  const introBlocks: MarkdownBlockNode[] = [];
  const chapters: PresentationNarrativeChapter[] = [];
  let currentChapter: PresentationNarrativeChapter | null = null;
  let skippedPageTitle = false;

  for (const block of blocks) {
    if (block.type === "heading" && block.level === 1 && !skippedPageTitle) {
      skippedPageTitle = true;
      continue;
    }

    if (block.type === "heading" && block.level >= 2) {
      const chapter: PresentationNarrativeChapter = {
        id: createChapterId(chapters.length, flattenInlineText(block.inlines)),
        title: flattenInlineText(block.inlines),
        sceneKey: PRESENTATION_SCENE_KEYS[chapters.length] ?? "outcome",
        blocks: [],
      };

      chapters.push(chapter);
      currentChapter = chapter;
      continue;
    }

    if (currentChapter) {
      currentChapter.blocks.push(block);
      continue;
    }

    introBlocks.push(block);
  }

  return {
    introBlocks,
    chapters,
  };
}

export function PresentationContent({ blocks }: PresentationContentProps): ReactNode {
  const narrative = buildPresentationNarrative(blocks);

  return (
    <div className="presentationFlow" id={PRESENTATION_MOTION_CONTAINER_ID}>
      <nav className="presentationOutline" aria-label="Chapter outline">
        <PresentationMotionTracker chapters={narrative.chapters} containerId={PRESENTATION_MOTION_CONTAINER_ID} />
      </nav>

      <div className="presentationStage">
        {narrative.introBlocks.length > 0 ? (
          <section className="presentationPrelude" aria-label="Overview">
            <MarkdownContent blocks={narrative.introBlocks} />
          </section>
        ) : null}

        {narrative.chapters.map((chapter, index) => (
          <section
            key={chapter.id}
            className="presentationChapter"
            data-scene={chapter.sceneKey}
            id={chapter.id}
            aria-labelledby={`${chapter.id}-heading`}
          >
            <p className="presentationChapterIndex">Chapter {index + 1}</p>
            <h2 className="presentationChapterHeading" id={`${chapter.id}-heading`}>
              {chapter.title}
            </h2>
            <div className="presentationChapterBody">
              <MarkdownContent blocks={chapter.blocks} />
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
