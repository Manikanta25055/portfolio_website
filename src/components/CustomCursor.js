import React, { useEffect, useRef, useState } from 'react';

const CLICKABLE = 'a, button, .minimap-dot, .minimap-legend-item, .cta-primary, .achievement-badge, [role="button"]';
const TEXT_TARGETS = 'input, textarea, [contenteditable]';

const CustomCursor = ({ isPanning }) => {
  const reticleRef = useRef(null);
  const ringRef = useRef(null);
  const [isTouchDevice, setIsTouchDevice] = useState(true);

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  useEffect(() => {
    if (isTouchDevice) return;

    let mX = 0, mY = 0, rX = 0, rY = 0;
    let vX = 0, vY = 0, pX = 0, pY = 0;
    let rafId;
    let lastMove = 0, lastCheck = 0;
    let state = 'default';
    let mouseDown = false;

    const reticle = reticleRef.current;
    const ring = ringRef.current;

    const setState = (s) => {
      if (state === s) return;
      state = s;
      reticle.className = `cursor-reticle cursor-${s}`;
      ring.className = `cursor-ring cursor-${s}`;
    };

    const onMove = (e) => {
      const now = performance.now();
      const dt = Math.max(1, now - lastMove);
      lastMove = now;
      pX = mX; pY = mY;
      mX = e.clientX; mY = e.clientY;
      vX = (mX - pX) / dt; vY = (mY - pY) / dt;
      reticle.style.transform = `translate3d(${mX}px, ${mY}px, 0)`;

      if (now - lastCheck > 100) {
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

    const onDown = () => {
      mouseDown = true;
      setState('click');
    };
    const onUp = () => {
      mouseDown = false;
      setState('default');
    };

    const animateRing = () => {
      const dx = mX - rX, dy = mY - rY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const d = Math.min(0.18, 0.07 + dist / 3000);
      const p = Math.min(1.5, (Math.abs(vX) + Math.abs(vY)) * 0.8);
      rX += dx * d + vX * p;
      rY += dy * d + vY * p;
      ring.style.transform = `translate3d(${rX}px, ${rY}px, 0)`;
      rafId = requestAnimationFrame(animateRing);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    animateRing();

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      cancelAnimationFrame(rafId);
    };
  }, [isTouchDevice]);

  // React to isPanning prop changes
  useEffect(() => {
    if (isTouchDevice) return;
    const reticle = reticleRef.current;
    const ring = ringRef.current;
    if (!reticle || !ring) return;
    if (isPanning) {
      reticle.className = 'cursor-reticle cursor-pan';
      ring.className = 'cursor-ring cursor-pan';
    } else {
      reticle.className = 'cursor-reticle cursor-default';
      ring.className = 'cursor-ring cursor-default';
    }
  }, [isPanning, isTouchDevice]);

  if (isTouchDevice) return null;

  return (
    <>
      <div ref={reticleRef} className="cursor-reticle cursor-default">
        <svg className="cursor-brackets" viewBox="0 0 32 32" fill="none">
          <path d="M2 10 L2 2 L10 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"/>
          <path d="M22 2 L30 2 L30 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"/>
          <path d="M2 22 L2 30 L10 30" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"/>
          <path d="M22 30 L30 30 L30 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"/>
        </svg>
        <div className="cursor-core" />
      </div>
      <div ref={ringRef} className="cursor-ring cursor-default" />
    </>
  );
};

export default CustomCursor;
