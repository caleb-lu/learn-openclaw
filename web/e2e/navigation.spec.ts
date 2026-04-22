import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test.describe("Header navigation", () => {
    test("Timeline link navigates to timeline page", async ({ page }) => {
      await page.goto("/en/01-installation");
      await page.click("nav >> text=Timeline");
      await expect(page).toHaveURL(/\/en\/timeline\/?$/);
      await expect(page.locator("h1")).toContainText("Learning Timeline");
    });

    test("Playground link navigates to playground page", async ({ page }) => {
      await page.goto("/en/01-installation");
      await page.click("nav >> text=Playground");
      await expect(page).toHaveURL(/\/en\/playground\/?$/);
      await expect(page.locator("h1")).toContainText("Playground");
    });

    test("Dashboard link navigates to dashboard page", async ({ page }) => {
      await page.goto("/en/01-installation");
      await page.click("nav >> text=Dashboard");
      await expect(page).toHaveURL(/\/en\/dashboard\/?$/);
      await expect(page.locator("h1")).toContainText("Learning Progress");
    });
  });

  test.describe("Locale switching", () => {
    test("EN → ZH switches locale and preserves page", async ({ page }) => {
      await page.goto("/en/01-installation");
      await page.click('a:has-text("ZH")');
      await expect(page).toHaveURL(/\/zh\/01-installation\/?$/);
      // Use specific h1 selector to avoid strict mode with multiple h1s
      await expect(page.locator("h1.text-3xl")).toContainText("安装部署");
    });

    test("ZH → EN switches locale and preserves page", async ({ page }) => {
      await page.goto("/zh/timeline");
      // Click the locale link that has the Globe icon
      await page.click('a:has(svg.lucide-globe) >> text=EN');
      await expect(page).toHaveURL(/\/en\/timeline\/?$/);
      await expect(page.locator("h1")).toContainText("Learning Timeline");
    });

    test("locale switch from home preserves home", async ({ page }) => {
      await page.goto("/en");
      await page.click('a:has-text("ZH")');
      await expect(page).toHaveURL(/\/zh\/?$/);
      await expect(page.locator("h1")).toContainText(
        "构建你的 24/7 个人 AI 助手"
      );
    });
  });

  test.describe("Sidebar navigation", () => {
    test("sidebar is visible on desktop (1280px)", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto("/en/01-installation");
      const sidebar = page.locator("nav.lg\\:block");
      await expect(sidebar).toBeVisible();
    });

    test("clicking sidebar lesson link navigates correctly", async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto("/en/01-installation");
      await page.click("nav.lg\\:block >> text=Configuration Deep Dive");
      await expect(page).toHaveURL(/\/en\/02-configuration\/?$/);
      await expect(page.locator("h1.text-3xl")).toContainText(
        "Configuration Deep Dive"
      );
    });

    test("current lesson is highlighted in sidebar", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto("/en/01-installation");
      const activeLink = page.locator(
        'nav.lg\\:block a[href="/en/01-installation/"]'
      );
      await expect(activeLink).toBeVisible();
      await expect(activeLink).toHaveClass(/font-medium/);
    });
  });

  test.describe("Lesson prev/next navigation", () => {
    test("first lesson has no prev button", async ({ page }) => {
      await page.goto("/en/01-installation");
      const prevLink = page.locator('a:has(svg.lucide-chevron-left)');
      await expect(prevLink).toHaveCount(0);
    });

    test("last lesson has no next button", async ({ page }) => {
      await page.goto("/en/17-capstone");
      const nextLink = page.locator('a:has(svg.lucide-chevron-right)');
      await expect(nextLink).toHaveCount(0);
    });

    test("middle lesson has both prev and next", async ({ page }) => {
      await page.goto("/en/09-prompt-engineering");
      const prevLink = page.locator('a:has(svg.lucide-chevron-left)');
      const nextLink = page.locator('a:has(svg.lucide-chevron-right)');
      await expect(prevLink).toBeVisible();
      await expect(nextLink).toBeVisible();
    });

    test("next navigates to correct lesson", async ({ page }) => {
      await page.goto("/en/01-installation");
      await page.click('a:has(svg.lucide-chevron-right)');
      await expect(page).toHaveURL(/\/en\/02-configuration\/?$/);
    });

    test("prev navigates to correct lesson", async ({ page }) => {
      await page.goto("/en/02-configuration");
      await page.click('a:has(svg.lucide-chevron-left)');
      await expect(page).toHaveURL(/\/en\/01-installation\/?$/);
    });
  });
});
