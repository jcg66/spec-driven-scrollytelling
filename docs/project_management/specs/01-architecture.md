# Spec 01: Architecture

## Purpose

Define the technical foundation for a statically exported scrollytelling site using the stack patterns identified in the reference review.

## Requirements

- The application must use Next.js App Router with TypeScript.
- The build output must support static hosting, including GitHub Pages-style base path behavior.
- The architecture must separate content, rendering logic, motion primitives, and visualization components into maintainable modules.
- Internal links, image paths, and generated assets must work correctly under a non-root deployment path.
- Build-time validation should catch content and route errors before deploy.

## In Scope

- App shell, root layout, metadata defaults, route generation boundaries.
- Static-export configuration and path helpers.
- Directory conventions for `content`, `src/app`, `src/components`, `src/lib`, and `tests`.

## Non-Goals

- Server-side rendering.
- Runtime CMS integration.
- External data fetching as a required part of page rendering.

## Acceptance Criteria

- A production build completes as a static export with no runtime-only route dependencies.
- Unknown content slugs resolve as static misses rather than silent client-side fallbacks.
- Base-path-aware linking works consistently across navigation, asset references, and shared components.
- The codebase has a clear module boundary between content loading, layout orchestration, animation logic, and presentational components.

## Automated Verification

- Unit tests cover URL/path helper behavior and slug normalization.
- CI runs a production build as part of verification, not only local development mode.
- A browser smoke test confirms that generated pages load from the exported output without broken navigation.
