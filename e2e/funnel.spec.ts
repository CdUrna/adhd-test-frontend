import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs/promises";
import path from "node:path";

const auditDir = path.resolve(process.cwd(), "artifacts/funnel-audit");

test.beforeAll(async () => {
  await fs.mkdir(auditDir, { recursive: true });
});

test("guest registers, retakes, signs out, and signs in again", async ({
  page,
}) => {
  const email = `browser-e2e-${crypto.randomUUID()}@example.com`;

  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Discover Your ADHD Trait Profile" }),
  ).toBeVisible();
  await expectProfileAsset(page, "brine-face-desktop.png");
  await expectNoA11yViolations(page);
  await capture(page, "01-start-desktop.png");

  await page.getByRole("button", { name: "Male", exact: true }).click();
  await expect(page).toHaveURL(/\/test$/);
  await expect(page.getByRole("heading")).toBeVisible();
  await expectNoA11yViolations(page);
  await capture(page, "02-question-desktop.png");

  await answerAll(page, "Strongly agree");
  await expect(page).toHaveURL(/\/auth$/);
  await expect(
    page.getByRole("heading", { name: "Discover your ADHD Profile" }),
  ).toBeVisible();
  await expectNoA11yViolations(page);
  await capture(page, "03-registration-desktop.png");

  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill("StrongPass123!");
  await page.getByRole("button", { name: "Get My Results" }).click();

  await expect(page).toHaveURL(/\/report$/);
  await expect(
    page.getByRole("heading", { name: "High ADHD Traits" }),
  ).toBeVisible();
  await expectNoA11yViolations(page);
  await capture(page, "04-high-report-desktop.png", true);

  await page.setViewportSize({ width: 390, height: 844 });
  await expectNoHorizontalOverflow(page);
  await expect(page.getByLabel("Medical disclaimer")).toBeVisible();
  await expectNoA11yViolations(page);
  await capture(page, "11-report-mobile.png", true);
  await page.setViewportSize({ width: 1440, height: 1000 });

  const firstFaqItem = page.locator("details").first();
  await expect(firstFaqItem).toHaveAttribute("open", "");
  await firstFaqItem.locator("summary").click();
  await expect(firstFaqItem).not.toHaveAttribute("open", "");

  await page.getByRole("button", { name: "Retake test" }).click();
  await expect(page).toHaveURL(/\/?retake=1$/);
  await page.getByRole("button", { name: "Female", exact: true }).click();
  await expect(page).toHaveURL(/\/test$/);
  await answerAll(page, "Strongly disagree");

  await expect(page).toHaveURL(/\/report$/);
  await expect(
    page.getByRole("heading", { name: "Low ADHD Traits" }),
  ).toBeVisible();
  await expectNoA11yViolations(page);
  await capture(page, "05-low-report-after-retake.png", true);

  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page).toHaveURL(/\/$/);
  await page
    .getByRole("button", { name: "Already have an account? Sign in" })
    .click();
  await expect(page).toHaveURL(/\/auth\?mode=login$/);
  await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
  await capture(page, "12-sign-in-desktop.png");

  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill("StrongPass123!");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/report$/);
  await expect(
    page.getByRole("heading", { name: "Low ADHD Traits" }),
  ).toBeVisible();
});

test("entry and question screens reflow on a mobile viewport", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Discover Your ADHD Trait Profile" }),
  ).toBeVisible();
  await expectProfileAsset(page, "brine-face-mobile.png");
  await capture(page, "06-start-mobile.png");

  await page.getByRole("button", { name: "Female", exact: true }).click();
  await expect(page).toHaveURL(/\/test$/);
  await expect(page.getByRole("heading")).toBeVisible();
  await capture(page, "07-question-mobile.png");
});

test("primary quiz controls work with a keyboard and expose visible focus", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Discover Your ADHD Trait Profile" }),
  ).toBeVisible();

  await page.keyboard.press("Tab");
  const maleButton = page.getByRole("button", { name: "Male", exact: true });
  await expect(maleButton).toBeFocused();
  await capture(page, "08-keyboard-focus.png");

  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/test$/);
  await expect(page.getByRole("heading")).toBeVisible();
  const firstAnswer = page.getByRole("radio", {
    name: "Strongly agree",
    exact: true,
  });
  await page.keyboard.press("Tab");
  await expect(firstAnswer).toBeFocused();
  await page.keyboard.press("Space");
  await expect(page.getByText("2/5")).toBeVisible();
});

test("pages reflow without horizontal scrolling at a 200 percent zoom equivalent", async ({
  page,
}) => {
  await page.setViewportSize({ width: 640, height: 700 });
  await page.goto("/");
  await expectNoHorizontalOverflow(page);
  await capture(page, "09-zoom-200-entry.png", true);

  await page.getByRole("button", { name: "Female", exact: true }).click();
  await expect(page).toHaveURL(/\/test$/);
  await expectNoHorizontalOverflow(page);
  await capture(page, "10-zoom-200-question.png", true);
});

async function answerAll(page: Page, answer: string) {
  for (let index = 0; index < 5; index += 1) {
    await page.getByRole("radio", { name: answer, exact: true }).click();
    if (index < 4) {
      await expect(page.getByText(`${index + 2}/5`)).toBeVisible();
    }
  }
  await page.getByRole("button", { name: "Finish test" }).click();
}

async function capture(page: Page, name: string, fullPage = false) {
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: path.join(auditDir, name), fullPage });
}

async function expectNoA11yViolations(page: Page) {
  const results = await new AxeBuilder({ page })
    .exclude("#next-logo")
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();

  expect(
    results.violations,
    results.violations
      .map((violation) => `${violation.id}: ${violation.help}`)
      .join("\n"),
  ).toEqual([]);
}

async function expectNoHorizontalOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
}

async function expectProfileAsset(page: Page, fileName: string) {
  const image = page.locator("main section picture img").first();
  await expect(image).toBeVisible();
  await expect
    .poll(() =>
      image.evaluate((element: HTMLImageElement) => element.currentSrc),
    )
    .toContain(fileName);
}
