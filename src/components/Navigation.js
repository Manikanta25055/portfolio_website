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
    const sectionElements = sections.map(s => document.getElementById(s.id));
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

      {/* Circuit Path Progress Indicator */}
      <div
        className={`circuit-progress-container ${isDragging ? 'dragging' : ''}`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="circuit-track" ref={trackRef}>
          {/* Base PCB trace */}
          <div className="circuit-trace" />

          {/* Active trace (fills as you scroll) */}
          <motion.div
            className="circuit-trace-active"
            animate={{ width: `${displayProgress * 100}%` }}
            transition={isDragging ? { duration: 0 } : { duration: 0.4, ease: "easeOut" }}
          />

          {/* Circuit nodes */}
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
                {isActive && isPulsing && !isDragging && (
                  <div className="node-pulse" />
                )}
              </div>
            );
          })}

          {/* Current indicator with deformation */}
          <motion.div
            className={`circuit-current ${isPulsing ? 'pulsing' : ''} ${isDragging ? 'dragging' : ''}`}
            animate={{ left: `${displayProgress * 100}%` }}
            transition={isDragging ? { duration: 0 } : { duration: 0.3, ease: "easeOut" }}
            style={{
              transform: `translateX(-50%) scaleX(${deformScaleX}) scaleY(${deformScaleY})`,
            }}
          >
            <div className="current-glow" />
            <div className="current-spark" />
          </motion.div>

          {/* Section preview tooltip (mobile only) */}
          {isMobile && previewSection && isDragging && (
            <motion.div
              className="section-preview"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              style={{ left: `${displayProgress * 100}%` }}
            >
              {previewSection.label}
            </motion.div>
          )}
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
