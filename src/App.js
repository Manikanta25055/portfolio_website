import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import posthog from 'posthog-js';
import './App.css';
import CustomCursor from './components/CustomCursor';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import DualDegree from './components/DualDegree';
import WorkTimeline from './components/WorkTimeline';
import Projects from './components/Projects';
import GitHubActivity from './components/GitHubActivity';
import Coursework from './components/Coursework';
import Blog from './components/Blog';
import Contact from './components/Contact';
import SkillsRadar from './components/SkillsRadar';
import StatusWidget from './components/StatusWidget';
import KeyboardHint from './components/KeyboardHint';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

if (process.env.REACT_APP_POSTHOG_KEY) {
  posthog.init(process.env.REACT_APP_POSTHOG_KEY, {
    api_host: process.env.REACT_APP_POSTHOG_HOST || 'https://app.posthog.com',
    capture_pageview: true,
    autocapture: false,
  });
}

function AppContent() {
  const [hintVisible, setHintVisible] = useState(false);
  useKeyboardShortcuts(() => setHintVisible(v => !v));

  return (
    <div className="App">
      <CustomCursor />
      <Navigation />
      <Hero />
      <DualDegree />
      <WorkTimeline />
      <SkillsRadar />
      <Projects />
      <GitHubActivity />
      <Coursework />
      <Blog />
      <Contact />
      <StatusWidget />
      <KeyboardHint isVisible={hintVisible} onClose={() => setHintVisible(false)} />
      <button
        className="shortcuts-trigger"
        onClick={() => setHintVisible(v => !v)}
        aria-label="Toggle keyboard shortcuts"
        title="Keyboard shortcuts"
      >
        <kbd>?</kbd>
        <span>shortcuts</span>
      </button>
    </div>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 3000);
    return () => clearTimeout(t);
  }, []);

  if (isLoading) {
    return (
      <AnimatePresence>
        <motion.div
          className="loader"
          key="loader"
          exit={{ opacity: 0, transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] } }}
        >
          {/* Anchor glow — first thing visible */}
          <motion.div
            className="loader-dot-anchor"
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.34, 1.2, 0.64, 1] }}
          />

          {/* Horizontal scan line extending from center */}
          <motion.div
            className="loader-scanline"
            initial={{ scaleX: 0, opacity: 0.8 }}
            animate={{ scaleX: 1, opacity: 0 }}
            transition={{ delay: 0.35, duration: 0.75, ease: [0.4, 0, 0.2, 1] }}
          />

          {/* Name block */}
          <div className="loader-name-block">
            <motion.p
              className="loader-first"
              initial={{ opacity: 0, letterSpacing: '0.5em' }}
              animate={{ opacity: 1, letterSpacing: '-0.01em' }}
              transition={{ delay: 0.8, duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
            >
              Veera Manikanta
            </motion.p>
            <motion.h1
              className="loader-last"
              initial={{ opacity: 0, letterSpacing: '0.6em' }}
              animate={{ opacity: 1, letterSpacing: '-0.02em' }}
              transition={{ delay: 1.05, duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
            >
              Gonugondla
            </motion.h1>
            <motion.p
              className="loader-role"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.7, duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
            >
              Electrical &amp; Electronics Engineer
            </motion.p>
          </div>

          {/* Progress line */}
          <motion.div className="loader-progress-track">
            <motion.div
              className="loader-progress-fill"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.3, duration: 2.4, ease: [0.4, 0, 0.2, 1] }}
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return <AppContent />;
}

export default App;
