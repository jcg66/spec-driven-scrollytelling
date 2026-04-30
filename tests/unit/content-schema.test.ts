import { describe, expect, it } from "vitest";

import { parseMarkdownSource, validateHomeDocumentSource, validateRouteDocumentSource } from "@/lib/content";

describe("parseMarkdownSource", () => {
  it("parses simple scalar and list frontmatter fields", () => {
    const document = parseMarkdownSource(
      `---
title: Example Page
layout: presentation
draft: true
highlights:
  - First
  - Second
---
Body copy`,
      "content/example.md",
    );

    expect(document.frontmatter).toEqual({
      title: "Example Page",
      layout: "presentation",
      draft: true,
      highlights: ["First", "Second"],
    });
    expect(document.body.trim()).toBe("Body copy");
  });
});

describe("validateHomeDocumentSource", () => {
  it("accepts a valid homepage source", () => {
    const document = validateHomeDocumentSource(
      `---
title: Home
summary: Summary
layout: standard
eyebrow: Intro
highlights:
  - One
  - Two
visualizationLabel: Visual Label
visualizationDescription: Visual Description
seoTitle: Home SEO
seoDescription: Home description
heroImage: images/home.png
---
Homepage body`,
      "content/home/index.md",
    );

    expect(document.highlights).toEqual(["One", "Two"]);
    expect(document.visualization.label).toBe("Visual Label");
    expect(document.seoTitle).toBe("Home SEO");
    expect(document.heroImage).toBe("images/home.png");
  });

  it("fails when required homepage fields are missing", () => {
    expect(() =>
      validateHomeDocumentSource(
        `---
title: Home
summary: Summary
layout: standard
eyebrow: Intro
visualizationLabel: Visual Label
visualizationDescription: Visual Description
---
Homepage body`,
        "content/home/index.md",
      ),
    ).toThrow('Frontmatter field "highlights" must be a non-empty string array.');
  });
});

describe("validateRouteDocumentSource", () => {
  it("accepts valid routeable frontmatter and optional fields", () => {
    const document = validateRouteDocumentSource(
      `---
title: Story
summary: Summary
layout: presentation
slug: stories/agent-loop
order: 2
seoTitle: Story SEO
seoDescription: Story description
heroImage: images/story.png
draft: false
---
Story body`,
      "content/pages/story.md",
    );

    expect(document.slug).toBe("stories/agent-loop");
    expect(document.order).toBe(2);
    expect(document.draft).toBe(false);
    expect(document.seoDescription).toBe("Story description");
  });

  it("fails when routeable required fields are incomplete", () => {
    expect(() =>
      validateRouteDocumentSource(
        `---
title: Story
summary: Summary
layout: presentation
---
Story body`,
        "content/pages/story.md",
      ),
    ).toThrow('Frontmatter field "slug" must be a non-empty string.');
  });

  it("fails invalid slug shapes instead of silently normalizing them", () => {
    expect(() =>
      validateRouteDocumentSource(
        `---
title: Story
summary: Summary
layout: presentation
slug: /stories/agent-loop/
---
Story body`,
        "content/pages/story.md",
      ),
    ).toThrow('Frontmatter field "slug" must be a slash-delimited public route with no leading or trailing slash.');
  });

  it("fails invalid optional field types", () => {
    expect(() =>
      validateRouteDocumentSource(
        `---
title: Story
summary: Summary
layout: presentation
slug: stories/agent-loop
draft: nope
---
Story body`,
        "content/pages/story.md",
      ),
    ).toThrow('Frontmatter field "draft" must be a boolean when provided.');
  });

  it("fails unknown frontmatter fields so authoring mistakes are explicit", () => {
    expect(() =>
      validateRouteDocumentSource(
        `---
title: Story
summary: Summary
layout: presentation
slug: stories/agent-loop
unknownField: value
---
Story body`,
        "content/pages/story.md",
      ),
    ).toThrow('Unexpected frontmatter field "unknownField".');
  });
});
