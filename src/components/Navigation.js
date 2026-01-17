import React, { useState, useEffect } from 'react';
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
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Calculate scroll progress
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const maxScroll = Math.max(1, documentHeight - windowHeight);
      const progress = (scrollTop / maxScroll) * 100;
      setScrollProgress(progress);

      // Determine active section
      const sectionElements = sections.map(s => document.getElementById(s.id));

      // Check if we're at the bottom of the page
      const isAtBottom = (scrollTop + windowHeight) >= (documentHeight - 50);

      if (isAtBottom) {
        // At the bottom, always set contact as active
        setActiveSection('contact');
      } else {
        // Find section that's currently in view
        let foundSection = null;

        for (let i = sectionElements.length - 1; i >= 0; i--) {
          const el = sectionElements[i];
          if (el) {
            const rect = el.getBoundingClientRect();
            // Check if section is in the viewport (top is above or at viewport center)
            if (rect.top <= windowHeight / 2) {
              foundSection = sections[i];
              break;
            }
          }
        }

        if (foundSection) {
          setActiveSection(foundSection.id);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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

      {/* Scroll Progress Bar */}
      <div className="scroll-progress-container">
        <motion.div
          className="scroll-progress-bar"
          style={{ scaleX: scrollProgress / 100 }}
          initial={{ scaleX: 0 }}
        />
        <motion.div
          className="scroll-droplet"
          style={{ left: `${scrollProgress}%` }}
          initial={{ left: '0%' }}
        >
          <svg width="16" height="20" viewBox="0 0 16 20" className="droplet-svg">
            <path
              d="M8 0C8 0 0 8 0 13C0 16.866 3.58172 20 8 20C12.4183 20 16 16.866 16 13C16 8 8 0 8 0Z"
              fill="var(--orange)"
              className="droplet-path"
            />
          </svg>
          <div className="droplet-trail"></div>
        </motion.div>
      </div>

      {/* Custom Vertical Scrollbar */}
      <div className="custom-scrollbar-container">
        <div className="custom-scrollbar-track">
          <motion.div
            className="custom-scrollbar-progress"
            style={{ height: `${scrollProgress}%` }}
            initial={{ height: '0%' }}
          />
        </div>
        <motion.div
          className="scrollbar-droplet"
          style={{ top: `${scrollProgress}%` }}
          initial={{ top: '0%' }}
        >
          <svg width="20" height="28" viewBox="0 0 20 28" className="scrollbar-droplet-svg">
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <path
              d="M10 0C10 0 0 10 0 16C0 21.5228 4.47715 26 10 26C15.5228 26 20 21.5228 20 16C20 10 10 0 10 0Z"
              fill="url(#dropletGradient)"
              filter="url(#glow)"
              className="scrollbar-droplet-path"
            />
            <defs>
              <linearGradient id="dropletGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="var(--orange-light)" stopOpacity="1" />
                <stop offset="50%" stopColor="var(--orange)" stopOpacity="1" />
                <stop offset="100%" stopColor="var(--orange-dark)" stopOpacity="0.9" />
              </linearGradient>
            </defs>
          </svg>
          <div className="scrollbar-droplet-trail"></div>
        </motion.div>
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
