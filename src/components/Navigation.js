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
  const [isDragging, setIsDragging] = useState(false);
  const [pillLeft, setPillLeft] = useState(0);
  const [pillWidth, setPillWidth] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const navContainerRef = useRef(null);
  const navItemsRef = useRef([]);
  const dragStartX = useRef(0);
  const dragStartLeft = useRef(0);
  const dragDistance = useRef(0);
  const prevSectionRef = useRef('home');
  const scrollCooldownRef = useRef(false);
  const animationRef = useRef(null);

  // Get item position from DOM
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

  // Find closest item to current pill position
  const getClosestIndex = useCallback((currentLeft, currentWidth) => {
    const pillCenter = currentLeft + currentWidth / 2;
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

  // Animate pill to target position with easing
  const animateTo = useCallback((targetLeft, targetWidth, onComplete) => {
    const startLeft = pillLeft;
    const startWidth = pillWidth;
    const duration = 200; // Fast snap
    const startTime = performance.now();

    setIsAnimating(true);

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out quad for smooth deceleration
      const eased = 1 - (1 - progress) * (1 - progress);

      setPillLeft(startLeft + (targetLeft - startLeft) * eased);
      setPillWidth(startWidth + (targetWidth - startWidth) * eased);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(tick);
      } else {
        setIsAnimating(false);
        if (onComplete) onComplete();
      }
    };

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    animationRef.current = requestAnimationFrame(tick);
  }, [pillLeft, pillWidth]);

  // Snap pill to specific index
  const snapToIndex = useCallback((index, shouldScroll = false) => {
    const rect = getItemRect(index);

    scrollCooldownRef.current = true;

    animateTo(rect.left, rect.width, () => {
      setActiveIndex(index);
      prevSectionRef.current = sections[index].id;

      if (shouldScroll) {
        const el = document.getElementById(sections[index].id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }

      // Clear cooldown after scroll starts
      setTimeout(() => {
        scrollCooldownRef.current = false;
      }, 300);
    });
  }, [getItemRect, animateTo]);

  // Initialize pill position
  useLayoutEffect(() => {
    const initPill = () => {
      if (!isDragging && !isAnimating) {
        const rect = getItemRect(activeIndex);
        setPillLeft(rect.left);
        setPillWidth(rect.width);
      }
    };

    initPill();
    const timer = setTimeout(initPill, 100);
    window.addEventListener('resize', initPill);

    return () => {
      window.removeEventListener('resize', initPill);
      clearTimeout(timer);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [activeIndex, isDragging, isAnimating, getItemRect]);

  // Scroll detection
  useEffect(() => {
    let rafId = null;

    const handleScroll = () => {
      if (isDragging || scrollCooldownRef.current || isAnimating) return;
      if (rafId) return;

      rafId = requestAnimationFrame(() => {
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
          const rect = getItemRect(newIndex);
          animateTo(rect.left, rect.width);
        }

        rafId = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isDragging, isAnimating, getItemRect, animateTo]);

  // DRAG START
  const handleDragStart = useCallback((e) => {
    if (isAnimating) {
      cancelAnimationFrame(animationRef.current);
      setIsAnimating(false);
    }

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    dragStartX.current = clientX;
    dragStartLeft.current = pillLeft;
    dragDistance.current = 0;

    setIsDragging(true);
  }, [pillLeft, isAnimating]);

  // DRAG MOVE
  const handleDragMove = useCallback((e) => {
    if (!isDragging || !navContainerRef.current) return;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const deltaX = clientX - dragStartX.current;
    dragDistance.current = Math.abs(deltaX);

    const padding = 6;
    const containerWidth = navContainerRef.current.offsetWidth;
    const maxLeft = containerWidth - pillWidth - padding;

    let newLeft = dragStartLeft.current + deltaX;
    newLeft = Math.max(padding, Math.min(maxLeft, newLeft));

    setPillLeft(newLeft);
  }, [isDragging, pillWidth]);

  // DRAG END - Always snap to nearest
  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;

    setIsDragging(false);

    // Always snap to nearest section
    const closestIndex = getClosestIndex(pillLeft, pillWidth);

    // Only scroll if user actually dragged (not just tapped)
    const shouldScroll = dragDistance.current > 10;

    snapToIndex(closestIndex, shouldScroll);
  }, [isDragging, pillLeft, pillWidth, getClosestIndex, snapToIndex]);

  // CLICK - Direct navigation (works when not dragging)
  const handleClick = useCallback((e, index) => {
    // If user dragged more than 10px, ignore the click (it was a drag)
    if (dragDistance.current > 10) {
      dragDistance.current = 0;
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    // Cancel any animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    snapToIndex(index, true);
  }, [snapToIndex]);

  // Global event listeners for drag
  useEffect(() => {
    if (isDragging) {
      const onMove = (e) => {
        e.preventDefault();
        handleDragMove(e);
      };
      const onEnd = () => handleDragEnd();

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
  }, [isDragging, handleDragMove, handleDragEnd]);

  // Determine which item is currently highlighted
  const hoveredIndex = isDragging ? getClosestIndex(pillLeft, pillWidth) : activeIndex;

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
    <nav className={`glass-bottom-nav ${isDragging ? 'sliding' : ''}`}>
      <div className="glass-nav-container" ref={navContainerRef}>
        {/* Sliding Pill */}
        <div
          className={`sliding-pill ${isDragging ? 'dragging' : ''}`}
          style={{
            transform: `translateX(${pillLeft}px)`,
            width: `${pillWidth}px`
          }}
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
        />

        {/* Nav Items */}
        {sections.map((section, index) => {
          const isActive = hoveredIndex === index;
          return (
            <div
              key={section.id}
              ref={el => navItemsRef.current[index] = el}
              className={`glass-nav-item ${isActive ? 'active' : ''}`}
              onMouseDown={handleDragStart}
              onTouchStart={handleDragStart}
              onClick={(e) => handleClick(e, index)}
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
