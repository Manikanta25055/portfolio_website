const { test, expect } = require('@playwright/test');
const fc = require('fast-check');

test.describe('Property-Based Fuzz Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
  });

  test.describe('Viewport Resizing Edge Cases', () => {
    test('should handle random viewport dimensions without breaking', async ({ page }) => {
      await fc.assert(
        fc.asyncProperty(
          fc.integer({ min: 320, max: 3840 }),
          fc.integer({ min: 480, max: 2160 }),
          async (width, height) => {
            await page.setViewportSize({ width, height });
            await page.waitForTimeout(500);

            const app = page.locator('.App');
            await expect(app).toBeVisible();

            const hasHorizontalOverflow = await page.evaluate(() => {
              return document.documentElement.scrollWidth > document.documentElement.clientWidth;
            });

            expect(hasHorizontalOverflow).toBe(false);
          }
        ),
        { numRuns: 20 }
      );
    });

    test('should handle extreme aspect ratios', async ({ page }) => {
      await fc.assert(
        fc.asyncProperty(
          fc.constantFrom(
            { width: 320, height: 1920 },
            { width: 2560, height: 600 },
            { width: 375, height: 2000 },
            { width: 3000, height: 800 }
          ),
          async (viewport) => {
            await page.setViewportSize(viewport);
            await page.waitForTimeout(500);

            const navigation = page.locator('.navigation');
            await expect(navigation).toBeVisible();

            const app = page.locator('.App');
            await expect(app).toBeVisible();
          }
        ),
        { numRuns: 10 }
      );
    });
  });

  test.describe('Scroll Position Fuzz Testing', () => {
    test('should handle random scroll positions', async ({ page }) => {
      await fc.assert(
        fc.asyncProperty(
          fc.integer({ min: 0, max: 10000 }),
          async (scrollY) => {
            await page.evaluate((y) => window.scrollTo(0, y), scrollY);
            await page.waitForTimeout(300);

            const navigation = page.locator('.navigation');
            await expect(navigation).toBeVisible();

            const currentScrollY = await page.evaluate(() => window.scrollY);
            expect(currentScrollY).toBeGreaterThanOrEqual(0);
          }
        ),
        { numRuns: 30 }
      );
    });

    test('should handle rapid scroll sequences', async ({ page }) => {
      await fc.assert(
        fc.asyncProperty(
          fc.array(fc.integer({ min: 0, max: 5000 }), { minLength: 5, maxLength: 10 }),
          async (scrollPositions) => {
            for (const position of scrollPositions) {
              await page.evaluate((y) => window.scrollTo(0, y), position);
              await page.waitForTimeout(100);
            }

            const app = page.locator('.App');
            await expect(app).toBeVisible();
          }
        ),
        { numRuns: 10 }
      );
    });
  });

  test.describe('Modal Interaction Sequences', () => {
    test('should handle random modal open/close sequences', async ({ page }) => {
      await page.locator('#projects').scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);

      await fc.assert(
        fc.asyncProperty(
          fc.array(
            fc.record({
              action: fc.constantFrom('open', 'close'),
              projectIndex: fc.integer({ min: 0, max: 6 }),
              closeMethod: fc.constantFrom('button', 'overlay', 'escape')
            }),
            { minLength: 3, maxLength: 8 }
          ),
          async (sequence) => {
            let isModalOpen = false;

            for (const step of sequence) {
              if (step.action === 'open' && !isModalOpen) {
                const projectCard = page.locator('.project-card').nth(step.projectIndex);
                const isVisible = await projectCard.isVisible().catch(() => false);

                if (isVisible) {
                  await projectCard.click();
                  await page.waitForTimeout(500);
                  isModalOpen = true;
                }
              } else if (step.action === 'close' && isModalOpen) {
                if (step.closeMethod === 'button') {
                  await page.locator('.modal-close').click();
                } else if (step.closeMethod === 'overlay') {
                  await page.locator('.modal-overlay').click();
                } else if (step.closeMethod === 'escape') {
                  await page.keyboard.press('Escape');
                }
                await page.waitForTimeout(500);
                isModalOpen = false;
              }
            }

            const app = page.locator('.App');
            await expect(app).toBeVisible();
          }
        ),
        { numRuns: 10 }
      );
    });
  });

  test.describe('Category Filter Combinations', () => {
    test('should handle random category selection sequences', async ({ page }) => {
      await page.locator('#coursework').scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);

      await fc.assert(
        fc.asyncProperty(
          fc.array(
            fc.constantFrom('All Skills', 'Hardware', 'Software', 'AI/ML', 'Tools'),
            { minLength: 5, maxLength: 15 }
          ),
          async (categories) => {
            for (const category of categories) {
              const categoryBtn = page.locator('.category-btn', { hasText: category });
              await categoryBtn.click();
              await page.waitForTimeout(300);

              const skillsGrid = page.locator('.skills-grid');
              await expect(skillsGrid).toBeVisible();

              const skillCards = page.locator('.skill-card');
              const count = await skillCards.count();
              expect(count).toBeGreaterThan(0);
            }
          }
        ),
        { numRuns: 10 }
      );
    });
  });

  test.describe('Navigation Sequence Testing', () => {
    test('should handle random navigation sequences', async ({ page }) => {
      await fc.assert(
        fc.asyncProperty(
          fc.array(
            fc.constantFrom('home', 'about', 'experience', 'projects', 'coursework', 'contact'),
            { minLength: 5, maxLength: 10 }
          ),
          async (sections) => {
            for (const section of sections) {
              const link = page.locator(`a[href="#${section}"]`).first();
              const isVisible = await link.isVisible().catch(() => false);

              if (isVisible) {
                await link.click();
                await page.waitForTimeout(800);
              }

              const app = page.locator('.App');
              await expect(app).toBeVisible();
            }
          }
        ),
        { numRuns: 10 }
      );
    });
  });

  test.describe('Viewport Resize During Interactions', () => {
    test('should handle viewport changes during modal interaction', async ({ page }) => {
      await page.locator('#projects').scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);

      await fc.assert(
        fc.asyncProperty(
          fc.record({
            initialWidth: fc.integer({ min: 375, max: 1920 }),
            initialHeight: fc.integer({ min: 667, max: 1080 }),
            finalWidth: fc.integer({ min: 375, max: 1920 }),
            finalHeight: fc.integer({ min: 667, max: 1080 })
          }),
          async (viewports) => {
            await page.setViewportSize({
              width: viewports.initialWidth,
              height: viewports.initialHeight
            });
            await page.waitForTimeout(300);

            await page.locator('.project-card').first().click();
            await page.waitForTimeout(500);

            await page.setViewportSize({
              width: viewports.finalWidth,
              height: viewports.finalHeight
            });
            await page.waitForTimeout(500);

            const modal = page.locator('.modal-container');
            await expect(modal).toBeVisible();

            await page.locator('.modal-close').click();
            await page.waitForTimeout(300);
          }
        ),
        { numRuns: 10 }
      );
    });
  });

  test.describe('Rapid Input Sequences', () => {
    test('should handle rapid keyboard inputs', async ({ page }) => {
      await fc.assert(
        fc.asyncProperty(
          fc.array(
            fc.constantFrom('Tab', 'Enter', 'Escape', 'ArrowDown', 'ArrowUp'),
            { minLength: 10, maxLength: 20 }
          ),
          async (keys) => {
            for (const key of keys) {
              await page.keyboard.press(key);
              await page.waitForTimeout(50);
            }

            const app = page.locator('.App');
            await expect(app).toBeVisible();
          }
        ),
        { numRuns: 5 }
      );
    });
  });

  test.describe('Animation State Transitions', () => {
    test('should handle rapid page refreshes', async ({ page }) => {
      await fc.assert(
        fc.asyncProperty(
          fc.integer({ min: 2, max: 5 }),
          async (numRefreshes) => {
            for (let i = 0; i < numRefreshes; i++) {
              await page.reload();
              await page.waitForTimeout(1000);

              const app = page.locator('.App');
              await expect(app).toBeVisible();
            }
          }
        ),
        { numRuns: 5 }
      );
    });
  });

  test.describe('Concurrent Interactions', () => {
    test('should handle clicking multiple elements in quick succession', async ({ page }) => {
      await fc.assert(
        fc.asyncProperty(
          fc.array(
            fc.record({
              selector: fc.constantFrom('a[href="#about"]', 'a[href="#projects"]', '.nav-logo'),
              delay: fc.integer({ min: 100, max: 500 })
            }),
            { minLength: 3, maxLength: 6 }
          ),
          async (clicks) => {
            for (const click of clicks) {
              const element = page.locator(click.selector).first();
              const isVisible = await element.isVisible().catch(() => false);

              if (isVisible) {
                await element.click();
                await page.waitForTimeout(click.delay);
              }
            }

            const navigation = page.locator('.navigation');
            await expect(navigation).toBeVisible();
          }
        ),
        { numRuns: 10 }
      );
    });
  });

  test.describe('Media Query Breakpoint Testing', () => {
    test('should test all critical breakpoints', async ({ page }) => {
      const breakpoints = [320, 375, 414, 768, 1024, 1280, 1440, 1920, 2560];

      for (const width of breakpoints) {
        await page.setViewportSize({ width, height: 1080 });
        await page.waitForTimeout(500);

        const navigation = page.locator('.navigation');
        await expect(navigation).toBeVisible();

        const app = page.locator('.App');
        await expect(app).toBeVisible();

        const hasOverflow = await page.evaluate(() => {
          return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });
        expect(hasOverflow).toBe(false);
      }
    });
  });

  test.describe('Stress Testing', () => {
    test('should handle rapid navigation between all sections', async ({ page }) => {
      const sections = ['home', 'about', 'experience', 'projects', 'coursework', 'contact'];

      for (let iteration = 0; iteration < 3; iteration++) {
        for (const section of sections) {
          await page.locator(`a[href="#${section}"]`).first().click();
          await page.waitForTimeout(200);
        }
      }

      const app = page.locator('.App');
      await expect(app).toBeVisible();
    });

    test('should handle opening all projects sequentially', async ({ page }) => {
      await page.locator('#projects').scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);

      for (let i = 0; i < 7; i++) {
        await page.locator('.project-card').nth(i).click();
        await page.waitForTimeout(500);

        const modal = page.locator('.modal-container');
        await expect(modal).toBeVisible();

        await page.locator('.modal-close').click();
        await page.waitForTimeout(500);
      }

      const projectsSection = page.locator('#projects');
      await expect(projectsSection).toBeVisible();
    });
  });
});
