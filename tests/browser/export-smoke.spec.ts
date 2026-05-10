import { expect, test } from "@playwright/test";

type CssColor = {
  r: number;
  g: number;
  b: number;
};

function parseCssColor(value: string): CssColor {
  const channels = value.match(/\d+(?:\.\d+)?/g);

  if (!channels || channels.length < 3) {
    throw new Error(`Unable to parse CSS color: ${value}`);
  }

  return {
    r: Number(channels[0]),
    g: Number(channels[1]),
    b: Number(channels[2]),
  };
}

function linearizeChannel(channel: number): number {
  const normalized = channel / 255;

  if (normalized <= 0.03928) {
    return normalized / 12.92;
  }

  return ((normalized + 0.055) / 1.055) ** 2.4;
}

function getContrastRatio(foreground: CssColor, background: CssColor): number {
  const foregroundLuminance =
    0.2126 * linearizeChannel(foreground.r) + 0.7152 * linearizeChannel(foreground.g) + 0.0722 * linearizeChannel(foreground.b);
  const backgroundLuminance =
    0.2126 * linearizeChannel(background.r) + 0.7152 * linearizeChannel(background.g) + 0.0722 * linearizeChannel(background.b);

  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);

  return (lighter + 0.05) / (darker + 0.05);
}

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
  await page.getByRole("heading", { level: 2, name: "Execution Loop" }).scrollIntoViewIfNeeded();
  await expect(page.getByRole("region", { name: "Event log" })).toBeVisible();
  await expect(page.getByText("Action: inspect the task board")).toBeVisible();
  await expect(page.locator('.presentationChapter[data-scene="execution-loop"]')).toContainText("Execution Loop");
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
  await expect(page.getByRole("region", { name: "Capabilities" })).toContainText("The user's goal or request.");

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

test("homepage typography uses explicit system tokens", async ({ page, baseURL }) => {
  const sameOriginPrefix = baseURL || "";
  const homeUrl = `${sameOriginPrefix}/`;

  await page.goto(homeUrl, { waitUntil: "networkidle" });

  const tokens = await page.locator(":root").evaluate((element) => {
    const styles = getComputedStyle(element);

    return {
      body: styles.getPropertyValue("--font-body").trim(),
      display: styles.getPropertyValue("--font-display").trim(),
      mono: styles.getPropertyValue("--font-mono").trim(),
    };
  });

  const bodyFontSize = await page.locator("body").evaluate((element) => parseFloat(getComputedStyle(element).fontSize));
  const titleFontSize = await page.locator(".title").first().evaluate((element) => parseFloat(getComputedStyle(element).fontSize));
  const chapterHeadingFontSize = await page.locator(".presentationChapterHeading").first().evaluate((element) => parseFloat(getComputedStyle(element).fontSize));

  expect(tokens.body).toContain("Aptos");
  expect(tokens.display).toContain("Aptos Display");
  expect(tokens.mono).toContain("Cascadia Mono");
  expect(titleFontSize).toBeGreaterThan(bodyFontSize);
  expect(chapterHeadingFontSize).toBeGreaterThan(bodyFontSize);
});

test("homepage exposes a working skip link and main landmark", async ({ page, baseURL }) => {
  const sameOriginPrefix = baseURL || "";
  const homeUrl = `${sameOriginPrefix}/`;

  await page.goto(homeUrl, { waitUntil: "networkidle" });

  const skipLink = page.locator(".skipLink");
  const mainLandmark = page.getByRole("main");

  await expect(mainLandmark).toBeVisible();

  await page.keyboard.press("Tab");
  await expect(skipLink).toBeFocused();
  await expect(skipLink).toBeVisible();

  await page.keyboard.press("Enter");
  await expect(mainLandmark).toBeFocused();
  await expect(page.locator("#main-content")).toBeFocused();
});

test("homepage scene treatments remain visually distinct across the five chapters", async ({ page, baseURL }) => {
  const sameOriginPrefix = baseURL || "";
  const homeUrl = `${sameOriginPrefix}/`;

  await page.goto(homeUrl, { waitUntil: "networkidle" });

  const sparkChapter = page.locator('.presentationChapter[data-scene="spark"]');
  const deconstructionChapter = page.locator('.presentationChapter[data-scene="deconstruction"]');
  const digitalEyeChapter = page.locator('.presentationChapter[data-scene="digital-eye"]');
  const executionChapter = page.locator('.presentationChapter[data-scene="execution-loop"]');
  const outcomeChapter = page.locator('.presentationChapter[data-scene="outcome"]');

  await expect(sparkChapter).toHaveCount(1);
  await expect(deconstructionChapter).toHaveCount(1);
  await expect(digitalEyeChapter).toHaveCount(1);
  await expect(executionChapter).toHaveCount(1);
  await expect(outcomeChapter).toHaveCount(1);

  await expect(sparkChapter.locator(".sceneChromeLabel")).toHaveText("The Spark");
  await expect(deconstructionChapter.locator(".sceneChromeLabel")).toHaveText("The Logic Gate");
  await expect(digitalEyeChapter.locator(".sceneChromeLabel")).toHaveText("The Digital Eye");
  await expect(executionChapter.locator(".sceneChromeLabel")).toHaveText("The Execution Loop");
  await expect(outcomeChapter.locator(".sceneChromeLabel")).toHaveText("The Post-App Era");

  const sparkBackground = await sparkChapter.evaluate((element) => getComputedStyle(element).backgroundImage);
  const executionFontFamily = await executionChapter.evaluate((element) => getComputedStyle(element).fontFamily);
  const outcomeBorderColor = await outcomeChapter.evaluate((element) => getComputedStyle(element).borderColor);

  expect(sparkBackground).toContain("radial-gradient");
  expect(executionFontFamily).toContain("Cascadia Mono");
  expect(outcomeBorderColor).toContain("rgba");
});

test("release-review design and accessibility checks stay readable in the exported artifact", async ({ page, baseURL }) => {
  const sameOriginPrefix = baseURL || "";
  const homeUrl = `${sameOriginPrefix}/`;
  const supportUrl = `${sameOriginPrefix}/agentic-ai-context/`;

  await page.goto(homeUrl, { waitUntil: "networkidle" });

  const skipLink = page.locator(".skipLink");
  const mainLandmark = page.getByRole("main");
  const bodyBackground = await page.locator("body").evaluate((element) => getComputedStyle(element).backgroundColor);
  const titleColor = await page.locator(".title").first().evaluate((element) => getComputedStyle(element).color);
  const ledeColor = await page.locator(".lede").first().evaluate((element) => getComputedStyle(element).color);

  await expect(mainLandmark).toBeVisible();
  await page.keyboard.press("Tab");
  await expect(skipLink).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(mainLandmark).toBeFocused();

  expect(getContrastRatio(parseCssColor(titleColor), parseCssColor(bodyBackground))).toBeGreaterThanOrEqual(7);
  expect(getContrastRatio(parseCssColor(ledeColor), parseCssColor(bodyBackground))).toBeGreaterThanOrEqual(4.5);

  await page.goto(supportUrl, { waitUntil: "networkidle" });

  await expect(page.getByRole("main")).toBeVisible();
  await expect(page.getByRole("heading", { level: 1, name: "Agentic AI Context" })).toBeVisible();

  const supportTitleColor = await page.locator(".title").first().evaluate((element) => getComputedStyle(element).color);
  const supportLedeColor = await page.locator(".lede").first().evaluate((element) => getComputedStyle(element).color);
  const supportBackground = await page.locator("body").evaluate((element) => getComputedStyle(element).backgroundColor);

  expect(getContrastRatio(parseCssColor(supportTitleColor), parseCssColor(supportBackground))).toBeGreaterThanOrEqual(7);
  expect(getContrastRatio(parseCssColor(supportLedeColor), parseCssColor(supportBackground))).toBeGreaterThanOrEqual(4.5);
});

test("release-review visualization widgets remain readable with reduced motion", async ({ page, baseURL }) => {
  const sameOriginPrefix = baseURL || "";
  const homeUrl = `${sameOriginPrefix}/`;
  const supportUrl = `${sameOriginPrefix}/agentic-ai-context/`;

  await page.emulateMedia({ reducedMotion: "reduce" });

  await page.goto(homeUrl, { waitUntil: "networkidle" });
  await page.getByRole("heading", { level: 2, name: "Execution Loop" }).scrollIntoViewIfNeeded();
  await expect(page.getByRole("region", { name: "Event log" })).toContainText("Action: inspect the task board");

  await page.goto(supportUrl, { waitUntil: "networkidle" });
  await expect(page.getByRole("region", { name: "Capabilities" })).toContainText("The user's goal or request.");
});
