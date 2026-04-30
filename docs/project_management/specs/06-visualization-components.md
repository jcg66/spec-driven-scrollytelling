# Spec 06: Visualization Components

## Purpose

Support embedded explanatory visuals inside Markdown so the project can combine narrative prose with technical diagrams, metrics, logs, and structured callouts.

## Requirements

- The content system must support a defined set of embedded visualization components authored from Markdown.
- Embedded components must serve explanatory goals tied to the agent narrative, such as planner decomposition, visual grounding, event logs, timelines, or capability summaries.
- Component insertion must be schema-driven or convention-driven enough to prevent arbitrary fragile markup.
- Visualization components must remain stylistically consistent with the core design system.
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
- Unsupported or malformed component blocks fail clearly or degrade predictably.

## Automated Verification

- Parser tests cover recognition of supported embedded component syntax.
- Component tests verify core render contracts for each supported visualization type.
- Browser tests confirm at least one embedded visualization renders correctly within a real narrative page.
