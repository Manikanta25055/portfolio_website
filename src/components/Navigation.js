import React, { useState, useEffect, useRef, useCallback } from 'react';

const sections = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Work' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' }
];

const Navigation = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [activeIndex, setActiveIndex] = useState(0);
  const prevSectionRef = useRef('home');

  // Sliding pill states
  const [isSliding, setIsSliding] = useState(false);
  const [pillPosition, setPillPosition] = useState(0); // Actual pixel position
  const [pillTargetIndex, setPillTargetIndex] = useState(0);
  const navContainerRef = useRef(null);
  const navItemsRef = useRef([]);
  const dragStartX = useRef(0);
  const dragStartPillPos = useRef(0);

  // Calculate item width
  const getItemWidth = useCallback(() => {
    if (navContainerRef.current) {
      return navContainerRef.current.offsetWidth / sections.length;
    }
    return 80;
  }, []);

  // Update pill position when active section changes (from scroll)
  useEffect(() => {
    if (!isSliding) {
      const itemWidth = getItemWidth();
      setPillPosition(activeIndex * itemWidth);
      setPillTargetIndex(activeIndex);
    }
  }, [activeIndex, isSliding, getItemWidth]);

  // Scroll detection
  useEffect(() => {
    let rafId = null;

    const handleScroll = () => {
      if (isSliding) return;
      if (rafId) return;

      rafId = requestAnimationFrame(() => {
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
        setActiveIndex(newIndex);
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

  // Handle drag start on the pill or nav items
  const handleDragStart = (e) => {
    e.preventDefault();

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    dragStartX.current = clientX;
    dragStartPillPos.current = pillPosition;
    setIsSliding(true);
  };

  // Handle drag move - pill follows finger/mouse freely
  const handleDragMove = useCallback((e) => {
    if (!isSliding || !navContainerRef.current) return;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const deltaX = clientX - dragStartX.current;
    const itemWidth = getItemWidth();
    const maxPosition = (sections.length - 1) * itemWidth;

    // Calculate new position with bounds
    let newPosition = dragStartPillPos.current + deltaX;
    newPosition = Math.max(0, Math.min(maxPosition, newPosition));

    setPillPosition(newPosition);

    // Calculate which index the pill is closest to (for highlighting)
    const closestIndex = Math.round(newPosition / itemWidth);
    setPillTargetIndex(Math.max(0, Math.min(sections.length - 1, closestIndex)));
  }, [isSliding, getItemWidth]);

  // Handle drag end - snap to nearest section
  const handleDragEnd = useCallback(() => {
    if (!isSliding) return;

    const itemWidth = getItemWidth();
    const closestIndex = Math.round(pillPosition / itemWidth);
    const snappedIndex = Math.max(0, Math.min(sections.length - 1, closestIndex));

    // Snap pill to final position
    setPillPosition(snappedIndex * itemWidth);
    setPillTargetIndex(snappedIndex);
    setActiveIndex(snappedIndex);
    setActiveSection(sections[snappedIndex].id);
    setIsSliding(false);

    // Scroll to section
    scrollToSection(snappedIndex);
  }, [isSliding, pillPosition, getItemWidth]);

  // Handle click on nav item
  const handleItemClick = (e, index) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isSliding) {
      const itemWidth = getItemWidth();
      setPillPosition(index * itemWidth);
      setPillTargetIndex(index);
      setActiveIndex(index);
      setActiveSection(sections[index].id);
      scrollToSection(index);
    }
  };

  // Global mouse/touch event handlers
  useEffect(() => {
    if (isSliding) {
      const handleGlobalMove = (e) => handleDragMove(e);
      const handleGlobalEnd = () => handleDragEnd();

      window.addEventListener('mousemove', handleGlobalMove);
      window.addEventListener('mouseup', handleGlobalEnd);
      window.addEventListener('touchmove', handleGlobalMove, { passive: false });
      window.addEventListener('touchend', handleGlobalEnd);

      return () => {
        window.removeEventListener('mousemove', handleGlobalMove);
        window.removeEventListener('mouseup', handleGlobalEnd);
        window.removeEventListener('touchmove', handleGlobalMove);
        window.removeEventListener('touchend', handleGlobalEnd);
      };
    }
  }, [isSliding, handleDragMove, handleDragEnd]);

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

  const itemWidth = getItemWidth();

  return (
    <>
      <nav
        className={`glass-bottom-nav ${isSliding ? 'sliding' : ''}`}
        ref={navContainerRef}
      >
        <div className="glass-nav-container">
          {/* Sliding Pill Indicator */}
          <div
            className={`sliding-pill ${isSliding ? 'enlarged' : ''}`}
            style={{
              transform: `translateX(${pillPosition}px)`,
              width: `${itemWidth}px`,
              transition: isSliding ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), width 0.2s ease'
            }}
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
          >
            <div className="pill-inner"></div>
          </div>

          {/* Nav Items */}
          {sections.map((section, index) => {
            const isActive = pillTargetIndex === index;
            return (
              <div
                key={section.id}
                ref={el => navItemsRef.current[index] = el}
                className={`glass-nav-item ${isActive ? 'active' : ''}`}
                onClick={(e) => handleItemClick(e, index)}
                onMouseDown={handleDragStart}
                onTouchStart={handleDragStart}
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
