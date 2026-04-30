# Spec 01 Sprint Plan: Architecture

## Spec Intent

Spec 01 establishes the technical foundation for a static Next.js App Router site that will publish to GitHub Pages under a non-root repository base path. The goal of this spec is to make the deployment shape, module boundaries, and base-path-safe architecture reliable before deeper content, layout, motion, and visualization work begins.

## Sprint Breakdown

### Sprint 01A: Static Export Foundation

**Goal**

Lock in the baseline Next.js configuration for static export and GitHub Pages compatibility.

**Scope**

- Configure static export behavior for App Router.
- Ensure trailing-slash-compatible output for static hosting.
- Define the repository base-path strategy for local and production builds.
- Ensure image/media handling does not rely on runtime optimization.
- Document the expected production URL shape for the app code.

**Exit Criteria**

- The app can produce an exported static artifact without runtime-only hosting assumptions.
- Base path and asset prefix behavior are defined in code and not spread across ad hoc route strings.
- The architecture is aligned with GitHub Pages project-site deployment.

**Verification**

- Production build succeeds.
- Export artifact can be served locally under the repository subpath.

### Sprint 01B: Shared URL and Metadata Helpers

**Goal**

Centralize all URL construction so links, assets, and metadata behave correctly under the non-root base path.

**Scope**

- Create helpers for internal route URLs.
- Create helpers for static asset and image URLs.
- Create helpers for metadata URLs and canonical path generation.
- Add slug normalization utilities required by the architecture layer.

**Exit Criteria**

- Shared components have one architecture-approved way to create internal URLs and asset references.
- Metadata generation does not assume a root deployment.
- Slug and path behavior are deterministic and testable.

**Verification**

- Unit tests cover route URL generation, asset URL generation, metadata URL construction, and slug normalization.

### Sprint 01C: App Shell and Module Boundaries

**Goal**

Set up the architectural seams the later specs will build on without implementing their full behavior yet.

**Scope**

- Establish root layout and app shell structure.
- Define the initial directory and module boundaries for content loading, layouts, motion primitives, and visualization components.
- Add route boundary behavior needed for static misses and future content-driven pages.
- Keep placeholder implementations thin and architecture-focused.

**Exit Criteria**

- The codebase structure clearly separates app shell, content loading, layout orchestration, motion, and visuals.
- Unknown routes fail through the static-routing model instead of falling back silently.
- The app shell is ready for Spec 02 and Spec 03 to layer in real content and page modes.

**Verification**

- Production build still succeeds after architectural refactors.
- Focused tests confirm route boundary behavior where practical.

### Sprint 01D: Exported Artifact Smoke Verification

**Goal**

Prove that the architecture works in the same shape that GitHub Pages will actually publish.

**Scope**

- Add or finalize browser smoke coverage against the exported static artifact.
- Serve the exported output under the repository base path during verification.
- Ensure navigation and assets resolve correctly in that environment.
- Wire the production build into the verification workflow.

**Exit Criteria**

- The exported site loads successfully under the non-root base path.
- Smoke coverage validates the architecture contract instead of only dev-server behavior.
- The spec has a clean verification story for later deployment work.

**Verification**

- Browser smoke test passes against the exported artifact.
- Verification workflow includes production build/export.

## Sprint QA Review

### Ordering Check

- `01A` must come first because every later sprint depends on the static-export and base-path contract.
- `01B` comes next because helper APIs should exist before app shell code starts using ad hoc paths.
- `01C` should follow helper creation so architectural seams adopt the shared contract immediately.
- `01D` comes last because smoke verification should test the real outputs of the previous sprints.

### Scope Check

- The sprints stay inside Spec 01 by focusing on architecture and verification scaffolding.
- Content schema definition is intentionally deferred to Spec 02.
- Page narrative and layout behavior are intentionally deferred to Spec 03.
- Rich motion behavior is intentionally deferred to Spec 04.
- Deployment automation details beyond verification hooks are intentionally deferred to Spec 08.

### Risk Check

- The biggest risk is accidental bleed into later specs, especially when creating route shells or placeholder content behavior.
- Another risk is testing only `next dev` or `next start` behavior instead of the exported `out/` artifact served under the repository subpath.
- A smaller risk is scattering base-path logic across components before helper APIs are in place.

### Adjustments Applied

- The sprint sequence explicitly front-loads base-path and export configuration.
- Verification is tied to the exported artifact, not a generic production-like app server.
- The app shell sprint is limited to architectural seams so it does not absorb content or visual-system work prematurely.

## Ready-to-Implement Recommendation

Start with `Sprint 01A: Static Export Foundation`.

That sprint unlocks the highest-risk contract in the project: a Pages-safe static export under `/<repository>/`. If that layer is wrong, later content, layout, and motion work will be built on unstable assumptions.
