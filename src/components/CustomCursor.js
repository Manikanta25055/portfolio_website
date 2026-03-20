import React, { useEffect, useRef, useState } from 'react';

const CLICKABLE = 'a, button, .minimap-dot, .minimap-legend-item, .cta-primary, .achievement-badge, [role="button"]';
const TEXT_TARGETS = 'input, textarea, [contenteditable]';

const CustomCursor = ({ isPanning }) => {
  const reticleRef = useRef(null);
  const [isTouchDevice, setIsTouchDevice] = useState(true);

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  useEffect(() => {
    if (isTouchDevice) return;

    let mX = 0, mY = 0;
    let lastCheck = 0;
    let state = 'default';
    let mouseDown = false;

    const reticle = reticleRef.current;

    const setState = (s) => {
      if (state === s) return;
      state = s;
      reticle.className = `cursor-reticle cursor-${s}`;
    };

    const onMove = (e) => {
      mX = e.clientX; mY = e.clientY;
      reticle.style.transform = `translate3d(${mX}px, ${mY}px, 0)`;

      const now = performance.now();
      if (now - lastCheck > 80) {
        lastCheck = now;
        const el = e.target;
        if (mouseDown) {
          setState('click');
        } else if (el.closest(TEXT_TARGETS)) {
          setState('text');
        } else if (el.closest(CLICKABLE)) {
          setState('hover');
        } else {
          setState('default');
        }
      }
    };

    const onDown = () => { mouseDown = true; setState('click'); };
    const onUp = () => { mouseDown = false; setState('default'); };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
    };
  }, [isTouchDevice]);

  // React to isPanning prop changes
  useEffect(() => {
    if (isTouchDevice) return;
    const reticle = reticleRef.current;
    if (!reticle) return;
    if (isPanning) {
      reticle.className = 'cursor-reticle cursor-pan';
    }
    // Note: onMove will restore state to default once isPanning ends
  }, [isPanning, isTouchDevice]);

  if (isTouchDevice) return null;

  return (
    <div ref={reticleRef} className="cursor-reticle cursor-default">
      <svg className="cursor-brackets" viewBox="0 0 32 32" fill="none">
        <path d="M2 10 L2 2 L10 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"/>
        <path d="M22 2 L30 2 L30 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"/>
        <path d="M2 22 L2 30 L10 30" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"/>
        <path d="M22 30 L30 30 L30 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"/>
      </svg>
      <div className="cursor-core" />
    </div>
  );
};

export default CustomCursor;
