# Spec 11: Visual Architecture and Scene System

## Purpose

Translate the final script into a scene-first production architecture so the visual system is driven by explicit scene data instead of incidental markdown structure.

## Requirements

- The final script must be representable as explicit scene metadata with stable labels, beats, and visual cues for Spark, The Logic Gate, The Digital Eye, The Execution Loop, and The Post-App Era.
- Shared primitives must cover the recurring production motifs: glowing prompt field, cloud-like brain core, dependency graph, bento grid, browser sandbox simulation, action rail, success orb, and summary card.
- Markdown may remain the content source, but advanced visuals must be composed through reusable components and scene configuration rather than one-off markdown hacks.
- The layout must preserve reading order, route behavior, and the single-page scroll-activated story structure across all five scripted scenes.
- Decorative assets and scene metadata must remain optional so the experience degrades cleanly if a component is unavailable.
- Visual treatment must match the production references: deep-space minimalism, ultra-dark glass, phosphor-green accents, micro-borders, neural filaments, and high-contrast summary surfaces.

## In Scope

- Scene metadata or scene-manifest layer.
- Visual component primitives for the final script’s recurring motifs.
- Scene-level composition for the opening story beats: Spark and The Logic Gate.
- Token hooks for ambient grain, glass, glow, chrome, and script-specific scene labels.
- Visual browser simulation layers for the Digital Eye scene, if they can be expressed without a real sandbox runtime.

## Non-Goals

- Final motion choreography.
- Export or CI changes.
- Story rewrite beyond aligning to the final script.
- Implementing a full browser sandbox, computer-use runtime, or other interactive control surface unless a later spec explicitly requires it.
- Backend or API work.

## Acceptance Criteria

- The first two scenes can be rendered from shared scene data rather than ad hoc markup.
- Scene labels, structure, and supporting chrome match the final script rather than generic placeholder language.
- Scene changes do not disturb the existing route contract or markdown-first content pipeline.
- The site still reads correctly on mobile and with reduced motion.

## Automated Verification

- Unit tests for scene metadata and primitive composition.
- Browser checks that the opening scenes render with the expected labels, structure, and reading order.
