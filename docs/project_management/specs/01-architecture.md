# Spec 01: Architecture

## Purpose

Define the technical foundation for a statically exported scrollytelling site using the stack patterns identified in the reference review.

## Requirements

- The application must use Next.js App Router with TypeScript.
- The build output must support static hosting, with GitHub Pages project-site behavior treated as the default production case: `https://<account>.github.io/<repository>/`.
- The static export configuration must avoid runtime server dependencies and generate trailing-slash-compatible output that can be served directly from the exported artifact.
- The architecture must separate content, rendering logic, motion primitives, and visualization components into maintainable modules.
- Internal links, image paths, metadata URLs, and generated assets must work correctly under a non-root deployment path.
- All shared URL construction must go through base-path-aware helpers; route or asset references must not depend on hard-coded root-relative paths.
- The image/media strategy must be compatible with static export and GitHub Pages, including no dependency on runtime image optimization.
- Build-time validation should catch content and route errors before deploy.

## In Scope

- App shell, root layout, metadata defaults, route generation boundaries.
- Static-export configuration, path helpers, metadata helpers, and Pages-compatible asset conventions.
- Directory conventions for `content`, `src/app`, `src/components`, `src/lib`, and `tests`.

## Non-Goals

- Server-side rendering.
- Runtime CMS integration.
- External data fetching as a required part of page rendering.

## Acceptance Criteria

- A production build completes as a static export into the deploy artifact with no runtime-only route dependencies.
- Unknown content slugs resolve as static misses rather than silent client-side fallbacks.
- Base-path-aware linking works consistently across navigation, asset references, and shared components.
- Exported pages remain functional when served from the repository subpath instead of `/`.
- The codebase has a clear module boundary between content loading, layout orchestration, animation logic, and presentational components.

## Automated Verification

- Unit tests cover URL/path helper behavior, metadata URL construction, and slug normalization.
- CI runs a production build as part of verification, not only local development mode.
- A browser smoke test confirms that generated pages load from the exported output, served from the Pages-style base path, without broken navigation or missing assets.
