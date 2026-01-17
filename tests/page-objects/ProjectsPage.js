class ProjectsPage {
  constructor(page) {
    this.page = page;
    this.projectsSection = page.locator('#projects');
    this.projectCards = page.locator('.project-card');
    this.featuredProjectCard = page.locator('.project-card.featured');
    this.projectModal = page.locator('.modal-container');
    this.modalOverlay = page.locator('.modal-overlay');
    this.modalCloseButton = page.locator('.modal-close');
  }

  async getProjectCount() {
    return await this.projectCards.count();
  }

  async clickProject(index) {
    await this.projectCards.nth(index).click();
    await this.projectModal.waitFor({ state: 'visible' });
  }

  async clickProjectById(projectId) {
    await this.page.locator(`#${projectId}`).click();
    await this.projectModal.waitFor({ state: 'visible' });
  }

  async closeModal() {
    await this.modalCloseButton.click();
    await this.projectModal.waitFor({ state: 'hidden' });
  }

  async closeModalByOverlay() {
    await this.modalOverlay.click();
    await this.projectModal.waitFor({ state: 'hidden' });
  }

  async closeModalByEscape() {
    await this.page.keyboard.press('Escape');
    await this.projectModal.waitFor({ state: 'hidden' });
  }

  async isModalOpen() {
    return await this.projectModal.isVisible();
  }

  async getModalTitle() {
    return await this.projectModal.locator('h2').textContent();
  }

  async getProjectTechStack() {
    return await this.projectModal.locator('.modal-tech-pill').allTextContents();
  }

  async scrollToProjects() {
    await this.projectsSection.scrollIntoViewIfNeeded();
  }

  async isProjectCardVisible(index) {
    return await this.projectCards.nth(index).isVisible();
  }

  async getProjectTitle(index) {
    return await this.projectCards.nth(index).locator('h3').textContent();
  }

  async getProjectAchievement(index) {
    return await this.projectCards.nth(index).locator('.project-badge').textContent();
  }
}

module.exports = { ProjectsPage };
