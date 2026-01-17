class WorkTimelinePage {
  constructor(page) {
    this.page = page;
    this.experienceSection = page.locator('#experience');
    this.timelineItems = page.locator('.timeline-item');
    this.timelineContent = page.locator('.timeline-content');
  }

  async getExperienceCount() {
    return await this.timelineItems.count();
  }

  async scrollToExperience() {
    await this.experienceSection.scrollIntoViewIfNeeded();
  }

  async getExperienceRole(index) {
    return await this.timelineContent.nth(index).locator('h3').textContent();
  }

  async getExperienceCompany(index) {
    return await this.timelineContent.nth(index).locator('h4').textContent();
  }

  async getExperienceLocation(index) {
    return await this.timelineContent.nth(index).locator('.timeline-location').textContent();
  }

  async getExperiencePeriod(index) {
    return await this.timelineContent.nth(index).locator('.timeline-period').textContent();
  }

  async getExperienceSkills(index) {
    return await this.timelineContent.nth(index).locator('.timeline-skill').allTextContents();
  }

  async isCurrentBadgeVisible(index) {
    const badge = this.timelineContent.nth(index).locator('.current-badge');
    return await badge.isVisible().catch(() => false);
  }

  async isTimelineVisible() {
    return await this.experienceSection.isVisible();
  }

  async getTimelineDescription(index) {
    return await this.timelineContent.nth(index).locator('p').textContent();
  }
}

module.exports = { WorkTimelinePage };
