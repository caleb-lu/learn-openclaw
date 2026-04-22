import { test, expect } from "@playwright/test";

test.describe("Responsive - Mobile (Pixel 5)", () => {
  test.use({ viewport: { width: 393, height: 851 } });

  test("sidebar is hidden on mobile", async ({ page }) => {
    await page.goto("/en/01-installation");
    const sidebar = page.locator('nav[class*="w-56"]');
    await expect(sidebar).toHaveCSS("display", "none");
  });

  test("header is visible on mobile", async ({ page }) => {
    await page.goto("/en/01-installation");
    await expect(page.locator("header")).toBeVisible();
  });

  test("lesson prev shows 'Prev' text on mobile", async ({ page }) => {
    await page.goto("/en/02-configuration");
    const prevLink = page.locator('a:has(svg.lucide-chevron-left)');
    await expect(prevLink).toContainText("Prev");
  });

  test("lesson next shows 'Next' text on mobile", async ({ page }) => {
    await page.goto("/en/01-installation");
    const nextLink = page.locator('a:has(svg.lucide-chevron-right)');
    await expect(nextLink).toContainText("Next");
  });
});

test.describe("Responsive - Tablet (iPad)", () => {
  test.use({ viewport: { width: 810, height: 1080 } });

  test("sidebar is hidden on tablet (below lg=1024px)", async ({ page }) => {
    await page.goto("/en/01-installation");
    const sidebar = page.locator('nav[class*="w-56"]');
    await expect(sidebar).toHaveCSS("display", "none");
  });

  test("header is visible on tablet", async ({ page }) => {
    await page.goto("/en/01-installation");
    await expect(page.locator("header")).toBeVisible();
  });
});
