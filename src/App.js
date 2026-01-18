import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';
import CustomCursor from './components/CustomCursor';
import DotGrid from './components/DotGrid';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import DualDegree from './components/DualDegree';
import WorkTimeline from './components/WorkTimeline';
import Projects from './components/Projects';
import Coursework from './components/Coursework';
import Contact from './components/Contact';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadPhase, setLoadPhase] = useState(0);
  const [typedText, setTypedText] = useState('');

  const codeLines = [
    '> initializing_portfolio.exe',
    '> loading neural_networks...',
    '> compiling dreams...',
    '> deploying ambition...',
    '> ready.'
  ];

  useEffect(() => {
    const phases = [0, 600, 1200, 1800, 2200];
    phases.forEach((delay, index) => {
      setTimeout(() => setLoadPhase(index), delay);
    });
    setTimeout(() => setIsLoading(false), 2800);
  }, []);

  useEffect(() => {
    if (loadPhase < codeLines.length) {
      const line = codeLines[loadPhase];
      let charIndex = 0;
      setTypedText('');

      const typeInterval = setInterval(() => {
        if (charIndex <= line.length) {
          setTypedText(line.substring(0, charIndex));
          charIndex++;
        } else {
          clearInterval(typeInterval);
        }
      }, 30);

      return () => clearInterval(typeInterval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadPhase]);

  if (isLoading) {
    return (
      <div className="loader">
        <div className="loader-content">
          {/* Orbital rings */}
          <div className="loader-orbit-container">
            <motion.div
              className="loader-orbit loader-orbit-1"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="loader-orbit loader-orbit-2"
              animate={{ rotate: -360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="loader-orbit loader-orbit-3"
              animate={{ rotate: 360 }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            />

            {/* Center core */}
            <motion.div
              className="loader-core"
              animate={{
                scale: [1, 1.2, 1],
                boxShadow: [
                  "0 0 20px rgba(255, 107, 53, 0.5)",
                  "0 0 40px rgba(255, 107, 53, 0.8)",
                  "0 0 20px rgba(255, 107, 53, 0.5)"
                ]
              }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          {/* Terminal text */}
          <div className="loader-terminal">
            <AnimatePresence mode="wait">
              <motion.div
                key={loadPhase}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="loader-text"
              >
                {typedText}
                <span className="loader-cursor">_</span>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Progress dots */}
          <div className="loader-dots">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className={`loader-dot ${i <= loadPhase ? 'active' : ''}`}
                initial={{ scale: 0 }}
                animate={{ scale: i <= loadPhase ? 1 : 0.5 }}
                transition={{ delay: i * 0.1, duration: 0.3 }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <CustomCursor />
      <DotGrid />
      <Navigation />
      <Hero />
      <DualDegree />
      <WorkTimeline />
      <Projects />
      <Coursework />
      <Contact />
    </div>
  );
}

export default App;
