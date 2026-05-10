# Spec 10 Sprint Plan: Design and Layout Integration

## Spec Intent

Spec 10 translates the advanced design and layout direction into the live site while keeping the project stable. The goal is to upgrade the visual language and scene composition without introducing layout drift, accessibility regressions, or brittle motion dependencies.

## Current Design and Layout Snapshot

The current codebase already has a useful baseline:

- the site has explicit tokens and a coherent visual system from Spec 05,
- the story uses distinct scenes and layout modes from Specs 03 and 04,
- the exported artifact already passes browser coverage under the Pages-style base path,
- and the design reference materials already define the intended advanced aesthetic.

The gap is integration discipline rather than raw capability:

- the advanced visual treatment is more ambitious than the current implementation,
- the new look needs to be applied without breaking reading order or mobile behavior,
- and the work must be staged so any unstable visual change can be isolated quickly.

## Needed Inputs and Integration Model

Spec 10 builds on the finished content, motion, visualization, QA, and deployment work, plus the refreshed story content from Spec 09.

The integration rule should stay explicit:

- Spec 09 establishes the story language.
- Spec 10 expresses that language visually.
- design tokens and reusable components absorb the style changes before scene-specific composition does.
- any change that touches layout must preserve accessibility, exportability, and browser-test stability.

## Sprint Breakdown

### Sprint 10A: Design Token and Component Translation

**Goal**

Translate the advanced design direction into stable, reusable tokens and primitives before scene-level layout changes begin.

**Scope**

- Expand the existing design tokens to cover the advanced palette, surface depth, grain, glow, and high-contrast overlay language.
- Define the component-level primitives needed for recurring treatments like HUD panels, log rails, bento tiles, success cards, and the custom pointer treatment.
- Keep the changes token-driven so the visual language remains centralized instead of spreading through ad hoc styles.
- Establish explicit fallbacks for reduced motion, limited contrast modes, and lower-power rendering paths.

**Exit Criteria**

- The advanced visual language exists as a controlled set of tokens and reusable primitives.
- New styles can be applied consistently without duplicating one-off CSS across scenes.
- The current pages still render correctly before any deep scene choreography changes land.

**Verification**

- Targeted browser review of the existing pages plus export verification to confirm the new tokens do not destabilize the baseline.

### Sprint 10B: Scene Composition and Layout Choreography

**Goal**

Apply the advanced visual language to the five scenes while preserving reading order, responsiveness, and the existing story progression.

**Scope**

- Recompose the homepage scenes to match the advanced layout cues from the design and layout references.
- Add or refine scene-specific treatments for Spark, Deconstruction, Digital Eye, Execution Loop, and Outcome.
- Keep the visual treatment strong enough to feel cinematic but restrained enough to remain legible and stable.
- Preserve the current content structure and browser assertions wherever possible, adjusting tests only when the layout change is intentional.

**Exit Criteria**

- The homepage presents the updated story with the intended advanced layout language.
- The five scenes still read as one continuous experience.
- Mobile and desktop layouts both preserve the story sequence and the key interactions.

**Verification**

- Browser review across desktop and mobile viewports, plus exported-artifact verification.

### Sprint 10C: Stability Hardening and Regression QA

**Goal**

Lock the new design and layout in place by checking for drift, instability, and accessibility regressions.

**Scope**

- Validate that the new layout choices do not break keyboard traversal, reduced-motion behavior, or reading order.
- Verify that decorative effects such as glow, grain, cursor styling, scanning lines, and progress rails remain non-blocking.
- Review the exported artifact for visual stability and content integrity.
- Tighten any browser assertions that became brittle because of the new visual composition.

**Exit Criteria**

- The advanced design can be shipped without harming the existing QA baseline.
- The experience remains understandable when motion is reduced or the viewport shrinks.
- The test suite still describes the behavior that matters instead of overfitting to incidental visual details.

**Verification**

- Full export verification plus targeted browser runs for the layout-sensitive flows.

## Sprint QA Review

### Ordering Check

- `10A` comes first because a tokenized design foundation reduces the risk of one-off visual drift.
- `10B` follows because scene composition should build on stable primitives, not on experimental ad hoc styles.
- `10C` comes last because the project needs a deliberate hardening pass after the new layout is in place.

### Scope Check

- The sprints stay inside Spec 10 by focusing on visual integration, layout choreography, and stability.
- Narrative content remains owned by Spec 09.
- Routing, deployment, and QA system changes remain out of scope.
- Any motion changes must support the layout rather than define it independently.

### Risk Check

- The biggest risk is letting advanced visuals bypass the design-token layer and sprawl into scene-specific hacks.
- Another risk is improving the look in ways that make the reading order or mobile layout harder to follow.
- A smaller risk is letting decorative motion become test-critical, which would make the suite brittle and the release unstable.

### Adjustments Applied

- The sprint sequence starts with token and component translation to keep the design language centralized.
- The composition sprint is separated from the hardening sprint so the project can absorb aesthetic change without conflating it with regression cleanup.

## Ready-to-Implement Recommendation

Start with `Sprint 10A: Design Token and Component Translation`.

The current implementation already has the structural pieces needed for the advanced design. What it needs now is a controlled translation of the visual language into reusable tokens and layout primitives so the project can evolve without drifting or becoming brittle.