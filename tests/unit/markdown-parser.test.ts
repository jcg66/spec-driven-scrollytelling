import { describe, expect, it } from "vitest";

import { PRESENTATION_SLIDE_DELIMITER, parseMarkdownBlocks, parsePresentationMarkdown } from "@/lib/content";

describe("parseMarkdownBlocks", () => {
  it("parses headings, paragraphs, lists, links, emphasis, and code blocks into a structured document", () => {
    const document = parseMarkdownBlocks(`
# Story Title

This is a *focused* paragraph with a [reference link](https://example.com).

- First item
- Second item

\`\`\`ts
const answer = 42;
\`\`\`
`);

    expect(document.blocks).toEqual([
      {
        type: "heading",
        level: 1,
        inlines: [
          {
            type: "text",
            value: "Story Title",
          },
        ],
      },
      {
        type: "paragraph",
        inlines: [
          {
            type: "text",
            value: "This is a ",
          },
          {
            type: "emphasis",
            children: [
              {
                type: "text",
                value: "focused",
              },
            ],
          },
          {
            type: "text",
            value: " paragraph with a ",
          },
          {
            type: "link",
            href: "https://example.com",
            children: [
              {
                type: "text",
                value: "reference link",
              },
            ],
          },
          {
            type: "text",
            value: ".",
          },
        ],
      },
      {
        type: "list",
        items: [
          [
            {
              type: "text",
              value: "First item",
            },
          ],
          [
            {
              type: "text",
              value: "Second item",
            },
          ],
        ],
      },
      {
        type: "code",
        language: "ts",
        value: "const answer = 42;",
      },
    ]);
  });
});

describe("parsePresentationMarkdown", () => {
  it("splits a presentation page into deterministic slides using the documented delimiter", () => {
    const document = parsePresentationMarkdown(`
# First slide
Intro paragraph.

${PRESENTATION_SLIDE_DELIMITER}

## Second slide
Second slide paragraph.
`);

    expect(document.slides).toHaveLength(2);
    expect(document.slides[0]?.blocks).toEqual([
      {
        type: "heading",
        level: 1,
        inlines: [
          {
            type: "text",
            value: "First slide",
          },
        ],
      },
      {
        type: "paragraph",
        inlines: [
          {
            type: "text",
            value: "Intro paragraph.",
          },
        ],
      },
    ]);
    expect(document.slides[1]?.blocks).toEqual([
      {
        type: "heading",
        level: 2,
        inlines: [
          {
            type: "text",
            value: "Second slide",
          },
        ],
      },
      {
        type: "paragraph",
        inlines: [
          {
            type: "text",
            value: "Second slide paragraph.",
          },
        ],
      },
    ]);
  });

  it("treats a presentation page with no delimiter as one slide", () => {
    const document = parsePresentationMarkdown(`
# Lone slide
One slide only.
`);

    expect(document.slides).toHaveLength(1);
    expect(document.slides[0]?.blocks[0]).toEqual({
      type: "heading",
      level: 1,
      inlines: [
        {
          type: "text",
          value: "Lone slide",
        },
      ],
    });
  });

  it("rejects empty slides created by leading, trailing, or consecutive delimiters", () => {
    expect(() => parsePresentationMarkdown(`${PRESENTATION_SLIDE_DELIMITER}\n\n# Slide`)).toThrow(
      `Presentation slide delimiters cannot create empty slides with "${PRESENTATION_SLIDE_DELIMITER}".`,
    );

    expect(() => parsePresentationMarkdown(`# Slide\n\n${PRESENTATION_SLIDE_DELIMITER}`)).toThrow(
      `Presentation slide delimiters cannot create empty slides with "${PRESENTATION_SLIDE_DELIMITER}".`,
    );

    expect(() =>
      parsePresentationMarkdown(`# Slide one\n\n${PRESENTATION_SLIDE_DELIMITER}\n\n${PRESENTATION_SLIDE_DELIMITER}\n\n# Slide two`),
    ).toThrow(`Presentation slide delimiters cannot create empty slides with "${PRESENTATION_SLIDE_DELIMITER}".`);
  });
});