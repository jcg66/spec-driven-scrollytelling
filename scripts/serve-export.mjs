import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const workspaceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(workspaceRoot, "out");
const port = Number(process.env.PORT || 4321);
const basePath = normalizeBasePath(process.env.BASE_PATH || "/spec-driven-scrollytelling");

function normalizeBasePath(input) {
  if (!input || input === "/") {
    return "";
  }

  const withLeadingSlash = input.startsWith("/") ? input : `/${input}`;
  return withLeadingSlash.replace(/\/+$/, "");
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

  if (filePath.endsWith(".ico")) {
    return "image/x-icon";
  }

  return "application/octet-stream";
}

function toLocalPath(requestPath) {
  if (requestPath === "/") {
    return null;
  }

  if (basePath && requestPath === basePath) {
    return path.join(outDir, "index.html");
  }

  const withoutBasePath = basePath && requestPath.startsWith(basePath)
    ? requestPath.slice(basePath.length) || "/"
    : requestPath;

  const normalized = withoutBasePath.endsWith("/") ? `${withoutBasePath}index.html` : withoutBasePath;
  return path.join(outDir, normalized.replace(/^\/+/, "").replace(/\//g, path.sep));
}

async function sendFile(res, filePath, statusCode = 200) {
  const content = await readFile(filePath);
  res.writeHead(statusCode, { "Content-Type": getContentType(filePath) });
  res.end(content);
}

async function handler(req, res) {
  const requestUrl = new URL(req.url || "/", `http://${req.headers.host || "127.0.0.1"}`);
  const filePath = toLocalPath(requestUrl.pathname);

  if (requestUrl.pathname === "/") {
    res.writeHead(302, { Location: `${basePath || ""}/` || "/" });
    res.end();
    return;
  }

  try {
    if (!filePath) {
      throw new Error("Missing file path.");
    }

    await sendFile(res, filePath);
  } catch {
    try {
      await sendFile(res, path.join(outDir, "404.html"), 404);
    } catch {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not found");
    }
  }
}

const server = createServer((req, res) => {
  handler(req, res).catch(() => {
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Internal server error");
  });
});

server.listen(port, "127.0.0.1", () => {
  process.stdout.write(`Serving exported artifact from ${outDir} at http://127.0.0.1:${port}${basePath}/\n`);
});
