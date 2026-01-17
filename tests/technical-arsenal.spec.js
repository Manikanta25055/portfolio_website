const { test, expect } = require('@playwright/test');
const { TechnicalArsenalPage } = require('./page-objects/TechnicalArsenalPage');

test.describe('Technical Arsenal Tests', () => {
  let arsenalPage;

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000); // Wait for loader
    arsenalPage = new TechnicalArsenalPage(page);
    await arsenalPage.scrollToArsenal();
    await page.waitForTimeout(500);
  });

  test('should display Technical Arsenal section', async ({ page }) => {
    await expect(arsenalPage.arsenalSection).toBeVisible();

    const sectionTitle = await page.locator('#coursework .section-title').textContent();
    expect(sectionTitle).toBe('Technical Arsenal');
  });

  test('should display all category buttons', async ({ page }) => {
    const categories = await arsenalPage.getAllCategoryLabels();

    expect(categories).toContain('All Skills');
    expect(categories).toContain('Hardware');
    expect(categories).toContain('Software');
    expect(categories).toContain('AI/ML');
    expect(categories).toContain('Tools');
  });

  test('should have "All Skills" as default active category', async ({ page }) => {
    const activeCategory = await arsenalPage.getActiveCategory();
    expect(activeCategory).toBe('All Skills');
  });

  test('should display all skills when "All Skills" is selected', async ({ page }) => {
    const skillCount = await arsenalPage.getSkillCount();
    expect(skillCount).toBe(24); // 6 hardware + 6 software + 6 aiml + 6 tools
  });

  test('should filter skills when selecting Hardware category', async ({ page }) => {
    await arsenalPage.selectCategory('Hardware');

    const activeCategory = await arsenalPage.getActiveCategory();
    expect(activeCategory).toBe('Hardware');

    const skillCount = await arsenalPage.getSkillCount();
    expect(skillCount).toBe(6);

    const skillNames = await arsenalPage.getSkillNames();
    expect(skillNames).toContain('FPGA Design & Verification');
    expect(skillNames).toContain('Embedded Systems');
    expect(skillNames).toContain('Power Electronics');
  });

  test('should filter skills when selecting Software category', async ({ page }) => {
    await arsenalPage.selectCategory('Software');

    const activeCategory = await arsenalPage.getActiveCategory();
    expect(activeCategory).toBe('Software');

    const skillCount = await arsenalPage.getSkillCount();
    expect(skillCount).toBe(6);

    const skillNames = await arsenalPage.getSkillNames();
    expect(skillNames).toContain('Python');
    expect(skillNames).toContain('Verilog/SystemVerilog');
    expect(skillNames).toContain('Embedded C');
  });

  test('should filter skills when selecting AI/ML category', async ({ page }) => {
    await arsenalPage.selectCategory('AI/ML');

    const activeCategory = await arsenalPage.getActiveCategory();
    expect(activeCategory).toBe('AI/ML');

    const skillCount = await arsenalPage.getSkillCount();
    expect(skillCount).toBe(6);

    const skillNames = await arsenalPage.getSkillNames();
    expect(skillNames).toContain('YOLOv8');
    expect(skillNames).toContain('Machine Learning');
    expect(skillNames).toContain('Computer Vision');
  });

  test('should filter skills when selecting Tools category', async ({ page }) => {
    await arsenalPage.selectCategory('Tools');

    const activeCategory = await arsenalPage.getActiveCategory();
    expect(activeCategory).toBe('Tools');

    const skillCount = await arsenalPage.getSkillCount();
    expect(skillCount).toBe(6);

    const skillNames = await arsenalPage.getSkillNames();
    expect(skillNames).toContain('MATLAB/Simulink');
    expect(skillNames).toContain('LTSpice');
    expect(skillNames).toContain('Vivado');
  });

  test('should switch between categories smoothly', async ({ page }) => {
    await arsenalPage.selectCategory('Hardware');
    let skillCount = await arsenalPage.getSkillCount();
    expect(skillCount).toBe(6);

    await arsenalPage.selectCategory('Software');
    skillCount = await arsenalPage.getSkillCount();
    expect(skillCount).toBe(6);

    await arsenalPage.selectCategory('AI/ML');
    skillCount = await arsenalPage.getSkillCount();
    expect(skillCount).toBe(6);

    await arsenalPage.selectCategory('All Skills');
    skillCount = await arsenalPage.getSkillCount();
    expect(skillCount).toBe(24);
  });

  test('should display proficiency dots for each skill', async ({ page }) => {
    await arsenalPage.selectCategory('Hardware');

    const firstCard = arsenalPage.skillCards.first();
    const proficiencyDots = firstCard.locator('.proficiency-dot');

    const dotsCount = await proficiencyDots.count();
    expect(dotsCount).toBe(3);
  });

  test('should display correct proficiency levels', async ({ page }) => {
    await arsenalPage.selectCategory('Software');

    const pythonProficiency = await arsenalPage.getSkillProficiency('Python');
    expect(pythonProficiency).toBe(3);

    const cProficiency = await arsenalPage.getSkillProficiency('C');
    expect(cProficiency).toBe(2);
  });

  test('should display hardware and development kits section', async ({ page }) => {
    const techSection = page.locator('.tech-section');
    await expect(techSection).toBeVisible();

    const subtitle = await techSection.locator('.tech-subtitle').textContent();
    expect(subtitle).toBe('Hardware & Development Kits');
  });

  test('should display all 8 hardware items', async ({ page }) => {
    const hardwareCount = await arsenalPage.getHardwareCount();
    expect(hardwareCount).toBe(8);
  });

  test('should display correct hardware items', async ({ page }) => {
    const hardwareItems = await arsenalPage.getHardwareItems();

    expect(hardwareItems).toContain('Analog Discovery 3');
    expect(hardwareItems).toContain('ADALM 1000');
    expect(hardwareItems).toContain('Raspberry Pi 5');
    expect(hardwareItems).toContain('ESP32-C6/S3 DevKit');
    expect(hardwareItems).toContain('Arduino Uno R4 WiFi');
    expect(hardwareItems).toContain('Nexys A7 FPGA');
    expect(hardwareItems).toContain('Hailo 8L AI Accelerator');
    expect(hardwareItems).toContain('46-in-1 Sensor Kit');
  });

  test.describe('Mobile Technical Arsenal View', () => {
    test.use({ viewport: { width: 375, height: 667 } });

    test('should display categories on mobile', async ({ page }) => {
      await arsenalPage.scrollToArsenal();
      await page.waitForTimeout(500);

      const categories = await arsenalPage.getAllCategoryLabels();
      expect(categories.length).toBe(5);
    });

    test('should filter skills on mobile', async ({ page }) => {
      await arsenalPage.scrollToArsenal();
      await page.waitForTimeout(500);

      await arsenalPage.selectCategory('Hardware');

      const skillCount = await arsenalPage.getSkillCount();
      expect(skillCount).toBe(6);
    });

    test('should display hardware pills on mobile', async ({ page }) => {
      await arsenalPage.scrollToArsenal();
      await page.waitForTimeout(500);

      const hardwareCount = await arsenalPage.getHardwareCount();
      expect(hardwareCount).toBe(8);
    });

    test('should wrap category buttons properly on mobile', async ({ page }) => {
      await arsenalPage.scrollToArsenal();
      await page.waitForTimeout(500);

      const categoriesContainer = page.locator('.skills-categories');
      await expect(categoriesContainer).toBeVisible();

      const firstButton = arsenalPage.categoryButtons.first();
      const lastButton = arsenalPage.categoryButtons.last();

      await expect(firstButton).toBeVisible();
      await expect(lastButton).toBeVisible();
    });
  });

  test.describe('Desktop Technical Arsenal View', () => {
    test.use({ viewport: { width: 1920, height: 1080 } });

    test('should display skills in grid layout on desktop', async ({ page }) => {
      await arsenalPage.scrollToArsenal();
      await page.waitForTimeout(1000);

      const skillsGrid = page.locator('.skills-grid');
      await expect(skillsGrid).toBeVisible();

      const skillCount = await arsenalPage.getSkillCount();
      expect(skillCount).toBe(24);
    });

    test('should hover effects work on desktop', async ({ page }) => {
      await arsenalPage.scrollToArsenal();
      await page.waitForTimeout(500);

      const firstSkill = arsenalPage.skillCards.first();
      await firstSkill.hover();
      await page.waitForTimeout(200);

      await expect(firstSkill).toBeVisible();
    });
  });

  test('should maintain skill data consistency across category switches', async ({ page }) => {
    await arsenalPage.selectCategory('Hardware');
    const hardwareSkills = await arsenalPage.getSkillNames();

    await arsenalPage.selectCategory('All Skills');
    const allSkills = await arsenalPage.getSkillNames();

    for (const skill of hardwareSkills) {
      expect(allSkills).toContain(skill);
    }
  });

  test('should display skill cards with correct structure', async ({ page }) => {
    const firstCard = arsenalPage.skillCards.first();

    const skillName = firstCard.locator('.skill-name');
    const proficiencyDots = firstCard.locator('.proficiency-dots');

    await expect(skillName).toBeVisible();
    await expect(proficiencyDots).toBeVisible();
  });

  test('should test all category transitions', async ({ page }) => {
    const categories = ['All Skills', 'Hardware', 'Software', 'AI/ML', 'Tools'];
    const expectedCounts = [24, 6, 6, 6, 6];

    for (let i = 0; i < categories.length; i++) {
      await arsenalPage.selectCategory(categories[i]);

      const activeCategory = await arsenalPage.getActiveCategory();
      expect(activeCategory).toBe(categories[i]);

      const skillCount = await arsenalPage.getSkillCount();
      expect(skillCount).toBe(expectedCounts[i]);

      await page.waitForTimeout(300);
    }
  });

  test('should display active proficiency dots with correct styling', async ({ page }) => {
    await arsenalPage.selectCategory('Software');

    const pythonCard = arsenalPage.skillCards.filter({ hasText: 'Python' });
    const activeDots = pythonCard.locator('.proficiency-dot.active');

    const activeCount = await activeDots.count();
    expect(activeCount).toBe(3);
  });
});
