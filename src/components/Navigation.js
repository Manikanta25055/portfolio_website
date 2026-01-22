import React, { useState, useEffect, useRef, useLayoutEffect, useCallback } from 'react';

const sections = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Work' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' }
];

const TAP_THRESHOLD = 8; // pixels - below this is a tap, above is a slide

const Navigation = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [, forceUpdate] = useState(0);

  const navContainerRef = useRef(null);
  const navItemsRef = useRef([]);

  // Use refs for all drag state to avoid closure issues
  const isDraggingRef = useRef(false);
  const pillLeftRef = useRef(0);
  const pillWidthRef = useRef(80);
  const dragStartX = useRef(0);
  const dragStartLeft = useRef(0);
  const dragDistanceRef = useRef(0);
  const prevSectionRef = useRef('home');
  const isScrollingRef = useRef(false);
  const animationRef = useRef(null);
  const tappedIndexRef = useRef(null); // Track which item was tapped

  // Get item rect from DOM
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

  // Find closest index based on pill center position
  const getClosestIndex = useCallback((left, width) => {
    const pillCenter = left + width / 2;
    let closest = 0;
    let minDist = Infinity;

    for (let i = 0; i < sections.length; i++) {
      const rect = getItemRect(i);
      const dist = Math.abs(rect.center - pillCenter);
      if (dist < minDist) {
        minDist = dist;
        closest = i;
      }
    }
    return closest;
  }, [getItemRect]);

  // Scroll to section
  const scrollToSection = useCallback((index) => {
    const el = document.getElementById(sections[index].id);
    if (el) {
      isScrollingRef.current = true;
      el.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 800);
    }
  }, []);

  // Update pill position (with refs, triggers re-render)
  const updatePill = useCallback((left, width) => {
    pillLeftRef.current = left;
    pillWidthRef.current = width;
    forceUpdate(n => n + 1);
  }, []);

  // Animate pill to position
  const animatePill = useCallback((targetLeft, targetWidth, callback) => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    const startLeft = pillLeftRef.current;
    const startWidth = pillWidthRef.current;
    const duration = 180;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 2);

      const newLeft = startLeft + (targetLeft - startLeft) * eased;
      const newWidth = startWidth + (targetWidth - startWidth) * eased;
      updatePill(newLeft, newWidth);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        animationRef.current = null;
        if (callback) callback();
      }
    };
    animationRef.current = requestAnimationFrame(animate);
  }, [updatePill]);

  // Navigate to specific section
  const navigateToSection = useCallback((index) => {
    setActiveIndex(index);
    prevSectionRef.current = sections[index].id;

    const rect = getItemRect(index);
    animatePill(rect.left, rect.width, () => {
      scrollToSection(index);
    });
  }, [getItemRect, animatePill, scrollToSection]);

  // Initialize pill position
  useLayoutEffect(() => {
    const init = () => {
      if (!isDraggingRef.current) {
        const rect = getItemRect(activeIndex);
        pillLeftRef.current = rect.left;
        pillWidthRef.current = rect.width;
        forceUpdate(n => n + 1);
      }
    };
    init();
    setTimeout(init, 50);
    window.addEventListener('resize', init);
    return () => window.removeEventListener('resize', init);
  }, [activeIndex, getItemRect]);

  // Scroll listener - updates nav based on scroll position
  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (isDraggingRef.current || isScrollingRef.current) return;
      if (ticking) return;

      ticking = true;
      requestAnimationFrame(() => {
        const windowH = window.innerHeight;
        const docH = document.documentElement.scrollHeight;
        const scrollY = window.scrollY;
        const atBottom = scrollY + windowH >= docH - 50;

        let newIdx = 0;
        let newSec = 'home';

        if (atBottom) {
          newIdx = sections.length - 1;
          newSec = 'contact';
        } else {
          for (let i = sections.length - 1; i >= 0; i--) {
            const el = document.getElementById(sections[i].id);
            if (el && el.getBoundingClientRect().top <= windowH / 2) {
              newIdx = i;
              newSec = sections[i].id;
              break;
            }
          }
        }

        if (newSec !== prevSectionRef.current) {
          prevSectionRef.current = newSec;
          setActiveIndex(newIdx);
          const rect = getItemRect(newIdx);
          animatePill(rect.left, rect.width);
        }
        ticking = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [getItemRect, animatePill]);

  // Drag start handler - stores tapped index for tap detection
  const handleDragStart = useCallback((e, itemIndex = null) => {
    e.preventDefault();
    e.stopPropagation();

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;

    isDraggingRef.current = true;
    dragStartX.current = clientX;
    dragStartLeft.current = pillLeftRef.current;
    dragDistanceRef.current = 0;
    tappedIndexRef.current = itemIndex; // Store which item was tapped

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    forceUpdate(n => n + 1);
  }, []);

  // Drag move handler
  const handleDragMove = useCallback((e) => {
    if (!isDraggingRef.current || !navContainerRef.current) return;

    e.preventDefault();

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const delta = clientX - dragStartX.current;
    dragDistanceRef.current = Math.abs(delta);

    // Only move pill if actually sliding (past threshold)
    if (dragDistanceRef.current > TAP_THRESHOLD) {
      const padding = 6;
      const containerWidth = navContainerRef.current.offsetWidth;
      const maxLeft = containerWidth - pillWidthRef.current - padding;

      let newLeft = dragStartLeft.current + delta;
      newLeft = Math.max(padding, Math.min(maxLeft, newLeft));

      pillLeftRef.current = newLeft;
      forceUpdate(n => n + 1);
    }
  }, []);

  // Drag end handler - handles both tap and slide
  const handleDragEnd = useCallback(() => {
    if (!isDraggingRef.current) return;

    isDraggingRef.current = false;
    const wasTap = dragDistanceRef.current <= TAP_THRESHOLD;
    const tappedIndex = tappedIndexRef.current;

    if (wasTap && tappedIndex !== null) {
      // It was a tap on a specific nav item - navigate directly
      navigateToSection(tappedIndex);
    } else {
      // It was a slide - snap to closest section
      const closest = getClosestIndex(pillLeftRef.current, pillWidthRef.current);
      const rect = getItemRect(closest);

      setActiveIndex(closest);
      prevSectionRef.current = sections[closest].id;

      animatePill(rect.left, rect.width, () => {
        scrollToSection(closest);
      });
    }

    tappedIndexRef.current = null;
    forceUpdate(n => n + 1);
  }, [getClosestIndex, getItemRect, animatePill, scrollToSection, navigateToSection]);

  // Click handler for mouse clicks (desktop)
  const handleItemClick = useCallback((e, index) => {
    // Only handle if not from a drag
    if (dragDistanceRef.current > TAP_THRESHOLD) {
      dragDistanceRef.current = 0;
      return;
    }

    e.preventDefault();
    e.stopPropagation();
    navigateToSection(index);
  }, [navigateToSection]);

  // Global event listeners for drag
  useEffect(() => {
    const onMove = (e) => {
      if (isDraggingRef.current) {
        handleDragMove(e);
      }
    };

    const onEnd = () => {
      if (isDraggingRef.current) {
        handleDragEnd();
      }
    };

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
  }, [handleDragMove, handleDragEnd]);

  const isDragging = isDraggingRef.current;
  const pillLeft = pillLeftRef.current;
  const pillWidth = pillWidthRef.current;
  // Only show as dragging if actually moved past threshold
  const isSliding = isDragging && dragDistanceRef.current > TAP_THRESHOLD;
  const hoverIdx = isSliding ? getClosestIndex(pillLeft, pillWidth) : activeIndex;

  const icons = {
    home: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>,
    about: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/></svg>,
    experience: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/></svg>,
    projects: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z"/></svg>,
    contact: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
  };

  return (
    <nav className={`glass-bottom-nav ${isSliding ? 'sliding' : ''}`}>
      <div className="glass-nav-container" ref={navContainerRef}>
        {/* Sliding Pill */}
        <div
          className={`sliding-pill ${isSliding ? 'dragging' : ''}`}
          style={{
            transform: `translateX(${isSliding ? pillLeft - 20 : pillLeft}px)`,
            width: `${isSliding ? pillWidth + 40 : pillWidth}px`
          }}
          onMouseDown={(e) => handleDragStart(e, null)}
          onTouchStart={(e) => handleDragStart(e, null)}
        />

        {/* Nav Items */}
        {sections.map((section, idx) => (
          <div
            key={section.id}
            ref={el => navItemsRef.current[idx] = el}
            className={`glass-nav-item ${hoverIdx === idx ? 'active' : ''}`}
            onMouseDown={(e) => handleDragStart(e, idx)}
            onTouchStart={(e) => handleDragStart(e, idx)}
            onClick={(e) => handleItemClick(e, idx)}
          >
            <div className="glass-nav-icon">{icons[section.id]}</div>
            <span className="glass-nav-label">{section.label}</span>
          </div>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
