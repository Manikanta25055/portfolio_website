import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';

const sections = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Work' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' }
];

const Navigation = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [pillLeft, setPillLeft] = useState(0);
  const [pillWidth, setPillWidth] = useState(0);

  const navContainerRef = useRef(null);
  const navItemsRef = useRef([]);
  const dragStartX = useRef(0);
  const dragStartLeft = useRef(0);
  const dragDistanceRef = useRef(0);
  const prevSectionRef = useRef('home');
  const isScrollingRef = useRef(false);
  const isSnappingRef = useRef(false);

  // Get item rect from DOM
  const getItemRect = (index) => {
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
  };

  // Find closest index based on pill center position
  const getClosestIndex = (left, width) => {
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
  };

  // Scroll to section
  const scrollToSection = (index) => {
    const el = document.getElementById(sections[index].id);
    if (el) {
      isScrollingRef.current = true;
      el.scrollIntoView({ behavior: 'smooth' });
      // Reset after scroll completes
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 800);
    }
  };

  // Animate pill to position
  const animatePill = (targetLeft, targetWidth, callback) => {
    const startLeft = pillLeft;
    const startWidth = pillWidth;
    const duration = 180;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 2);

      setPillLeft(startLeft + (targetLeft - startLeft) * eased);
      setPillWidth(startWidth + (targetWidth - startWidth) * eased);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else if (callback) {
        callback();
      }
    };
    requestAnimationFrame(animate);
  };

  // Initialize pill
  useLayoutEffect(() => {
    const init = () => {
      // Don't reset during drag or snap animation
      if (!isDragging && !isSnappingRef.current) {
        const rect = getItemRect(activeIndex);
        setPillLeft(rect.left);
        setPillWidth(rect.width);
      }
    };
    init();
    setTimeout(init, 50);
    window.addEventListener('resize', init);
    return () => window.removeEventListener('resize', init);
  }, [activeIndex, isDragging]);

  // Scroll listener
  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (isDragging || isScrollingRef.current) return;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging]);

  // Drag handlers
  const onDragStart = (e) => {
    e.preventDefault();
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    dragStartX.current = x;
    dragStartLeft.current = pillLeft;
    dragDistanceRef.current = 0;
    setIsDragging(true);
  };

  const onDragMove = (e) => {
    if (!isDragging || !navContainerRef.current) return;

    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const delta = x - dragStartX.current;
    dragDistanceRef.current = Math.abs(delta);

    const padding = 6;
    const maxLeft = navContainerRef.current.offsetWidth - pillWidth - padding;
    let newLeft = dragStartLeft.current + delta;
    newLeft = Math.max(padding, Math.min(maxLeft, newLeft));

    setPillLeft(newLeft);
  };

  const onDragEnd = () => {
    if (!isDragging) return;

    // Prevent useLayoutEffect from resetting during snap
    isSnappingRef.current = true;
    setIsDragging(false);

    // Find closest and snap
    const closest = getClosestIndex(pillLeft, pillWidth);
    const rect = getItemRect(closest);

    // Update state
    setActiveIndex(closest);
    prevSectionRef.current = sections[closest].id;

    // Animate to snap position
    animatePill(rect.left, rect.width, () => {
      isSnappingRef.current = false;
      // Scroll to section if user actually dragged
      if (dragDistanceRef.current > 5) {
        scrollToSection(closest);
      }
    });
  };

  // Click handler for direct navigation
  const onItemClick = (e, index) => {
    // If user dragged, don't navigate on click
    if (dragDistanceRef.current > 10) {
      dragDistanceRef.current = 0;
      return;
    }

    e.preventDefault();
    isSnappingRef.current = true;
    setActiveIndex(index);
    prevSectionRef.current = sections[index].id;

    const rect = getItemRect(index);
    animatePill(rect.left, rect.width, () => {
      isSnappingRef.current = false;
      scrollToSection(index);
    });
  };

  // Global mouse/touch listeners
  useEffect(() => {
    if (!isDragging) return;

    const move = (e) => {
      e.preventDefault();
      onDragMove(e);
    };
    const end = () => onDragEnd();

    window.addEventListener('mousemove', move, { passive: false });
    window.addEventListener('mouseup', end);
    window.addEventListener('touchmove', move, { passive: false });
    window.addEventListener('touchend', end);
    window.addEventListener('touchcancel', end);

    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', end);
      window.removeEventListener('touchmove', move);
      window.removeEventListener('touchend', end);
      window.removeEventListener('touchcancel', end);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging]);

  const hoverIdx = isDragging ? getClosestIndex(pillLeft, pillWidth) : activeIndex;

  const icons = {
    home: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>,
    about: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/></svg>,
    experience: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/></svg>,
    projects: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z"/></svg>,
    contact: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
  };

  return (
    <nav className={`glass-bottom-nav ${isDragging ? 'sliding' : ''}`}>
      <div className="glass-nav-container" ref={navContainerRef}>
        {/* Sliding Pill - enlarges outside container when dragging */}
        <div
          className={`sliding-pill ${isDragging ? 'dragging' : ''}`}
          style={{
            transform: `translateX(${isDragging ? pillLeft - 10 : pillLeft}px)`,
            width: `${isDragging ? pillWidth + 20 : pillWidth}px`
          }}
          onMouseDown={onDragStart}
          onTouchStart={onDragStart}
        />

        {/* Nav Items */}
        {sections.map((section, idx) => (
          <div
            key={section.id}
            ref={el => navItemsRef.current[idx] = el}
            className={`glass-nav-item ${hoverIdx === idx ? 'active' : ''}`}
            onMouseDown={onDragStart}
            onTouchStart={onDragStart}
            onClick={(e) => onItemClick(e, idx)}
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
