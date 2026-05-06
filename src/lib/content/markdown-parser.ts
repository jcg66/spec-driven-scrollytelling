export const PRESENTATION_SLIDE_DELIMITER = "<!-- slide -->";

export const SUPPORTED_VISUALIZATION_COMPONENT_IDS = [
  "stat-grid",
  "timeline",
  "event-log",
  "capability-list",
  "decision-flow",
  "code-sample",
] as const;

export type VisualizationComponentId = (typeof SUPPORTED_VISUALIZATION_COMPONENT_IDS)[number];

type VisualizationStatGridPayload = {
  items: Array<{
    value: string;
    label: string;
  }>;
};

type VisualizationTimelinePayload = {
  entries: Array<{
    when: string;
    label: string;
    description: string;
  }>;
};

type VisualizationEventLogPayload = {
  entries: Array<{
    level: "info" | "success" | "warning" | "error";
    message: string;
    detail?: string;
  }>;
};

type VisualizationCapabilityListPayload = {
  items: Array<{
    name: string;
    description: string;
  }>;
};

type VisualizationDecisionFlowPayload = {
  nodes: Array<{
    id: string;
    label: string;
  }>;
  edges: Array<{
    from: string;
    to: string;
    label?: string;
  }>;
};

type VisualizationCodeSamplePayload = {
  title?: string;
  language: string;
  code: string;
  caption?: string;
};

type VisualizationPayload =
  | VisualizationStatGridPayload
  | VisualizationTimelinePayload
  | VisualizationEventLogPayload
  | VisualizationCapabilityListPayload
  | VisualizationDecisionFlowPayload
  | VisualizationCodeSamplePayload;

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
    }
  | {
      type: "visualization";
      componentId: VisualizationComponentId;
      payload: VisualizationPayload;
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

function parseCodeFenceLanguage(line: string): string {
  return line.trim().slice(3).trim();
}

function isVisualizationFenceLanguage(language: string): boolean {
  return /^viz:[a-z0-9-]+$/.test(language);
}

function isSupportedVisualizationComponentId(componentId: string): componentId is VisualizationComponentId {
  return (SUPPORTED_VISUALIZATION_COMPONENT_IDS as readonly string[]).includes(componentId);
}

function createVisualizationError(componentId: string, message: string): Error {
  return createMarkdownError(`Visualization component "${componentId}": ${message}`);
}

function assertVisualizationRecord(value: unknown, componentId: string): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw createVisualizationError(componentId, "payload must be a JSON object.");
  }

  return value as Record<string, unknown>;
}

function requireVisualizationStringField(
  record: Record<string, unknown>,
  fieldName: string,
  componentId: string,
): string {
  const value = record[fieldName];

  if (typeof value !== "string" || !value.trim()) {
    throw createVisualizationError(componentId, `field "${fieldName}" must be a non-empty string.`);
  }

  return value.trim();
}

function assertAllowedVisualizationKeys(
  record: Record<string, unknown>,
  allowedKeys: readonly string[],
  componentId: string,
) {
  for (const key of Object.keys(record)) {
    if (!allowedKeys.includes(key)) {
      throw createVisualizationError(componentId, `unexpected field "${key}".`);
    }
  }
}

function validateVisualizationPayload(componentId: VisualizationComponentId, sourceText: string): VisualizationPayload {
  let parsedValue: unknown;

  try {
    parsedValue = JSON.parse(sourceText);
  } catch {
    throw createVisualizationError(componentId, "payload must be valid JSON.");
  }

  const record = assertVisualizationRecord(parsedValue, componentId);

  switch (componentId) {
    case "stat-grid": {
      assertAllowedVisualizationKeys(record, ["items"], componentId);
      const items = record.items;

      if (!Array.isArray(items) || items.length === 0) {
        throw createVisualizationError(componentId, 'field "items" must be a non-empty array.');
      }

      return {
        items: items.map((item) => {
          const itemRecord = assertVisualizationRecord(item, componentId);
          assertAllowedVisualizationKeys(itemRecord, ["value", "label"], componentId);

          return {
            value: requireVisualizationStringField(itemRecord, "value", componentId),
            label: requireVisualizationStringField(itemRecord, "label", componentId),
          };
        }),
      };
    }
    case "timeline": {
      assertAllowedVisualizationKeys(record, ["entries"], componentId);
      const entries = record.entries;

      if (!Array.isArray(entries) || entries.length === 0) {
        throw createVisualizationError(componentId, 'field "entries" must be a non-empty array.');
      }

      return {
        entries: entries.map((entry) => {
          const entryRecord = assertVisualizationRecord(entry, componentId);
          assertAllowedVisualizationKeys(entryRecord, ["when", "label", "description"], componentId);

          return {
            when: requireVisualizationStringField(entryRecord, "when", componentId),
            label: requireVisualizationStringField(entryRecord, "label", componentId),
            description: requireVisualizationStringField(entryRecord, "description", componentId),
          };
        }),
      };
    }
    case "event-log": {
      assertAllowedVisualizationKeys(record, ["entries"], componentId);
      const entries = record.entries;

      if (!Array.isArray(entries) || entries.length === 0) {
        throw createVisualizationError(componentId, 'field "entries" must be a non-empty array.');
      }

      return {
        entries: entries.map((entry) => {
          const entryRecord = assertVisualizationRecord(entry, componentId);
          assertAllowedVisualizationKeys(entryRecord, ["level", "message", "detail"], componentId);

          const level = requireVisualizationStringField(entryRecord, "level", componentId);

          if (!(["info", "success", "warning", "error"] as const).includes(level as VisualizationEventLogPayload["entries"][number]["level"])) {
            throw createVisualizationError(componentId, 'field "level" must be one of: info, success, warning, error.');
          }

          const entryPayload: VisualizationEventLogPayload["entries"][number] = {
            level: level as VisualizationEventLogPayload["entries"][number]["level"],
            message: requireVisualizationStringField(entryRecord, "message", componentId),
          };

          if (entryRecord.detail !== undefined) {
            entryPayload.detail = requireVisualizationStringField(entryRecord, "detail", componentId);
          }

          return entryPayload;
        }),
      };
    }
    case "capability-list": {
      assertAllowedVisualizationKeys(record, ["items"], componentId);
      const items = record.items;

      if (!Array.isArray(items) || items.length === 0) {
        throw createVisualizationError(componentId, 'field "items" must be a non-empty array.');
      }

      return {
        items: items.map((item) => {
          const itemRecord = assertVisualizationRecord(item, componentId);
          assertAllowedVisualizationKeys(itemRecord, ["name", "description"], componentId);

          return {
            name: requireVisualizationStringField(itemRecord, "name", componentId),
            description: requireVisualizationStringField(itemRecord, "description", componentId),
          };
        }),
      };
    }
    case "decision-flow": {
      assertAllowedVisualizationKeys(record, ["nodes", "edges"], componentId);
      const nodes = record.nodes;
      const edges = record.edges;

      if (!Array.isArray(nodes) || nodes.length === 0) {
        throw createVisualizationError(componentId, 'field "nodes" must be a non-empty array.');
      }

      if (!Array.isArray(edges) || edges.length === 0) {
        throw createVisualizationError(componentId, 'field "edges" must be a non-empty array.');
      }

      const parsedNodes = nodes.map((node) => {
        const nodeRecord = assertVisualizationRecord(node, componentId);
        assertAllowedVisualizationKeys(nodeRecord, ["id", "label"], componentId);

        return {
          id: requireVisualizationStringField(nodeRecord, "id", componentId),
          label: requireVisualizationStringField(nodeRecord, "label", componentId),
        };
      });

      const knownNodeIds = new Set(parsedNodes.map((node) => node.id));

      return {
        nodes: parsedNodes,
        edges: edges.map((edge) => {
          const edgeRecord = assertVisualizationRecord(edge, componentId);
          assertAllowedVisualizationKeys(edgeRecord, ["from", "to", "label"], componentId);

          const from = requireVisualizationStringField(edgeRecord, "from", componentId);
          const to = requireVisualizationStringField(edgeRecord, "to", componentId);

          if (!knownNodeIds.has(from) || !knownNodeIds.has(to)) {
            throw createVisualizationError(componentId, 'field "edges" must reference known node ids.');
          }

          const edgePayload: VisualizationDecisionFlowPayload["edges"][number] = {
            from,
            to,
          };

          if (edgeRecord.label !== undefined) {
            edgePayload.label = requireVisualizationStringField(edgeRecord, "label", componentId);
          }

          return edgePayload;
        }),
      };
    }
    case "code-sample": {
      assertAllowedVisualizationKeys(record, ["title", "language", "code", "caption"], componentId);

      return {
        title: record.title === undefined ? undefined : requireVisualizationStringField(record, "title", componentId),
        language: requireVisualizationStringField(record, "language", componentId),
        code: requireVisualizationStringField(record, "code", componentId),
        caption: record.caption === undefined ? undefined : requireVisualizationStringField(record, "caption", componentId),
      };
    }
  }
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
  const language = parseCodeFenceLanguage(openingFenceLine) || null;
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

function parseVisualizationBlock(lines: string[], startIndex: number): { block: MarkdownBlockNode; nextIndex: number } {
  const openingFenceLine = lines[startIndex].trim();
  const fenceLanguage = parseCodeFenceLanguage(openingFenceLine);
  const componentId = fenceLanguage.slice(4);

  if (!isSupportedVisualizationComponentId(componentId)) {
    throw createMarkdownError(`Unsupported visualization component "${componentId}".`);
  }

  const sourceLines: string[] = [];
  let index = startIndex + 1;

  while (index < lines.length && !isCodeFenceLine(lines[index])) {
    sourceLines.push(lines[index]);
    index += 1;
  }

  if (index >= lines.length) {
    throw createMarkdownError(`Markdown visualization fence for "${componentId}" is not closed.`);
  }

  const value = sourceLines.join("\n");

  if (!value.trim()) {
    throw createVisualizationError(componentId, "payload cannot be empty.");
  }

  return {
    block: {
      type: "visualization",
      componentId,
      payload: validateVisualizationPayload(componentId, value),
      value,
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
      const openingFenceLanguage = parseCodeFenceLanguage(line);

      if (isVisualizationFenceLanguage(openingFenceLanguage)) {
        const { block, nextIndex } = parseVisualizationBlock(lines, index);
        blocks.push(block);
        index = nextIndex;
        continue;
      }

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