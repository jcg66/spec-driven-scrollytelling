import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const repositoryName = "spec-driven-scrollytelling";
const projectRoot = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(projectRoot, "..");
const outDir = path.join(workspaceRoot, "out");
const basePath = `/${repositoryName}`;
const expectedFile = path.join(outDir, "index.html");
const requestPath = `${basePath}/`;
const expectedMarker = "Static Export Foundation";

async function ensureArtifactExists() {
  await stat(expectedFile);
}

function getContentType(filePath) {
  if (filePath.endsWith(".html")) {
    return "text/html; charset=utf-8";
  }

  if (filePath.endsWith(".css")) {
    return "text/css; charset=utf-8";
  }

  if (filePath.endsWith(".js")) {
    return "application/javascript; charset=utf-8";
  }

  if (filePath.endsWith(".json")) {
    return "application/json; charset=utf-8";
  }

  return "application/octet-stream";
}

async function resolveFilePath(urlPath) {
  const withoutBasePath = urlPath.startsWith(basePath) ? urlPath.slice(basePath.length) || "/" : urlPath;
  const normalized = withoutBasePath.endsWith("/") ? `${withoutBasePath}index.html` : withoutBasePath;
  const localPath = path.join(outDir, normalized.replace(/^\/+/, "").replace(/\//g, path.sep));
  return localPath;
}

async function verifyServedArtifact() {
  const server = createServer(async (req, res) => {
    try {
      const requestUrl = req.url || "/";
      const filePath = await resolveFilePath(requestUrl);
      const content = await readFile(filePath);

      res.writeHead(200, { "Content-Type": getContentType(filePath) });
      res.end(content);
    } catch {
      res.writeHead(404);
      res.end("Not found");
    }
  });

  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));

  const address = server.address();

  if (!address || typeof address === "string") {
    server.close();
    throw new Error("Unable to determine verification server address.");
  }

  try {
    const response = await fetch(`http://127.0.0.1:${address.port}${requestPath}`);
    const body = await response.text();

    if (!response.ok) {
      throw new Error(`Expected 200 from exported artifact, received ${response.status}.`);
    }

    if (!body.includes(expectedMarker)) {
      throw new Error(`Expected exported artifact to include marker: ${expectedMarker}`);
    }
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(undefined);
      });
    });
  }
}

async function main() {
  await ensureArtifactExists();
  await verifyServedArtifact();
  process.stdout.write(`Verified exported artifact at ${requestPath}\n`);
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
});
