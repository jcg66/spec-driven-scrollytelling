# Project Specifications

This directory breaks [OBJECTIVE.md](../OBJECTIVE.md) into implementation-facing specifications for a static Next.js scrollytelling site about agentic AI.

The specs are aligned to the technical patterns identified in [scrollytelling_review.md](../scrollytelling_review.md): App Router static export, Markdown-first content, dual layout modes, motion-driven storytelling, embedded visualizations, and test-backed QA.

## Reading Order

| # | Spec | Purpose |
|---|---|---|
| 00 | [overview.md](./00-overview.md) | Product scope, outcomes, constraints, success criteria |
| 01 | [architecture.md](./01-architecture.md) | Core stack, project structure, static-export constraints |
| 02 | [content-and-routing.md](./02-content-and-routing.md) | Content model, frontmatter, slug generation, route behavior |
| 03 | [narrative-and-layouts.md](./03-narrative-and-layouts.md) | Story structure, standard vs presentation pages, chapter flow |
| 04 | [motion-and-interaction.md](./04-motion-and-interaction.md) | Scroll behavior, reveal logic, interaction expectations |
| 05 | [design-and-accessibility.md](./05-design-and-accessibility.md) | Visual system, typography, responsiveness, accessibility |
| 06 | [visualization-components.md](./06-visualization-components.md) | Markdown-embedded visuals and educational components |
| 07 | [quality-assurance.md](./07-quality-assurance.md) | Automated testing, quality gates, review workflow |
| 08 | [deployment-and-operations.md](./08-deployment-and-operations.md) | Build, CI, GitHub Pages deployment, release checks |

## Spec Conventions

- Requirements state what must be true in the finished project.
- Acceptance criteria define what reviewers should be able to confirm.
- Automated verification defines the minimum test or CI evidence required.
- Non-goals prevent scope drift into unrelated engineering or content work.
