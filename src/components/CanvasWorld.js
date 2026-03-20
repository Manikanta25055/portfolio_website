import React, { useRef, useEffect, useImperativeHandle, forwardRef, useCallback } from 'react';

const MIN_SCALE = 0.18;
const MAX_SCALE = 1.6;
const INERTIA_FACTOR = 0.88;
const ZOOM_SENSITIVITY = 0.0008;

const CanvasWorld = forwardRef(({ children, onPanStart, onPanEnd }, ref) => {
  const viewportRef = useRef(null);
  const worldRef = useRef(null);
  const stateRef = useRef({
    x: 0, y: 0, scale: 1,
    dragging: false,
    startMouseX: 0, startMouseY: 0,
    startWorldX: 0, startWorldY: 0,
    velX: 0, velY: 0,
    lastX: 0, lastY: 0,
    lastTime: 0,
    rafId: null,
    pinchDist: null,
    pinchScale: null,
  });

  const applyTransform = useCallback(() => {
    const { x, y, scale } = stateRef.current;
    if (worldRef.current) {
      worldRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
    }
  }, []);

  const clampScale = (s) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, s));

  useImperativeHandle(ref, () => ({
    panTo: (worldX, worldY, targetScale) => {
      const s = stateRef.current;
      const vw = viewportRef.current.offsetWidth;
      const vh = viewportRef.current.offsetHeight;
      const sc = clampScale(targetScale ?? s.scale);
      s.x = vw / 2 - worldX * sc;
      s.y = vh / 2 - worldY * sc;
      s.scale = sc;
      s.velX = 0;
      s.velY = 0;
      applyTransform();
    },
    zoomBy: (factor) => {
      const s = stateRef.current;
      const vw = viewportRef.current.offsetWidth;
      const vh = viewportRef.current.offsetHeight;
      const cx = vw / 2;
      const cy = vh / 2;
      const newScale = clampScale(s.scale * factor);
      const sf = newScale / s.scale;
      s.x = cx - (cx - s.x) * sf;
      s.y = cy - (cy - s.y) * sf;
      s.scale = newScale;
      applyTransform();
    },
    panBy: (dx, dy) => {
      const s = stateRef.current;
      s.x += dx;
      s.y += dy;
      applyTransform();
    },
    getState: () => ({ ...stateRef.current }),
  }));

  // ── Mouse events — attached to window during drag for smooth off-canvas movement ──
  const onMouseDown = useCallback((e) => {
    if (e.button !== 0) return;
    // Don't start pan if clicking on interactive elements inside panels
    if (e.target.closest('a, button, input, textarea, select, [role="button"]')) return;

    const s = stateRef.current;
    s.dragging = true;
    s.startMouseX = e.clientX;
    s.startMouseY = e.clientY;
    s.startWorldX = s.x;
    s.startWorldY = s.y;
    s.velX = 0;
    s.velY = 0;
    s.lastX = e.clientX;
    s.lastY = e.clientY;
    s.lastTime = performance.now();
    cancelAnimationFrame(s.rafId);

    // Prevent text selection during drag
    document.body.classList.add('is-panning');

    onPanStart?.();
  }, [onPanStart]);

  // These are attached to window so drag continues off-element
  useEffect(() => {
    const onWindowMouseMove = (e) => {
      const s = stateRef.current;
      if (!s.dragging) return;
      const now = performance.now();
      const dt = Math.max(1, now - s.lastTime);
      s.velX = (e.clientX - s.lastX) / dt * 16;
      s.velY = (e.clientY - s.lastY) / dt * 16;
      s.lastX = e.clientX;
      s.lastY = e.clientY;
      s.lastTime = now;
      s.x = s.startWorldX + (e.clientX - s.startMouseX);
      s.y = s.startWorldY + (e.clientY - s.startMouseY);
      applyTransform();
    };

    const onWindowMouseUp = () => {
      const s = stateRef.current;
      if (!s.dragging) return;
      s.dragging = false;
      document.body.classList.remove('is-panning');
      onPanEnd?.();

      const inertia = () => {
        s.velX *= INERTIA_FACTOR;
        s.velY *= INERTIA_FACTOR;
        s.x += s.velX;
        s.y += s.velY;
        applyTransform();
        if (Math.abs(s.velX) > 0.05 || Math.abs(s.velY) > 0.05) {
          s.rafId = requestAnimationFrame(inertia);
        }
      };
      s.rafId = requestAnimationFrame(inertia);
    };

    window.addEventListener('mousemove', onWindowMouseMove, { passive: true });
    window.addEventListener('mouseup', onWindowMouseUp);
    return () => {
      window.removeEventListener('mousemove', onWindowMouseMove);
      window.removeEventListener('mouseup', onWindowMouseUp);
    };
  }, [applyTransform, onPanEnd]);

  const onWheel = useCallback((e) => {
    e.preventDefault();
    const s = stateRef.current;
    cancelAnimationFrame(s.rafId);
    s.velX = 0;
    s.velY = 0;
    const rect = viewportRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const delta = -e.deltaY * ZOOM_SENSITIVITY;
    const newScale = clampScale(s.scale * (1 + delta));
    const scaleFactor = newScale / s.scale;
    s.x = mouseX - (mouseX - s.x) * scaleFactor;
    s.y = mouseY - (mouseY - s.y) * scaleFactor;
    s.scale = newScale;
    applyTransform();
  }, [applyTransform]);

  // ── Touch events ──
  const onTouchStart = useCallback((e) => {
    const s = stateRef.current;
    cancelAnimationFrame(s.rafId);
    if (e.touches.length === 1) {
      s.dragging = true;
      s.startMouseX = e.touches[0].clientX;
      s.startMouseY = e.touches[0].clientY;
      s.startWorldX = s.x;
      s.startWorldY = s.y;
      s.velX = 0; s.velY = 0;
      s.pinchDist = null;
    } else if (e.touches.length === 2) {
      s.dragging = false;
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      s.pinchDist = Math.sqrt(dx * dx + dy * dy);
      s.pinchScale = s.scale;
    }
  }, []);

  const onTouchMove = useCallback((e) => {
    e.preventDefault();
    const s = stateRef.current;
    if (e.touches.length === 1 && s.dragging) {
      s.x = s.startWorldX + (e.touches[0].clientX - s.startMouseX);
      s.y = s.startWorldY + (e.touches[0].clientY - s.startMouseY);
      applyTransform();
    } else if (e.touches.length === 2 && s.pinchDist !== null) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const newScale = clampScale(s.pinchScale * (dist / s.pinchDist));
      const rect = viewportRef.current.getBoundingClientRect();
      const cx = (e.touches[0].clientX + e.touches[1].clientX) / 2 - rect.left;
      const cy = (e.touches[0].clientY + e.touches[1].clientY) / 2 - rect.top;
      const sf = newScale / s.scale;
      s.x = cx - (cx - s.x) * sf;
      s.y = cy - (cy - s.y) * sf;
      s.scale = newScale;
      applyTransform();
    }
  }, [applyTransform]);

  const onTouchEnd = useCallback(() => {
    stateRef.current.dragging = false;
    stateRef.current.pinchDist = null;
  }, []);

  useEffect(() => {
    const vp = viewportRef.current;
    vp.addEventListener('wheel', onWheel, { passive: false });
    vp.addEventListener('touchmove', onTouchMove, { passive: false });
    return () => {
      vp.removeEventListener('wheel', onWheel);
      vp.removeEventListener('touchmove', onTouchMove);
    };
  }, [onWheel, onTouchMove]);

  // Center world on Hero (0,0) on mount
  useEffect(() => {
    const vp = viewportRef.current;
    const s = stateRef.current;
    s.x = vp.offsetWidth / 2;
    s.y = vp.offsetHeight / 2;
    s.scale = 1;
    applyTransform();
  }, [applyTransform]);

  return (
    <div
      ref={viewportRef}
      className="canvas-viewport"
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div ref={worldRef} className="canvas-world">
        {children}
      </div>
    </div>
  );
});

export default CanvasWorld;
