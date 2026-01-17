class NavigationPage {
  constructor(page) {
    this.page = page;
    this.logo = page.locator('.nav-logo');
    this.contactButton = page.locator('.nav-cta-btn');
    this.hamburgerMenu = page.locator('.hamburger');
    this.mobileMenu = page.locator('.mobile-menu');
    this.sectionIndicators = page.locator('.section-indicators');
    this.scrollProgressBar = page.locator('.scroll-progress-bar');
  }

  async navigateToSection(sectionId) {
    await this.page.locator(`a[href="#${sectionId}"]`).first().click();
  }

  async openMobileMenu() {
    await this.hamburgerMenu.click();
    await this.mobileMenu.waitFor({ state: 'visible' });
  }

  async closeMobileMenu() {
    await this.page.locator('.mobile-menu-overlay').click();
    await this.mobileMenu.waitFor({ state: 'hidden' });
  }

  async navigateToSectionViaMobileMenu(sectionLabel) {
    await this.openMobileMenu();
    await this.page.locator('.mobile-menu-item', { hasText: sectionLabel }).click();
    await this.mobileMenu.waitFor({ state: 'hidden' });
  }

  async isScrolled() {
    const navigation = await this.page.locator('.navigation');
    return await navigation.evaluate((el) => el.classList.contains('scrolled'));
  }

  async getActiveSection() {
    const activeDot = await this.page.locator('.section-dot.active');
    return await activeDot.getAttribute('href');
  }
}

module.exports = { NavigationPage };
