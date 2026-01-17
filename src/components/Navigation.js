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
            href="#home"
            className="nav-logo"
            whileHover={{ scale: 1.05 }}
          >
            <span className="logo-text">GVM</span>
            <span className="logo-subtext">Portfolio</span>
          </motion.a>

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

          <div
            className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </motion.nav>

      {/* Scroll Progress Bar */}
      <motion.div
        className="scroll-progress-bar"
        style={{ scaleX: scrollProgress / 100 }}
        initial={{ scaleX: 0 }}
      />

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
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <motion.div
        className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}
        initial={{ x: '100%' }}
        animate={{ x: isMobileMenuOpen ? 0 : '100%' }}
        transition={{ duration: 0.3 }}
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
      </motion.div>
    </>
  );
};

export default Navigation;
