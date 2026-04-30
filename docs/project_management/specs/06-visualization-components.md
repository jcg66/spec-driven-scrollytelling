# Spec 06: Visualization Components

## Purpose

Support embedded explanatory visuals inside Markdown so the project can combine narrative prose with technical diagrams, metrics, logs, and structured callouts.

## Requirements

- The content system must support a defined set of embedded visualization components authored from Markdown through one documented embedding contract.
- Embedded components must serve explanatory goals tied to the agent narrative, such as planner decomposition, visual grounding, event logs, timelines, or capability summaries.
- Supported embedded components for v1 must be enumerated explicitly. The minimum supported set is `stat-grid`, `timeline`, `event-log`, `capability-list`, `decision-flow`, and `code-sample`.
- Component insertion must be schema-driven or convention-driven enough to prevent arbitrary fragile markup.
- The embedding syntax must be deterministic: fenced code blocks use an info string of the form `viz:<component-id>`, and the block body must validate against the schema for that component.
- Visualization components must remain stylistically consistent with the core design system.
- Unsupported component identifiers or malformed payloads must fail clearly during validation rather than silently rendering broken UI.
- Components must have sensible fallback rendering for reduced-motion or low-interactivity contexts.

## In Scope

- Markdown component embedding contract.
- Educational widgets and visual callouts.
- Code/log/diagram-style explanatory elements.

## Non-Goals

- Building a full MDX component ecosystem without clear need.
- Shipping placeholder widgets with no narrative value.
- Requiring complex author-side syntax for common visuals.

## Acceptance Criteria

- Authors can insert supported visualization components without modifying rendering code for each use.
- At least the core explanatory component set is stable, documented, and tested.
- Embedded visuals render consistently inside both standard and presentation contexts where applicable.
- Unsupported or malformed component blocks fail clearly according to the documented validation path, and low-interactivity fallbacks degrade predictably.

## Automated Verification

- Parser tests cover recognition of supported embedded component syntax, identifier validation, and malformed-payload failure behavior.
- Component tests verify core render contracts for each supported visualization type.
- Browser tests confirm at least one embedded visualization renders correctly within a real narrative page.
