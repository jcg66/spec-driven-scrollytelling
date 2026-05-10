# Project Status

This file is the lightweight checkpoint for the current implementation state. Update it whenever the active spec or sprint changes.

## Current State

| Field | Value |
|---|---|
| Phase | Spec 01 complete; Spec 02 complete; Spec 03 complete; Spec 04 complete; Spec 05 complete; Spec 06 complete; Spec 07 complete; Spec 08 complete; Spec 09 in progress; Spec 10 in progress |
| Current spec | Spec 10: Design and Layout Integration in progress |
| Current sprint | Sprint 10A ready to start |
| Next recommended spec | Spec 10: Design and Layout Integration |
| Last completed work | Implemented and verified Sprint 08B: Release Operations Runbook and Health Checks |

## Current Context

- Product: static Next.js scrollytelling site about agentic AI.
- Deployment target: GitHub Pages project site under `https://<account>.github.io/<repository>/`.
- Core delivery constraint: everything must work as a static export under a non-root base path.
- Content model direction: Markdown-first with a dedicated homepage source, routeable page sources, and separate reference-only Markdown.
- Main experience direction: one canonical single-page scrolling story plus supporting reference material.
- QA direction: verify against the exported static artifact served under the GitHub Pages-style base path.

## Active Focus

- Start `Sprint 10A: Design Token and Component Translation`.
- Keep the release-operations runbook aligned with the CI workflow, local preview command, and Pages publish path.
- Keep all route, asset, and metadata URL construction routed through `src/lib/site-config.ts`.
- Keep `npm run verify:export` as the Pages-shape smoke gate for exported artifacts.
- Keep `STATUS.md` updated as the source of truth for what is currently in progress.

## Notes

- Specs have been revised to close gaps around GitHub Pages deployment, route contracts, visualization embedding, and exported-artifact QA.
- Spec 01 sprint plan lives in `docs/project_management/sprints/01-architecture.md`.
- Spec 02 sprint plan lives in `docs/project_management/sprints/02-content-and-routing.md`.
- Sprint 01A verification passed with `npm test`, `npm run build`, and `npm run verify:export`.
- Sprint 01A QA found no blocking defects; the two carry-forward issues were centralizing metadata URL generation and reducing URL-contract drift, both addressed in Sprint 01B.
- Sprint 01B verification passed with `npm test`, `npm run build`, and `npm run verify:export`.
- Sprint 01B QA found no blocking defects; the main carry-forward gap was missing app-shell and module-boundary enforcement, addressed in Sprint 01C.
- Sprint 01C verification passed with `npm test`, `npm run build`, and `npm run verify:export`.
- Sprint 01C QA found that `tests/unit/page-layout-factory.test.tsx` was not actually executing because `vitest.config.ts` only included `*.test.ts`; that coverage gap was fixed during Sprint 01D.
- Sprint 01D verification passed with `npm test` and `npm run verify:export`.
- Sprint 01D replaced the old HTTP-only export check with a Playwright smoke test that serves `out/` under `/spec-driven-scrollytelling/`, verifies base-path-prefixed assets, and confirms static-miss recovery back to the homepage.
- Spec 01 QA against the current worktree found no blocking defects; `npm test`, `npm run build`, and `npm run verify:export` all passed when run outside the local sandbox.
- Sprint 02A QA found the expected pre-implementation gaps: homepage content was still hard-coded in TypeScript, published/reference Markdown source conventions did not exist, and there was no formal frontmatter validation layer.
- Sprint 02A implemented `content/home`, `content/pages`, and `content/reference`, added strict Markdown frontmatter validation in `src/lib/content/schema.ts`, and moved homepage loading into the Markdown-backed content repository.
- Sprint 02A verification passed with `npm test`, `npm run build`, and `npm run verify:export`.
- Sprint 02B added deterministic route-registry validation for duplicate and app-owned slugs, wired static param generation through the validated registry, and extended unit coverage for the new failure cases.
- Sprint 02B verification passed with `npm run test -- tests/unit/content-repository.test.ts tests/unit/route-params.test.ts` and `npm run build`.
- Sprint 02C added a deterministic custom Markdown parser, a single `<!-- slide -->` presentation delimiter, structured parser exports, and unit coverage for standard and presentation-page parsing.
- Sprint 02C verification passed with `npm run test -- tests/unit/content-repository.test.ts tests/unit/route-params.test.ts tests/unit/markdown-parser.test.ts` and `npm run build`.
- Sprint 02D wired a dynamic content route at `src/app/[...slug]/page.tsx`, added content-route metadata and markdown rendering helpers, extended browser coverage to a published content route, and preserved static-miss handling.
- Sprint 02D verification passed with `npm run test` and `npm run verify:export`.
- Spec 03 QA against the current worktree found that layout selection exists, but canonical route designation, chapter/sticky structure, motion-independent presentation fallback, and release-review browser coverage are still incomplete.
- Sprint 03A added an explicit canonical narrative route constant, encoded the chapter spine in the main presentation Markdown, added a supporting standard context page, linked the homepage to the canonical route, and extended tests and browser coverage.
- Sprint 03A verification passed with `npm run test` and `npm run verify:export`.
- Sprint 03B added a chapter-aware presentation renderer with outline and section landmarks, preserved standard-page rendering, and extended browser coverage to the supporting standard page.
- Sprint 03B verification passed with `npm run test` and `npm run verify:export`.
- Sprint 03-Refactor moved the canonical story surface onto the homepage, demoted the old narrative route to support content, and updated unit and browser coverage to the new public-story contract.
- Sprint 03-Refactor verification passed with `npm run test -- tests/unit/content-pages.test.ts tests/unit/content-repository.test.ts tests/unit/route-params.test.ts` and `npm run verify:export`.
- Sprint 03C added reduced-motion fallback behavior that collapses the homepage presentation into a static reading stack and verified the fallback with browser coverage.
- Sprint 03C verification passed with `npm run test -- tests/unit/content-pages.test.ts tests/unit/content-repository.test.ts tests/unit/route-params.test.ts` and `npm run verify:export`.
- Sprint 03D completed the release-review pass, kept the homepage as the public story surface, and verified homepage/support-page navigation plus static-miss handling under the exported artifact.
- Sprint 03D verification passed with `npm run test -- tests/unit/content-pages.test.ts tests/unit/content-repository.test.ts tests/unit/route-params.test.ts` and `npm run verify:export`.
- Spec 04 sprint planning now defines scroll-linked motion, sticky progression, reduced-motion fallbacks, and release-review QA as separate implementation phases.
- Sprint 04A added a shared presentation motion state helper, a client-side scene progress tracker, and a visible progress indicator on the homepage presentation flow.
- Sprint 04A verification passed with `npm run test -- tests/unit/presentation-motion.test.ts tests/unit/content-pages.test.ts`.
- Sprint 04B connected scroll position to the five-scene sequence, highlighted the active section and outline entry, and verified the exported artifact across desktop and mobile viewports.
- Sprint 04B verification passed with `npm run verify:export`.
- Sprint 04C added an explicit reduced-motion reading mode, kept the presentation readable without motion-linked updates, and verified the fallback with browser coverage.
- Sprint 04C verification passed with `npm run verify:export`.
- Sprint 04D completed the exported-artifact release review, kept the homepage story contract intact, and verified full story progression plus support-page navigation under the Pages-style base path.
- Sprint 04D verification passed with `npm run verify:export`.
- Spec 05 sprint planning now defines visual tokens, accessibility shell foundations, scene-specific treatments, and release-review QA as separate implementation phases.
- Sprint 05A added shared design tokens for color, spacing, typography, and surfaces, plus explicit fallback font stacks and a distinct type scale for narrative and technical text.
- Sprint 05A verification passed with `npm run test:e2e -- tests/browser/export-smoke.spec.ts`.
- Sprint 05B added a working skip link, a focusable main landmark, visible focus treatment, and browser coverage for the shared accessibility shell.
- Sprint 05B verification passed with `npm run test:e2e -- tests/browser/export-smoke.spec.ts`.
- Sprint 05C added scene-specific visual treatments for the five story chapters plus mobile-responsive shell refinements, and verified the exported artifact across the scene set.
- Sprint 05C verification passed with `npm run build && npm run test:e2e -- tests/browser/export-smoke.spec.ts`.
- Sprint 05D added release-review browser coverage for focus, contrast, landmarks, and support-page readability in the exported artifact.
- Sprint 05D verification passed with `npm run build && npm run test:e2e -- tests/browser/export-smoke.spec.ts`.
- Spec 06 sprint planning now defines a Markdown visualization embedding contract, reusable component library work, narrative integration, and release-review QA as separate implementation phases.
- Sprint 06A added fenced `viz:<component-id>` parser support with validated JSON payloads for the initial component set and unit coverage for supported, unsupported, and malformed blocks.
- Sprint 06A verification passed with `npm run test` and `npm run build`.
- Sprint 06B added reusable React visualization components for stat grids, timelines, event logs, capability lists, decision flows, and code samples, plus reduced-motion fallback coverage.
- Sprint 06B verification passed with `npm run test` and `npm run build`.
- Sprint 06C wired embedded visualization blocks into the shared Markdown renderer, added story-page and support-page examples, and verified them in the exported artifact.
- Sprint 06C verification passed with `npm run build` and `npm run test:e2e -- tests/browser/export-smoke.spec.ts`.
- Sprint 06D added release-review browser coverage for embedded visualizations and reduced-motion fallback states, then verified the exported artifact under the Pages-style base path.
- Sprint 06D verification passed with `npm run test:e2e -- tests/browser/export-smoke.spec.ts`.
- Spec 07 QA against the current codebase found solid unit/browser/export coverage but no lint script, no CI workflow file, no dedicated local preview workflow document, and no definition-of-done template yet.
- Spec 07 sprint plan lives in `docs/project_management/sprints/07-quality-assurance.md`.
- Sprint 07A added `lint` and `typecheck` scripts, a flat ESLint baseline, local verification guidance in the README, and a combined export gate that runs type checking, linting, build, and export smoke verification.
- Sprint 07A verification passed with `npm run typecheck`, `npm run lint`, `npm test`, and `npm run verify:export`.
- Sprint 07B added a GitHub Actions CI workflow with separate verify, build, and deploy jobs plus Pages artifact publishing.
- Sprint 07B verification passed with `npm run verify:export` under the GitHub Pages-style environment variables used by CI.
- Sprint 07B CI install steps were adjusted from `npm ci` to `npm install` after GitHub Actions reported a lockfile sync failure on the optional `@emnapi/*` dependency tree.
- Sprint 07C added a dedicated release-review browser suite that organizes routing, motion, and visualization checks by risk area.
- Sprint 07C verification passed with `npm run test:e2e -- tests/browser/release-review.spec.ts` and `npm run test:e2e`.
- Sprint 07D added a documented local preview workflow, a release-review checklist, and a reusable definition-of-done template for future specs and sprints.
- Sprint 08A added a first-class `preview:export` command, a CI artifact validation step, and documentation for the exported release path.
- Sprint 08A verification passed with `npm run verify:export` and a local `npm run preview:export` smoke run.
- Sprint 08B added a release operations runbook and linked it from the README so deployment, preview, and post-publish checks live in one place.
- Sprint 08B verification passed with a doc review against the current workflow and preview command surface.
- Spec 08 sprint plan lives in `docs/project_management/sprints/08-deployment-and-operations.md`.
- Spec 09 QA against the current worktree found that the homepage, support pages, and reference notes still reflect the earlier agentic-brain draft more than the newer action-layer script draft, so the narrative copy needs a dedicated refresh before the story can be considered aligned.
- Spec 09 sprint plan lives in `docs/project_management/sprints/09-story-content-refresh.md`.
- Spec 10 QA against the current worktree found that the advanced design language is already directionally defined in the reference materials and Spec 05, but it still needs a guarded translation into reusable tokens, scene composition, and regression hardening to avoid project drift or layout instability.
- Spec 10 sprint plan lives in `docs/project_management/sprints/10-design-and-layout-integration.md`.
