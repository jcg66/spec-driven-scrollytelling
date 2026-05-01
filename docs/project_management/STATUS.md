# Project Status

This file is the lightweight checkpoint for the current implementation state. Update it whenever the active spec or sprint changes.

## Current State

| Field | Value |
|---|---|
| Phase | Spec 01 complete; Spec 02 in progress |
| Current spec | Spec 02: Content and Routing in progress |
| Current sprint | Sprint 02C complete |
| Next recommended spec | Spec 02: Content and Routing |
| Last completed work | Implemented and verified Sprint 02C: Markdown Parsing and Presentation Segmentation |

## Current Context

- Product: static Next.js scrollytelling site about agentic AI.
- Deployment target: GitHub Pages project site under `https://<account>.github.io/<repository>/`.
- Core delivery constraint: everything must work as a static export under a non-root base path.
- Content model direction: Markdown-first with a dedicated homepage source, routeable page sources, and separate reference-only Markdown.
- Main experience direction: one canonical presentation-style scrollytelling route plus supporting standard pages.
- QA direction: verify against the exported static artifact served under the GitHub Pages-style base path.

## Active Focus

- Start `Sprint 02D: App Router Integration for Content-Driven Pages`.
- Keep all route, asset, and metadata URL construction routed through `src/lib/site-config.ts`.
- Keep homepage, routeable-page, and reference-source Markdown boundaries explicit as Spec 02 expands.
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

