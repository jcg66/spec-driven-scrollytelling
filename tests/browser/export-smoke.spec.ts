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
    const failure = request.failure();

    if (request.url().startsWith(sameOriginPrefix) && failure?.errorText !== "net::ERR_ABORTED") {
      failedRequests.push(`${request.method()} ${new URL(request.url()).pathname}`);
    }
  });

  page.on("response", (response) => {
    if (response.url().startsWith(sameOriginPrefix) && response.status() >= 400) {
      errorResponses.push(`${response.status()} ${new URL(response.url()).pathname}`);
    }
  });

  await page.goto(homeUrl, { waitUntil: "networkidle" });

  await expect(page.getByRole("heading", { level: 1, name: "Inside the Agentic Brain" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Chapter outline" })).toBeVisible();
  await expect(page.getByRole("progressbar", { name: "Story progress" })).toHaveAttribute("aria-valuenow", "1");
  await expect(page.getByRole("progressbar", { name: "Story progress" })).toHaveAttribute(
    "aria-valuetext",
    /Scene 1 of 5: Spark/,
  );
  await expect(page.getByRole("heading", { level: 2, name: "Spark" })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "Outcome" })).toBeVisible();
  await expect(page.locator('.presentationChapter[data-active="true"]')).toContainText("Spark");
  await expect(page.getByRole("link", { name: "story guide" })).toBeVisible();
  await page.getByRole("link", { name: "story guide" }).click();
  await expect(page).toHaveURL(new RegExp(`${basePath}/agentic-ai-context/$`));
  await expect(page.getByRole("heading", { level: 1, name: "Agentic AI Context" })).toBeVisible();
  await page.getByRole("link", { name: "Return Home" }).click();
  await expect(page).toHaveURL(new RegExp(`${basePath}/$`));

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
  await expect(page.getByRole("heading", { level: 1, name: "Story Guide" })).toBeVisible();
  await expect(page.getByRole("heading", { level: 3, name: "Scene map" })).toBeVisible();
  await expect(page.getByRole("heading", { level: 3, name: "Vocabulary" })).toBeVisible();
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

test("homepage progress updates as the visitor moves through the presentation scenes", async ({ page, baseURL }) => {
  const sameOriginPrefix = baseURL || "";
  const homeUrl = `${sameOriginPrefix}/`;

  await page.goto(homeUrl, { waitUntil: "networkidle" });

  const progressBar = page.getByRole("progressbar", { name: "Story progress" });
  const activeSection = page.locator('.presentationChapter[data-active="true"]');

  await expect(progressBar).toHaveAttribute("aria-valuenow", "1");
  await expect(progressBar).toHaveAttribute("aria-valuetext", /Scene 1 of 5: Spark/);
  await expect(activeSection).toContainText("Spark");

  await page.getByRole("heading", { level: 2, name: "Digital Eye" }).scrollIntoViewIfNeeded();

  await expect(progressBar).toHaveAttribute("aria-valuenow", "3");
  await expect(progressBar).toHaveAttribute("aria-valuetext", /Scene 3 of 5: Digital Eye/);
  await expect(activeSection).toContainText("Digital Eye");
  await expect(page.getByRole("link", { name: "3. Digital Eye" })).toHaveAttribute("aria-current", "location");
});

test("homepage progress stays usable on a mobile viewport", async ({ page, baseURL }) => {
  const sameOriginPrefix = baseURL || "";
  const homeUrl = `${sameOriginPrefix}/`;

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(homeUrl, { waitUntil: "networkidle" });

  await expect(page.getByRole("navigation", { name: "Chapter outline" })).toBeVisible();
  await expect(page.getByRole("progressbar", { name: "Story progress" })).toHaveAttribute("aria-valuenow", "1");
  await expect(page.locator(".presentationFlow")).toHaveCSS("display", "grid");
});

test("homepage story remains readable with reduced motion", async ({ page, baseURL }) => {
  const sameOriginPrefix = baseURL || "";
  const homeUrl = `${sameOriginPrefix}/`;

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(homeUrl, { waitUntil: "networkidle" });

  await expect(page.getByRole("heading", { level: 1, name: "Inside the Agentic Brain" })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "Spark" })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "Outcome" })).toBeVisible();
  await expect(page.getByRole("progressbar", { name: "Story progress" })).toHaveAttribute("aria-valuenow", "1");
  await expect(page.getByRole("progressbar", { name: "Story progress" })).toHaveAttribute("aria-valuetext", /Scene 1 of 5: Spark/);
  await expect(page.getByText("Reading mode")).toBeVisible();
  await expect(page.locator(".presentationFlow")).toHaveCSS("display", "block");
  await expect(page.locator(".presentationOutline")).toHaveCSS("position", "static");

  await page.getByRole("link", { name: "3. Digital Eye" }).click();

  await expect(page.getByRole("progressbar", { name: "Story progress" })).toHaveAttribute("aria-valuenow", "3");
  await expect(page.getByRole("progressbar", { name: "Story progress" })).toHaveAttribute("aria-valuetext", /Scene 3 of 5: Digital Eye/);
  await expect(page.locator('.presentationChapter[data-active="true"]')).toContainText("Digital Eye");
});

test("homepage motion completes the full exported story sequence", async ({ page, baseURL }) => {
  const sameOriginPrefix = baseURL || "";
  const homeUrl = `${sameOriginPrefix}/`;

  await page.goto(homeUrl, { waitUntil: "networkidle" });

  const progressBar = page.getByRole("progressbar", { name: "Story progress" });

  await expect(progressBar).toHaveAttribute("aria-valuenow", "1");

  await page.getByRole("link", { name: "5. Outcome" }).click();

  await expect(progressBar).toHaveAttribute("aria-valuenow", "5");
  await expect(progressBar).toHaveAttribute("aria-valuetext", /Scene 5 of 5: Outcome/);
  await expect(page.locator('.presentationChapter[data-active="true"]')).toContainText("Outcome");
  await expect(page.getByRole("link", { name: "5. Outcome" })).toHaveAttribute("aria-current", "location");
});
