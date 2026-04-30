# Spec 02 Sprint Plan: Content and Routing

## Spec Intent

Spec 02 turns the placeholder architecture from Spec 01 into a real Markdown-first content system. The goal is to let authors add a homepage and routeable narrative pages through validated content files, while keeping routing deterministic, GitHub-Pages-safe, and fully testable at build time.

## Needed Inputs and Integration Model

Spec 02 needs three distinct Markdown source classes so future research can be added freely without destabilizing routing:

- `Published home source`: one dedicated Markdown file for the homepage.
- `Published routeable pages`: Markdown files with validated frontmatter that become public routes.
- `Reference sources`: research notes, story fragments, outlines, and other Markdown used during authoring, but excluded from route generation by default.

The integration rule should be explicit: reference Markdown is not auto-published. It informs authored pages, but only content moved into the published home source or published routeable-page sources enters the build pipeline for routing and rendering.

## Sprint Breakdown

### Sprint 02A: Content Sources and Frontmatter Schema

**Goal**

Define the authoring contract for homepage content and routeable pages before any routing or rendering logic depends on it.

**Scope**

- Create the dedicated homepage Markdown source separate from routeable content pages.
- Create the routeable content directory convention for Markdown-authored pages.
- Create a non-routeable reference-source convention for research and story-planning Markdown.
- Define and implement a formal frontmatter schema with required fields: `title`, `summary`, `layout`, and `slug`.
- Document and validate optional fields: `order`, `seoTitle`, `seoDescription`, `heroImage`, and `draft`.
- Treat `draft: true` as the explicit non-routeable flag unless a narrower documented rule is chosen during implementation.
- Fail fast on invalid or incomplete frontmatter during validation.

**Exit Criteria**

- The project has documented conventions for homepage, routeable-page, and reference-only Markdown sources.
- Frontmatter rules are formalized in code instead of being implied by component usage.
- Invalid content fails deterministically before UI rendering begins.

**Verification**

- Unit tests cover required-field validation, optional-field semantics, homepage-source separation, ignored-reference-source behavior, and invalid-frontmatter failure cases.

### Sprint 02B: Content Discovery and Route Registry

**Goal**

Turn validated Markdown files into a deterministic route registry that exactly matches the allowed public pages.

**Scope**

- Discover content files from the documented source locations.
- Build repository helpers that load, validate, and return homepage content separately from routeable page content.
- Ensure reference-source directories are intentionally excluded from route discovery.
- Enforce slug normalization, uniqueness, and slash-delimited public route rules.
- Reserve app-owned routes such as the homepage, `404`, and any utility paths introduced by the app.
- Exclude only content explicitly marked non-routeable by the documented schema.
- Generate static route params from the validated route registry.

**Exit Criteria**

- Route generation matches the valid routeable content set exactly.
- Duplicate, reserved, or malformed slugs fail before static generation proceeds.
- Homepage content and routeable content are loaded through distinct repository seams.

**Verification**

- Unit tests cover content discovery, reserved-route protection, duplicate-slug failures, invalid-slug failures, route filtering for non-routeable content, reference-source exclusion, and static param generation.

### Sprint 02C: Markdown Parsing and Presentation Segmentation

**Goal**

Define one deterministic Markdown parsing contract that supports both long-form pages and presentation-style pages from the same content system.

**Scope**

- Choose and document the Markdown parsing stack for build-time content processing.
- Define one slide-boundary delimiter rule for presentation pages and document it for contributors.
- Parse standard pages into stable long-form content structures.
- Parse presentation pages into a deterministic slide or chapter sequence from the same Markdown source.
- Keep reference-source Markdown outside the published parsing pipeline unless a later spec introduces an explicit authoring-assist workflow.
- Normalize key Markdown constructs that later layout work will rely on predictably.

**Exit Criteria**

- The same Markdown source always parses into the same page structure.
- Presentation segmentation behavior is documented clearly enough for future authors to follow without guessing.
- Parser output is stable enough for later layout and visualization specs to consume.

**Verification**

- Parser tests cover standard pages, presentation-page segmentation, delimiter edge cases, and invalid segmentation cases.
- Snapshot or structured render tests confirm predictable conversion of headings, paragraphs, lists, links, emphasis, and code blocks.

### Sprint 02D: App Router Integration for Content-Driven Pages

**Goal**

Wire the validated content system into Next App Router so authors can add or update pages without editing route code per page.

**Scope**

- Render the homepage from its dedicated Markdown source.
- Add content-driven route generation for routeable Markdown pages.
- Connect layout selection to frontmatter metadata without absorbing Spec 03 narrative behavior.
- Generate page metadata from validated content through the existing base-path-aware helper layer.
- Preserve a clean promotion path where research or story-reference Markdown can be turned into published pages by copying or converting it into the published content sources, without changing routing code.
- Ensure missing, invalid, or non-routeable content resolves through the static-routing model instead of silent fallbacks.
- Keep the exported artifact compatible with the GitHub Pages subpath contract from Spec 01.

**Exit Criteria**

- Authors can add or update valid content files without editing routing code for each page.
- Homepage and routeable pages render from the same validated content pipeline, while remaining separate source types.
- Authors can expand research and story-reference Markdown freely without creating accidental public routes.
- Static misses and protected routes behave correctly in the exported site.

**Verification**

- Integration or component tests cover metadata generation, layout selection from frontmatter, and route lookup behavior.
- Browser tests against the exported artifact cover the homepage, at least one generated content route, navigation under the repository base path, and a protected or missing route case.

## Sprint QA Review

### Ordering Check

- `02A` comes first because schema decisions must exist before file discovery, parsing, or route generation can be trusted.
- `02B` follows because routing and duplicate-slug protection depend on validated content objects, not raw frontmatter.
- `02C` comes next because page parsing should operate on validated, discoverable content instead of re-solving route concerns.
- `02D` comes last because app integration should consume the completed content, routing, and parsing contracts rather than inventing them ad hoc inside route components.

### Scope Check

- The sprints stay inside Spec 02 by focusing on content sources, validation, parsing, and routing contracts.
- Rich page choreography, sticky-stage behavior, and canonical-story sequencing remain deferred to Spec 03.
- Motion timing and transition behavior remain deferred to Spec 04.
- Visualization embedding behavior beyond parser readiness remains deferred to Spec 06.
- CI expansion and broader definition-of-done work remain deferred to Spec 07 and Spec 08.

### Risk Check

- The largest risk is letting page rendering concerns leak backward into content parsing, which would make authoring rules harder to test and reuse.
- Another major risk is leaving the non-routeable-content rule ambiguous; this plan assumes `draft` is the explicit exclusion flag unless implementation finds a better documented contract.
- A separate risk is accidentally mixing reference Markdown with published-content discovery, which would create unstable routes and unclear authoring expectations.
- A smaller but real risk is testing parsed content only in isolation and not through exported routes under the repository base path.

### Adjustments Applied

- The sprint order separates schema, discovery, parsing, and app integration so failures can be isolated early.
- Reserved-route and duplicate-slug enforcement is treated as core routing work, not cleanup.
- Reference-source handling is made explicit so research notes can accumulate safely without becoming accidental site pages.
- Exported-artifact browser verification is attached to the final integration sprint so Spec 02 closes with production-shape evidence instead of unit coverage only.

## Ready-to-Implement Recommendation

Start with `Sprint 02A: Content Sources and Frontmatter Schema`.

That sprint locks the authoring contract the rest of Spec 02 depends on. If the schema, source separation, or `draft` semantics are unstable, later routing and parser work will be forced to churn.
