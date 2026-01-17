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

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;

      // Check if hovering over clickable element
      const target = e.target;
      const isClickable = target.closest('a, button, .project-card, .skill-card, .category-btn, .timeline-content, .tech-pill, .section-dot, .hamburger, .mobile-menu-item');
      setIsHovering(!!isClickable);
    };

    const handleMouseDown = () => {
      setIsClicking(true);
    };

    const handleMouseUp = () => {
      setIsClicking(false);
    };

    const animateOutline = () => {
      outlineX += (mouseX - outlineX) * 0.15;
      outlineY += (mouseY - outlineY) * 0.15;

      cursorOutline.style.left = `${outlineX}px`;
      cursorOutline.style.top = `${outlineY}px`;

      animationFrameId = requestAnimationFrame(animateOutline);
    };

    window.addEventListener('mousemove', handleMouseMove);
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
