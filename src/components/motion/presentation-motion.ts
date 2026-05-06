export type PresentationMotionChapter = {
  id: string;
  title: string;
};

export type PresentationMotionState = {
  activeChapterId: string | null;
  activeChapterIndex: number;
  activeChapterTitle: string;
  progressDescription: string;
  progressLabel: string;
  progressValue: number;
  totalChapters: number;
};

function clampIndex(value: number, maximumIndex: number): number {
  if (maximumIndex < 0) {
    return 0;
  }

  return Math.min(Math.max(value, 0), maximumIndex);
}

export function createPresentationMotionState(
  chapters: PresentationMotionChapter[],
  activeChapterId: string | null = chapters[0]?.id ?? null,
): PresentationMotionState {
  if (chapters.length === 0) {
    return {
      activeChapterId: null,
      activeChapterIndex: 0,
      activeChapterTitle: "",
      progressDescription: "No scenes are available yet.",
      progressLabel: "No scene progress",
      progressValue: 0,
      totalChapters: 0,
    };
  }

  const resolvedIndex = clampIndex(
    chapters.findIndex((chapter) => chapter.id === activeChapterId),
    chapters.length - 1,
  );
  const activeChapter = chapters[resolvedIndex];

  return {
    activeChapterId: activeChapter.id,
    activeChapterIndex: resolvedIndex,
    activeChapterTitle: activeChapter.title,
    progressDescription: `${activeChapter.title} is the active scene.`,
    progressLabel: `Scene ${resolvedIndex + 1} of ${chapters.length}`,
    progressValue: Math.round(((resolvedIndex + 1) / chapters.length) * 100),
    totalChapters: chapters.length,
  };
}