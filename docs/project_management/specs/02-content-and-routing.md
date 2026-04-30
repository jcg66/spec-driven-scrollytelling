# Spec 02: Content and Routing

## Purpose

Create a Markdown-first content system that lets the project tell a structured technical story while keeping authoring accessible and safely validated.

## Requirements

- Routeable pages must be authored in Markdown with frontmatter-based metadata.
- The content schema must define required fields for title, summary, layout mode, and ordering or routing metadata.
- Content loading must validate frontmatter at build time using a formal schema.
- The routing layer must support a homepage and additional pages derived from content files.
- The content model must support both explanatory long-form pages and presentation-style scrollytelling pages.
- Content parsing rules must be deterministic and documented well enough for future contributors to author pages safely.

## In Scope

- Home content source.
- Routeable content pages.
- Frontmatter schema validation.
- Static param generation from content files.
- Markdown parsing strategy, including any delimiters used for presentation slides.

## Non-Goals

- WYSIWYG editing.
- Live user-generated content.
- Complex runtime personalization.

## Acceptance Criteria

- Invalid or incomplete frontmatter fails during validation instead of degrading silently in the UI.
- Route generation matches the set of valid content files exactly.
- Presentation pages can express chapter or slide boundaries through the chosen content format.
- Authors can add or update narrative content without editing routing code for each page.

## Automated Verification

- Unit tests cover schema validation, content discovery, slug generation, and invalid-content failure cases.
- Parser tests cover normal pages and presentation-page segmentation behavior.
- Snapshot or structured render tests confirm that key Markdown constructs are converted predictably.
