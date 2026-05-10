# Spec 08 Sprint Plan: Deployment and Operations

## Spec Intent

Spec 08 turns the existing static-export release path into a clearly documented operating model. The goal is to make production deployment, release validation, and post-publish confirmation repeatable for a project that ships to GitHub Pages.

## Current Codebase Deployment Snapshot

The current workspace already has a strong deployment baseline:

- `src/lib/site-config.ts` centralizes the base-path, asset-path, and metadata URL contract.
- `next.config.ts` already exports the site statically with trailing slashes, unoptimized images, and base-path-aware asset prefixing.
- `.github/workflows/ci.yml` already separates verify, build, and deploy jobs.
- The build job already runs browser tests against the exported artifact before publishing it.
- `scripts/serve-export.mjs` already simulates the GitHub Pages subpath locally for preview and browser verification.

The remaining gaps are mostly operational:

- there is no dedicated release-operations runbook yet,
- the project does not yet document how to confirm a release is healthy after publish,
- and the deployment workflow should be reviewed as a release contract, not just as a functioning CI file.

## Needed Inputs and Integration Model

Spec 08 builds on the already-complete content, layout, motion, design, visualization, and QA systems. It assumes the static export is the only production artifact and that GitHub Pages remains the release target.

The integration rule should stay explicit:

- the production base path must remain `/spec-driven-scrollytelling` in the student-project environment,
- the release artifact must be the exported `out/` directory produced by CI,
- and release validation should be done against the same Pages-style base path that the public site will use.

## Sprint Breakdown

### Sprint 08A: Verified Artifact Deployment Path

**Goal**

Confirm that CI produces, validates, and publishes the static export through a clean verify/build/deploy chain with the correct GitHub Pages artifact handoff.

**Scope**

- Review the GitHub Actions workflow as the release contract for the project.
- Keep verification separate from build and deployment so failing checks cannot publish.
- Ensure the exported artifact used for deployment is the CI artifact, not a local rebuild.
- Keep the browser test job pointed at the exported artifact under the production base path.
- Preserve the base-path and asset-path assumptions already centralized in the site configuration helpers.

**Exit Criteria**

- A main-branch pipeline can verify, build, and prepare the static site for deployment without bypassing the verified artifact.
- Deployment is blocked when verification or build steps fail.
- The published artifact is traceable to the verified CI run.

**Verification**

- Workflow review plus an end-to-end CI run on the Pages-style static export.

### Sprint 08B: Release Operations Runbook and Health Checks

**Goal**

Document how to operate the release process and how to confirm that a published site is healthy after deployment.

**Scope**

- Document the production base-path assumption and how it maps to GitHub Pages.
- Document the local preview workflow that serves the exported artifact under the repository subpath.
- Document the checks needed to confirm the published release is healthy after deploy.
- Add a small release-operations reference that future contributors can follow without reverse-engineering the workflow.

**Exit Criteria**

- A contributor can preview the production shape locally and then verify the live release with the same mental model.
- The docs explain what a healthy release looks like after deployment.
- The release process remains simple enough for a student project but explicit enough to avoid avoidable regressions.

**Verification**

- Doc review against the actual build, preview, and deploy commands in the workspace.

## Sprint QA Review

### Ordering Check

- `08A` comes first because the project should treat the deployment workflow as the contract before writing the operating guide around it.
- `08B` follows because the release runbook should describe the final release shape, not a hypothetical one.

### Scope Check

- The sprints stay inside Spec 08 by focusing on build/export delivery, deployment gating, base-path behavior, and release operations.
- Content, narrative, layout, motion, design, and visualization concerns remain owned by Specs 02 through 06.
- General QA workflow structure remains owned by Spec 07.

### Risk Check

- The biggest risk is treating deployment as solved just because CI exists, without explicitly validating the artifact handoff and publish path.
- Another risk is documenting a release process that does not match the actual static-export commands.
- A smaller risk is missing the post-publish health check guidance that operators need after a GitHub Pages deploy.

### Adjustments Applied

- The sprint sequence starts with deployment-path verification because Spec 08 is about production release reliability first and documentation second.
- The operational runbook is deferred until the release contract is clear enough to describe accurately.

## Ready-to-Implement Recommendation

Start with `Sprint 08A: Verified Artifact Deployment Path`.

The current codebase already has the static export, the Pages base-path helpers, and the split CI jobs. What it still needs is a deliberate release-path review and a matching operations guide that tells future contributors how to confirm a healthy publish.