# Spec 03: Narrative and Layouts

## Purpose

Translate the project objective into one continuous narrative page with layout support for overview reading, immersive scrollytelling, and secondary support content.

## Requirements

- The site must support a single canonical presentation page, while standard pages may exist only for supporting content that does not fragment the main scroll experience.
- The narrative should progress from user intent, to planning, to visual grounding, to execution, to outcome.
- The project must designate the homepage as the canonical main scrollytelling route, and that route must be the primary entry point used by navigation, QA, and release review.
- The presentation mode must preserve chapter clarity even when motion is reduced or disabled.
- Standard pages must support supporting content such as context, glossary material, or reflections without inheriting presentation-only behavior.
- The layout system must allow content authors to select the correct page mode through metadata rather than hard-coded routes.
- Layout orchestration owns chapter order, slide/section structure, sticky-stage containers, landmarks, and reading order; animation timing and visual transitions belong to the motion layer.

## In Scope

- Narrative chapter structure.
- Page layout selection and rendering contracts.
- Sticky or staged presentation behavior at the page level.
- Supporting reading pages that contextualize the main experience.

## Non-Goals

- Building many unrelated page templates.
- Embedding all narrative logic directly in JSX.
- Treating the homepage and presentation pages as disconnected visual systems.

## Acceptance Criteria

- The canonical homepage communicates the full agent loop in a stable sequence.
- The single public story page and any supporting pages share the same content system while rendering appropriately different experiences.
- Layout selection is explicit, deterministic, and visible in page metadata.
- The presentation experience remains comprehensible as a sequence of sections when advanced animation is unavailable.

## Automated Verification

- Component or integration tests verify layout selection based on frontmatter and the route designation used for the main narrative.
- Browser tests confirm that the canonical scroll page and supporting pages render and expose expected landmark content.
- Reduced-motion e2e coverage confirms the presentation narrative still appears in the correct order.
