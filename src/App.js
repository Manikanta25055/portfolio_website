import React, { useState, useRef, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import posthog from 'posthog-js';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import './App.css';
import CustomCursor from './components/CustomCursor';
import CanvasWorld from './components/CanvasWorld';
import WorldNode from './components/WorldNode';
import CanvasTraces from './components/CanvasTraces';
import Minimap from './components/Minimap';
import BlueprintReveal from './components/BlueprintReveal';
import Hero from './components/Hero';
import DualDegree from './components/DualDegree';
import WorkTimeline from './components/WorkTimeline';
import Projects from './components/Projects';
import GitHubActivity from './components/GitHubActivity';
import Blog from './components/Blog';
import Contact from './components/Contact';
import SkillsRadar from './components/SkillsRadar';
import StatusWidget from './components/StatusWidget';
import ThemeToggle from './components/ThemeToggle';

if (process.env.REACT_APP_POSTHOG_KEY) {
  posthog.init(process.env.REACT_APP_POSTHOG_KEY, {
    api_host: process.env.REACT_APP_POSTHOG_HOST || 'https://app.posthog.com',
    capture_pageview: true,
    autocapture: false,
  });
}

// World-space layout — generous spacing so panels never overlap
const WORLD_LAYOUT = [
  { id: 'home',       label: '00 · GVM — WAYPOINT', x: 0,      y: 0     },
  { id: 'about',      label: '01 · EDUCATION',       x: 1100,   y: -900  },
  { id: 'skills',     label: '02 · SKILLS',          x: 1600,   y: -100  },
  { id: 'projects',   label: '03 · PROJECTS',        x: 950,    y: 1050  },
  { id: 'experience', label: '04 · EXPERIENCE',      x: -350,   y: 1000  },
  { id: 'contact',    label: '05 · CONTACT',         x: 0,      y: 1950  },
  { id: 'blog',       label: '06 · BLOG',            x: -1200,  y: 380   },
  { id: 'github',     label: '07 · GITHUB',          x: -1000,  y: -650  },
];

const SECTION_COMPONENTS = {
  home:       Hero,
  about:      DualDegree,
  skills:     SkillsRadar,
  projects:   Projects,
  experience: WorkTimeline,
  contact:    Contact,
  blog:       Blog,
  github:     GitHubActivity,
};

function App() {
  const [revealDone, setRevealDone] = useState(false);
  const [activeSection] = useState('home');
  const [isPanning, setIsPanning] = useState(false);
  const canvasRef = useRef(null);

  const handleRevealComplete = useCallback(() => {
    setRevealDone(true);
  }, []);

  useKeyboardShortcuts(canvasRef, null);

  return (
    <div className="App">
      <CustomCursor isPanning={isPanning} />

      {/* Blueprint opening animation */}
      <AnimatePresence>
        {!revealDone && (
          <BlueprintReveal onComplete={handleRevealComplete} />
        )}
      </AnimatePresence>

      {/* Canvas world — mounted after reveal */}
      {revealDone && (
        <CanvasWorld
          ref={canvasRef}
          onPanStart={() => setIsPanning(true)}
          onPanEnd={() => setIsPanning(false)}
        >
          {/* Circuit trace lines */}
          <CanvasTraces />

          {/* All section panels positioned on the canvas */}
          {WORLD_LAYOUT.map(({ id, label, x, y }) => {
            const SectionComponent = SECTION_COMPONENTS[id];
            if (!SectionComponent) return null;
            return (
              <WorldNode key={id} id={id} x={x} y={y} label={label}>
                <SectionComponent />
              </WorldNode>
            );
          })}
        </CanvasWorld>
      )}

      {/* Minimap navigation overlay */}
      {revealDone && (
        <Minimap
          canvasRef={canvasRef}
          activeSection={activeSection}
        />
      )}

      <StatusWidget />
      <ThemeToggle />
    </div>
  );
}

export default App;
