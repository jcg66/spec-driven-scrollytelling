import { normalizeSlug } from "@/lib/site-config";

export type LayoutMode = "standard" | "presentation";

export type HomeDocument = {
  title: string;
  summary: string;
  layout: LayoutMode;
  eyebrow: string;
  highlights: string[];
  visualization: {
    label: string;
    description: string;
  };
  seoTitle?: string;
  seoDescription?: string;
  heroImage?: string;
  body: string;
  sourcePath: string;
};

export type RouteDocument = {
  title: string;
  summary: string;
  layout: LayoutMode;
  slug: string;
  order?: number;
  seoTitle?: string;
  seoDescription?: string;
  heroImage?: string;
  draft?: boolean;
  body: string;
  sourcePath: string;
};

type FrontmatterValue = boolean | number | string | string[];
type FrontmatterRecord = Record<string, FrontmatterValue>;
type ParsedMarkdownSource = {
  body: string;
  frontmatter: FrontmatterRecord;
};

const LAYOUT_MODES: readonly LayoutMode[] = ["standard", "presentation"];
const ROUTE_SLUG_PATTERN = /^[^/\s]+(?:\/[^/\s]+)*$/;

function createContentError(sourcePath: string, message: string): Error {
  return new Error(`${sourcePath}: ${message}`);
}

function parseScalarValue(rawValue: string): boolean | number | string {
  const trimmedValue = rawValue.trim();
  const quotedValueMatch = trimmedValue.match(/^"(.*)"$/) ?? trimmedValue.match(/^'(.*)'$/);

  if (quotedValueMatch) {
    return quotedValueMatch[1];
  }

  if (trimmedValue === "true") {
    return true;
  }

  if (trimmedValue === "false") {
    return false;
  }

  if (/^-?\d+$/.test(trimmedValue)) {
    return Number(trimmedValue);
  }

  return trimmedValue;
}

function assertAllowedKeys(frontmatter: FrontmatterRecord, allowedKeys: readonly string[], sourcePath: string) {
  for (const key of Object.keys(frontmatter)) {
    if (!allowedKeys.includes(key)) {
      throw createContentError(sourcePath, `Unexpected frontmatter field "${key}".`);
    }
  }
}

function requireStringField(frontmatter: FrontmatterRecord, fieldName: string, sourcePath: string): string {
  const value = frontmatter[fieldName];

  if (typeof value !== "string" || !value.trim()) {
    throw createContentError(sourcePath, `Frontmatter field "${fieldName}" must be a non-empty string.`);
  }

  return value.trim();
}

function requireStringArrayField(frontmatter: FrontmatterRecord, fieldName: string, sourcePath: string): string[] {
  const value = frontmatter[fieldName];

  if (!Array.isArray(value) || value.length === 0) {
    throw createContentError(sourcePath, `Frontmatter field "${fieldName}" must be a non-empty string array.`);
  }

  const normalizedValues = value.map((item) => {
    if (typeof item !== "string" || !item.trim()) {
      throw createContentError(sourcePath, `Frontmatter field "${fieldName}" must contain only non-empty strings.`);
    }

    return item.trim();
  });

  return normalizedValues;
}

function requireLayoutField(frontmatter: FrontmatterRecord, sourcePath: string): LayoutMode {
  const layout = requireStringField(frontmatter, "layout", sourcePath);

  if (!LAYOUT_MODES.includes(layout as LayoutMode)) {
    throw createContentError(sourcePath, `Frontmatter field "layout" must be one of: ${LAYOUT_MODES.join(", ")}.`);
  }

  return layout as LayoutMode;
}

function optionalStringField(frontmatter: FrontmatterRecord, fieldName: string, sourcePath: string): string | undefined {
  const value = frontmatter[fieldName];

  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== "string" || !value.trim()) {
    throw createContentError(sourcePath, `Frontmatter field "${fieldName}" must be a non-empty string when provided.`);
  }

  return value.trim();
}

function optionalIntegerField(frontmatter: FrontmatterRecord, fieldName: string, sourcePath: string): number | undefined {
  const value = frontmatter[fieldName];

  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== "number" || !Number.isInteger(value) || value < 0) {
    throw createContentError(sourcePath, `Frontmatter field "${fieldName}" must be a non-negative integer when provided.`);
  }

  return value;
}

function optionalBooleanField(frontmatter: FrontmatterRecord, fieldName: string, sourcePath: string): boolean | undefined {
  const value = frontmatter[fieldName];

  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== "boolean") {
    throw createContentError(sourcePath, `Frontmatter field "${fieldName}" must be a boolean when provided.`);
  }

  return value;
}

function requireMarkdownBody(body: string, sourcePath: string): string {
  const normalizedBody = body.trim();

  if (!normalizedBody) {
    throw createContentError(sourcePath, "Markdown body cannot be empty.");
  }

  return normalizedBody;
}

export function parseMarkdownSource(sourceText: string, sourcePath: string): ParsedMarkdownSource {
  const normalizedSource = sourceText.replace(/\r\n/g, "\n");
  const lines = normalizedSource.split("\n");

  if (lines[0] !== "---") {
    throw createContentError(sourcePath, 'Markdown source must begin with a "---" frontmatter delimiter.');
  }

  const closingDelimiterIndex = lines.findIndex((line, index) => index > 0 && line === "---");

  if (closingDelimiterIndex === -1) {
    throw createContentError(sourcePath, 'Markdown source is missing the closing "---" frontmatter delimiter.');
  }

  const frontmatter: FrontmatterRecord = {};
  const frontmatterLines = lines.slice(1, closingDelimiterIndex);

  for (let index = 0; index < frontmatterLines.length; index += 1) {
    const line = frontmatterLines[index];
    const trimmedLine = line.trim();

    if (!trimmedLine || trimmedLine.startsWith("#")) {
      continue;
    }

    const fieldMatch = line.match(/^([A-Za-z][A-Za-z0-9]*)\s*:\s*(.*)$/);

    if (!fieldMatch) {
      throw createContentError(sourcePath, `Unsupported frontmatter syntax: "${line}".`);
    }

    const [, key, rawValue] = fieldMatch;

    if (Object.prototype.hasOwnProperty.call(frontmatter, key)) {
      throw createContentError(sourcePath, `Duplicate frontmatter field "${key}".`);
    }

    if (rawValue.trim()) {
      frontmatter[key] = parseScalarValue(rawValue);
      continue;
    }

    const listValues: string[] = [];

    for (index += 1; index < frontmatterLines.length; index += 1) {
      const listLine = frontmatterLines[index];
      const trimmedListLine = listLine.trim();

      if (!trimmedListLine) {
        continue;
      }

      const listMatch = listLine.match(/^\s*-\s+(.+)$/);

      if (!listMatch) {
        index -= 1;
        break;
      }

      listValues.push(String(parseScalarValue(listMatch[1])));
    }

    if (listValues.length === 0) {
      throw createContentError(sourcePath, `Frontmatter field "${key}" must declare at least one list item.`);
    }

    frontmatter[key] = listValues;
  }

  return {
    frontmatter,
    body: lines.slice(closingDelimiterIndex + 1).join("\n"),
  };
}

export function validateHomeDocumentSource(sourceText: string, sourcePath: string): HomeDocument {
  const { frontmatter, body } = parseMarkdownSource(sourceText, sourcePath);

  assertAllowedKeys(
    frontmatter,
    [
      "title",
      "summary",
      "layout",
      "eyebrow",
      "highlights",
      "visualizationLabel",
      "visualizationDescription",
      "seoTitle",
      "seoDescription",
      "heroImage",
    ],
    sourcePath,
  );

  return {
    title: requireStringField(frontmatter, "title", sourcePath),
    summary: requireStringField(frontmatter, "summary", sourcePath),
    layout: requireLayoutField(frontmatter, sourcePath),
    eyebrow: requireStringField(frontmatter, "eyebrow", sourcePath),
    highlights: requireStringArrayField(frontmatter, "highlights", sourcePath),
    visualization: {
      label: requireStringField(frontmatter, "visualizationLabel", sourcePath),
      description: requireStringField(frontmatter, "visualizationDescription", sourcePath),
    },
    seoTitle: optionalStringField(frontmatter, "seoTitle", sourcePath),
    seoDescription: optionalStringField(frontmatter, "seoDescription", sourcePath),
    heroImage: optionalStringField(frontmatter, "heroImage", sourcePath),
    body: requireMarkdownBody(body, sourcePath),
    sourcePath,
  };
}

export function validateRouteDocumentSource(sourceText: string, sourcePath: string): RouteDocument {
  const { frontmatter, body } = parseMarkdownSource(sourceText, sourcePath);

  assertAllowedKeys(
    frontmatter,
    [
      "title",
      "summary",
      "layout",
      "slug",
      "order",
      "seoTitle",
      "seoDescription",
      "heroImage",
      "draft",
    ],
    sourcePath,
  );

  const slug = requireStringField(frontmatter, "slug", sourcePath);

  if (slug !== normalizeSlug(slug) || !ROUTE_SLUG_PATTERN.test(slug)) {
    throw createContentError(
      sourcePath,
      'Frontmatter field "slug" must be a slash-delimited public route with no leading or trailing slash.',
    );
  }

  return {
    title: requireStringField(frontmatter, "title", sourcePath),
    summary: requireStringField(frontmatter, "summary", sourcePath),
    layout: requireLayoutField(frontmatter, sourcePath),
    slug,
    order: optionalIntegerField(frontmatter, "order", sourcePath),
    seoTitle: optionalStringField(frontmatter, "seoTitle", sourcePath),
    seoDescription: optionalStringField(frontmatter, "seoDescription", sourcePath),
    heroImage: optionalStringField(frontmatter, "heroImage", sourcePath),
    draft: optionalBooleanField(frontmatter, "draft", sourcePath),
    body: requireMarkdownBody(body, sourcePath),
    sourcePath,
  };
}
