import { expect, test } from "@playwright/test";

function getSameOriginPrefix(baseURL: string | undefined): string {
  return baseURL || "";
}

test.describe("Release review", () => {
  test("covers exported routing and base-path risks", async ({ page, baseURL }) => {
    const sameOriginPrefix = getSameOriginPrefix(baseURL);
    const basePath = new URL(sameOriginPrefix).pathname.replace(/\/$/, "");
    const homeUrl = `${sameOriginPrefix}/`;
    const supportUrl = `${sameOriginPrefix}/agentic-ai-context/`;
    const missingRouteUrl = `${sameOriginPrefix}/missing/route/`;

    await page.goto(homeUrl, { waitUntil: "networkidle" });

    await expect(page.getByRole("heading", { level: 1, name: "Inside the Agentic Brain" })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Chapter outline" })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: "Spark" })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: "Outcome" })).toBeVisible();

    const assetPaths = await page.evaluate(() =>
      [
        ...Array.from(document.querySelectorAll("script[src]"), (element) => element.getAttribute("src")),
        ...Array.from(document.querySelectorAll('link[rel="stylesheet"][href]'), (element) => element.getAttribute("href")),
      ].filter((value): value is string => Boolean(value)),
    );

    expect(assetPaths.length).toBeGreaterThan(0);

    for (const assetPath of assetPaths) {
      expect(assetPath.startsWith(`${basePath}/`)).toBe(true);
    }

    await page.goto(supportUrl, { waitUntil: "networkidle" });
    await expect(page.getByRole("heading", { level: 1, name: "Agentic AI Context" })).toBeVisible();
    await expect(page.getByRole("heading", { level: 3, name: "Vocabulary" })).toBeVisible();

    await page.goto(missingRouteUrl, { waitUntil: "networkidle" });
    await expect(page.getByRole("heading", { level: 1, name: "Page Not Found" })).toBeVisible();
  });

  test("covers reduced-motion and mobile story risks", async ({ page, baseURL }) => {
    const sameOriginPrefix = getSameOriginPrefix(baseURL);
    const homeUrl = `${sameOriginPrefix}/`;

    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(homeUrl, { waitUntil: "networkidle" });

    await expect(page.getByRole("navigation", { name: "Chapter outline" })).toBeVisible();
    await expect(page.getByRole("progressbar", { name: "Story progress" })).toHaveAttribute("aria-valuenow", "1");
    await expect(page.getByText("Reading mode")).toBeVisible();
    await expect(page.locator(".presentationFlow")).toHaveCSS("display", "block");
    await expect(page.locator(".presentationOutline")).toHaveCSS("position", "static");
  });

  test("covers scene chrome hardening in reduced motion", async ({ page, baseURL }) => {
    const sameOriginPrefix = getSameOriginPrefix(baseURL);
    const homeUrl = `${sameOriginPrefix}/`;

    await page.setViewportSize({ width: 1280, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(homeUrl, { waitUntil: "networkidle" });

    const sceneChrome = page.locator(".sceneChrome").first();

    await expect(sceneChrome).toBeVisible();
    await expect(sceneChrome).toHaveCSS("backdrop-filter", "none");
    await expect(sceneChrome).toHaveCSS("box-shadow", "none");
    await expect(page.locator(".presentationChapter[data-scene=\"execution-loop\"]")).toContainText("Execution Loop");
  });

  test("covers embedded visualization and support-content risks", async ({ page, baseURL }) => {
    const sameOriginPrefix = getSameOriginPrefix(baseURL);
    const homeUrl = `${sameOriginPrefix}/`;
    const supportUrl = `${sameOriginPrefix}/agentic-ai-context/`;

    await page.goto(homeUrl, { waitUntil: "networkidle" });
    await page.getByRole("heading", { level: 2, name: "Execution Loop" }).scrollIntoViewIfNeeded();
    await expect(page.getByRole("region", { name: "Event log" })).toContainText("Action: inspect the task board");

    await page.goto(supportUrl, { waitUntil: "networkidle" });
    await expect(page.getByRole("region", { name: "Capabilities" })).toContainText("The user's goal or request.");
  });
});