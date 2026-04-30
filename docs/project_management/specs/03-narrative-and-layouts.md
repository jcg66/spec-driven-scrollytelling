# Spec 03: Narrative and Layouts

## Purpose

Translate the project objective into a narrative system with page layouts that support both overview reading and immersive scrollytelling.

## Requirements

- The site must support at least two layout modes: `standard` and `presentation`.
- The narrative should progress from user intent, to planning, to visual grounding, to execution, to outcome.
- The presentation mode must preserve chapter clarity even when motion is reduced or disabled.
- Standard pages must support supporting content such as context, glossary material, or reflections without inheriting presentation-only behavior.
- The layout system must allow content authors to select the correct page mode through metadata rather than hard-coded routes.

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

- The main scrollytelling page communicates the full agent loop in a stable sequence.
- Standard pages and presentation pages share the same content system while rendering appropriately different experiences.
- Layout selection is explicit, deterministic, and visible in page metadata.
- The presentation experience remains comprehensible as a sequence of sections when advanced animation is unavailable.

## Automated Verification

- Component or integration tests verify layout selection based on frontmatter.
- Browser tests confirm that standard and presentation pages both render and expose expected landmark content.
- Reduced-motion e2e coverage confirms the presentation narrative still appears in the correct order.
