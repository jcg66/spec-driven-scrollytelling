# Spec 04: Motion and Interaction

## Purpose

Use motion as explanatory infrastructure for the single-page scrollytelling experience, not as decorative excess.

## Requirements

- Scroll-linked motion must reinforce the agent narrative across Spark, Deconstruction, Digital Eye, Execution Loop, and Outcome.
- Motion primitives must behave differently when used in supporting pages versus the canonical presentation page where appropriate.
- Presentation sections should support sticky-stage storytelling and a visible progress indicator that reflects meaningful progress through the single-page sequence.
- Interaction design must degrade gracefully under reduced-motion preferences.
- Motion state should remain predictable and testable rather than hidden behind ad hoc animation code.
- Keyboard shortcuts or other step-navigation affordances are optional, but if implemented they must not interfere with native scrolling, focus order, or assistive technology behavior.
- The implementation should use one coherent scroll and motion orchestration path; multiple competing scroll controllers or scene directors should not be required to understand the page.

- Scene-level motion contracts should stay narrow: typing and hero emphasis in Spark, sticky deconstruction in Deconstruction, visual grounding overlays in Digital Eye, terminal/log pacing in Execution Loop, and a calm settled end state in Outcome.

## In Scope

- Reveal behavior.
- Scroll progress handling.
- Sticky section progression.
- Progress indicators and any optional keyboard affordances or other navigation helpers that materially improve comprehension.

## Non-Goals

- Animation for its own sake.
- Unbounded custom motion systems with no component contract.
- Reliance on motion to convey information that disappears entirely when animation is off.

## Acceptance Criteria

- Each major visual transition maps to a narrative change the visitor can understand.
- Sticky-section progression is stable on desktop and usable on mobile.
- The visible progress indicator updates consistently as the visitor moves through the single-page presentation sequence.
- The five scenes can be recognized without depending on animation alone.
- Reduced-motion mode displays readable end states without broken spacing or missing information.
- Motion primitives are reusable across scenes instead of being implemented as one-off page hacks.
- Heavy motion features such as cinematic zooms or cursor-follow choreography must degrade to readable static states rather than becoming hard runtime dependencies.

## Automated Verification

- Unit or component tests cover motion mode selection and reduced-motion fallbacks where logic is observable.
- Browser tests verify slide progression, major section visibility, and progress indicator state changes.
- Regression checks should include viewport coverage for mobile and desktop breakpoints.

## Sprint Plan

Sprint planning for this spec lives in [docs/project_management/sprints/04-motion-and-interaction.md](../sprints/04-motion-and-interaction.md).
