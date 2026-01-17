# Quick Start - Testing Guide

## Installation

1. Install dependencies:
```bash
npm install
```

2. Install Playwright browsers:
```bash
npm run test:install
```

## Running Tests

### Quick Test Run (Chromium only)
```bash
npm run test:e2e:chromium
```

### Run All Tests (All Browsers)
```bash
npm run test:e2e
```

### Interactive UI Mode (Recommended for Development)
```bash
npm run test:e2e:ui
```

### View Test Report
```bash
npm run test:e2e:report
```

## Test Files Overview

| File | Tests | Description |
|------|-------|-------------|
| navigation.spec.js | 15 | Navigation, mobile menu, section indicators |
| projects.spec.js | 25 | All 7 projects, modals, interactions |
| work-timeline.spec.js | 20 | Work experience timeline |
| technical-arsenal.spec.js | 30 | Skills filtering, categories |
| responsive.spec.js | 40 | 8 viewports, responsive layouts |
| property-based.spec.js | 20 | Fuzz testing, edge cases |

**Total: 150+ tests**

## What Gets Tested

### Components
- Navigation
- Projects (7 projects)
- Work Timeline (3 experiences)
- Technical Arsenal (24 skills, 8 hardware items)
- Project Modals
- Custom Cursor

### Browsers
- Chrome/Chromium
- Firefox
- Safari/WebKit
- Mobile Chrome
- Mobile Safari

### Viewports
- Mobile: 375px, 414px
- Tablet: 768px, 1024px
- Desktop: 1280px, 1440px, 1920px, 2560px

## Development Workflow

### 1. Make Changes to Components
```bash
# Edit your React components
```

### 2. Run Tests in UI Mode
```bash
npm run test:e2e:ui
```

### 3. Fix Any Failures
- Click on failed test
- See screenshot/video
- Debug step by step

### 4. Run Full Suite Before Commit
```bash
npm run test:e2e
```

## CI/CD

Tests run automatically on:
- Push to main/master/develop
- Pull requests

Check GitHub Actions tab for results.

## Troubleshooting

### Tests Fail with Timeout
```bash
# Increase timeout in playwright.config.js
# Or run with more time:
npx playwright test --timeout=60000
```

### Need to Debug a Specific Test
```bash
# Run single test file
npx playwright test navigation.spec.js --debug

# Run specific test
npx playwright test -g "should display navigation"
```

### See What's Happening
```bash
# Run in headed mode (shows browser)
npm run test:e2e:headed
```

## File Structure

```
portfolio-react/
├── tests/
│   ├── page-objects/          # Reusable page interaction classes
│   │   ├── NavigationPage.js
│   │   ├── ProjectsPage.js
│   │   ├── TechnicalArsenalPage.js
│   │   └── WorkTimelinePage.js
│   ├── navigation.spec.js     # Navigation tests
│   ├── projects.spec.js       # Projects tests
│   ├── work-timeline.spec.js  # Timeline tests
│   ├── technical-arsenal.spec.js  # Skills tests
│   ├── responsive.spec.js     # Responsive tests
│   └── property-based.spec.js # Fuzz tests
├── playwright.config.js       # Playwright configuration
├── .github/
│   └── workflows/
│       └── test.yml          # CI/CD workflow
└── TESTING.md                # Full documentation
```

## Next Steps

1. Run `npm run test:e2e:ui` to explore tests interactively
2. Read TESTING.md for comprehensive documentation
3. Check test-report-summary.json for detailed metrics
4. Review failed tests in playwright-report/

## Tips

- Use UI mode for development (fastest feedback)
- Run full suite before pushing to GitHub
- Check CI results in GitHub Actions
- Screenshots are in test-results/ folder
- Videos are recorded on failure

---

For detailed documentation, see TESTING.md
