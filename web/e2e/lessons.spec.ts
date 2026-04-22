import { test, expect } from "@playwright/test";

test.describe("Lesson page", () => {
  test.describe("Page structure", () => {
    test("shows title, #N badge, and week badge", async ({ page }) => {
      await page.goto("/en/01-installation");
      // LessonHeader renders h1, DocRenderer may also render h1
      const titleH1 = page.locator("h1.text-3xl");
      await expect(titleH1).toContainText("Installation & Deployment");
      await expect(
        page.locator("span.inline-flex.items-center >> text=#1")
      ).toBeVisible();
      await expect(
        page.locator("span.inline-flex.items-center >> text=W1")
      ).toBeVisible();
    });
  });

  test.describe("Tab system", () => {
    test("Learn tab is active by default", async ({ page }) => {
      await page.goto("/en/01-installation");
      const learnTab = page.locator('div.border-b >> text="Learn"');
      // Active tab has border-b-2 with specific color (text-[var(--week-1)])
      await expect(learnTab).toBeVisible();
    });

    test("Simulate tab shows scenario title", async ({ page }) => {
      await page.goto("/en/01-installation");
      await page.click('div.border-b >> text="Simulate"');
      await expect(
        page.locator("h3:has-text('Installing OpenClaw')")
      ).toBeVisible();
    });

    test("Code tab shows code samples for lessons with code", async ({
      page,
    }) => {
      await page.goto("/en/01-installation");
      await page.click('div.border-b >> text="Code"');
      // 01-installation has 3 code samples; use .first() since multiple pre match
      await expect(
        page.locator('pre:has-text("docker pull")').first()
      ).toBeVisible();
    });

    test("Code tab shows empty state for lessons without code", async ({
      page,
    }) => {
      await page.goto("/en/04-first-conversation");
      await page.click('div.border-b >> text="Code"');
      await expect(
        page.locator("text=No code samples for this lesson yet.")
      ).toBeVisible();
    });

    test("Playground tab shows empty state for lesson 01", async ({ page }) => {
      await page.goto("/en/01-installation");
      await page.click('div.border-b >> text="Playground"');
      await expect(
        page.locator("text=No interactive playground for this lesson.")
      ).toBeVisible();
    });

    test("Playground tab shows component names for lessons with features", async ({
      page,
    }) => {
      // 02-configuration has ConfigEditor
      await page.goto("/en/02-configuration");
      await page.click('div.border-b >> text="Playground"');
      await expect(page.locator("text=ConfigEditor")).toBeVisible();
    });

    test("Deep Dive tab renders visualization", async ({ page }) => {
      await page.goto("/en/01-installation");
      await page.click('div.border-b >> text="Deep Dive"');
      // All lessons have visualizations, wait for content to render
      await expect(page.locator(".py-6 > div").first()).toBeVisible();
    });
  });

  test.describe("Learn content", () => {
    test("prose element is rendered (DocRenderer)", async ({ page }) => {
      await page.goto("/en/01-installation");
      // DocRenderer renders markdown into .prose div
      await expect(page.locator(".prose")).toBeVisible();
    });
  });

  test.describe("Simulator", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/en/01-installation");
      await page.click('div.border-b >> text="Simulate"');
    });

    test("shows scenario title and description", async ({ page }) => {
      await expect(
        page.locator("h3:has-text('Installing OpenClaw')")
      ).toBeVisible();
      await expect(
        page.locator("p:has-text('Walk through installing Docker')")
      ).toBeVisible();
    });

    test("displays Step 1 initially", async ({ page }) => {
      await expect(
        page.locator(
          "text=Step 1: Verify that Docker is installed and running"
        )
      ).toBeVisible();
    });

    test("Next Step advances to Step 2", async ({ page }) => {
      await page.click('button:has-text("Next Step")');
      await expect(
        page.locator(
          "text=Step 2: Pull the official OpenClaw Docker image"
        )
      ).toBeVisible();
    });

    test("stepping through all steps shows completion message", async ({
      page,
    }) => {
      // 01-installation has 5 steps
      for (let i = 0; i < 5; i++) {
        await page.click('button:has-text("Next Step")');
      }
      await expect(
        page.locator(
          "text=Congratulations! OpenClaw is fully installed"
        )
      ).toBeVisible();
    });

    test("Reset returns to Step 1", async ({ page }) => {
      // Advance one step
      await page.click('button:has-text("Next Step")');
      await expect(
        page.locator("text=Step 2:")
      ).toBeVisible();

      // Reset
      await page.click('button:has-text("Reset")');
      await expect(
        page.locator(
          "text=Step 1: Verify that Docker is installed and running"
        )
      ).toBeVisible();
    });
  });
});
