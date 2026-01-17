const { test, expect, devices } = require('@playwright/test');

test.describe('Responsive Design Tests', () => {
  const viewports = [
    { name: 'Mobile Small', width: 375, height: 667 },
    { name: 'Mobile Medium', width: 414, height: 896 },
    { name: 'Tablet Portrait', width: 768, height: 1024 },
    { name: 'Tablet Landscape', width: 1024, height: 768 },
    { name: 'Desktop Small', width: 1280, height: 720 },
    { name: 'Desktop Medium', width: 1440, height: 900 },
    { name: 'Desktop Large', width: 1920, height: 1080 },
    { name: 'Desktop XL', width: 2560, height: 1440 }
  ];

  test.describe('Viewport Testing', () => {
    for (const viewport of viewports) {
      test(`should render correctly on ${viewport.name} (${viewport.width}x${viewport.height})`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(3000);

        await expect(page.locator('.App')).toBeVisible();

        const navigation = page.locator('.navigation');
        await expect(navigation).toBeVisible();

        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
        await page.waitForTimeout(500);

        const screenshot = await page.screenshot({ fullPage: true });
        expect(screenshot).toBeTruthy();
      });
    }
  });

  test.describe('Custom Cursor Behavior', () => {
    test('should hide custom cursor on mobile devices', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      await page.waitForTimeout(3000);

      const cursorDot = page.locator('.cursor-dot');
      const cursorOutline = page.locator('.cursor-outline');

      await expect(cursorDot).not.toBeVisible();
      await expect(cursorOutline).not.toBeVisible();
    });

    test('should show custom cursor on desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto('/');
      await page.waitForTimeout(3000);

      const cursorDot = page.locator('.cursor-dot');
      const cursorOutline = page.locator('.cursor-outline');

      const hasTouch = await page.evaluate(() => 'ontouchstart' in window);
      if (!hasTouch) {
        await expect(cursorDot).toBeVisible();
        await expect(cursorOutline).toBeVisible();
      }
    });

    test('should hide custom cursor on tablet devices', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('/');
      await page.waitForTimeout(3000);

      const cursorDot = page.locator('.cursor-dot');
      const cursorOutline = page.locator('.cursor-outline');

      await expect(cursorDot).not.toBeVisible();
      await expect(cursorOutline).not.toBeVisible();
    });
  });

  test.describe('Navigation Responsiveness', () => {
    test('should show hamburger menu on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      await page.waitForTimeout(3000);

      const hamburger = page.locator('.hamburger');
      await expect(hamburger).toBeVisible();

      const sectionIndicators = page.locator('.section-indicators');
      const isVisible = await sectionIndicators.isVisible().catch(() => false);
      expect(isVisible).toBe(true);
    });

    test('should show full navigation on desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto('/');
      await page.waitForTimeout(3000);

      const logo = page.locator('.nav-logo');
      const contactBtn = page.locator('.nav-cta-btn');

      await expect(logo).toBeVisible();
      await expect(contactBtn).toBeVisible();
    });
  });

  test.describe('Projects Grid Responsiveness', () => {
    test('should display projects in single column on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      await page.waitForTimeout(3000);

      await page.locator('#projects').scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);

      const projectCards = page.locator('.project-card');
      const firstCard = await projectCards.first().boundingBox();
      const secondCard = await projectCards.nth(1).boundingBox();

      expect(firstCard).toBeTruthy();
      expect(secondCard).toBeTruthy();

      const areSameColumn = Math.abs(firstCard.x - secondCard.x) < 10;
      expect(areSameColumn).toBe(true);
    });

    test('should display projects in grid on desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto('/');
      await page.waitForTimeout(3000);

      await page.locator('#projects').scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);

      const projectsGrid = page.locator('.projects-grid');
      await expect(projectsGrid).toBeVisible();

      const projectCards = page.locator('.project-card');
      const count = await projectCards.count();
      expect(count).toBe(7);
    });
  });

  test.describe('Modal Responsiveness', () => {
    test('should display full-screen modal on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      await page.waitForTimeout(3000);

      await page.locator('#projects').scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);

      await page.locator('.project-card').first().click();
      await page.waitForTimeout(500);

      const modal = page.locator('.modal-container');
      await expect(modal).toBeVisible();

      const modalBox = await modal.boundingBox();
      expect(modalBox.width).toBeLessThanOrEqual(375);
    });

    test('should display centered modal on desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto('/');
      await page.waitForTimeout(3000);

      await page.locator('#projects').scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);

      await page.locator('.project-card').first().click();
      await page.waitForTimeout(500);

      const modal = page.locator('.modal-container');
      await expect(modal).toBeVisible();

      const modalBox = await modal.boundingBox();
      expect(modalBox.width).toBeLessThan(1920);

      const modalCenterX = modalBox.x + modalBox.width / 2;
      const viewportCenterX = 1920 / 2;
      const tolerance = 100;

      expect(Math.abs(modalCenterX - viewportCenterX)).toBeLessThan(tolerance);
    });
  });

  test.describe('Skills Grid Responsiveness', () => {
    test('should display skills in responsive grid', async ({ page }) => {
      const testViewports = [
        { width: 375, height: 667 },
        { width: 768, height: 1024 },
        { width: 1920, height: 1080 }
      ];

      for (const viewport of testViewports) {
        await page.setViewportSize(viewport);
        await page.goto('/');
        await page.waitForTimeout(3000);

        await page.locator('#coursework').scrollIntoViewIfNeeded();
        await page.waitForTimeout(500);

        const skillsGrid = page.locator('.skills-grid');
        await expect(skillsGrid).toBeVisible();

        const skillCards = page.locator('.skill-card');
        const count = await skillCards.count();
        expect(count).toBe(24);
      }
    });
  });

  test.describe('Timeline Responsiveness', () => {
    test('should display timeline on all viewports', async ({ page }) => {
      const testViewports = [
        { width: 375, height: 667 },
        { width: 768, height: 1024 },
        { width: 1920, height: 1080 }
      ];

      for (const viewport of testViewports) {
        await page.setViewportSize(viewport);
        await page.goto('/');
        await page.waitForTimeout(3000);

        await page.locator('#experience').scrollIntoViewIfNeeded();
        await page.waitForTimeout(500);

        const timeline = page.locator('.timeline');
        await expect(timeline).toBeVisible();

        const timelineItems = page.locator('.timeline-item');
        const count = await timelineItems.count();
        expect(count).toBe(3);
      }
    });
  });

  test.describe('Scroll Behavior', () => {
    test('should handle smooth scrolling on all viewports', async ({ page }) => {
      const testViewports = [
        { width: 375, height: 667 },
        { width: 1920, height: 1080 }
      ];

      for (const viewport of testViewports) {
        await page.setViewportSize(viewport);
        await page.goto('/');
        await page.waitForTimeout(3000);

        await page.locator('a[href="#projects"]').first().click();
        await page.waitForTimeout(1000);

        const projectsSection = page.locator('#projects');
        await expect(projectsSection).toBeInViewport();
      }
    });
  });

  test.describe('Text Readability', () => {
    test('should maintain readable text sizes on all viewports', async ({ page }) => {
      const testViewports = [
        { width: 375, height: 667 },
        { width: 768, height: 1024 },
        { width: 1920, height: 1080 }
      ];

      for (const viewport of testViewports) {
        await page.setViewportSize(viewport);
        await page.goto('/');
        await page.waitForTimeout(3000);

        const sectionTitle = page.locator('.section-title').first();
        const fontSize = await sectionTitle.evaluate((el) => {
          return window.getComputedStyle(el).fontSize;
        });

        const fontSizeNum = parseInt(fontSize);
        expect(fontSizeNum).toBeGreaterThan(16);
      }
    });
  });

  test.describe('Image and Media Responsiveness', () => {
    test('should not have horizontal overflow on any viewport', async ({ page }) => {
      const testViewports = [
        { width: 375, height: 667 },
        { width: 768, height: 1024 },
        { width: 1920, height: 1080 }
      ];

      for (const viewport of testViewports) {
        await page.setViewportSize(viewport);
        await page.goto('/');
        await page.waitForTimeout(3000);

        const hasHorizontalScroll = await page.evaluate(() => {
          return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });

        expect(hasHorizontalScroll).toBe(false);
      }
    });
  });

  test.describe('Orientation Changes', () => {
    test('should handle portrait to landscape transition', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      await page.waitForTimeout(3000);

      await expect(page.locator('.App')).toBeVisible();

      await page.setViewportSize({ width: 667, height: 375 });
      await page.waitForTimeout(1000);

      await expect(page.locator('.App')).toBeVisible();
    });
  });
});
