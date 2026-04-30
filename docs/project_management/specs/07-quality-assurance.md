# Spec 07: Quality Assurance

## Purpose

Establish a professional SWE quality bar so the project is verified continuously rather than evaluated only by manual inspection.

## Quality Strategy

The project should use layered verification:

- static checks for type, lint, and formatting discipline,
- unit tests for content, parsing, configuration, and utility logic,
- component or integration tests for layout selection and rendering contracts,
- browser e2e tests for critical user journeys,
- and build verification for exportability and deploy readiness.

## Required Automated Checks

- Type checking must run in CI.
- Linting must run in CI.
- Unit tests must run in CI with deterministic pass/fail behavior.
- Browser tests must run against the exported static artifact served under the GitHub Pages-style base path for critical flows.
- A production build/export step must run in CI before deploy.

## Required Test Coverage Areas

- Frontmatter schema validation and invalid-content failure behavior.
- Route generation and base-path correctness.
- Exported-asset loading and internal navigation correctness under the repository subpath.
- Layout mode selection and chapter rendering.
- Presentation-page progression and reduced-motion behavior.
- Embedded visualization parsing and rendering.
- Primary navigation and at least one full scrollytelling path.

## QA Gates

- No deploy from a failing build.
- No merge of spec-complete work without corresponding automated coverage for new behavior.
- Bugs that break narrative continuity, static export, accessibility basics, or content integrity are release blockers.
- Every completed spec must include evidence of verification, not only implementation notes.

## Manual QA Expectations

- Review the main story on desktop and mobile widths.
- Review with reduced-motion enabled.
- Confirm keyboard traversal across navigation and major interactive elements.
- Confirm exported pages behave correctly under the target base path.

## Acceptance Criteria

- The repository has a documented verification workflow that a new contributor can run locally.
- CI enforces the minimum quality gates before deployment.
- Test suites map clearly to the risks in the scrollytelling experience instead of existing as generic smoke coverage only, and at least one end-to-end path uses the exact deployment shape that GitHub Pages will publish.

## Deliverables

- A documented test command set.
- A CI workflow that separates verify, build, and deploy responsibilities.
- A documented local preview workflow for serving the exported site under the target base path.
- A definition of done template for future spec and sprint work.
