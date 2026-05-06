# Spec 04 Sprint Plan: Motion and Interaction

## Spec Intent

Spec 04 turns the narrative structure from Spec 03 into a motion-aware single-page experience. The goal is to use motion as explanatory infrastructure for the story, keep progression understandable, and preserve readable behavior when motion is reduced or unavailable.

## Needed Inputs and Integration Model

Spec 04 builds on the homepage-centered story surface from Spec 03 and the reduced-motion fallback already in place. It assumes the project already has a canonical single-page presentation route, supporting pages that remain secondary, and a deterministic layout contract.

The integration rule should stay explicit:

- The motion layer should operate on the canonical story surface, not on every content page by default.
- Motion state should be derived from the story sequence instead of being hard-coded independently inside each scene.
- Reduced-motion behavior should preserve readability and ordering rather than hiding the story behind animation.

## Sprint Breakdown

### Sprint 04A: Scroll-Linked Motion Foundation

**Goal**

Create the motion primitives and state model that the homepage story can use without hard-coding animation logic inside the page.

**Scope**

- Define the motion state contract for the five story scenes.
- Add reusable scroll progress or scene-progress helpers.
- Establish a single motion orchestration path for the homepage story.
- Keep supporting pages free of story-specific motion behavior unless explicitly needed.

**Exit Criteria**

- Motion state can be derived predictably from the story sequence.
- The codebase has one motion path instead of ad hoc scene controllers.
- The motion layer is reusable across the story scenes.

**Verification**

- Unit tests cover motion state selection or progress helpers.
- Component tests cover any observable motion wiring.

### Sprint 04B: Sticky Progress and Scene Progression

**Goal**

Make the story feel like a single scroll sequence by wiring sticky-stage behavior and visible progression through the five scenes.

**Scope**

- Add a visible progress indicator for the canonical story page.
- Connect scroll position to chapter or scene progression.
- Ensure sticky-stage layout behavior remains stable on desktop and usable on mobile.
- Keep the scene order synchronized with the story layout contract from Spec 03.

**Exit Criteria**

- The homepage exposes meaningful progression through the story scenes.
- The progress indicator reflects the sequence consistently.
- Sticky behavior stays aligned with the reading order.

**Verification**

- Browser tests verify section visibility and progression state.
- Integration or component tests cover observable progress state where feasible.

### Sprint 04C: Reduced-Motion and Interaction Fallbacks

**Goal**

Ensure the motion experience remains readable and safe when reduced motion is enabled or when motion features are unavailable.

**Scope**

- Expand reduced-motion behavior beyond a static fallback into a deliberate motion mode.
- Ensure keyboard interaction, focus order, and native scrolling are not disrupted by motion affordances.
- Keep heavy motion features degradable to readable static states.
- Validate that supporting content still behaves like supporting content.

**Exit Criteria**

- Reduced-motion users can read the story without relying on animation.
- Motion features fail gracefully when unavailable.
- Interaction helpers do not interfere with accessibility.

**Verification**

- Browser tests run with reduced-motion preferences enabled.
- Component tests cover any observable fallback logic.

### Sprint 04D: Release-Review Motion QA

**Goal**

Prove the completed motion system works in the exported artifact and preserves the homepage story contract.

**Scope**

- Run browser coverage against the exported static artifact.
- Confirm progress, scene order, and fallback behavior under the repository base path.
- Verify the motion system does not regress the homepage or support-page navigation.
- Document the release-review motion path for the story.

**Exit Criteria**

- Exported motion behavior is verified under the Pages-style base path.
- The homepage story remains the primary public experience.
- Supporting pages remain secondary and accessible.

**Verification**

- Browser tests cover the homepage, scene progression, reduced-motion behavior, and static-miss handling.
- Export verification passes against the static artifact.

## Sprint QA Review

### Ordering Check

- `04A` must come first because the project needs a motion contract before sticky progression and progress UI can be wired.
- `04B` follows because visible progress and sticky sequencing depend on the motion state model.
- `04C` comes next because reduced-motion and accessibility fallbacks should be built after the core motion path exists.
- `04D` comes last because release-review QA should validate the completed motion contract in the exported artifact.

### Scope Check

- The sprints stay inside Spec 04 by focusing on motion, progression, and interaction clarity.
- Layout orchestration remains the responsibility of Spec 03.
- Visual design tokens remain the responsibility of Spec 05.
- Visualization component internals remain the responsibility of Spec 06.
- Browser and export verification remain attached so motion bugs are caught in the published shape.

### Risk Check

- The biggest risk is scattering motion state across page components instead of centralizing it into a single contract.
- Another risk is adding visible progress without actually tying it to story progression.
- A smaller risk is treating reduced motion as a purely CSS concern instead of a full interaction fallback.

### Adjustments Applied

- The sprint sequence separates motion state, sticky progression, reduced-motion behavior, and release-review validation.
- The homepage remains the canonical single-page story, so motion work can stay focused on one surface.
- Supporting pages stay secondary, which keeps motion contracts from leaking into non-story content.

## Ready-to-Implement Recommendation

Start with `Sprint 04A: Scroll-Linked Motion Foundation`.

That sprint establishes the motion contract the remaining work depends on. If the state model is unstable, sticky progression and reduced-motion fallbacks will be difficult to verify.