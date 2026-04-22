import { test, expect } from "@playwright/test";
import { buildAllRoutes, SEL } from "./fixtures/test-data";

const allRoutes = buildAllRoutes();

test.describe("Smoke tests", () => {
  for (const route of allRoutes) {
    test(`${route} returns 200 and has no JS console errors`, async ({
      page,
    }) => {
      const errors: string[] = [];
      page.on("console", (msg) => {
        if (msg.type() === "error") {
          // Filter out 404 resource errors (favicon.ico, etc.)
          const text = msg.text();
          if (!text.includes("404")) {
            errors.push(text);
          }
        }
      });

      // Ignore request failures for missing resources (favicon, etc.)
      page.on("requestfailed", () => {});

      const response = await page.goto(route);
      expect(response?.status()).toBe(200);

      // Allow some time for JS to execute
      await page.waitForLoadState("networkidle");
      expect(errors).toEqual([]);
    });
  }

  test("home page has header and h1", async ({ page }) => {
    await page.goto("/en");
    await expect(page.locator(SEL.header)).toBeVisible();
    await expect(page.locator("h1")).toContainText(
      "Build Your 24/7 Personal AI Assistant"
    );
  });

  test("lesson page has title and #N badge", async ({ page }) => {
    await page.goto("/en/01-installation");
    await expect(page.locator(SEL.lessonTitle)).toBeVisible();
    // Multiple badge spans exist (#N, W1); use .first() for the #N badge
    await expect(page.locator(SEL.badge).first()).toContainText("#1");
  });
});
