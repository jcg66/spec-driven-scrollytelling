export const PRESENTATION_SLIDE_DELIMITER = "<!-- slide -->";

export type MarkdownInlineNode =
  | {
      type: "text";
      value: string;
    }
  | {
      type: "emphasis";
      children: MarkdownInlineNode[];
    }
  | {
      type: "link";
      href: string;
      children: MarkdownInlineNode[];
    };

export type MarkdownBlockNode =
  | {
      type: "heading";
      level: 1 | 2 | 3 | 4 | 5 | 6;
      inlines: MarkdownInlineNode[];
    }
  | {
      type: "paragraph";
      inlines: MarkdownInlineNode[];
    }
  | {
      type: "list";
      items: MarkdownInlineNode[][];
    }
  | {
      type: "code";
      language: string | null;
      value: string;
    };

export type ParsedMarkdownDocument = {
  blocks: MarkdownBlockNode[];
};

export type ParsedPresentationSlide = {
  blocks: MarkdownBlockNode[];
};

export type ParsedPresentationDocument = {
  slides: ParsedPresentationSlide[];
};

function createMarkdownError(message: string): Error {
  return new Error(message);
}

function normalizeSourceText(sourceText: string): string {
  return sourceText.replace(/\r\n/g, "\n");
}

function isBlankLine(line: string): boolean {
  return !line.trim();
}

function isHeadingLine(line: string): boolean {
  return /^#{1,6}\s+\S/.test(line);
}

function isListItemLine(line: string): boolean {
  return /^\s*-\s+\S/.test(line);
}

function isCodeFenceLine(line: string): boolean {
  return /^```/.test(line.trim());
}

function isPresentationDelimiterLine(line: string): boolean {
  return line.trim() === PRESENTATION_SLIDE_DELIMITER;
}

function mergeTextNodes(nodes: MarkdownInlineNode[]): MarkdownInlineNode[] {
  const mergedNodes: MarkdownInlineNode[] = [];

  for (const node of nodes) {
    const lastNode = mergedNodes[mergedNodes.length - 1];

    if (node.type === "text" && lastNode?.type === "text") {
      lastNode.value += node.value;
      continue;
    }

    mergedNodes.push(node);
  }

  return mergedNodes.filter((node) => node.type !== "text" || node.value.length > 0);
}

function parseInlineNodes(text: string): MarkdownInlineNode[] {
  const nodes: MarkdownInlineNode[] = [];
  let cursor = 0;

  while (cursor < text.length) {
    const currentCharacter = text[cursor];

    if (currentCharacter === "[") {
      const linkCloseIndex = text.indexOf("](", cursor + 1);
      const hrefCloseIndex = linkCloseIndex === -1 ? -1 : text.indexOf(")", linkCloseIndex + 2);

      if (linkCloseIndex !== -1 && hrefCloseIndex !== -1) {
        const linkText = text.slice(cursor + 1, linkCloseIndex);
        const href = text.slice(linkCloseIndex + 2, hrefCloseIndex).trim();

        if (href) {
          nodes.push({
            type: "link",
            href,
            children: parseInlineNodes(linkText),
          });
          cursor = hrefCloseIndex + 1;
          continue;
        }
      }
    }

    if (currentCharacter === "*" || currentCharacter === "_") {
      const delimiter = text[cursor + 1] === currentCharacter ? currentCharacter + currentCharacter : currentCharacter;
      const searchStartIndex = cursor + delimiter.length;
      const closingIndex = text.indexOf(delimiter, searchStartIndex);

      if (closingIndex !== -1) {
        const emphasisText = text.slice(searchStartIndex, closingIndex);

        if (emphasisText.trim()) {
          nodes.push({
            type: "emphasis",
            children: parseInlineNodes(emphasisText),
          });
          cursor = closingIndex + delimiter.length;
          continue;
        }
      }
    }

    let nextSpecialIndex = text.length;

    for (const specialCharacter of ["[", "*", "_"]) {
      const candidateIndex = text.indexOf(specialCharacter, cursor + 1);

      if (candidateIndex !== -1 && candidateIndex < nextSpecialIndex) {
        nextSpecialIndex = candidateIndex;
      }
    }

    nodes.push({
      type: "text",
      value: text.slice(cursor, nextSpecialIndex),
    });
    cursor = nextSpecialIndex;
  }

  return mergeTextNodes(nodes);
}

function parseHeadingLine(line: string): MarkdownBlockNode {
  const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);

  if (!headingMatch) {
    throw createMarkdownError(`Invalid heading syntax: "${line}".`);
  }

  return {
    type: "heading",
    level: headingMatch[1].length as 1 | 2 | 3 | 4 | 5 | 6,
    inlines: parseInlineNodes(headingMatch[2].trim()),
  };
}

function parseListItems(lines: string[], startIndex: number): { block: MarkdownBlockNode; nextIndex: number } {
  const items: MarkdownInlineNode[][] = [];
  let index = startIndex;

  while (index < lines.length) {
    const listMatch = lines[index].match(/^\s*-\s+(.+)$/);

    if (!listMatch) {
      break;
    }

    items.push(parseInlineNodes(listMatch[1].trim()));
    index += 1;
  }

  return {
    block: {
      type: "list",
      items,
    },
    nextIndex: index,
  };
}

function parseCodeBlock(lines: string[], startIndex: number): { block: MarkdownBlockNode; nextIndex: number } {
  const openingFenceLine = lines[startIndex].trim();
  const language = openingFenceLine.slice(3).trim() || null;
  const codeLines: string[] = [];
  let index = startIndex + 1;

  while (index < lines.length && !isCodeFenceLine(lines[index])) {
    codeLines.push(lines[index]);
    index += 1;
  }

  if (index >= lines.length) {
    throw createMarkdownError("Markdown code fence is not closed.");
  }

  return {
    block: {
      type: "code",
      language,
      value: codeLines.join("\n"),
    },
    nextIndex: index + 1,
  };
}

export function parseMarkdownBlocks(sourceText: string): ParsedMarkdownDocument {
  const lines = normalizeSourceText(sourceText).split("\n");
  const blocks: MarkdownBlockNode[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];

    if (isBlankLine(line)) {
      index += 1;
      continue;
    }

    if (isCodeFenceLine(line)) {
      const { block, nextIndex } = parseCodeBlock(lines, index);
      blocks.push(block);
      index = nextIndex;
      continue;
    }

    if (isHeadingLine(line)) {
      blocks.push(parseHeadingLine(line));
      index += 1;
      continue;
    }

    if (isListItemLine(line)) {
      const { block, nextIndex } = parseListItems(lines, index);
      blocks.push(block);
      index = nextIndex;
      continue;
    }

    const paragraphLines: string[] = [];

    while (index < lines.length) {
      const paragraphLine = lines[index];

      if (
        isBlankLine(paragraphLine) ||
        isCodeFenceLine(paragraphLine) ||
        isHeadingLine(paragraphLine) ||
        isListItemLine(paragraphLine) ||
        isPresentationDelimiterLine(paragraphLine)
      ) {
        break;
      }

      paragraphLines.push(paragraphLine.trim());
      index += 1;
    }

    if (paragraphLines.length === 0) {
      throw createMarkdownError(`Unsupported markdown syntax: "${line}".`);
    }

    blocks.push({
      type: "paragraph",
      inlines: parseInlineNodes(paragraphLines.join(" ")),
    });
  }

  if (blocks.length === 0) {
    throw createMarkdownError("Markdown content must contain at least one block.");
  }

  return {
    blocks,
  };
}

function splitPresentationSegments(sourceText: string): string[] {
  const lines = normalizeSourceText(sourceText).split("\n");
  const segments: string[][] = [[]];
  let insideCodeBlock = false;

  for (const line of lines) {
    if (isCodeFenceLine(line)) {
      insideCodeBlock = !insideCodeBlock;
      segments[segments.length - 1].push(line);
      continue;
    }

    if (!insideCodeBlock && isPresentationDelimiterLine(line)) {
      segments.push([]);
      continue;
    }

    segments[segments.length - 1].push(line);
  }

  if (segments.some((segment) => segment.every((line) => isBlankLine(line)))) {
    throw createMarkdownError(`Presentation slide delimiters cannot create empty slides with "${PRESENTATION_SLIDE_DELIMITER}".`);
  }

  return segments.map((segment) => segment.join("\n"));
}

export function parsePresentationMarkdown(sourceText: string): ParsedPresentationDocument {
  const slides = splitPresentationSegments(sourceText).map((slideSourceText) => ({
    blocks: parseMarkdownBlocks(slideSourceText).blocks,
  }));

  return {
    slides,
  };
}