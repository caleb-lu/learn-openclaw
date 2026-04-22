import { test, expect } from "@playwright/test";

test.describe("Dark mode", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/en");
    await page.evaluate(() => {
      localStorage.removeItem("theme");
      document.documentElement.classList.remove("dark");
    });
  });

  test("toggle adds dark class to html", async ({ page }) => {
    await page.goto("/en");
    await page.click('button[title="Toggle dark mode"]');
    await expect(page.locator("html")).toHaveClass(/dark/);
  });

  test("toggle twice removes dark class", async ({ page }) => {
    await page.goto("/en");
    await page.click('button[title="Toggle dark mode"]');
    await page.click('button[title="Toggle dark mode"]');
    await expect(page.locator("html")).not.toHaveClass(/dark/);
  });

  test("dark mode persists across navigation", async ({ page }) => {
    await page.goto("/en");
    await page.click('button[title="Toggle dark mode"]');
    await page.goto("/en/timeline");
    await expect(page.locator("html")).toHaveClass(/dark/);
  });

  test("dark mode persists after page refresh", async ({ page }) => {
    await page.goto("/en");
    await page.click('button[title="Toggle dark mode"]');
    await page.reload();
    await expect(page.locator("html")).toHaveClass(/dark/);
  });

  test("Moon icon visible in light mode", async ({ page }) => {
    await page.goto("/en");
    await expect(
      page.locator('button[title="Toggle dark mode"] .lucide-moon')
    ).toBeVisible();
  });

  test("Sun icon visible in dark mode", async ({ page }) => {
    await page.goto("/en");
    await page.click('button[title="Toggle dark mode"]');
    await expect(
      page.locator('button[title="Toggle dark mode"] .lucide-sun')
    ).toBeVisible();
  });

  test("localStorage stores theme value", async ({ page }) => {
    await page.goto("/en");
    await page.click('button[title="Toggle dark mode"]');
    const theme = await page.evaluate(() => localStorage.getItem("theme"));
    expect(theme).toBe("dark");
  });

  test("toggling back stores light in localStorage", async ({ page }) => {
    await page.goto("/en");
    await page.click('button[title="Toggle dark mode"]');
    await page.click('button[title="Toggle dark mode"]');
    const theme = await page.evaluate(() => localStorage.getItem("theme"));
    expect(theme).toBe("light");
  });

  test("CSS variables update when dark class is toggled", async ({ page }) => {
    await page.goto("/en");
    const lightBg = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue("--bg-primary").trim()
    );
    expect(lightBg).toMatch(/#fff(fff)?$/);

    await page.click('button[title="Toggle dark mode"]');
    const darkBg = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue("--bg-primary").trim()
    );
    expect(darkBg).toBe("#0f172a");
  });
});
