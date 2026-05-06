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

    const syncActiveSectionState = (chapterId: string | null) => {
      for (const section of sectionElements) {
        const isActive = section.id === chapterId;

        if (isActive) {
          section.dataset.active = "true";
        } else {
          delete section.dataset.active;
        }
      }
    };

    let frameId: number | null = null;

    const updateActiveChapter = () => {
      const viewportCenter = window.innerHeight / 2;
      let bestChapterId: string | null = null;
      let bestDistance = Number.POSITIVE_INFINITY;

      for (const section of sectionElements) {
        const sectionRect = section.getBoundingClientRect();

        if (sectionRect.bottom <= 0 || sectionRect.top >= window.innerHeight) {
          continue;
        }

        const sectionCenter = sectionRect.top + sectionRect.height / 2;
        const distanceToCenter = Math.abs(sectionCenter - viewportCenter);

        if (distanceToCenter < bestDistance) {
          bestDistance = distanceToCenter;
          bestChapterId = section.id;
        }
      }

      if (bestChapterId) {
        syncActiveSectionState(bestChapterId);
        setActiveChapterId((current) => (current === bestChapterId ? current : bestChapterId));
      }
    };

    syncActiveSectionState(activeChapterId);

    const scheduleUpdate = () => {
      if (frameId !== null) {
        return;
      }

      frameId = window.requestAnimationFrame(() => {
        frameId = null;
        updateActiveChapter();
      });
    };

    updateActiveChapter();

    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }

      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
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
          aria-label="Story progress"
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