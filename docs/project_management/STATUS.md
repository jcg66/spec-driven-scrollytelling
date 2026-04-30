# Project Status

This file is the lightweight checkpoint for the current implementation state. Update it whenever the active spec or sprint changes.

## Current State

| Field | Value |
|---|---|
| Phase | Spec 01 complete; Spec 02 planned and ready to start |
| Current spec | Spec 02: Content and Routing ready |
| Current sprint | Sprint 02A ready to start |
| Next recommended spec | Spec 02: Content and Routing |
| Last completed work | QA'd Spec 01 and created the Spec 02 sprint plan |

## Current Context

- Product: static Next.js scrollytelling site about agentic AI.
- Deployment target: GitHub Pages project site under `https://<account>.github.io/<repository>/`.
- Core delivery constraint: everything must work as a static export under a non-root base path.
- Content model direction: Markdown-first with a dedicated homepage source plus frontmatter-driven routeable pages.
- Main experience direction: one canonical presentation-style scrollytelling route plus supporting standard pages.
- QA direction: verify against the exported static artifact served under the GitHub Pages-style base path.

## Active Focus

- Start `Sprint 02A: Content Sources and Frontmatter Schema`.
- Keep all route, asset, and metadata URL construction routed through `src/lib/site-config.ts`.
- Keep homepage content separate from routeable page content as Spec 02 is implemented.
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
