"use client";

import { useEffect, useState, type CSSProperties } from "react";

import { createPresentationMotionState, type PresentationMotionChapter } from "./presentation-motion";

type PresentationMotionTrackerProps = {
  chapters: PresentationMotionChapter[];
  containerId: string;
};

export function PresentationMotionTracker({ chapters, containerId }: PresentationMotionTrackerProps) {
  const [activeChapterId, setActiveChapterId] = useState<string | null>(chapters[0]?.id ?? null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updatePreference = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };

    updatePreference();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", updatePreference);

      return () => mediaQuery.removeEventListener("change", updatePreference);
    }

    mediaQuery.addListener(updatePreference);

    return () => mediaQuery.removeListener(updatePreference);
  }, []);

  useEffect(() => {
    const container = document.getElementById(containerId);

    if (!container) {
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

    const getChapterIdFromHash = () => {
      const hash = window.location.hash.replace(/^#/, "");

      if (!hash) {
        return null;
      }

      const matchingChapter = chapters.find((chapter) => chapter.id === hash);

      return matchingChapter?.id ?? null;
    };

    if (prefersReducedMotion) {
      const updateFromHash = () => {
        const chapterId = getChapterIdFromHash() ?? chapters[0]?.id ?? null;

        syncActiveSectionState(chapterId);
        setActiveChapterId((current) => (current === chapterId ? current : chapterId));
      };

      updateFromHash();
      window.addEventListener("hashchange", updateFromHash);

      return () => {
        window.removeEventListener("hashchange", updateFromHash);
      };
    }

    let frameId: number | null = null;

    const updateActiveChapter = () => {
      const hashChapterId = getChapterIdFromHash();

      if (hashChapterId) {
        syncActiveSectionState(hashChapterId);
        setActiveChapterId((current) => (current === hashChapterId ? current : hashChapterId));

        return;
      }

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
    window.addEventListener("hashchange", scheduleUpdate);

    return () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }

      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("hashchange", scheduleUpdate);
    };
  }, [chapters, containerId, prefersReducedMotion]);

  const motionState = createPresentationMotionState(chapters, activeChapterId);

  if (motionState.totalChapters === 0) {
    return null;
  }

  const progressBarStyle = {
    "--presentation-progress": `${motionState.progressValue}%`,
  } as CSSProperties;

  const motionModeLabel = prefersReducedMotion ? "Reading mode" : "Scroll-linked motion";
  const motionModeDescription = prefersReducedMotion
    ? "Reduced motion is enabled. Use the chapter links to move through the story without motion-linked updates."
    : motionState.progressDescription;

  return (
    <>
      <section className="presentationMotion" aria-label="Story progress" aria-live="polite" data-motion-mode={prefersReducedMotion ? "reduced" : "scroll"}>
        <p className="presentationMotionLabel">{motionModeLabel}</p>
        <p className="presentationMotionStatus">{motionState.progressLabel}</p>
        <p className="presentationMotionDescription">{motionModeDescription}</p>
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