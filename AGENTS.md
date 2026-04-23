# Repository Guidelines

## Project Structure & Module Organization
This repository is a Create React App portfolio built as a Pokemon-style game. App entry points live in `src/index.js` and `src/App.js`. UI and gameplay components are under `src/components/`, panel content lives in `src/components/panels/`, shared game data is in `src/data/`, and map/constants logic is in `src/game/`. Static assets and site metadata belong in `public/`. The Vercel serverless contact handler is in `api/contact.js`, and deployment headers/rewrites are defined in `vercel.json`.

## Build, Test, and Development Commands
Use `npm ci` for a clean install that matches CI. Use `npm start` to run the local CRA dev server. Use `npm run build` to generate the production bundle in `build/`. There is no `npm test` script currently checked in. The GitHub Actions workflow runs Playwright with `npx playwright test`, so add local Playwright config before depending on E2E coverage.

## Coding Style & Naming Conventions
Follow the existing style: functional React components, 2-space indentation, semicolons, and single quotes. Use `PascalCase` for component files such as `GameCanvas.js`, `camelCase` for hooks and helpers such as `useGameInput.js`, and descriptive data names in `src/data/portfolio.js`. Keep gameplay constants in `src/game/constants.js` instead of scattering literals. CRA’s default ESLint rules apply through the `react-app` preset.

## Testing Guidelines
No unit or integration tests are currently committed. If you add coverage, prefer Playwright for user flows and place specs under `tests/` with names like `contact-form.spec.js`. Keep tests deterministic and verify desktop plus mobile behavior because CI is configured for Chromium, Firefox, WebKit, Mobile Chrome, and Mobile Safari.

## Commit & Pull Request Guidelines
Recent history follows short conventional-style subjects such as `feat(game): ...`, `fix(visuals): ...`, and `merge: ...`. Keep commit messages scoped and imperative. Pull requests should include a concise summary, linked issue when relevant, screenshots or screen recordings for UI changes, and notes about manual testing performed.

## Security & Configuration Tips
Store secrets in local or Vercel environment variables, especially `RESEND_API_KEY` used by `api/contact.js`. Do not commit `.env*` files, generated reports, or build output beyond intentional release artifacts.
