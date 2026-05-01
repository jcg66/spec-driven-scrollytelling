# Content Sources

This directory contains the Markdown source inputs for the published site and for supporting authoring work.

## Published Sources

- `home/index.md`: the dedicated homepage source.
- `pages/**/*.md`: routeable narrative pages with validated frontmatter.

Only these published sources enter the application content pipeline.

## Reference Sources

- `reference/**/*.md`: research notes, story outlines, and authoring support material.

Reference sources are intentionally excluded from routing and published-content discovery. To publish reference material, copy or convert it into `home/` or `pages/` with the documented frontmatter schema.

## Markdown Parsing Contract

Published Markdown is parsed at build time by the custom parser in `src/lib/content/markdown-parser.ts`.

- Standard content is parsed into structured blocks for headings, paragraphs, lists, links, emphasis, and fenced code blocks.
- Presentation pages use a single slide delimiter: `<!-- slide -->` on its own line.
- The parser is deterministic and intentionally small so the content model stays testable without runtime Markdown dependencies.
