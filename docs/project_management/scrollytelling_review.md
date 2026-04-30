# Scrollytelling Spec-Driven Reference Review

## Executive Summary

`docs\_references\scrollytelling_spec_driven` is best understood as two things at once:

1. A **reference Next.js project** for a statically exported scrollytelling site.
2. A **teaching system for AI-assisted software delivery**, where the real lesson is how to manage an AI coding assistant with specs, phases, references, tests, and review gates.

The most important conclusion from the review is that the project is **stronger as a process and architecture reference than as a finished product**. Its documentation is extensive and well-structured, and it clearly defines the desired end state. The current codebase, however, is still closer to an early scaffold than to the complete feature set described in its specs.

## What the Project Is Trying to Do

The project presents itself as a scrollytelling site, but its deeper purpose is to teach a repeatable, spec-driven workflow for building software with an AI pair. The project uses the scrollytelling assignment as the vehicle and the AI collaboration model as the payload.

The core teaching idea is a three-layer system:

- `docs/_references/` provides working examples and source material.
- `docs/specs/` defines what should be built.
- `docs/phases/` defines how the work should be executed incrementally.

This makes the project notable not just as a web app, but as a structured method for controlling AI-generated code over multiple sessions.

## Key Product and Technical Features

### 1. Spec-driven AI workflow

This is the project's defining feature.

- The repo is organized around a control loop: harvest, converge, specify, phase, pre-flight QA, implementation, exit QA, and optional audit.
- It treats specs as the stable source of meaning and phases as bounded execution units.
- It emphasizes reviewability, explicit exit checks, and test-backed validation instead of trusting raw AI output.
- It includes student-facing guides, glossary material, prompt templates, and phase templates that explain how to run the workflow.

This is more mature than the application code itself. If reused, this process layer is arguably the highest-value part of the reference.

### 2. Static-export Next.js architecture

The application is built as a statically exported Next.js App Router site.

- Stack: Next.js 16, React 19, TypeScript, framer-motion, Zod, gray-matter.
- `next.config.ts` is configured for `output: "export"`.
- The app supports GitHub Pages deployment through `basePath`, `assetPrefix`, unoptimized images, and trailing slashes.
- `src/lib/site-config.ts` provides a helper for base-path-aware internal URLs.

This is a practical architecture for school projects and portfolio sites because it avoids server hosting and keeps deployment simple.

### 3. Markdown-first content model

The project is designed so that authors write content in Markdown files rather than inside JSX.

- `content/home.md` powers the homepage.
- `content/pages/*.md` powers routed pages.
- YAML frontmatter supplies `title`, `layout`, `summary`, optional SEO fields, optional hero image, and ordering metadata.
- `ContentRepository` loads files and validates frontmatter at build time.
- Zod is used to fail invalid content early rather than letting content errors surface in the browser.

This is a clean and scalable authoring model for a small static site. It lowers the barrier for adding pages while keeping structure explicit.

### 4. File-based routing with static generation

The routing model is simple and deliberate.

- `src/app/page.tsx` renders the homepage from `content/home.md`.
- `src/app/[...slug]/page.tsx` renders content pages from `content/pages/`.
- `generateStaticParams()` enumerates all page slugs at build time.
- `dynamicParams = false` ensures unknown pages fail as static misses instead of depending on runtime behavior.

This keeps the site deterministic and aligned with static export constraints.

### 5. Two intended page modes: standard and presentation

The content schema supports two page layouts:

- `standard`: long-form reading pages.
- `presentation`: sticky-slide scrollytelling pages.

The project includes a `PageLayoutFactory` that dispatches pages based on frontmatter, and the parser supports slide splitting with `---` plus image directives like:

- `![bg](...)`
- `![bg 50% 65%](...)`
- `![split](...)`
- `![split-reverse](...)`

Conceptually, this is one of the most important product features. It allows the same authoring system to support both article-style pages and slide-style narrative pages.

### 6. Intended dual-mode motion system

The motion architecture is one of the most ambitious parts of the design.

- `SlideContext` is meant to let motion components detect whether they are in a normal article or inside a presentation slide.
- `Reveal` is intended to run in two modes:
  - viewport-triggered reveal on standard pages
  - scroll-progress-linked reveal on presentation slides
- `PresentationSlide` uses a sticky-stage pattern with `useScroll` and `position: sticky`.
- The docs specify future motion primitives such as `DriftMedia`, `SceneCard`, `ParallaxBackground`, and `PresentationProgress`.
- Accessibility expectations are explicit: reduced motion should degrade to instant, readable states.

This is the most technically distinctive app-side feature in the project, even though the implementation is only partial.

### 7. Markdown-embedded visualizations

The project aims to let authors place visual components in Markdown using fenced code blocks with a language tag.

Examples of supported component tags in the current code:

- `stat-grid`
- `scroll-demo`
- `timeline`
- `progress-bar`
- `mermaid`
- `code-sample`

The `MarkdownRenderer` detects these code blocks and swaps them for React components. This is a strong idea because it preserves a Markdown authoring workflow while still allowing richer visual storytelling elements.

### 8. Image library and asset discoverability

The project includes a practical asset browser at `/images`.

- It recursively scans `public/images/`.
- It groups images by directory.
- It shows file paths and sizes.
- It explains how to reference images correctly in JSX and Markdown.
- It respects GitHub Pages base-path behavior.

This is a useful quality-of-life feature for content authors and is one of the more complete supporting features already implemented.

### 9. Testing and deployment foundations

The project includes both unit and browser testing infrastructure.

- Vitest is configured for `tests/unit/`.
- Playwright is configured for `tests/browser/`.
- Existing tests cover frontmatter schema validation, repository loading, slug handling, parser behavior, contextual links, and a few browser smoke tests.
- A GitHub Actions workflow exists for building and deploying to GitHub Pages.

This shows the repo is meant to be operationalized, not just documented.

## Current Implementation Status

The codebase and the docs are not at the same maturity level.

- `docs/phases/STATUS.md` says only **Phase 00 (Scaffold)** is complete.
- In practice, the repository already contains fragments from later phases, but those fragments are still incomplete.
- The result is a repo that has many of the right pieces, but not the full finished behavior promised by the specs.

This distinction matters. Anyone using this reference should treat it as a **partial implementation with a strong blueprint**, not as a finished drop-in scrollytelling framework.

## Important Gaps Between Spec and Reality

### 1. The design system is still transitional

The design-system spec says the project should move away from Tailwind and adopt CSS Modules plus custom tokens. That shift has not fully happened.

- `src/app/globals.css` still imports Tailwind.
- `StandardLayout.tsx` and `PresentationLayout.tsx` still use many Tailwind utility classes.
- `StandardLayout.module.css` and `PresentationLayout.module.css` are effectively placeholders.
- `src/app/layout.tsx` still uses Geist fonts rather than the documented Newsreader/Public Sans pairing.

So the design system is described in detail, but not yet implemented to the level the docs promise.

### 2. Presentation mode is not yet the real sticky-slide system

The biggest gap is in the scrollytelling experience itself.

- `PresentationLayout.tsx` currently renders more like a dark article page than a sticky-slide deck.
- It does not currently split the page body into slides with `splitMarkdownIntoSlides()`.
- It does not render `PresentationSlide` instances for each parsed fragment.
- It does not implement the documented progress bar, keyboard shortcuts, or footer gate behavior.

In other words, the most important promised front-end interaction model is specified, but not actually delivered yet.

### 3. The motion system is simplified

The motion system exists only in a reduced form.

- `Reveal.tsx` supports viewport-triggered animation.
- When `SlideContext` is present, `Reveal` currently falls back to plain rendering instead of using scroll-progress-linked animation values.
- `LayeredRevealGroup` ignores its `stagger` prop in practice because it just wraps children in identical `Reveal` components.
- The richer primitives from the spec are not present.

This means the code demonstrates the intended direction, but not the completed dual-mode motion architecture.

### 4. The Markdown renderer is custom and lightweight

The docs describe a more robust MDX-style renderer using `next-mdx-remote` and `remark-gfm`. The current implementation is more limited.

- `MarkdownRenderer.tsx` manually parses headings, paragraphs, bullet lists, links, and fenced blocks.
- It does not appear to provide the full Markdown or GFM surface described in the docs.
- It works as a scaffold, but it is not yet a full-content renderer.

This is fine for a starter implementation, but it is an important limitation if someone expects the documented content model to already be complete.

### 5. Visualization components are starter versions

The visualization system exists, but most components are lightweight placeholders rather than polished teaching widgets.

- `StatGrid`, `Timeline`, `ProgressBar`, and `CodeSample` are simple and functional.
- `ScrollDemo` currently just displays formatted text, not an actual miniature scroll-linked demo.
- `Mermaid` currently outputs a `<pre>` block rather than rendering Mermaid diagrams.

The architecture for visualization injection is useful, but several visual components have not reached the behavior described in the spec.

### 6. Tests are real but still shallow

The testing setup is solid, but current coverage is closer to smoke testing than to the full quality bar described in the testing spec.

- Browser tests currently verify that the homepage, a standard page, a presentation page, and reduced-motion rendering load.
- They do not yet verify sticky-slide progression, keyboard navigation, reveal animation behavior, footer gating, or richer accessibility scenarios.
- Unit tests cover basic repository, schema, and parser behavior, but not the full integration surface promised in the docs.

This is enough for a scaffold, but not yet enough to enforce the complete scrollytelling contract.

### 7. Deployment automation is present but not yet hardened

The GitHub Pages workflow is usable, but it is simpler than the documented target.

- The current workflow builds and deploys.
- The spec calls for a fuller pipeline with separate verify, build, e2e, and deploy stages.
- That means the deployment story is started, but not yet fully quality-gated.

## Most Valuable Reusable Ideas

If we were borrowing from this reference for our own project, the most valuable ideas are:

- The **specs + phases + reference** workflow structure.
- The **Markdown + frontmatter + Zod** content pipeline.
- The **static-export GitHub Pages** deployment model.
- The **two-layout concept** (`standard` and `presentation`).
- The **dual-mode motion architecture** as a design pattern, even though it still needs completion.
- The **fenced-code-block visualization pattern** for embedding structured visuals into Markdown.
- The `/images` asset browser as an authoring support tool.

These ideas are strong even where the implementation is incomplete.

## Overall Assessment

This reference project is strong in concept, documentation quality, and process design. It is weaker as a finished application than its own specs suggest.

Its real strengths are:

- a disciplined AI-assisted development workflow,
- a clean content-driven architecture,
- a sensible static-deployment setup,
- and a promising scrollytelling abstraction model.

Its main weakness is that the implementation has not yet caught up to the ambition of the documentation. The repo currently behaves more like a **well-documented starter scaffold** than a fully realized scrollytelling platform.

## Bottom Line

`scrollytelling_spec_driven` is a valuable reference, but it should be used carefully:

- Use it as a **process reference** with high confidence.
- Use it as an **architecture reference** with moderate confidence.
- Use it as a **finished feature reference** with caution, because several headline features are still specified more completely than they are implemented.

For our purposes, it is a strong source of patterns, structure, and workflow discipline, but not a project we should imitate blindly at the code level without checking what is actually complete.
