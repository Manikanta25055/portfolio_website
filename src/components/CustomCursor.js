import React, { useEffect, useRef, useState } from 'react';

const CustomCursor = () => {
  const cursorDotRef = useRef(null);
  const cursorOutlineRef = useRef(null);
  const [isTouchDevice, setIsTouchDevice] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const checkTouchDevice = () => {
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isMobile = window.innerWidth <= 1024;
      setIsTouchDevice(hasTouch || isMobile);
    };

    checkTouchDevice();
    window.addEventListener('resize', checkTouchDevice);

    return () => {
      window.removeEventListener('resize', checkTouchDevice);
    };
  }, []);

  useEffect(() => {
    if (isTouchDevice) return;

    const cursorDot = cursorDotRef.current;
    const cursorOutline = cursorOutlineRef.current;

    let mouseX = 0;
    let mouseY = 0;
    let outlineX = 0;
    let outlineY = 0;
    let animationFrameId;
    let hoverCheckTimeout;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (cursorDot) {
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
      }

      // Throttle hover detection to improve performance
      if (hoverCheckTimeout) return;
      hoverCheckTimeout = setTimeout(() => {
        const target = e.target;
        const isClickable = target.closest('a, button, .project-card, .skill-card, .category-btn, .timeline-content, .tech-pill, .section-dot, .hamburger, .mobile-menu-item, .degree-card, .expand-btn, .course-item, .phase-item');
        setIsHovering(!!isClickable);
        hoverCheckTimeout = null;
      }, 50);
    };

    const handleMouseDown = () => {
      setIsClicking(true);
    };

    const handleMouseUp = () => {
      setIsClicking(false);
    };

    const animateOutline = () => {
      const deltaX = mouseX - outlineX;
      const deltaY = mouseY - outlineY;

      // Only update if there's meaningful movement
      if (Math.abs(deltaX) > 0.1 || Math.abs(deltaY) > 0.1) {
        outlineX += deltaX * 0.15;
        outlineY += deltaY * 0.15;

        if (cursorOutline) {
          cursorOutline.style.left = `${outlineX}px`;
          cursorOutline.style.top = `${outlineY}px`;
        }
      }

      animationFrameId = requestAnimationFrame(animateOutline);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    animateOutline();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      if (hoverCheckTimeout) clearTimeout(hoverCheckTimeout);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isTouchDevice]);

  if (isTouchDevice) return null;

  return (
    <>
      <div
        ref={cursorDotRef}
        className={`cursor-dot ${isHovering ? 'hovering' : ''} ${isClicking ? 'clicking' : ''}`}
      ></div>
      <div
        ref={cursorOutlineRef}
        className={`cursor-outline ${isHovering ? 'hovering' : ''} ${isClicking ? 'clicking' : ''}`}
      ></div>
    </>
  );
};

export default CustomCursor;
