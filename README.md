# Project Management

This project is building a spec-driven scrollytelling website about agentic AI. The core goal is to help visitors understand how an AI agent moves from human intent to digital action through perception, reasoning, execution, and correction.

## Direction

The project is using the reviewed scrollytelling reference as a process and architecture guide, not as a finished product to copy directly. The intended direction is a statically exported Next.js site with a Markdown-first content model, presentation-style scrollytelling, a deliberate visual system, and professional automated QA.

## Current Progress

- Reference project reviewed and summarized in [scrollytelling_review.md](./docs/project_management/scrollytelling_review.md).
- Topic and visual theme defined in [TOPIC.md](./docs/project_management/TOPIC.md) and [THEME.md](./docs/project_management/THEME.md).
- High-level project objective documented in [OBJECTIVE.md](./docs/project_management/OBJECTIVE.md).
- Project specs created in [specs/](./docs/project_management/specs/), covering architecture, content, layouts, motion, design, visualization, QA, and deployment.
- Spec 01 is complete through Sprint 01D, including exported-artifact smoke verification.

## App Foundation

Sprint 01A establishes the production URL and export assumptions the codebase will build on.

- Production deployment target: `https://<account>.github.io/spec-driven-scrollytelling/`
- Default application base path: `/spec-driven-scrollytelling`
- Export mode: static `out/` artifact with trailing-slash-compatible routes
- Image strategy: unoptimized static assets only, with no runtime image optimization dependency

## Commands

- `npm run typecheck`: checks the TypeScript project without emitting output.
- `npm run lint`: runs ESLint across the repository with zero tolerated warnings.
- `npm test`: runs the current unit and component-level architecture checks.
- `npm run build`: creates the production static export.
- `npm run test:e2e`: serves the exported artifact locally under the repository base path and runs the browser smoke test.
- `npm run verify:export`: runs type checking, linting, the production build, and then the exported-artifact browser smoke workflow.

## Local Verification Order

Run the checks in this order when you are preparing a change:

1. `npm test`
2. `npm run typecheck`
3. `npm run lint`
4. `npm run verify:export`

Use `npm run build` and `npm run test:e2e` directly when you want to inspect the export or browser behavior separately before the final combined verification step.
