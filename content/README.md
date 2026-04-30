# Content Sources

This directory contains the Markdown source inputs for the published site and for supporting authoring work.

## Published Sources

- `home/index.md`: the dedicated homepage source.
- `pages/**/*.md`: routeable narrative pages with validated frontmatter.

Only these published sources enter the application content pipeline.

## Reference Sources

- `reference/**/*.md`: research notes, story outlines, and authoring support material.

Reference sources are intentionally excluded from routing and published-content discovery. To publish reference material, copy or convert it into `home/` or `pages/` with the documented frontmatter schema.
