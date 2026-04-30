# Spec 08: Deployment and Operations

## Purpose

Define how the project reaches production reliably as a static site and how release quality is enforced operationally.

## Requirements

- The project must deploy as a static export to GitHub Pages, with the default production assumption of a project site served from `https://<account>.github.io/<repository>/`.
- CI/CD must separate verification from deployment so broken builds cannot publish.
- Deployment configuration must preserve correct asset paths, internal routes, and metadata under the target base path.
- The release artifact must be the exported static output produced by CI, not a local build and not a runtime Next.js server deployment.
- Operational documentation must define how the production base path is configured, how local preview simulates it, and how a healthy release is confirmed after publish.
- The release process must be simple enough for a student project but strict enough to prevent avoidable regressions.

## In Scope

- Build and export pipeline.
- GitHub Actions or equivalent CI/CD workflow.
- Environment assumptions for base path and static assets.
- Pages artifact handoff between verify, build, and deploy stages.
- Release readiness checks.

## Non-Goals

- Complex multi-environment infrastructure.
- Runtime secrets for core page rendering.
- Custom server deployment.

## Acceptance Criteria

- A clean main-branch pipeline verifies, builds, and deploys the static site automatically.
- Deployment failures surface clearly and block publication.
- The published site behaves the same way as the locally verified production build for core routes.
- Operational docs explain how to confirm a release is healthy after deployment.
- The deploy job consumes the verified CI artifact directly, and the released site is validated against the repository subpath it will actually use in production.

## Automated Verification

- CI must run verification before build and build before deploy.
- The build artifact used for deploy must come from the verified pipeline, not from an unverified local output.
- At least one browser test job must run against the exported artifact and production base-path configuration used for release.
