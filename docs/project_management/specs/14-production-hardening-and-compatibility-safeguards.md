# Spec 14: Production Hardening and Compatibility Safeguards

## Purpose

Lock the advanced visual system into a production-ready baseline so the dramatic experience stays stable across static export, reduced motion, keyboard traversal, and mobile review.

## Requirements

- The advanced visuals must remain driven by the scene system and design tokens rather than by fragile markdown structure.
- Reading order, focus visibility, keyboard traversal, and route behavior must remain intact across the new visual composition.
- Reduced-motion mode must preserve the full narrative in a readable static stack while disabling decorative motion and heavy glass effects.
- The exported artifact must continue to work under the GitHub Pages base path and pass browser-review coverage.
- Regression checks must guard against visual drift in the custom pointer, scroll choreography, and scene-specific chrome.

## In Scope

- Reduced-motion hardening.
- Keyboard and focus validation.
- Export verification and Pages-style base-path checks.
- Browser regression coverage for scene labels, decorative chrome, and content order.
- Performance and stability guardrails for the advanced visual treatments.

## Non-Goals

- Reworking the scene architecture from Specs 11 through 13.
- Introducing new visual motifs beyond the final production design.
- Changing routing, deployment, or content-model contracts.
- Rewriting the story or motion direction.

## Acceptance Criteria

- The exported site remains visually impressive without depending on fragile browser state.
- Reduced-motion users receive the same narrative in a stable and legible format.
- The browser and export test suites validate behavior instead of overfitting to incidental DOM structure.

## Automated Verification

- `npm run verify:export`.
- Targeted browser checks for reduced motion, mobile layout, keyboard access, and final scene readability.
