import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const sections = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Work' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' }
];

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const prevSectionRef = useRef('home');

  // Slideable nav states
  const [isSliding, setIsSliding] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const navContainerRef = useRef(null);
  const touchStartX = useRef(0);
  const touchStartIndex = useRef(0);

  useEffect(() => {
    let rafId = null;

    const handleScroll = () => {
      if (isSliding) return;

      if (rafId) return;

      rafId = requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 50);

        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.scrollY;
        const sectionElements = sections.map(s => document.getElementById(s.id));
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

        if (newSection !== prevSectionRef.current) {
          prevSectionRef.current = newSection;
        }

        setActiveSection(newSection);
        if (!isSliding) setSlideIndex(newIndex);

        rafId = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isSliding]);

  const scrollToSection = (index) => {
    const section = sections[index];
    const el = document.getElementById(section.id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Touch/Mouse handlers for slideable nav
  const handlePointerDown = (e, index) => {
    e.preventDefault();
    e.stopPropagation();

    setIsSliding(true);
    setSlideIndex(index);

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    touchStartX.current = clientX;
    touchStartIndex.current = index;
  };

  const handlePointerMove = (e) => {
    if (!isSliding || !navContainerRef.current) return;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const deltaX = clientX - touchStartX.current;
    const itemWidth = navContainerRef.current.offsetWidth / sections.length;
    // Positive deltaX = moving right = next items, negative = moving left = previous items
    const indexDelta = Math.round(deltaX / (itemWidth * 0.8));
    const newIndex = Math.max(0, Math.min(sections.length - 1, touchStartIndex.current + indexDelta));

    if (newIndex !== slideIndex) {
      setSlideIndex(newIndex);
    }
  };

  const handlePointerUp = (e) => {
    if (isSliding) {
      e.preventDefault();
      e.stopPropagation();
      scrollToSection(slideIndex);
      setIsSliding(false);
    }
  };

  const handleItemClick = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isSliding) {
      scrollToSection(index);
    }
  };

  const getIcon = (id) => {
    const icons = {
      home: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>,
      about: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/></svg>,
      experience: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/></svg>,
      projects: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z"/></svg>,
      contact: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
    };
    return icons[id];
  };

  return (
    <>
      {/* Top Navigation - Desktop only */}
      <motion.nav
        className={`navigation desktop-only ${isScrolled ? 'scrolled' : ''}`}
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
        </div>
      </motion.nav>

      {/* iOS-style Glass Bottom Navigation - Both Mobile & Desktop */}
      <nav
        className={`glass-bottom-nav ${isSliding ? 'sliding' : ''}`}
        ref={navContainerRef}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
      >
        <div className="glass-nav-container">
          {sections.map((section, index) => {
            const isActive = isSliding ? slideIndex === index : activeSection === section.id;
            return (
              <div
                key={section.id}
                className={`glass-nav-item ${isActive ? 'active' : ''} ${isSliding && isActive ? 'enlarged' : ''}`}
                onTouchStart={(e) => handlePointerDown(e, index)}
                onMouseDown={(e) => handlePointerDown(e, index)}
                onClick={(e) => handleItemClick(e, index)}
              >
                <div className="glass-nav-icon">
                  {getIcon(section.id)}
                </div>
                <span className="glass-nav-label">{section.label}</span>
              </div>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default Navigation;
