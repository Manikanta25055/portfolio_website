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
  const [isDragging, setIsDragging] = useState(false);
  const [pillLeft, setPillLeft] = useState(0);
  const [pillWidth, setPillWidth] = useState(0);

  const navContainerRef = useRef(null);
  const navItemsRef = useRef([]);
  const dragStartX = useRef(0);
  const dragStartLeft = useRef(0);
  const hasMovedRef = useRef(false);
  const prevSectionRef = useRef('home');
  const scrollCooldownRef = useRef(false);
  const animationFrameRef = useRef(null);

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

  // Smoothly animate pill to target position
  const animatePillTo = useCallback((targetLeft, targetWidth, duration = 300) => {
    const startLeft = pillLeft;
    const startWidth = pillWidth;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Smooth easing - ease out cubic for fluid feel
      const eased = 1 - Math.pow(1 - progress, 3);

      const newLeft = startLeft + (targetLeft - startLeft) * eased;
      const newWidth = startWidth + (targetWidth - startWidth) * eased;

      setPillLeft(newLeft);
      setPillWidth(newWidth);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [pillLeft, pillWidth]);

  // Update pill to specific index
  const updatePillToIndex = useCallback((index, animate = true) => {
    const rect = getItemRect(index);
    if (animate) {
      animatePillTo(rect.left, rect.width, 280);
    } else {
      setPillLeft(rect.left);
      setPillWidth(rect.width);
    }
  }, [getItemRect, animatePillTo]);

  // Initialize pill position
  useLayoutEffect(() => {
    const initPill = () => {
      if (!isSliding && !scrollCooldownRef.current) {
        const rect = getItemRect(activeIndex);
        setPillLeft(rect.left);
        setPillWidth(rect.width);
      }
    };

    initPill();
    const timer = setTimeout(initPill, 50);
    window.addEventListener('resize', initPill);

    return () => {
      window.removeEventListener('resize', initPill);
      clearTimeout(timer);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [activeIndex, isSliding, getItemRect]);

  // Scroll detection with cooldown
  useEffect(() => {
    let rafId = null;

    const handleScroll = () => {
      // Skip if sliding or in cooldown period
      if (isSliding || scrollCooldownRef.current) return;
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

  // Find closest item based on pill center
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

  // Handle drag start
  const handleDragStart = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();

    // Cancel any ongoing animation
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    dragStartX.current = clientX;
    dragStartLeft.current = pillLeft;
    hasMovedRef.current = false;

    setIsSliding(true);
    setIsDragging(true);
  }, [pillLeft]);

  // Handle drag move - ultra fluid
  const handleDragMove = useCallback((e) => {
    if (!isSliding || !navContainerRef.current) return;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const deltaX = clientX - dragStartX.current;

    if (Math.abs(deltaX) > 3) {
      hasMovedRef.current = true;
    }

    const containerPadding = 8;
    const containerWidth = navContainerRef.current.offsetWidth;
    const maxLeft = containerWidth - pillWidth - containerPadding;

    let newLeft = dragStartLeft.current + deltaX;
    newLeft = Math.max(containerPadding, Math.min(maxLeft, newLeft));

    // Direct state update for instant response
    setPillLeft(newLeft);
  }, [isSliding, pillWidth]);

  // Handle drag end
  const handleDragEnd = useCallback((e) => {
    if (!isSliding) return;

    e?.preventDefault?.();
    e?.stopPropagation?.();

    const closestIndex = getClosestIndex(pillLeft, pillWidth);
    const targetRect = getItemRect(closestIndex);

    // Set cooldown to prevent scroll from interfering
    scrollCooldownRef.current = true;

    // Animate to final position
    animatePillTo(targetRect.left, targetRect.width, 250);

    setActiveIndex(closestIndex);
    prevSectionRef.current = sections[closestIndex].id;
    setIsSliding(false);
    setIsDragging(false);

    // Scroll only if user actually dragged
    if (hasMovedRef.current) {
      setTimeout(() => {
        scrollToSection(closestIndex);
      }, 50);
    }

    // Clear cooldown after animation completes
    setTimeout(() => {
      scrollCooldownRef.current = false;
    }, 400);
  }, [isSliding, pillLeft, pillWidth, getClosestIndex, getItemRect, animatePillTo]);

  // Handle click
  const handleItemClick = useCallback((e, index) => {
    e.preventDefault();
    e.stopPropagation();

    if (hasMovedRef.current) {
      hasMovedRef.current = false;
      return;
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    scrollCooldownRef.current = true;

    setActiveIndex(index);
    prevSectionRef.current = sections[index].id;
    updatePillToIndex(index, true);
    scrollToSection(index);

    setTimeout(() => {
      scrollCooldownRef.current = false;
    }, 400);
  }, [updatePillToIndex]);

  // Global event listeners
  useEffect(() => {
    if (isSliding) {
      const onMove = (e) => {
        e.preventDefault();
        handleDragMove(e);
      };
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

  // Current hovered index during drag
  const hoveredIndex = isSliding ? getClosestIndex(pillLeft, pillWidth) : activeIndex;

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
