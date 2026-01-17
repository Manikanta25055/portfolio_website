# Portfolio React - E2E Test Suite

This directory contains comprehensive end-to-end tests for the Portfolio React application using Playwright and fast-check.

## Test Structure

### Page Object Models (`page-objects/`)
- `NavigationPage.js` - Navigation bar, mobile menu, section indicators
- `ProjectsPage.js` - Projects section, modals, project cards
- `TechnicalArsenalPage.js` - Skills filtering, category selection
- `WorkTimelinePage.js` - Work experience timeline

### Test Suites

1. **navigation.spec.js** - Navigation and routing tests
   - Top navigation functionality
   - Mobile menu interactions
   - Section indicators
   - Scroll progress tracking
   - Keyboard navigation

2. **projects.spec.js** - Projects section tests
   - All 7 projects validation
   - Modal open/close operations
   - Modal centering on all viewports
   - Project details display
   - Technology stack verification

3. **work-timeline.spec.js** - Work experience tests
   - Timeline display on mobile/desktop
   - Experience details validation
   - Skills display
   - Responsive layout

4. **technical-arsenal.spec.js** - Technical skills tests
   - Category filtering (All Skills, Hardware, Software, AI/ML, Tools)
   - Skill proficiency display
   - Hardware items display
   - Responsive grid layout

5. **responsive.spec.js** - Viewport and responsive tests
   - 8 different viewport sizes (375px to 2560px)
   - Custom cursor behavior
   - Mobile/desktop/tablet layouts
   - Orientation changes
   - No horizontal overflow verification

6. **property-based.spec.js** - Fuzz and property-based tests
   - Random viewport resizing
   - Scroll position fuzzing
   - Modal interaction sequences
   - Category filter combinations
   - Stress testing

## Running Tests

### Install Dependencies
```bash
npm install
npm run test:install
```

### Run All Tests
```bash
npm run test:e2e
```

### Run Specific Browser
```bash
npm run test:e2e:chromium
npm run test:e2e:firefox
npm run test:e2e:webkit
```

### Run Mobile Tests
```bash
npm run test:e2e:mobile
```

### Run with UI
```bash
npm run test:e2e:ui
```

### Debug Tests
```bash
npm run test:e2e:debug
```

### View Test Report
```bash
npm run test:e2e:report
```

## Test Coverage

### Components Tested
- Navigation (desktop and mobile)
- Hero section
- About section
- Work Timeline (3 experiences)
- Projects section (7 projects)
- Technical Arsenal (24 skills + 8 hardware items)
- Contact section
- Project Modals
- Custom Cursor
- Scroll behavior

### Browsers Tested
- Chromium (Desktop Chrome)
- Firefox
- WebKit (Safari)
- Mobile Chrome (Pixel 5)
- Mobile Safari (iPhone 12)
- iPad Pro

### Viewports Tested
- 375x667 (Mobile Small)
- 414x896 (Mobile Medium)
- 768x1024 (Tablet)
- 1024x768 (Tablet Landscape)
- 1280x720 (Desktop Small)
- 1440x900 (Desktop Medium)
- 1920x1080 (Desktop Large)
- 2560x1440 (Desktop XL)

## CI/CD Integration

Tests run automatically on:
- Push to main/master/develop branches
- Pull requests

GitHub Actions workflow:
- Runs tests in parallel across multiple browsers
- Shards tests for faster execution
- Uploads test reports as artifacts
- Comments on PRs with test results

## Test Metrics

Total test cases: 150+
Expected execution time:
- Single browser: ~5-8 minutes
- All browsers: ~15-20 minutes (parallel)
- Mobile tests: ~3-5 minutes

## Maintenance

### Adding New Tests
1. Create test file in `tests/` directory
2. Import necessary page objects
3. Follow existing test structure
4. Use descriptive test names
5. Include viewport variations if needed

### Updating Page Objects
1. Modify page object classes in `page-objects/`
2. Ensure all tests using the page object still pass
3. Update selectors if DOM structure changes

### Debugging Failed Tests
1. Run with `--headed` to see browser
2. Use `--debug` for step-by-step debugging
3. Check screenshots in `test-results/`
4. Review video recordings for failures
5. Use `--ui` mode for interactive debugging

## Best Practices

- Tests are isolated and can run in any order
- Each test cleans up after itself
- Page Object Model for maintainability
- Wait for network idle before interactions
- Use proper timeout values
- Test accessibility where applicable
- Property-based tests for edge cases
