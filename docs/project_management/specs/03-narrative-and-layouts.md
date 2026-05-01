# Spec 03: Narrative and Layouts

## Purpose

Translate the project objective into one continuous narrative page with layout support for overview reading, immersive scrollytelling, and secondary support content.

## Requirements

- The site must support a single canonical presentation page; any other pages may exist only as secondary support content outside the main public story route.
- The narrative should progress through the five named scenes from the reference script: Spark, Deconstruction, Digital Eye, Execution Loop, and Outcome.
- The project must designate the homepage as the canonical main scrollytelling route, and that route must be the primary entry point used by navigation, QA, and release review.
- The presentation mode must preserve chapter clarity even when motion is reduced or disabled.
- Any standard pages must remain secondary reference or support content and must not compete with the main scroll narrative.
- The layout system must allow content authors to select the correct page mode through metadata rather than hard-coded routes.
- Layout orchestration owns chapter order, slide/section structure, sticky-stage containers, landmarks, and reading order; animation timing and visual transitions belong to the motion layer.

The canonical page should expose those scenes as clear in-page sections or chapters, with the first scene acting as the isolated hero state and the final scene resolving into a calm success state.

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
- The single public story page is the primary narrative experience; any supporting pages remain clearly secondary and do not fragment the story.
- The five story scenes appear in the intended order and retain their identities even when motion is reduced.
- Layout selection is explicit, deterministic, and visible in page metadata.
- The presentation experience remains comprehensible as a sequence of sections when advanced animation is unavailable.

## Automated Verification

- Component or integration tests verify layout selection based on frontmatter and the route designation used for the main narrative.
- Browser tests confirm that the canonical scroll page renders and that any secondary support content remains visually and semantically distinct.
- Reduced-motion e2e coverage confirms the presentation narrative still appears in the correct order.
