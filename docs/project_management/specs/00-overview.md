# Spec 00: Overview

## Purpose

The project will be a scrollytelling website that explains how an agentic AI system interprets a user goal, plans across tools, acts inside software environments, and converges on a result. The experience should make this process intelligible to a non-expert audience without reducing it to marketing copy or implementation trivia.

## Product Outcome

By the end of the experience, a visitor should understand:

- agentic AI is about goal-directed action, not only language generation,
- perception, reasoning, and action are separate but coordinated functions,
- software interaction is shifting from manual app-by-app operation toward delegated workflows,
- and this shift matters because it connects human intent to real digital outcomes.

## Primary Audience

- Students and general technical audiences who know what AI is but do not yet have a concrete mental model of how agents operate.
- Instructors or reviewers evaluating whether the project communicates a complex technical idea clearly and professionally.

## Core Constraints

- The site must be statically exportable.
- The content model must support narrative iteration without requiring frequent JSX edits.
- The scrollytelling experience must remain understandable with reduced motion enabled.
- The project must remain vendor-neutral at the product level even if examples reference current ecosystems.

## Non-Goals

- Teaching readers how to implement an AI agent backend.
- Building a real autonomous agent or live integration with external software.
- Turning the site into a general-purpose blog or documentation portal.
- Optimizing for maximum animation density over clarity.

## Success Criteria

- The narrative remains coherent from first scroll to final outcome.
- Each major chapter communicates a distinct part of the agent loop.
- The visual language reinforces the explanation instead of distracting from it.
- Content, layout, motion, and embedded visuals work together as a single explanatory system.

## Automated Verification

- Smoke e2e coverage must confirm that the homepage and at least one presentation page build and render successfully.
- Content validation must fail the build when required metadata or routeable content is invalid.
