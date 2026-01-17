import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const sections = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'coursework', label: 'Tech' },
  { id: 'contact', label: 'Contact' }
];

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [isPulsing, setIsPulsing] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const prevSectionRef = useRef('home');

  useEffect(() => {
    let rafId = null;
    let lastScrollTime = 0;

    const handleScroll = () => {
      const now = performance.now();

      // Throttle to ~60fps
      if (now - lastScrollTime < 16) return;
      lastScrollTime = now;

      if (rafId) return;

      rafId = requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 50);

        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.scrollY;

        // Determine active section
        const sectionElements = sections.map(s => document.getElementById(s.id));

        // Check if we're at the bottom of the page
        const isAtBottom = (scrollTop + windowHeight) >= (documentHeight - 50);

        let newSection = 'home';
        let newIndex = 0;

        if (isAtBottom) {
          newSection = 'contact';
          newIndex = sections.length - 1;
        } else {
          for (let i = sectionElements.length - 1; i >= 0; i--) {
            const el = sectionElements[i];
            if (el) {
              const rect = el.getBoundingClientRect();
              if (rect.top <= windowHeight / 2) {
                newSection = sections[i].id;
                newIndex = i;
                break;
              }
            }
          }
        }

        // Trigger pulse animation when section changes
        if (newSection !== prevSectionRef.current) {
          prevSectionRef.current = newSection;
          setIsPulsing(true);
          setTimeout(() => setIsPulsing(false), 600);
        }

        setActiveSection(newSection);
        setActiveSectionIndex(newIndex);

        rafId = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      {/* Minimal Top Navigation */}
      <motion.nav
        className={`navigation ${isScrolled ? 'scrolled' : ''}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.6, 0.05, 0.01, 0.9] }}
      >
        <div className="nav-container">
          <motion.a
            href="#contact"
            className="nav-cta-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Get In Touch</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </motion.a>

          <button
            className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMobileMenuOpen}
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </button>
        </div>
      </motion.nav>

      {/* Circuit Path Progress Indicator */}
      <div className="circuit-progress-container">
        <div className="circuit-track">
          {/* Base PCB trace */}
          <div className="circuit-trace" />

          {/* Active trace (fills as you scroll) */}
          <motion.div
            className="circuit-trace-active"
            animate={{ width: `${(activeSectionIndex / (sections.length - 1)) * 100}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />

          {/* Circuit nodes */}
          {sections.map((section, index) => (
            <div
              key={section.id}
              className={`circuit-node ${index <= activeSectionIndex ? 'powered' : ''} ${index === activeSectionIndex ? 'active' : ''}`}
              style={{ left: `${(index / (sections.length - 1)) * 100}%` }}
            >
              <div className="node-ring" />
              <div className="node-core" />
              {index === activeSectionIndex && isPulsing && (
                <div className="node-pulse" />
              )}
            </div>
          ))}

          {/* Current indicator */}
          <motion.div
            className={`circuit-current ${isPulsing ? 'pulsing' : ''}`}
            animate={{ left: `${(activeSectionIndex / (sections.length - 1)) * 100}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="current-glow" />
            <div className="current-spark" />
          </motion.div>
        </div>
      </div>

      {/* Vertical Section Indicators */}
      <motion.div
        className="section-indicators"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        {sections.map((section, index) => (
          <motion.a
            key={section.id}
            href={`#${section.id}`}
            className={`section-dot ${activeSection === section.id ? 'active' : ''}`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            <span className="dot-tooltip">{section.label}</span>
            <span className="dot"></span>
          </motion.a>
        ))}
      </motion.div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="mobile-menu-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            role="presentation"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <motion.nav
        className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}
        initial={{ x: '100%' }}
        animate={{ x: isMobileMenuOpen ? 0 : '100%' }}
        transition={{ duration: 0.3 }}
        aria-label="Mobile navigation"
        role="navigation"
      >
        {sections.map((section) => (
          <motion.a
            key={section.id}
            href={`#${section.id}`}
            className="mobile-menu-item"
            onClick={() => setIsMobileMenuOpen(false)}
            whileHover={{ x: 10 }}
          >
            {section.label}
          </motion.a>
        ))}
      </motion.nav>
    </>
  );
};

export default Navigation;
