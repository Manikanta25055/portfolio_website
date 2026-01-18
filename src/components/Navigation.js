import React, { useState, useEffect, useRef, useCallback, useLayoutEffect } from 'react';

const sections = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Work' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' }
];

const Navigation = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0 });

  const navContainerRef = useRef(null);
  const navItemsRef = useRef([]);
  const dragStartX = useRef(0);
  const dragStartLeft = useRef(0);
  const currentDragIndex = useRef(0);
  const hasMovedRef = useRef(false);
  const prevSectionRef = useRef('home');

  // Get actual item positions from DOM
  const getItemRect = useCallback((index) => {
    const item = navItemsRef.current[index];
    const container = navContainerRef.current;
    if (item && container) {
      const containerRect = container.getBoundingClientRect();
      const itemRect = item.getBoundingClientRect();
      return {
        left: itemRect.left - containerRect.left,
        width: itemRect.width,
        center: itemRect.left - containerRect.left + itemRect.width / 2
      };
    }
    return { left: 0, width: 80, center: 40 };
  }, []);

  // Update pill position to match active item
  const updatePillToIndex = useCallback((index, animate = true) => {
    const rect = getItemRect(index);
    setPillStyle({
      left: rect.left,
      width: rect.width,
      animate
    });
  }, [getItemRect]);

  // Initialize and update pill position on mount/resize
  useLayoutEffect(() => {
    const updatePill = () => {
      if (!isSliding) {
        updatePillToIndex(activeIndex, false);
      }
    };

    updatePill();
    window.addEventListener('resize', updatePill);

    // Small delay to ensure DOM is ready
    const timer = setTimeout(updatePill, 100);

    return () => {
      window.removeEventListener('resize', updatePill);
      clearTimeout(timer);
    };
  }, [activeIndex, isSliding, updatePillToIndex]);

  // Scroll detection
  useEffect(() => {
    let rafId = null;
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      if (isSliding) return;
      if (rafId) return;

      rafId = requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        // Only update if scroll changed significantly
        if (Math.abs(currentScrollY - lastScrollY) < 5) {
          rafId = null;
          return;
        }
        lastScrollY = currentScrollY;

        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.scrollY;
        const isAtBottom = (scrollTop + windowHeight) >= (documentHeight - 50);

        let newIndex = 0;
        let newSection = 'home';

        if (isAtBottom) {
          newIndex = sections.length - 1;
          newSection = 'contact';
        } else {
          for (let i = sections.length - 1; i >= 0; i--) {
            const el = document.getElementById(sections[i].id);
            if (el) {
              const rect = el.getBoundingClientRect();
              if (rect.top <= windowHeight / 2) {
                newIndex = i;
                newSection = sections[i].id;
                break;
              }
            }
          }
        }

        if (newSection !== prevSectionRef.current) {
          prevSectionRef.current = newSection;
          setActiveIndex(newIndex);
          updatePillToIndex(newIndex, true);
        }

        rafId = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isSliding, updatePillToIndex]);

  const scrollToSection = (index) => {
    const section = sections[index];
    const el = document.getElementById(section.id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Find which item the pill center is closest to
  const getClosestIndex = useCallback((pillLeft, pillWidth) => {
    const pillCenter = pillLeft + pillWidth / 2;
    let closestIndex = 0;
    let closestDistance = Infinity;

    for (let i = 0; i < sections.length; i++) {
      const rect = getItemRect(i);
      const distance = Math.abs(rect.center - pillCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = i;
      }
    }

    return closestIndex;
  }, [getItemRect]);

  // Handle drag start
  const handleDragStart = useCallback((e, index) => {
    e.preventDefault();
    e.stopPropagation();

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    dragStartX.current = clientX;
    dragStartLeft.current = pillStyle.left;
    currentDragIndex.current = index;
    hasMovedRef.current = false;

    setIsSliding(true);
  }, [pillStyle.left]);

  // Handle drag move
  const handleDragMove = useCallback((e) => {
    if (!isSliding || !navContainerRef.current) return;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const deltaX = clientX - dragStartX.current;

    // Mark as moved if dragged more than 5px
    if (Math.abs(deltaX) > 5) {
      hasMovedRef.current = true;
    }

    const containerRect = navContainerRef.current.getBoundingClientRect();
    const containerPadding = 8; // Matches CSS padding
    const maxLeft = containerRect.width - pillStyle.width - containerPadding;

    // Calculate new position with bounds
    let newLeft = dragStartLeft.current + deltaX;
    newLeft = Math.max(containerPadding, Math.min(maxLeft, newLeft));

    // Update pill position directly during drag
    setPillStyle(prev => ({
      ...prev,
      left: newLeft,
      animate: false
    }));
  }, [isSliding, pillStyle.width]);

  // Handle drag end
  const handleDragEnd = useCallback((e) => {
    if (!isSliding) return;

    e?.preventDefault?.();
    e?.stopPropagation?.();

    // Find closest item and snap to it
    const closestIndex = getClosestIndex(pillStyle.left, pillStyle.width);

    setActiveIndex(closestIndex);
    updatePillToIndex(closestIndex, true);
    setIsSliding(false);

    // Only scroll if user actually dragged
    if (hasMovedRef.current) {
      scrollToSection(closestIndex);
    }
  }, [isSliding, pillStyle.left, pillStyle.width, getClosestIndex, updatePillToIndex]);

  // Handle click (tap without drag)
  const handleItemClick = useCallback((e, index) => {
    e.preventDefault();
    e.stopPropagation();

    // If we were sliding and moved, ignore the click
    if (hasMovedRef.current) {
      hasMovedRef.current = false;
      return;
    }

    setActiveIndex(index);
    updatePillToIndex(index, true);
    scrollToSection(index);
  }, [updatePillToIndex]);

  // Global event listeners for drag
  useEffect(() => {
    if (isSliding) {
      const onMove = (e) => handleDragMove(e);
      const onEnd = (e) => handleDragEnd(e);

      window.addEventListener('mousemove', onMove, { passive: false });
      window.addEventListener('mouseup', onEnd);
      window.addEventListener('touchmove', onMove, { passive: false });
      window.addEventListener('touchend', onEnd);
      window.addEventListener('touchcancel', onEnd);

      return () => {
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onEnd);
        window.removeEventListener('touchmove', onMove);
        window.removeEventListener('touchend', onEnd);
        window.removeEventListener('touchcancel', onEnd);
      };
    }
  }, [isSliding, handleDragMove, handleDragEnd]);

  // Determine which item the pill is currently over
  const getHoveredIndex = useCallback(() => {
    if (!isSliding) return activeIndex;
    return getClosestIndex(pillStyle.left, pillStyle.width);
  }, [isSliding, activeIndex, pillStyle.left, pillStyle.width, getClosestIndex]);

  const hoveredIndex = getHoveredIndex();

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
    <nav className={`glass-bottom-nav ${isSliding ? 'sliding' : ''}`}>
      <div className="glass-nav-container" ref={navContainerRef}>
        {/* Sliding Pill */}
        <div
          className={`sliding-pill ${isSliding ? 'dragging' : ''}`}
          style={{
            transform: `translateX(${pillStyle.left}px)`,
            width: `${pillStyle.width}px`,
            transition: pillStyle.animate && !isSliding
              ? 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), width 0.3s ease'
              : 'none'
          }}
          onMouseDown={(e) => handleDragStart(e, activeIndex)}
          onTouchStart={(e) => handleDragStart(e, activeIndex)}
        />

        {/* Nav Items */}
        {sections.map((section, index) => {
          const isActive = hoveredIndex === index;
          return (
            <div
              key={section.id}
              ref={el => navItemsRef.current[index] = el}
              className={`glass-nav-item ${isActive ? 'active' : ''}`}
              onMouseDown={(e) => handleDragStart(e, index)}
              onTouchStart={(e) => handleDragStart(e, index)}
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
  );
};

export default Navigation;
