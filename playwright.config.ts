import { defineConfig } from "@playwright/test";

import { getConfiguredBasePath } from "./src/lib/site-config";

const port = 4321;
const basePath = getConfiguredBasePath();
const host = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: "./tests/browser",
  fullyParallel: false,
  retries: 0,
  reporter: "list",
  use: {
    baseURL: `${host}${basePath}`,
    headless: true,
  },
  webServer: {
    command: "node scripts/serve-export.mjs",
    url: `${host}${basePath}/`,
    reuseExistingServer: !process.env.CI,
    env: {
      PORT: String(port),
      BASE_PATH: basePath,
    },
  },
});
