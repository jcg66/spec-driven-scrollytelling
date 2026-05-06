"use client";

import { useEffect, useState, type CSSProperties } from "react";

import { createPresentationMotionState, type PresentationMotionChapter } from "./presentation-motion";

type PresentationMotionTrackerProps = {
  chapters: PresentationMotionChapter[];
  containerId: string;
};

export function PresentationMotionTracker({ chapters, containerId }: PresentationMotionTrackerProps) {
  const [activeChapterId, setActiveChapterId] = useState<string | null>(chapters[0]?.id ?? null);

  useEffect(() => {
    const container = document.getElementById(containerId);

    if (!container || typeof IntersectionObserver === "undefined") {
      return;
    }

    const sectionElements = Array.from(container.querySelectorAll<HTMLElement>(".presentationChapter"));

    if (sectionElements.length === 0) {
      return;
    }

    const visibilityByChapter = new Map<string, number>();

    const updateActiveChapter = () => {
      let bestChapterId: string | null = null;
      let bestVisibility = -1;

      for (const chapter of chapters) {
        const visibility = visibilityByChapter.get(chapter.id) ?? 0;

        if (visibility > bestVisibility) {
          bestVisibility = visibility;
          bestChapterId = chapter.id;
        }
      }

      if (bestChapterId) {
        setActiveChapterId((current) => (current === bestChapterId ? current : bestChapterId));
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const chapterId = entry.target.getAttribute("id");

          if (!chapterId) {
            continue;
          }

          visibilityByChapter.set(chapterId, entry.isIntersecting ? entry.intersectionRatio : 0);
        }

        updateActiveChapter();
      },
      {
        root: null,
        rootMargin: "-18% 0px -48% 0px",
        threshold: [0.2, 0.35, 0.5, 0.75],
      },
    );

    sectionElements.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      observer.disconnect();
    };
  }, [chapters, containerId]);

  const motionState = createPresentationMotionState(chapters, activeChapterId);

  if (motionState.totalChapters === 0) {
    return null;
  }

  const progressBarStyle = {
    "--presentation-progress": `${motionState.progressValue}%`,
  } as CSSProperties;

  return (
    <>
      <section className="presentationMotion" aria-label="Story progress" aria-live="polite">
        <p className="presentationMotionLabel">Scene progress</p>
        <p className="presentationMotionStatus">{motionState.progressLabel}</p>
        <p className="presentationMotionDescription">{motionState.progressDescription}</p>
        <div
          className="presentationMotionTrack"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={motionState.totalChapters}
          aria-valuenow={motionState.activeChapterIndex + 1}
          aria-valuetext={`${motionState.progressLabel}: ${motionState.activeChapterTitle}`}
        >
          <span className="presentationMotionFill" style={progressBarStyle} />
        </div>
      </section>

      <p className="presentationOutlineLabel">Chapters</p>
      <ol className="presentationOutlineList">
        {chapters.map((chapter, index) => {
          const isActive = chapter.id === motionState.activeChapterId;

          return (
            <li key={chapter.id} data-active={isActive ? "true" : undefined}>
              <a href={`#${chapter.id}`} aria-current={isActive ? "location" : undefined}>
                {index + 1}. {chapter.title}
              </a>
            </li>
          );
        })}
      </ol>
    </>
  );
}