# Spec 12: Cinematic Interactions and Motion

## Purpose

Layer the script’s scroll-linked motion and interactive storytelling onto the scene architecture so the production visuals feel directed instead of decorative.

## Requirements

- Scroll position must drive the prompt typing, scene progression, and reveal timing for the scripted beats.
- Motion timing should follow an intentional exponential-deceleration feel rather than bouncy or toy-like easing.
- The visual grounding sequence must support a browser sandbox, phosphor-green bounding boxes with crosshair corners, scan-line motion, and a ghost cursor path that snaps with machine precision.
- The execution loop must surface action logs, MCP-style responses, correction loops, action pings, and the right-side progress rail as readable motion rather than noisy animation.
- Motion must remain optional or degradable so reduced-motion users still receive the same story in a static reading stack.
- Interaction logic must stay aligned with the five-scene progression defined by the final script.

## In Scope

- Scroll-linked motion controller and scene state transitions.
- Sticky narration and zoom choreography.
- Visual grounding overlays, cursor movement, and terminal/log sequencing.
- The laser-line sweep, action pings, and progress-rail fill that make the execution loop feel operational.
- Reduced-motion fallbacks for the same story beats.

## Non-Goals

- Reworking the scene architecture from Spec 11.
- Replacing the design token system from Spec 10.
- Adding a new animation stack purely for novelty.
- Changing routing, deployment, or content authoring conventions.

## Acceptance Criteria

- The prompt, grounding, and execution scenes animate in the order and timing implied by the script.
- The browser and terminal layers remain readable as the primary story elements.
- Reduced-motion mode still exposes the full narrative without scroll-jank or hidden state.
- Motion details like the scan line, cursor snap, and progress rail reinforce the story instead of distracting from it.

## Automated Verification

- Browser coverage for scroll progression, scene transitions, and mobile behavior.
- Reduced-motion browser checks that confirm the story remains readable and linear.
