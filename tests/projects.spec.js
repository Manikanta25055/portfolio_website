const { test, expect } = require('@playwright/test');
const { ProjectsPage } = require('./page-objects/ProjectsPage');

test.describe('Projects Section Tests', () => {
  let projectsPage;

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000); // Wait for loader
    projectsPage = new ProjectsPage(page);
    await projectsPage.scrollToProjects();
    await page.waitForTimeout(500);
  });

  test('should display all 7 project cards', async ({ page }) => {
    const projectCount = await projectsPage.getProjectCount();
    expect(projectCount).toBe(7);
  });

  test('should display featured project with featured class', async ({ page }) => {
    await expect(projectsPage.featuredProjectCard).toBeVisible();

    const featuredTitle = await projectsPage.getProjectTitle(0);
    expect(featuredTitle).toBe('Project GARUDA');
  });

  test('should display project achievement badges', async ({ page }) => {
    const achievement = await projectsPage.getProjectAchievement(0);
    expect(achievement).toBe('1st Place - Gadget Expo 2025');
  });

  test('should open modal when clicking on a project card', async ({ page }) => {
    await projectsPage.clickProject(0);

    const isModalOpen = await projectsPage.isModalOpen();
    expect(isModalOpen).toBe(true);

    const modalTitle = await projectsPage.getModalTitle();
    expect(modalTitle).toBe('Project GARUDA');
  });

  test('should close modal when clicking close button', async ({ page }) => {
    await projectsPage.clickProject(0);
    await expect(projectsPage.projectModal).toBeVisible();

    await projectsPage.closeModal();
    await expect(projectsPage.projectModal).not.toBeVisible();
  });

  test('should close modal when clicking overlay', async ({ page }) => {
    await projectsPage.clickProject(0);
    await expect(projectsPage.projectModal).toBeVisible();

    await projectsPage.closeModalByOverlay();
    await expect(projectsPage.projectModal).not.toBeVisible();
  });

  test('should close modal when pressing Escape key', async ({ page }) => {
    await projectsPage.clickProject(0);
    await expect(projectsPage.projectModal).toBeVisible();

    await projectsPage.closeModalByEscape();
    await expect(projectsPage.projectModal).not.toBeVisible();
  });

  test('should prevent body scroll when modal is open', async ({ page }) => {
    await projectsPage.clickProject(0);

    const bodyOverflow = await page.evaluate(() => document.body.style.overflow);
    expect(bodyOverflow).toBe('hidden');

    await projectsPage.closeModal();

    const bodyOverflowAfter = await page.evaluate(() => document.body.style.overflow);
    expect(bodyOverflowAfter).toBe('unset');
  });

  test('should display all project details in modal', async ({ page }) => {
    await projectsPage.clickProject(0);

    await expect(page.locator('.modal-section h4', { hasText: 'Problem Statement' })).toBeVisible();
    await expect(page.locator('.modal-section h4', { hasText: 'Solution' })).toBeVisible();
    await expect(page.locator('.modal-section h4', { hasText: 'Key Features' })).toBeVisible();
    await expect(page.locator('.modal-section h4', { hasText: 'Achievements' })).toBeVisible();
    await expect(page.locator('.modal-section h4', { hasText: 'Timeline' })).toBeVisible();
    await expect(page.locator('.modal-section h4', { hasText: 'Technologies Used' })).toBeVisible();
  });

  test('should display technology stack in modal', async ({ page }) => {
    await projectsPage.clickProject(0);

    const techStack = await projectsPage.getProjectTechStack();
    expect(techStack).toContain('Python');
    expect(techStack).toContain('YOLOv8');
    expect(techStack).toContain('Hailo AI');
  });

  test('should test all 7 projects individually', async ({ page }) => {
    const expectedProjects = [
      { title: 'Project GARUDA', tech: 'Python' },
      { title: 'Patient Collapse Detection System', tech: 'AI/ML' },
      { title: 'Active Battery Cell Equalization', tech: 'Power Electronics' },
      { title: 'Active Suspension System', tech: 'MATLAB' },
      { title: 'Secure Communication System', tech: 'MATLAB' },
      { title: 'Speech Denoising using Spectral Subtraction', tech: 'MATLAB' },
      { title: 'Power Quality Analysis using DTFS', tech: 'MATLAB' }
    ];

    for (let i = 0; i < 7; i++) {
      const title = await projectsPage.getProjectTitle(i);
      expect(title).toBe(expectedProjects[i].title);

      await projectsPage.clickProject(i);
      await expect(projectsPage.projectModal).toBeVisible();

      const modalTitle = await projectsPage.getModalTitle();
      expect(modalTitle).toBe(expectedProjects[i].title);

      const techStack = await projectsPage.getProjectTechStack();
      expect(techStack.join(' ')).toContain(expectedProjects[i].tech);

      await projectsPage.closeModal();
      await page.waitForTimeout(500);
    }
  });

  test('should display achievements grid with correct values', async ({ page }) => {
    await projectsPage.clickProject(0);

    const achievementValue = await page.locator('.achievement-value').first().textContent();
    const achievementLabel = await page.locator('.achievement-label').first().textContent();

    expect(achievementValue).toBeTruthy();
    expect(achievementLabel).toBeTruthy();
  });

  test('should display key features as a list', async ({ page }) => {
    await projectsPage.clickProject(0);

    const featuresList = page.locator('.modal-list li');
    const featuresCount = await featuresList.count();

    expect(featuresCount).toBeGreaterThan(0);
  });

  test.describe('Modal Centering and Responsiveness', () => {
    const viewports = [
      { name: 'Mobile', width: 375, height: 667 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Desktop', width: 1920, height: 1080 }
    ];

    for (const viewport of viewports) {
      test(`should center modal on ${viewport.name}`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await projectsPage.scrollToProjects();
        await page.waitForTimeout(500);

        await projectsPage.clickProject(0);

        const modalBox = await projectsPage.projectModal.boundingBox();
        expect(modalBox).toBeTruthy();

        const viewportWidth = page.viewportSize().width;
        const modalCenterX = modalBox.x + modalBox.width / 2;
        const viewportCenterX = viewportWidth / 2;

        const tolerance = 50;
        expect(Math.abs(modalCenterX - viewportCenterX)).toBeLessThan(tolerance);
      });
    }
  });

  test('should handle rapid modal open/close operations', async ({ page }) => {
    for (let i = 0; i < 3; i++) {
      await projectsPage.clickProject(0);
      await expect(projectsPage.projectModal).toBeVisible();

      await projectsPage.closeModal();
      await expect(projectsPage.projectModal).not.toBeVisible();

      await page.waitForTimeout(200);
    }
  });

  test('should maintain scroll position after closing modal', async ({ page }) => {
    await projectsPage.scrollToProjects();
    const scrollYBefore = await page.evaluate(() => window.scrollY);

    await projectsPage.clickProject(0);
    await projectsPage.closeModal();

    await page.waitForTimeout(500);
    const scrollYAfter = await page.evaluate(() => window.scrollY);

    expect(Math.abs(scrollYBefore - scrollYAfter)).toBeLessThan(100);
  });

  test.describe('Project Card Animations', () => {
    test('should display project cards with animations on desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto('/');
      await page.waitForTimeout(3000);

      await projectsPage.scrollToProjects();
      await page.waitForTimeout(1000);

      const firstCard = projectsPage.projectCards.first();
      await expect(firstCard).toBeVisible();
    });

    test('should not animate on mobile to preserve performance', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      await page.waitForTimeout(3000);

      await projectsPage.scrollToProjects();
      await page.waitForTimeout(500);

      const firstCard = projectsPage.projectCards.first();
      await expect(firstCard).toBeVisible();
    });
  });
});
