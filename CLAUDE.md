# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start        # Start development server
npm run build    # Production build (output: /build)
```

No test suite is configured.

## Architecture

Single-page React portfolio with scroll-based section navigation. No router, no Redux - pure hooks and refs.

**Entry point:** `src/App.js` orchestrates a 2.8s loading screen, then renders all sections.

**Section order (in DOM):** Hero -> DualDegree -> WorkTimeline -> Projects -> Coursework -> Contact

**Styling:** All CSS lives in `src/App.css` (~2,800 lines). No CSS modules or styled-components. Component-specific styles are grouped in clearly labeled sections within that file.

## Key Components

**Navigation.js** - The most complex component. A draggable/tappable pill that slides between nav items. Uses refs extensively (`isDraggingRef`, `pillLeftRef`, `dragStartX`, etc.) to avoid stale closures in gesture handlers. Tap vs. drag is distinguished by an 8px movement threshold (`dragDistanceRef`). Scroll position syncs the pill via a throttled scroll listener using a `ticking` flag.

**Projects.js** - Project grid with modal. Project data is defined as a static array of objects within the file. Each project has: `id, title, subtitle, achievement, description, tech[], githubLink, problemStatement, solution, keyFeatures[], achievements[], timeline`.

**App.js** - Loading screen uses `setInterval` at 30ms for terminal typing effect. Phase transitions fire at 600ms intervals via `setTimeout`. After 2.8s, sets `isLoaded = true` which unmounts the loader and mounts the main content.

## Animation Patterns

- Framer Motion `motion.div` with `variants` for staggered entrance animations
- Standard easing curve across components: `[0.6, 0.05, 0.01, 0.9]`
- `AnimatePresence` wraps modals and the loading screen for exit transitions
- Performance-sensitive animations (nav pill, scroll sync) use `requestAnimationFrame`, not Framer Motion

## Deployment

Deployed on Vercel. `vercel.json` is present in the root.

## Color Scheme

Primary accent: `#E27F5A` (orange). Used consistently for highlights, active states, and CTA elements.
