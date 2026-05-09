# Spec 07 Sprint Plan: Quality Assurance

## Spec Intent

Spec 07 turns the project's QA goals into a practical verification system. The goal is to make the scrollytelling site continuously verifiable with clear local commands, a gated CI workflow, and browser coverage that reflects the real deployment shape.

## Current Codebase QA Snapshot

The current workspace already has a meaningful baseline:

- unit tests for content, parsing, configuration, layout, motion, and visualization behavior,
- browser coverage for the exported site under the GitHub Pages-style base path,
- a static production build,
- and an export smoke command that exercises the built artifact.

The current gaps against Spec 07 are also clear:

- there is no repository lint script or lint configuration in the current workspace,
- there is no CI workflow file in the repo yet,
- the local preview workflow is only described informally in the README rather than as a dedicated QA workflow,
- and the repository does not yet include a definition-of-done template for future spec or sprint work.

## Needed Inputs and Integration Model

Spec 07 builds on the completed implementation work from Specs 01 through 06. It assumes the content model, layout system, motion system, design system, and visualization embedding path already exist and should be treated as the codebase under test.

The integration rule should stay explicit:

- verification must run against the exported artifact served under the GitHub Pages-style base path,
- CI should separate verify, build, and deploy responsibilities,
- and QA documentation should match the commands contributors actually run locally.

## Sprint Breakdown

### Sprint 07A: Local Verification Workflow and Lint Baseline

**Goal**

Define the local QA command set and add the missing static-analysis baseline the repository needs before CI can enforce it.

**Scope**

- Add or formalize scripts for linting and type checking alongside the existing unit, build, and export commands.
- Document the local verification order in the repository README or QA docs so a new contributor can run the project deterministically.
- Align the documented commands with the current static-export workflow and exported-artifact smoke checks.
- Keep the command set small enough that it is actually used.

**Exit Criteria**

- A contributor can follow the documented commands to validate the project locally without guessing the order.
- Lint and type-check steps exist as first-class quality gates, not as ad hoc shell commands.
- The repository documents what to run before opening a PR.

**Verification**

- Local command validation for unit tests, build, lint, type checking, and export smoke checks.

### Sprint 07B: CI Workflow and Deployment Gates

**Goal**

Translate the local QA workflow into a gated CI pipeline with clear handoffs between verification, build, and deploy responsibilities.

**Scope**

- Add the repository's CI workflow configuration.
- Separate verify, build, and deploy jobs so failures stop publication.
- Ensure the deploy job uses the verified exported artifact rather than rebuilding from an unverified state.
- Preserve the GitHub Pages base-path contract in the workflow environment.

**Exit Criteria**

- CI blocks deploy on failing verification or build steps.
- The deploy stage consumes the artifact produced by the verified pipeline.
- The workflow is understandable from top to bottom without needing hidden manual steps.

**Verification**

- Workflow review plus a successful run of the verify/build/deploy path in the target environment.

### Sprint 07C: Browser QA Matrix and Regression Coverage

**Goal**

Make the browser test suite reflect the project risks explicitly rather than functioning only as a broad smoke test.

**Scope**

- Organize browser coverage around the risks in the site: base-path routing, exported asset loading, primary story flow, reduced-motion behavior, support-page navigation, and embedded visualization rendering.
- Confirm the exported artifact continues to work across desktop and mobile viewport coverage.
- Keep the critical test path grounded in the Pages-style static export.
- Make the release-review checks easy to identify and rerun.

**Exit Criteria**

- The browser suite maps cleanly to the project risks described in Spec 07.
- At least one end-to-end path uses the exact deployment shape that GitHub Pages will publish.
- Reduced-motion and support-page coverage remain part of the release-review set.

**Verification**

- Targeted browser runs plus the exported-artifact smoke suite.

### Sprint 07D: QA Documentation and Definition of Done

**Goal**

Close the QA loop with the missing documentation that future work will depend on.

**Scope**

- Document the local preview workflow for serving the exported site under the repository base path.
- Add a definition-of-done template for future specs and sprints.
- Document the release-review QA checklist so future contributors know what evidence is required before merge.
- Consolidate the QA commands and workflow notes into a durable reference.

**Exit Criteria**

- A new contributor can find the local preview workflow, the verification workflow, and the release-review checklist in the project docs.
- Future spec or sprint work has a reusable QA template.
- The documentation reflects the current build and export contract rather than an imagined future one.

**Verification**

- Doc review against the current commands, workflow, and export behavior.

## Sprint QA Review

### Ordering Check

- `07A` must come first because the repository needs a stable local quality baseline before CI can enforce anything.
- `07B` follows because CI depends on the command set and the export contract being explicit.
- `07C` comes next because the browser matrix should be organized after the command and workflow shape are stable.
- `07D` comes last because the documentation should describe the final QA system, not a draft version of it.

### Scope Check

- The sprints stay inside Spec 07 by focusing on verification, workflow automation, browser coverage, and QA documentation.
- Content modeling remains the responsibility of Spec 02.
- Narrative and layout behavior remain the responsibility of Specs 03 and 04.
- Design and accessibility implementation remain the responsibility of Spec 05.
- Visualization embedding remains the responsibility of Spec 06.

### Risk Check

- The biggest risk is treating QA as a documentation exercise without enforcing it in scripts and CI.
- Another risk is leaving the export smoke check as a single generic test instead of a clearly scoped regression matrix.
- A smaller risk is documenting commands that do not match the real workspace behavior.

### Adjustments Applied

- The sprint sequence starts with local command baseline work because the current codebase already has test and export checks but lacks lint and CI enforcement.
- The CI sprint is separated from browser coverage so the workflow can consume a stable command set.
- Documentation is deferred until the command and workflow contract is real.

## Ready-to-Implement Recommendation

Start with `Sprint 07A: Local Verification Workflow and Lint Baseline`.

The current codebase already has unit tests, browser tests, and export verification. What it does not yet have is the complete local QA command set that Spec 07 requires before CI, deployment gating, and documentation can be locked down.