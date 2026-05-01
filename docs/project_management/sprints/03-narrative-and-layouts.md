# Spec 03 Sprint Plan: Narrative and Layouts

## Spec Intent

Spec 03 turns the content system from Spec 02 into a coherent single-page narrative experience. The goal is to make one canonical scroll route feel deliberate, keep supporting pages clearly secondary, and ensure layout structure stays understandable even when motion is reduced or unavailable.

## Needed Inputs and Integration Model

Spec 03 builds on the validated content and route model from Spec 02. It assumes the project already has explicit `standard` and `presentation` layout modes, a static content route, and base-path-safe routing helpers.

The integration rule should stay explicit:

- The canonical narrative route must be designated in code or content metadata, not implied by convention alone.
- Supporting pages such as context, glossary, or reflection content should remain standard pages.
- Presentation layout work should consume structured content and chapter order, but it should not absorb motion timing or animation choreography.

## Sprint Breakdown

### Sprint 03A: Canonical Single-Page Narrative and Chapter Spine

**Goal**

Designate and stabilize the primary single-page story route so navigation, QA, and release review all point at the same story entry.

**Scope**

- Formalize one canonical route for the main agent narrative.
- Encode the narrative spine from user intent to planning, visual grounding, execution, and outcome.
- Add or promote at least one supporting standard page for context, glossary, or reflection material.
- Make navigation and review references target the canonical route explicitly.
- Keep motion choreography out of this sprint.

**Exit Criteria**

- The canonical route is explicit in code and documentation.
- Narrative order is deterministic and visible in the content model.
- Supporting standard content exists as secondary material around the main presentation page.

**Verification**

- Unit or integration tests confirm canonical route designation and chapter order.
- Browser coverage confirms the homepage is the primary narrative entry point.

### Sprint 03B: Single-Page Presentation Layout Orchestration

**Goal**

Render the single presentation page as a structured chapter sequence with clear landmarks and reading order.

**Scope**

- Expand presentation rendering so ordered chapters or sections are exposed in the DOM.
- Preserve semantic landmarks and reading order inside presentation pages.
- Keep standard pages as a simpler reading mode for supporting content.
- Keep sticky-stage scaffolding at the layout level without introducing motion timing concerns.

**Exit Criteria**

- The presentation page exposes a stable chapter or section structure.
- Supporting pages remain visually and semantically distinct from the presentation page.
- Layout selection stays metadata-driven and deterministic.

**Verification**

- Component or integration tests cover standard versus presentation rendering.
- Browser tests confirm the presentation page and supporting pages expose expected landmarks.

### Sprint 03C: Motion-Independent Presentation Clarity

**Goal**

Keep the presentation comprehensible when motion is reduced or unavailable.

**Scope**

- Add reduced-motion fallbacks that preserve chapter clarity and section order.
- Ensure the presentation route remains readable as a sequence of sections without relying on animation.
- Keep scroll-linked timing, reveal choreography, and progress animation for Spec 04.
- Add browser coverage for reduced-motion behavior.

**Exit Criteria**

- Presentation pages remain understandable with motion disabled.
- The narrative order is still legible in a static read-through.
- Motion timing remains outside the scope of this spec.

**Verification**

- Browser tests run with reduced-motion preferences enabled.
- Component tests cover any observable fallback logic.

### Sprint 03D: Single-Page Release-Review QA and Navigation Coverage

**Goal**

Prove the single-page narrative system works in the exported artifact and is ready for release review.

**Scope**

- Wire top-level navigation or review helpers to the canonical route.
- Confirm the exported site still works under the repository base path.
- Add browser coverage for the homepage and at least one supporting standard page.
- Document the release-review path for the main narrative.

**Exit Criteria**

- The canonical route is the primary reviewed path for the story.
- Supporting standard pages are reachable and remain secondary to the single-page narrative route.
- Exported navigation and review flows are verified under the Pages-style base path.

**Verification**

- Browser tests cover the homepage, canonical route, supporting page, and static-miss handling.
- Export verification passes against the static artifact.

## Sprint QA Review

### Ordering Check

- `03A` must come first because the single-page route and chapter spine need to exist before layout and fallback work can be trusted.
- `03B` follows because presentation structure and layout landmarks depend on the narrative spine being stable.
- `03C` comes next because motion-independent clarity should be added after the structural layout contract exists.
- `03D` comes last because release-review and exported-artifact coverage should validate the completed narrative flow rather than an intermediate fragment.

### Scope Check

- The sprints stay inside Spec 03 by focusing on narrative sequencing, layout orchestration, and readable presentation structure.
- Motion timing and animation choreography remain deferred to Spec 04.
- Design-system refinements remain deferred to Spec 05.
- Content parsing remains deferred to Spec 02.
- Visualization details beyond layout readiness remain deferred to Spec 06.

### Risk Check

- The biggest risk is letting motion timing leak into layout orchestration, which would blur the boundary between Spec 03 and Spec 04.
- Another risk is treating the homepage as the story entry point without an explicit canonical narrative route.
- A smaller risk is building presentation structure that only works when animation is available, instead of remaining readable in a static fallback.

### Adjustments Applied

- The sprint sequence separates canonical route designation, layout orchestration, motion-independent readability, and release-review QA so failures can be isolated.
- The existing `standard` and `presentation` split is preserved for supporting content instead of introducing extra story routes too early.
- Supporting pages are treated as secondary content, not as alternate story entry points.
- Exported-artifact verification is attached to the final sprint so Spec 03 closes with production-shape evidence.

## Ready-to-Implement Recommendation

Start with `Sprint 03A: Canonical Single-Page Narrative and Chapter Spine`.

That sprint locks the route and narrative order the rest of Spec 03 depends on. If the canonical route is not explicit, later layout and reduced-motion work will be difficult to verify.
