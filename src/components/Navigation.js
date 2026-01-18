import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
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

  // Mobile drag states
  const [isDragging, setIsDragging] = useState(false);
  const [dragProgress, setDragProgress] = useState(0);
  const [dragVelocity, setDragVelocity] = useState(0);
  const [previewSection, setPreviewSection] = useState(null);

  const trackRef = useRef(null);
  const lastTouchX = useRef(0);
  const lastTouchTime = useRef(0);
  const velocityDecayRef = useRef(null);

  const isMobile = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth <= 768;
  }, []);

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
  }, [isDragging]);

  // Calculate which section corresponds to a progress value (0-1)
  const getSectionFromProgress = useCallback((progress) => {
    const index = Math.round(progress * (sections.length - 1));
    return Math.max(0, Math.min(sections.length - 1, index));
  }, []);

  // Scroll to a specific progress position
  const scrollToProgress = useCallback((progress) => {
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;

    // Calculate scroll position based on progress
    const targetScroll = progress * documentHeight;
    window.scrollTo({ top: targetScroll, behavior: 'auto' });

    // Update preview section
    const nearestSectionIndex = getSectionFromProgress(progress);
    setPreviewSection(sections[nearestSectionIndex]);
  }, [getSectionFromProgress]);

  // Touch event handlers for mobile drag
  const handleTouchStart = useCallback((e) => {
    if (!isMobile || !trackRef.current) return;

    const touch = e.touches[0];
    const rect = trackRef.current.getBoundingClientRect();
    const touchX = touch.clientX - rect.left;
    const progress = Math.max(0, Math.min(1, touchX / rect.width));

    setIsDragging(true);
    setDragProgress(progress);
    lastTouchX.current = touch.clientX;
    lastTouchTime.current = performance.now();

    // Clear any velocity decay
    if (velocityDecayRef.current) {
      cancelAnimationFrame(velocityDecayRef.current);
    }
  }, [isMobile]);

  const handleTouchMove = useCallback((e) => {
    if (!isDragging || !trackRef.current) return;

    const touch = e.touches[0];
    const rect = trackRef.current.getBoundingClientRect();
    const touchX = touch.clientX - rect.left;
    const progress = Math.max(0, Math.min(1, touchX / rect.width));

    // Calculate velocity
    const now = performance.now();
    const deltaTime = now - lastTouchTime.current;
    const deltaX = touch.clientX - lastTouchX.current;

    if (deltaTime > 0) {
      const velocity = deltaX / deltaTime;
      // Clamp velocity for deformation effect (-1 to 1 range, scaled)
      setDragVelocity(Math.max(-1, Math.min(1, velocity * 0.5)));
    }

    lastTouchX.current = touch.clientX;
    lastTouchTime.current = now;

    setDragProgress(progress);
    scrollToProgress(progress);
  }, [isDragging, scrollToProgress]);

  const handleTouchEnd = useCallback(() => {
    if (!isDragging) return;

    setIsDragging(false);
    setPreviewSection(null);

    // Decay velocity smoothly
    const decayVelocity = () => {
      setDragVelocity(prev => {
        const newVelocity = prev * 0.85;
        if (Math.abs(newVelocity) < 0.01) {
          return 0;
        }
        velocityDecayRef.current = requestAnimationFrame(decayVelocity);
        return newVelocity;
      });
    };
    velocityDecayRef.current = requestAnimationFrame(decayVelocity);
  }, [isDragging]);

  // Cleanup velocity decay on unmount
  useEffect(() => {
    return () => {
      if (velocityDecayRef.current) {
        cancelAnimationFrame(velocityDecayRef.current);
      }
    };
  }, []);

  // Calculate display progress (from drag or scroll)
  const displayProgress = isDragging
    ? dragProgress
    : activeSectionIndex / (sections.length - 1);

  // Calculate deformation scale based on velocity
  const deformScaleX = 1 + Math.abs(dragVelocity) * 0.8;
  const deformScaleY = 1 - Math.abs(dragVelocity) * 0.3;

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

      {/* Circuit Path Progress Indicator - Desktop Only */}
      <div className="circuit-progress-container desktop-only">
        <div className="circuit-track" ref={trackRef}>
          <div className="circuit-trace" />
          <motion.div
            className="circuit-trace-active"
            animate={{ width: `${displayProgress * 100}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
          {sections.map((section, index) => {
            const nodeProgress = index / (sections.length - 1);
            const isPowered = nodeProgress <= displayProgress;
            const isActive = Math.abs(displayProgress - nodeProgress) < 0.1;
            return (
              <div
                key={section.id}
                className={`circuit-node ${isPowered ? 'powered' : ''} ${isActive ? 'active' : ''}`}
                style={{ left: `${nodeProgress * 100}%` }}
              >
                <div className="node-ring" />
                <div className="node-core" />
                {isActive && isPulsing && <div className="node-pulse" />}
              </div>
            );
          })}
          <motion.div
            className={`circuit-current ${isPulsing ? 'pulsing' : ''}`}
            animate={{ left: `${displayProgress * 100}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="current-glow" />
            <div className="current-spark" />
          </motion.div>
        </div>
      </div>

      {/* iOS-style Glass Bottom Navigation - Mobile Only */}
      <nav className="glass-bottom-nav mobile-only">
        <div className="glass-nav-container">
          {sections.filter(s => ['home', 'about', 'experience', 'projects', 'contact'].includes(s.id)).map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className={`glass-nav-item ${activeSection === section.id ? 'active' : ''}`}
            >
              <div className="glass-nav-icon">
                {section.id === 'home' && (
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
                )}
                {section.id === 'about' && (
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/></svg>
                )}
                {section.id === 'experience' && (
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/></svg>
                )}
                {section.id === 'projects' && (
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z"/></svg>
                )}
                {section.id === 'contact' && (
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                )}
              </div>
              <span className="glass-nav-label">{section.label}</span>
            </a>
          ))}
        </div>
      </nav>

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
