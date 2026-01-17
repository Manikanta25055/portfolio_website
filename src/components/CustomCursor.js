import React, { useEffect, useRef, useState } from 'react';

const CustomCursor = () => {
  const cursorDotRef = useRef(null);
  const cursorOutlineRef = useRef(null);
  const [isTouchDevice, setIsTouchDevice] = useState(true);

  useEffect(() => {
    const checkTouchDevice = () => {
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsTouchDevice(hasTouch);
    };

    checkTouchDevice();
    // No need for resize listener since touch capability doesn't change
  }, []);

  useEffect(() => {
    if (isTouchDevice) return;

    const cursorDot = cursorDotRef.current;
    const cursorOutline = cursorOutlineRef.current;

    let mouseX = 0;
    let mouseY = 0;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let velocityX = 0;
    let velocityY = 0;
    let outlineX = 0;
    let outlineY = 0;
    let animationFrameId;
    let lastHoverCheck = 0;
    let isHovering = false;
    let lastMoveTime = 0;

    const handleMouseMove = (e) => {
      const now = performance.now();
      const deltaTime = Math.max(1, now - lastMoveTime);
      lastMoveTime = now;

      prevMouseX = mouseX;
      prevMouseY = mouseY;
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Calculate velocity for predictive movement
      velocityX = (mouseX - prevMouseX) / deltaTime;
      velocityY = (mouseY - prevMouseY) / deltaTime;

      if (cursorDot) {
        cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }

      // Throttle hover detection to every 150ms
      if (now - lastHoverCheck > 150) {
        lastHoverCheck = now;
        const target = e.target;
        const isClickable = !!target.closest('a, button, .project-card, .skill-card, .category-btn, .timeline-content, .tech-pill, .section-dot, .hamburger, .mobile-menu-item, .degree-card, .expand-btn, .course-item, .phase-item');

        // Only update DOM if hover state changed
        if (isClickable !== isHovering) {
          isHovering = isClickable;
          if (isClickable) {
            if (cursorDot) cursorDot.classList.add('hovering');
            if (cursorOutline) cursorOutline.classList.add('hovering');
          } else {
            if (cursorDot) cursorDot.classList.remove('hovering');
            if (cursorOutline) cursorOutline.classList.remove('hovering');
          }
        }
      }
    };

    const handleMouseDown = () => {
      if (cursorDot) cursorDot.classList.add('clicking');
      if (cursorOutline) cursorOutline.classList.add('clicking');
    };

    const handleMouseUp = () => {
      if (cursorDot) cursorDot.classList.remove('clicking');
      if (cursorOutline) cursorOutline.classList.remove('clicking');
    };

    const animateOutline = () => {
      const deltaX = mouseX - outlineX;
      const deltaY = mouseY - outlineY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      // Adaptive damping: faster when farther, slower when closer
      // Velocity-based prediction: add slight prediction for smoother tracking
      const speed = Math.abs(velocityX) + Math.abs(velocityY);
      const baseDamping = 0.08;
      const adaptiveDamping = Math.min(0.2, baseDamping + (distance / 2000));
      const prediction = Math.min(2, speed * 1);

      outlineX += deltaX * adaptiveDamping + velocityX * prediction;
      outlineY += deltaY * adaptiveDamping + velocityY * prediction;

      if (cursorOutline) {
        cursorOutline.style.transform = `translate3d(${outlineX}px, ${outlineY}px, 0)`;
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
      cancelAnimationFrame(animationFrameId);
    };
  }, [isTouchDevice]);

  if (isTouchDevice) return null;

  return (
    <>
      <div
        ref={cursorDotRef}
        className="cursor-dot"
      ></div>
      <div
        ref={cursorOutlineRef}
        className="cursor-outline"
      ></div>
    </>
  );
};

export default CustomCursor;
