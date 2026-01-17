const { test, expect } = require('@playwright/test');
const { NavigationPage } = require('./page-objects/NavigationPage');

test.describe('Navigation Tests', () => {
  let navigationPage;

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    // Wait for loader to finish
    await page.waitForTimeout(3000);
    navigationPage = new NavigationPage(page);
  });

  test('should display navigation bar with logo and contact button', async ({ page }) => {
    await expect(navigationPage.logo).toBeVisible();
    await expect(navigationPage.contactButton).toBeVisible();

    const logoText = await navigationPage.logo.locator('.logo-text').textContent();
    expect(logoText).toBe('GVM');
  });

  test('should navigate to contact section when clicking contact button', async ({ page }) => {
    await navigationPage.contactButton.click();
    await page.waitForTimeout(1000);

    const contactSection = page.locator('#contact');
    await expect(contactSection).toBeInViewport();
  });

  test('should add scrolled class to navigation on scroll', async ({ page }) => {
    const isScrolledBefore = await navigationPage.isScrolled();
    expect(isScrolledBefore).toBe(false);

    await page.evaluate(() => window.scrollTo(0, 200));
    await page.waitForTimeout(500);

    const isScrolledAfter = await navigationPage.isScrolled();
    expect(isScrolledAfter).toBe(true);
  });

  test('should display scroll progress bar and update on scroll', async ({ page }) => {
    await expect(navigationPage.scrollProgressBar).toBeVisible();

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await page.waitForTimeout(500);

    const progressBar = await navigationPage.scrollProgressBar;
    const scaleX = await progressBar.evaluate((el) => {
      const transform = window.getComputedStyle(el).transform;
      if (transform === 'none') return 0;
      const matrix = transform.match(/matrix.*\((.+)\)/);
      if (matrix) {
        const values = matrix[1].split(', ');
        return parseFloat(values[0]);
      }
      return 0;
    });

    expect(scaleX).toBeGreaterThan(0);
  });

  test('should display vertical section indicators', async ({ page }) => {
    await expect(navigationPage.sectionIndicators).toBeVisible();

    const sections = ['Home', 'About', 'Experience', 'Projects', 'Tech', 'Contact'];
    for (const section of sections) {
      const indicator = page.locator('.section-dot .dot-tooltip', { hasText: section });
      await expect(indicator).toBeAttached();
    }
  });

  test('should navigate to sections via section indicators', async ({ page }) => {
    await page.locator('.section-dot[href="#about"]').click();
    await page.waitForTimeout(1000);

    const aboutSection = page.locator('#about');
    await expect(aboutSection).toBeInViewport();
  });

  test('should update active section indicator on scroll', async ({ page }) => {
    await page.locator('#projects').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    const activeHref = await navigationPage.getActiveSection();
    expect(activeHref).toContain('projects');
  });

  test.describe('Mobile Navigation', () => {
    test.use({ viewport: { width: 375, height: 667 } });

    test('should display hamburger menu on mobile', async ({ page }) => {
      await expect(navigationPage.hamburgerMenu).toBeVisible();
    });

    test('should open mobile menu when clicking hamburger', async ({ page }) => {
      await navigationPage.openMobileMenu();
      await expect(navigationPage.mobileMenu).toHaveClass(/active/);
    });

    test('should close mobile menu when clicking overlay', async ({ page }) => {
      await navigationPage.openMobileMenu();
      await navigationPage.closeMobileMenu();
      await expect(navigationPage.mobileMenu).not.toHaveClass(/active/);
    });

    test('should navigate to sections via mobile menu', async ({ page }) => {
      await navigationPage.navigateToSectionViaMobileMenu('Projects');

      const projectsSection = page.locator('#projects');
      await expect(projectsSection).toBeInViewport();
    });

    test('should display all menu items in mobile menu', async ({ page }) => {
      await navigationPage.openMobileMenu();

      const menuItems = ['Home', 'About', 'Experience', 'Projects', 'Tech', 'Contact'];
      for (const item of menuItems) {
        const menuItem = page.locator('.mobile-menu-item', { hasText: item });
        await expect(menuItem).toBeVisible();
      }
    });
  });

  test.describe('Keyboard Navigation', () => {
    test('should support keyboard navigation for links', async ({ page }) => {
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');

      const focusedElement = await page.evaluate(() => document.activeElement.className);
      expect(focusedElement).toBeTruthy();
    });
  });

  test.describe('Cross-browser Navigation', () => {
    test('should work correctly in all browsers', async ({ browserName, page }) => {
      await expect(navigationPage.logo).toBeVisible();
      await expect(navigationPage.contactButton).toBeVisible();

      await navigationPage.contactButton.click();
      await page.waitForTimeout(1000);

      const contactSection = page.locator('#contact');
      await expect(contactSection).toBeInViewport();
    });
  });
});
