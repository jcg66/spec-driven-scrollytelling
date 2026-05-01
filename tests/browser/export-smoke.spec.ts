import { expect, test } from "@playwright/test";

test("exported site loads under the repository base path and survives a static miss", async ({ page, baseURL }) => {
  const sameOriginPrefix = baseURL || "";
  const basePath = new URL(sameOriginPrefix).pathname.replace(/\/$/, "");
  const homeUrl = `${sameOriginPrefix}/`;
  const contentRouteUrl = `${sameOriginPrefix}/inside-the-agentic-brain/`;
  const missingRouteUrl = `${sameOriginPrefix}/missing/route/`;
  const failedRequests: string[] = [];
  const errorResponses: string[] = [];

  page.on("requestfailed", (request) => {
    if (request.url().startsWith(sameOriginPrefix)) {
      failedRequests.push(`${request.method()} ${new URL(request.url()).pathname}`);
    }
  });

  page.on("response", (response) => {
    if (response.url().startsWith(sameOriginPrefix) && response.status() >= 400) {
      errorResponses.push(`${response.status()} ${new URL(response.url()).pathname}`);
    }
  });

  await page.goto(homeUrl, { waitUntil: "networkidle" });

  await expect(page.getByRole("heading", { level: 1, name: "Static Export Foundation" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Start the canonical narrative" })).toBeVisible();
  await page.getByRole("link", { name: "Start the canonical narrative" }).click();
  await expect(page).toHaveURL(new RegExp(`${basePath}/inside-the-agentic-brain/$`));
  await expect(page.getByRole("heading", { level: 1, name: "Inside the Agentic Brain" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Chapter outline" })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "User Intent" })).toBeVisible();

  const assetPaths = await page.evaluate(() =>
    [
      ...Array.from(document.querySelectorAll("script[src]"), (element) => element.getAttribute("src")),
      ...Array.from(
        document.querySelectorAll('link[rel="stylesheet"][href]'),
        (element) => element.getAttribute("href"),
      ),
    ].filter((value): value is string => Boolean(value)),
  );

  expect(assetPaths.length).toBeGreaterThan(0);

  for (const assetPath of assetPaths) {
    expect(assetPath.startsWith(`${basePath}/`)).toBe(true);
  }

  expect(await page.evaluate(() => document.styleSheets.length)).toBeGreaterThan(0);

  await page.goto(contentRouteUrl, { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { level: 1, name: "Inside the Agentic Brain" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Chapter outline" })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "User Intent" })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "Outcome" })).toBeVisible();
  await page.getByRole("link", { name: "Return Home" }).click();
  await expect(page).toHaveURL(new RegExp(`${basePath}/$`));

  await page.goto(`${sameOriginPrefix}/agentic-ai-context/`, { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { level: 1, name: "Agentic AI Context" })).toBeVisible();
  await expect(page.getByRole("heading", { level: 3, name: "Vocabulary" })).toBeVisible();

  await page.goto(missingRouteUrl, { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { level: 1, name: "Page Not Found" })).toBeVisible();
  await page.getByRole("link", { name: "Return Home" }).click();
  await expect(page).toHaveURL(new RegExp(`${basePath}/$`));

  expect(failedRequests).toEqual([]);
  expect(errorResponses).toEqual([`404 ${basePath}/missing/route/`]);
});
