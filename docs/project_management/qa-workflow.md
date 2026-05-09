# QA Workflow

This document captures the local preview workflow and the release-review checklist for the current static-export project.

## Local Verification Workflow

Run the checks in this order when preparing a change:

1. `npm test`
2. `npm run typecheck`
3. `npm run lint`
4. `npm run verify:export`

Use `npm run build` and `npm run test:e2e` directly when you want to inspect the exported artifact or browser behavior independently.

## Local Preview Workflow

The exported site is meant to be served under the repository subpath.

1. Build the static artifact with `npm run build`.
2. Start the export server with `node scripts/serve-export.mjs`.
3. Open the preview URL printed by the server, usually `http://127.0.0.1:4321/spec-driven-scrollytelling/`.
4. Confirm the homepage, the supporting pages, and a missing route all behave under the repository base path.

If you need to override the port or base path for a one-off preview, set `PORT` and `BASE_PATH` before launching the server.

## Release-Review Checklist

Use this checklist before merging spec-complete work:

- Verify the homepage story on desktop width.
- Verify the homepage story on a mobile viewport.
- Verify the homepage story with reduced motion enabled.
- Confirm keyboard traversal works across navigation and major interactive elements.
- Confirm the five named scenes remain understandable when animation is absent or simplified.
- Confirm secondary support content remains clearly secondary to the public story path.
- Confirm exported pages behave correctly under the target GitHub Pages-style base path.
- Confirm the exported artifact still passes the browser smoke and release-review tests.
