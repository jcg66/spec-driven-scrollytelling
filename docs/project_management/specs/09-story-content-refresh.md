# Spec 09: Story Content Refresh

## Purpose

Refresh the canonical story content so the homepage and supporting pages align with the updated 2026 narrative direction, including the action-layer framing, the planner-grounder split, visual grounding, and the agentic execution loop.

## Requirements

- The canonical homepage story must remain the public narrative surface, but its copy should reflect the updated story direction from the reference script and topic notes.
- The supporting pages must reinforce, not compete with, the homepage story.
- The story should feel contemporary, precise, and slightly cinematic while still prioritizing clarity over spectacle.
- Narrative copy should use the current agentic-AI vocabulary consistently, including the action-layer framing, visual grounding, planner-grounder concepts, and execution-loop language where appropriate.
- Story updates must preserve the existing static-export, base-path, and Markdown-first content contract.
- Any updated story content must remain accessible, scannable, and compatible with the current browser coverage model.

## In Scope

- Homepage narrative copy refresh.
- Supporting-page copy refresh.
- Story-outline and reference-source alignment.
- Technical vocabulary and explanatory framing updates.
- Content-driven browser and content tests if wording or structure changes affect them.

## Non-Goals

- New routing architecture.
- New deployment infrastructure.
- New visualization system design.
- Reworking the existing QA or deployment specifications.

## Acceptance Criteria

- The homepage tells the updated story in a way that matches the current topic and reference materials.
- The supporting pages provide clearer context for the updated story without stealing the spotlight from the homepage.
- The narrative reads as one coherent scrollytelling experience from spark to outcome.
- The updated copy stays consistent with the project’s existing production, accessibility, and static-export constraints.

## Automated Verification

- Relevant content and browser tests must pass after the narrative update.
- Exported-artifact verification must still succeed under the GitHub Pages-style base path.
- Any updated copy or scene structure must be reflected in the current browser assertions.