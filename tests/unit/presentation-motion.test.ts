import { describe, expect, it } from "vitest";

import { createPresentationMotionState } from "@/components/motion";

describe("presentation motion state", () => {
  const chapters = [
    { id: "presentation-chapter-1-spark", title: "Spark" },
    { id: "presentation-chapter-2-deconstruction", title: "Deconstruction" },
    { id: "presentation-chapter-3-digital-eye", title: "Digital Eye" },
  ];

  it("defaults to the first chapter when no active scene is provided", () => {
    expect(createPresentationMotionState(chapters)).toMatchObject({
      activeChapterId: "presentation-chapter-1-spark",
      activeChapterIndex: 0,
      activeChapterTitle: "Spark",
      progressLabel: "Scene 1 of 3",
      progressValue: 33,
      totalChapters: 3,
    });
  });

  it("clamps unknown chapters back to the start of the sequence", () => {
    expect(createPresentationMotionState(chapters, "missing-chapter")).toMatchObject({
      activeChapterId: "presentation-chapter-1-spark",
      activeChapterIndex: 0,
      activeChapterTitle: "Spark",
    });
  });

  it("tracks the active chapter when a later scene is selected", () => {
    expect(createPresentationMotionState(chapters, "presentation-chapter-3-digital-eye")).toMatchObject({
      activeChapterId: "presentation-chapter-3-digital-eye",
      activeChapterIndex: 2,
      activeChapterTitle: "Digital Eye",
      progressLabel: "Scene 3 of 3",
      progressValue: 100,
    });
  });
});