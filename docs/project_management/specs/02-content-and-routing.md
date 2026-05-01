# Spec 02: Content and Routing

## Purpose

Create a Markdown-first content system that lets the project tell a structured technical story while keeping authoring accessible and safely validated.

## Requirements

- The homepage must be authored from a dedicated Markdown source, separate from routeable content pages.
- Routeable pages must be authored in Markdown with frontmatter-based metadata.
- Research notes, story planning notes, and other reference Markdown may exist as non-routeable source material, but they must stay outside the public route set unless explicitly promoted into the routeable content schema.
- Routeable page frontmatter must include `title`, `summary`, `layout`, and `slug`.
- The schema may include optional fields such as `order`, `seoTitle`, `seoDescription`, `heroImage`, and `draft`, but their semantics must be documented and validated.
- `slug` must be a unique slash-delimited public route with no leading or trailing slash; duplicate, reserved, or invalid slugs must fail validation.
- Content loading must validate frontmatter at build time using a formal schema.
- The routing layer must support a single canonical public homepage route for the story; any other Markdown stays non-routeable unless explicitly promoted.
- The content model must support both supporting explanatory content and the single presentation-style scrollytelling page.
- Presentation slide boundaries must be encoded with one documented delimiter rule; the same source content must always parse into the same slide sequence.
- Content parsing rules must be deterministic and documented well enough for future contributors to author pages safely.

## In Scope

- Home content source.
- Routeable content pages.
- Non-routeable reference-source conventions for research and story-development Markdown.
- Frontmatter schema validation.
- Reserved-route policy and duplicate-route failure behavior.
- Static param generation from content files.
- Markdown parsing strategy, including any delimiters used for presentation slides.

## Non-Goals

- WYSIWYG editing.
- Live user-generated content.
- Complex runtime personalization.

## Acceptance Criteria

- Invalid or incomplete frontmatter fails during validation instead of degrading silently in the UI.
- Route generation matches the set of valid content files exactly, excluding only content explicitly marked non-routeable by the documented schema.
- Reference Markdown used for research or story development is ignored by route generation unless it is explicitly converted into a documented published-content source.
- The canonical narrative page can express chapter or section boundaries through the chosen content format.
- Reserved routes such as the homepage, `404`, and any app-owned utility routes cannot be claimed accidentally by content.
- Authors can add or update narrative content without editing routing code for each page.

## Automated Verification

- Unit tests cover schema validation, content discovery, slug generation, reserved-route protection, duplicate-slug failure cases, ignored-reference-source behavior, and invalid-content failure cases.
- Parser tests cover normal pages, presentation-page segmentation behavior, and the exact delimiter contract used for slides.
- Snapshot or structured render tests confirm that key Markdown constructs are converted predictably.
