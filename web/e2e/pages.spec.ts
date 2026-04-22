import { test, expect } from "@playwright/test";

test.describe("Pages", () => {
  test.describe("Home page (EN)", () => {
    test("shows hero heading and CTA buttons", async ({ page }) => {
      await page.goto("/en");
      await expect(page.locator("h1")).toContainText(
        "Build Your 24/7 Personal AI Assistant"
      );
      await expect(page.locator('a:has-text("Start Learning")')).toBeVisible();
      await expect(
        page.locator('a:has-text("View Timeline")')
      ).toBeVisible();
    });

    test("Start Learning navigates to first lesson", async ({ page }) => {
      await page.goto("/en");
      await page.click('a:has-text("Start Learning")');
      await expect(page).toHaveURL(/\/en\/01-installation\/?$/);
    });

    test("View Timeline navigates to timeline", async ({ page }) => {
      await page.goto("/en");
      await page.click('a:has-text("View Timeline")');
      await expect(page).toHaveURL(/\/en\/timeline\/?$/);
    });

    test("shows 4 week cards", async ({ page }) => {
      await page.goto("/en");
      await expect(page.locator("text=W1")).toBeVisible();
      await expect(page.locator("text=W2")).toBeVisible();
      await expect(page.locator("text=W3")).toBeVisible();
      await expect(page.locator("text=W4")).toBeVisible();
    });

    test("shows architecture overview cards", async ({ page }) => {
      await page.goto("/en");
      // Each architecture card has an icon container and text.
      // Use h3 headings for the 4 architecture items
      const archCards = page.locator(
        ".grid.gap-4.sm\\:grid-cols-2.lg\\:grid-cols-4 h3"
      );
      await expect(archCards).toHaveCount(4);
      await expect(archCards.nth(0)).toContainText("Deploy");
      await expect(archCards.nth(1)).toContainText("Channels");
      await expect(archCards.nth(2)).toContainText("Intelligence");
      await expect(archCards.nth(3)).toContainText("Automation");
    });
  });

  test.describe("Home page (ZH)", () => {
    test("shows Chinese hero heading", async ({ page }) => {
      await page.goto("/zh");
      await expect(page.locator("h1")).toContainText(
        "构建你的 24/7 个人 AI 助手"
      );
    });
  });

  test.describe("Timeline page", () => {
    test("shows timeline heading", async ({ page }) => {
      await page.goto("/en/timeline");
      await expect(page.locator("h1")).toContainText("Learning Timeline");
    });

    test("shows 4 week headers", async ({ page }) => {
      await page.goto("/en/timeline");
      const weekHeaders = page.locator("h2");
      await expect(weekHeaders).toHaveCount(4);
    });

    test("has 17 lesson card links", async ({ page }) => {
      await page.goto("/en/timeline");
      // Timeline lesson cards are links containing "#" followed by number
      const lessonLinks = page.locator("a.card-link, a[href*='/en/']").filter({
        hasText: /^#\d+/,
      });
      // Alternative: count all links that contain a "#" lesson number
      const allLessonLinks = page.getByRole("link").filter({
        has: page.locator("text=/^#\\d+/"),
      });
      // Use a simpler approach: count the number of lesson entries
      // Each lesson has a Clock icon next to duration
      const clockIcons = page.locator(
        "a[href*='/en/'] svg.lucide-clock"
      );
      await expect(clockIcons).toHaveCount(17);
    });

    test("clicking a lesson card navigates correctly", async ({ page }) => {
      await page.goto("/en/timeline");
      await page.click('a[href="/en/05-channel-setup/"]');
      await expect(page).toHaveURL(/\/en\/05-channel-setup\/?$/);
      await expect(page.locator("h1.text-3xl")).toContainText("Channel Setup");
    });
  });

  test.describe("Dashboard page", () => {
    test.beforeEach(async ({ page }) => {
      // Clear progress before each test by visiting page, clearing, and reloading
      await page.goto("/en/dashboard");
      await page.evaluate(() => {
        localStorage.removeItem("learn-openclaw-progress");
      });
      await page.reload();
    });

    test("initial progress is 0/17", async ({ page }) => {
      await expect(page.locator("text=0/17 lessons completed")).toBeVisible();
    });

    test("progress bar is visible", async ({ page }) => {
      const progressBar = page.locator(".h-3.rounded-full").first();
      await expect(progressBar).toBeVisible();
    });

    test("clicking a lesson button updates localStorage", async ({ page }) => {
      await page
        .locator('button:has-text("#1")')
        .first()
        .click();
      const progress = await page.evaluate(() => {
        const raw = localStorage.getItem("learn-openclaw-progress");
        return raw ? JSON.parse(raw) : [];
      });
      expect(progress).toContainEqual("01-installation");
    });

    test("has 17 lesson rows", async ({ page }) => {
      // Each lesson row has a button with the lesson number
      const lessonButtons = page.locator(
        "button:has-text('#1'), button:has-text('#2'), button:has-text('#3'), button:has-text('#4'), " +
        "button:has-text('#5'), button:has-text('#6'), button:has-text('#7'), button:has-text('#8'), " +
        "button:has-text('#9'), button:has-text('#10'), button:has-text('#11'), button:has-text('#12'), " +
        "button:has-text('#13'), button:has-text('#14'), button:has-text('#15'), button:has-text('#16'), " +
        "button:has-text('#17')"
      );
      await expect(lessonButtons).toHaveCount(17);
    });

    test("progress reflects completed lesson after reload", async ({ page }) => {
      await page
        .locator('button:has-text("#1")')
        .first()
        .click();
      // Reload to re-read localStorage via useMemo
      await page.reload();
      await expect(page.locator("text=1/17 lessons completed")).toBeVisible();
    });
  });

  test.describe("Playground page", () => {
    test("shows Playground heading", async ({ page }) => {
      await page.goto("/en/playground");
      await expect(page.locator("h1")).toContainText("Playground");
    });

    test("renders 3 Monaco editors", async ({ page }) => {
      await page.goto("/en/playground");
      // Wait for Monaco editors to render (they load asynchronously)
      const editors = page.locator(".monaco-editor");
      await expect(editors).toHaveCount(3, { timeout: 15000 });
    });

    test("shows Config Editor, Workspace Preview, Skill Template labels", async ({
      page,
    }) => {
      await page.goto("/en/playground");
      await expect(page.locator("h3:has-text('Config Editor')")).toBeVisible();
      await expect(
        page.locator("h3:has-text('Workspace Preview')")
      ).toBeVisible();
      await expect(
        page.locator("h3:has-text('Skill Template')")
      ).toBeVisible();
    });
  });
});
