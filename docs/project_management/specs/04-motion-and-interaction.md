# Spec 04: Motion and Interaction

## Purpose

Use motion as explanatory infrastructure for the scrollytelling experience, not as decorative excess.

## Requirements

- Scroll-linked motion must reinforce the agent narrative: intent, decomposition, perception, action, and completion.
- Motion primitives must behave differently when used in standard pages versus presentation slides where appropriate.
- Presentation slides should support sticky-stage storytelling and meaningful progress through the sequence.
- Interaction design must degrade gracefully under reduced-motion preferences.
- Motion state should remain predictable and testable rather than hidden behind ad hoc animation code.

## In Scope

- Reveal behavior.
- Scroll progress handling.
- Sticky slide progression.
- Optional progress indicators, keyboard affordances, or other navigation helpers if they materially improve comprehension.

## Non-Goals

- Animation for its own sake.
- Unbounded custom motion systems with no component contract.
- Reliance on motion to convey information that disappears entirely when animation is off.

## Acceptance Criteria

- Each major visual transition maps to a narrative change the visitor can understand.
- Sticky-slide progression is stable on desktop and usable on mobile.
- Reduced-motion mode displays readable end states without broken spacing or missing information.
- Motion primitives are reusable across scenes instead of being implemented as one-off page hacks.

## Automated Verification

- Unit or component tests cover motion mode selection and reduced-motion fallbacks where logic is observable.
- Browser tests verify slide progression, major section visibility, and any progress indicator state changes.
- Regression checks should include viewport coverage for mobile and desktop breakpoints.
