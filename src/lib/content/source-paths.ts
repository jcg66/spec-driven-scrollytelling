import fs from "node:fs";
import path from "node:path";

export const CONTENT_ROOT = path.join(process.cwd(), "content");
export const HOME_CONTENT_DIRECTORY = path.join(CONTENT_ROOT, "home");
export const HOME_SOURCE_PATH = path.join(HOME_CONTENT_DIRECTORY, "index.md");
export const ROUTE_PAGE_CONTENT_DIRECTORY = path.join(CONTENT_ROOT, "pages");
export const REFERENCE_CONTENT_DIRECTORY = path.join(CONTENT_ROOT, "reference");

function listMarkdownFiles(directoryPath: string): string[] {
  if (!fs.existsSync(directoryPath)) {
    return [];
  }

  const entries = fs.readdirSync(directoryPath, {
    withFileTypes: true,
  });

  return entries.flatMap((entry) => {
    const entryPath = path.join(directoryPath, entry.name);

    if (entry.isDirectory()) {
      return listMarkdownFiles(entryPath);
    }

    return entry.isFile() && entry.name.endsWith(".md") ? [entryPath] : [];
  });
}

function isWithinDirectory(filePath: string, directoryPath: string) {
  const relativePath = path.relative(directoryPath, path.resolve(filePath));

  return relativePath !== "" && !relativePath.startsWith("..") && !path.isAbsolute(relativePath);
}

export function listRoutePageSourcePaths(): string[] {
  return listMarkdownFiles(ROUTE_PAGE_CONTENT_DIRECTORY).sort();
}

export function listReferenceSourcePaths(): string[] {
  return listMarkdownFiles(REFERENCE_CONTENT_DIRECTORY).sort();
}

export function listPublishedContentSourcePaths(): string[] {
  const publishedPaths = [HOME_SOURCE_PATH, ...listRoutePageSourcePaths()];

  return publishedPaths.filter((filePath) => fs.existsSync(filePath));
}

export function isReferenceSourcePath(filePath: string): boolean {
  return isWithinDirectory(filePath, REFERENCE_CONTENT_DIRECTORY);
}
