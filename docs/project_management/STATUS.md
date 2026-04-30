# Project Status

This file is the lightweight checkpoint for the current implementation state. Update it whenever the active spec or sprint changes.

## Current State

| Field | Value |
|---|---|
| Phase | Spec 01 implementation |
| Current spec | Spec 01: Architecture |
| Current sprint | Sprint 01A complete; Sprint 01B next |
| Next recommended spec | Spec 01: Architecture |
| Last completed work | Implemented and verified Sprint 01A: Static Export Foundation |

## Current Context

- Product: static Next.js scrollytelling site about agentic AI.
- Deployment target: GitHub Pages project site under `https://<account>.github.io/<repository>/`.
- Core delivery constraint: everything must work as a static export under a non-root base path.
- Content model direction: Markdown-first with frontmatter-driven routing and layout selection.
- Main experience direction: one canonical presentation-style scrollytelling route plus supporting standard pages.
- QA direction: verify against the exported static artifact served under the GitHub Pages-style base path.

## Active Focus

- Start Sprint 01B: Shared URL and Metadata Helpers.
- Keep the GitHub Pages base-path contract centralized as new routing code is added.
- Keep `STATUS.md` updated as the source of truth for what is currently in progress.

## Notes

- Specs have been revised to close gaps around GitHub Pages deployment, route contracts, visualization embedding, and exported-artifact QA.
- Spec 01 sprint plan lives in `docs/project_management/sprints/01-architecture.md`.
- Sprint 01A verification passed with `npm test`, `npm run build`, and `npm run verify:export`.
