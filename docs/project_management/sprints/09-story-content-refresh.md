# Spec 09 Sprint Plan: Story Content Refresh

## Spec Intent

Spec 09 updates the story itself. The implementation focus is not infrastructure or QA scaffolding, but the actual narrative the site tells: what the visitor reads first, how the five scenes are framed, and how the supporting pages explain the story without competing with it.

## Current Content Snapshot

The current content system already gives the project a strong base:

- the homepage is Markdown-backed and remains the canonical public story surface,
- the main story still uses the five-scene structure that maps cleanly to scroll-based presentation,
- the support pages already provide context without becoming part of the primary route,
- and the reference material already contains a more specific, 2026-oriented narrative direction.

The gap is editorial rather than structural:

- the current homepage copy is simpler than the updated reference script,
- the terminology on the support pages could be aligned more closely with the refreshed narrative,
- and the story outline/reference notes should be turned into content the published site actually expresses.

## Needed Inputs and Integration Model

Spec 09 builds on the finished content, layout, motion, visualization, QA, and deployment work.

The integration rule should stay explicit:

- the homepage remains the canonical story surface,
- supporting pages remain secondary context,
- reference-only Markdown stays non-routable,
- and all story changes must continue to respect the existing static-export and base-path contract.

## Sprint Breakdown

### Sprint 09A: Homepage Narrative Rewrite

**Goal**

Rewrite the homepage story so it matches the updated action-layer narrative while keeping the five-scene structure and the current presentation flow.

**Scope**

- Rewrite the canonical homepage prose to reflect the updated story direction from the reference script.
- Align the scene copy with the newer terminology: action layer, planner-grounder split, visual grounding, and execution loop.
- Keep the existing five-scene structure unless a scene can be improved without breaking the current presentation and browser contract.
- Preserve the embedded visualization and reduced-motion behavior already in place.

**Exit Criteria**

- The homepage reads like the updated canonical story rather than the earlier draft.
- The story still works as a single scrollable narrative from spark to outcome.
- The public story page remains the primary surface for the project.

**Verification**

- Browser review of the homepage story plus export verification against the repository subpath.

### Sprint 09B: Supporting Context and Story QA

**Goal**

Bring the support pages and story-reference material into alignment with the refreshed homepage content, then verify that the updated story remains clear and coherent in the exported artifact.

**Scope**

- Update the support-page explanations so they match the refreshed homepage vocabulary.
- Decide which reference-only notes should become published support material and which should remain authoring-only.
- Refresh any content-driven browser assertions that depend on story wording or scene labels.
- Review the narrative flow for clarity, consistency, and accessibility on desktop, mobile, and reduced-motion views.

**Exit Criteria**

- The homepage and support pages describe the same narrative model.
- The updated story feels cohesive across the full published experience.
- The browser coverage continues to confirm the exported story path under the production base path.

**Verification**

- Targeted browser review, content checks, and exported-artifact verification.

## Sprint QA Review

### Ordering Check

- `09A` comes first because the homepage is the canonical story surface and must be rewritten before the surrounding support material is aligned.
- `09B` follows because the supporting pages and content assertions should reflect the final story language, not a draft rewrite.

### Scope Check

- The sprints stay inside Spec 09 by focusing on narrative copy, support content, and story coherence.
- Routing, deployment, and QA system changes remain out of scope.
- Visualization mechanics remain out of scope unless the story rewrite requires copy-level adjustments around them.

### Risk Check

- The biggest risk is updating the homepage copy without updating the support pages, which would leave the published story inconsistent.
- Another risk is overcorrecting the story into a dense technical explanation and losing the clear, scrollytelling-first structure.
- A smaller risk is changing wording in a way that silently breaks content-driven browser expectations.

### Adjustments Applied

- The sprint sequence starts with the homepage rewrite because the public story should set the vocabulary that the support pages then reinforce.
- The support-page alignment sprint is separated so the team can preserve story clarity while tightening the surrounding context.

## Ready-to-Implement Recommendation

Start with `Sprint 09A: Homepage Narrative Rewrite`.

The current implementation already has the structure, motion, and export path needed to support the updated story. What it needs now is a content rewrite that makes the narrative feel like the newer reference draft while staying faithful to the existing five-scene public experience.