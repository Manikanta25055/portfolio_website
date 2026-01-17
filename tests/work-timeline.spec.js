const { test, expect } = require('@playwright/test');
const { WorkTimelinePage } = require('./page-objects/WorkTimelinePage');

test.describe('Work Timeline Tests', () => {
  let workTimelinePage;

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000); // Wait for loader
    workTimelinePage = new WorkTimelinePage(page);
    await workTimelinePage.scrollToExperience();
    await page.waitForTimeout(500);
  });

  test('should display work experience section', async ({ page }) => {
    const isVisible = await workTimelinePage.isTimelineVisible();
    expect(isVisible).toBe(true);

    const sectionTitle = await page.locator('#experience .section-title').textContent();
    expect(sectionTitle).toBe('Work Experience');
  });

  test('should display all 3 work experiences', async ({ page }) => {
    const experienceCount = await workTimelinePage.getExperienceCount();
    expect(experienceCount).toBe(3);
  });

  test('should display correct work experience details', async ({ page }) => {
    const experiences = [
      {
        role: 'Project Intern',
        company: 'Apsis Solutions',
        location: 'Bangalore, India',
        period: 'July 2025 - September 2025'
      },
      {
        role: 'Project Intern',
        company: 'Mindenious Edutech',
        location: 'Bangalore, India',
        period: 'July 2025 - September 2025'
      },
      {
        role: 'Summer School Participant',
        company: 'IIIT Hyderabad',
        location: 'Hyderabad, India',
        period: 'June 2024 - July 2024'
      }
    ];

    for (let i = 0; i < experiences.length; i++) {
      const role = await workTimelinePage.getExperienceRole(i);
      const company = await workTimelinePage.getExperienceCompany(i);
      const location = await workTimelinePage.getExperienceLocation(i);
      const period = await workTimelinePage.getExperiencePeriod(i);

      expect(role).toBe(experiences[i].role);
      expect(company).toBe(experiences[i].company);
      expect(location).toBe(experiences[i].location);
      expect(period).toBe(experiences[i].period);
    }
  });

  test('should display timeline markers', async ({ page }) => {
    const markers = page.locator('.timeline-marker');
    const markerCount = await markers.count();

    expect(markerCount).toBe(3);

    for (let i = 0; i < markerCount; i++) {
      const dot = markers.nth(i).locator('.timeline-dot');
      await expect(dot).toBeVisible();
    }
  });

  test('should display experience descriptions', async ({ page }) => {
    for (let i = 0; i < 3; i++) {
      const description = await workTimelinePage.getTimelineDescription(i);
      expect(description).toBeTruthy();
      expect(description.length).toBeGreaterThan(20);
    }
  });

  test('should display skills for each experience', async ({ page }) => {
    const expectedSkillCounts = [4, 5, 3];

    for (let i = 0; i < 3; i++) {
      const skills = await workTimelinePage.getExperienceSkills(i);
      expect(skills.length).toBe(expectedSkillCounts[i]);
    }
  });

  test('should display Apsis Solutions skills correctly', async ({ page }) => {
    const skills = await workTimelinePage.getExperienceSkills(0);
    expect(skills).toContain('IoT Development');
    expect(skills).toContain('Industry Solutions');
    expect(skills).toContain('Mentorship');
    expect(skills).toContain('Technical Leadership');
  });

  test('should display Mindenious Edutech skills correctly', async ({ page }) => {
    const skills = await workTimelinePage.getExperienceSkills(1);
    expect(skills).toContain('FPGA Validation');
    expect(skills).toContain('RTL Design');
    expect(skills).toContain('Verification');
    expect(skills).toContain('Test Bench Development');
    expect(skills).toContain('ASIC Design Flow');
  });

  test.describe('Mobile Timeline View', () => {
    test.use({ viewport: { width: 375, height: 667 } });

    test('should display timeline on mobile', async ({ page }) => {
      await workTimelinePage.scrollToExperience();
      await page.waitForTimeout(500);

      const isVisible = await workTimelinePage.isTimelineVisible();
      expect(isVisible).toBe(true);
    });

    test('should display all experience cards on mobile', async ({ page }) => {
      await workTimelinePage.scrollToExperience();
      await page.waitForTimeout(500);

      const experienceCount = await workTimelinePage.getExperienceCount();
      expect(experienceCount).toBe(3);

      for (let i = 0; i < experienceCount; i++) {
        const content = workTimelinePage.timelineContent.nth(i);
        await expect(content).toBeVisible();
      }
    });

    test('should display skills on mobile with proper wrapping', async ({ page }) => {
      await workTimelinePage.scrollToExperience();
      await page.waitForTimeout(500);

      for (let i = 0; i < 3; i++) {
        const skills = await workTimelinePage.getExperienceSkills(i);
        expect(skills.length).toBeGreaterThan(0);
      }
    });
  });

  test.describe('Desktop Timeline View', () => {
    test.use({ viewport: { width: 1920, height: 1080 } });

    test('should display timeline with animations on desktop', async ({ page }) => {
      await page.goto('/');
      await page.waitForTimeout(3000);

      await workTimelinePage.scrollToExperience();
      await page.waitForTimeout(1000);

      const experienceCount = await workTimelinePage.getExperienceCount();
      expect(experienceCount).toBe(3);
    });

    test('should hover effect work on desktop', async ({ page }) => {
      await workTimelinePage.scrollToExperience();
      await page.waitForTimeout(500);

      const firstExperience = workTimelinePage.timelineContent.first();
      await firstExperience.hover();
      await page.waitForTimeout(200);

      await expect(firstExperience).toBeVisible();
    });
  });

  test.describe('Tablet Timeline View', () => {
    test.use({ viewport: { width: 768, height: 1024 } });

    test('should display timeline correctly on tablet', async ({ page }) => {
      await workTimelinePage.scrollToExperience();
      await page.waitForTimeout(500);

      const experienceCount = await workTimelinePage.getExperienceCount();
      expect(experienceCount).toBe(3);

      for (let i = 0; i < experienceCount; i++) {
        const content = workTimelinePage.timelineContent.nth(i);
        await expect(content).toBeVisible();
      }
    });
  });

  test('should display timeline in correct chronological order', async ({ page }) => {
    const firstRole = await workTimelinePage.getExperienceRole(0);
    const secondRole = await workTimelinePage.getExperienceRole(1);
    const thirdRole = await workTimelinePage.getExperienceRole(2);

    expect(firstRole).toBe('Project Intern');
    expect(secondRole).toBe('Project Intern');
    expect(thirdRole).toBe('Summer School Participant');
  });

  test('should have proper spacing between timeline items', async ({ page }) => {
    const items = page.locator('.timeline-item');

    for (let i = 0; i < await items.count() - 1; i++) {
      const currentBox = await items.nth(i).boundingBox();
      const nextBox = await items.nth(i + 1).boundingBox();

      expect(currentBox).toBeTruthy();
      expect(nextBox).toBeTruthy();

      const spacing = nextBox.y - (currentBox.y + currentBox.height);
      expect(spacing).toBeGreaterThan(0);
    }
  });

  test('should display complete timeline vertical line', async ({ page }) => {
    const timeline = page.locator('.timeline');
    await expect(timeline).toBeVisible();

    const timelineBox = await timeline.boundingBox();
    expect(timelineBox.height).toBeGreaterThan(300);
  });
});
