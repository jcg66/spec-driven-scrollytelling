# Spec 06 Sprint Plan: Visualization Components

## Spec Intent

Spec 06 turns the story's visual ideas into a deterministic Markdown embedding system. The goal is to let the narrative combine prose with structured diagrams, logs, callouts, and summary widgets without resorting to bespoke page-only code.

## Needed Inputs and Integration Model

Spec 06 builds on the tokenized design system from Spec 05 and the motion-capable story from Spec 04. It assumes the project already has a canonical homepage story, supporting content pages, and a stable static export path.

The integration rule should stay explicit:

- Visualization components should be authored from Markdown through one documented embedding contract.
- Embedded visuals should stay stylistically consistent with the shared design system.
- High-cost effects should be optional enhancements with clear fallback content.

## Sprint Breakdown

### Sprint 06A: Markdown Visualization Contract and Parser Support

**Goal**

Define the deterministic Markdown contract for embedded visualization components before building out the widget library.

**Scope**

- Add parser support for fenced visualization blocks using the `viz:<component-id>` info-string convention.
- Enumerate the initial supported component identifiers: `stat-grid`, `timeline`, `event-log`, `capability-list`, `decision-flow`, and `code-sample`.
- Validate component payloads against component-specific schemas.
- Fail clearly on unsupported identifiers or malformed payloads.

**Exit Criteria**

- Markdown authors can declare supported visualization blocks without guessing syntax.
- Invalid component blocks fail during parsing or validation.
- The embedding contract is deterministic and documented in code.

**Verification**

- Parser tests cover supported component syntax, identifier validation, and malformed-payload failures.

### Sprint 06B: Core Visualization Component Library

**Goal**

Build the reusable widget set that the story can embed from Markdown.

**Scope**

- Implement the supported v1 visualization components as reusable React blocks or composed layouts.
- Keep the components aligned with the existing design tokens and typography system.
- Provide sensible reduced-motion and low-interactivity fallbacks for each component.
- Reuse the same component primitives across narrative and supporting contexts where appropriate.

**Exit Criteria**

- The supported visualization set renders consistently in isolation.
- Each component has a readable fallback state.
- The component library is reusable rather than one-off page code.

**Verification**

- Component tests cover render contracts and fallback behavior for each supported visualization type.

### Sprint 06C: Narrative Embedding and Exported Rendering

**Goal**

Wire the Markdown embedding system into the published story surfaces and verify it in the exported artifact.

**Scope**

- Render embedded visualization blocks inside Markdown-authored pages.
- Confirm supported visuals work in both standard and presentation contexts where applicable.
- Keep the homepage story and supporting pages readable when visuals are absent or reduced.
- Preserve static-export compatibility under the repository base path.

**Exit Criteria**

- At least one real story page renders an embedded visualization block.
- Embedded visuals remain readable in the exported artifact.
- The content pipeline still behaves deterministically under static export.

**Verification**

- Browser tests confirm at least one embedded visualization renders correctly inside a real narrative page.
- Export verification passes against the static artifact.

### Sprint 06D: Release-Review Visualization QA

**Goal**

Prove the completed visualization embedding system works in the exported artifact without breaking the story contract.

**Scope**

- Run browser coverage against the exported static artifact.
- Confirm embedded visuals, fallback states, and page navigation all remain stable.
- Verify the visualization system does not regress the homepage or support-page content flow.
- Document the release-review visualization path.

**Exit Criteria**

- Exported visualization behavior is verified under the Pages-style base path.
- The homepage story remains readable and coherent with visuals present.
- Supporting pages remain accessible and secondary.

**Verification**

- Browser tests cover the homepage, at least one embedded visualization, reduced-interactivity fallbacks, and static-miss handling.
- Export verification passes against the static artifact.

## Sprint QA Review

### Ordering Check

- `06A` must come first because the Markdown contract and parser validation should exist before any component work is trusted.
- `06B` follows because the component library depends on the supported contract being stable.
- `06C` comes next because narrative embedding should consume the completed parser and component library rather than inventing its own syntax.
- `06D` comes last because release-review QA should validate the completed visualization contract in the exported artifact.

### Scope Check

- The sprints stay inside Spec 06 by focusing on visualization embedding, component reuse, and fallback rendering.
- Motion timing and page choreography remain the responsibility of Spec 04.
- Visual tokens and accessibility shell work remain the responsibility of Spec 05.
- Narrative sequencing and layout orchestration remain the responsibility of Spec 03.
- Content source validation remains anchored in Spec 02.

### Risk Check

- The biggest risk is creating a loose MDX-style system that becomes hard to validate.
- Another risk is shipping visuals that only work in ideal motion-rich conditions.
- A smaller risk is introducing bespoke page code instead of reusable components.

### Adjustments Applied

- The sprint sequence separates contract design, component implementation, narrative embedding, and release-review validation.
- Supported identifiers are enumerated up front so authors know exactly what can be embedded.
- Fallback behavior is treated as part of the component contract, not an afterthought.

## Ready-to-Implement Recommendation

Start with `Sprint 06A: Markdown Visualization Contract and Parser Support`.

That sprint locks the embedding syntax and validation rules the rest of Spec 06 depends on. If the contract is unstable, the widget library and narrative integration will drift.