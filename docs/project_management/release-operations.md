# Release Operations

This runbook describes how the project reaches production, how to preview the production shape locally, and how to confirm a release is healthy after publish.

## Production Base Path

The production deployment target is a GitHub Pages project site at `https://<account>.github.io/spec-driven-scrollytelling/`.

The corresponding production base path is `/spec-driven-scrollytelling`.

That base path is centralized in `src/lib/site-config.ts` and propagated into the Next.js export configuration, route helpers, metadata URLs, and asset URLs.

## Local Preview

Use the exported static artifact to preview the production shape locally.

1. Run `npm run build`.
2. Run `npm run preview:export`.
3. Open the local URL printed by the server, usually `http://127.0.0.1:4321/spec-driven-scrollytelling/`.

The preview should behave like the published site:

- the homepage should load at the repository subpath,
- supporting pages should resolve under the same subpath,
- and missing routes should fall back to the exported 404 behavior.

## Healthy Release Checks

After deployment, confirm the release with the same mental model used for local preview:

- open the production homepage and confirm it loads under the repository subpath,
- navigate to the supporting route and confirm the content renders,
- test a missing route and confirm the exported 404 page appears,
- and verify that the browser smoke coverage still passes against the exported artifact used for release.

If any of those checks fail, treat the deploy as unhealthy until the CI artifact, the Pages publish step, and the base-path configuration are reconciled.

## Release Contract

The release contract is intentionally simple:

- CI verifies the workspace first,
- CI builds the exported artifact second,
- CI validates the exported artifact before publishing,
- and the deploy step consumes the verified CI artifact directly.

Keep this document aligned with `.github/workflows/ci.yml`, `scripts/serve-export.mjs`, and the commands listed in the README.