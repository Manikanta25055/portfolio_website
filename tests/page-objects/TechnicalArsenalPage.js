class TechnicalArsenalPage {
  constructor(page) {
    this.page = page;
    this.arsenalSection = page.locator('#coursework');
    this.categoryButtons = page.locator('.category-btn');
    this.skillCards = page.locator('.skill-card');
    this.hardwarePills = page.locator('.tech-pill');
  }

  async selectCategory(categoryLabel) {
    await this.categoryButtons.filter({ hasText: categoryLabel }).click();
    await this.page.waitForTimeout(500); // Wait for animation
  }

  async getActiveCategory() {
    const activeButton = await this.categoryButtons.filter({ hasClass: /active/ });
    return await activeButton.textContent();
  }

  async getSkillCount() {
    return await this.skillCards.count();
  }

  async getSkillNames() {
    return await this.skillCards.locator('.skill-name').allTextContents();
  }

  async getHardwareCount() {
    return await this.hardwarePills.count();
  }

  async getHardwareItems() {
    return await this.hardwarePills.allTextContents();
  }

  async scrollToArsenal() {
    await this.arsenalSection.scrollIntoViewIfNeeded();
  }

  async getSkillProficiency(skillName) {
    const skillCard = await this.skillCards.filter({ hasText: skillName });
    const activeDots = await skillCard.locator('.proficiency-dot.active').count();
    return activeDots;
  }

  async getAllCategoryLabels() {
    return await this.categoryButtons.allTextContents();
  }
}

module.exports = { TechnicalArsenalPage };
