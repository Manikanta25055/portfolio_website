import React, { useEffect, useRef, useCallback } from 'react';

const DotGrid = () => {
  const canvasRef = useRef(null);
  const mousePos = useRef({ x: -1000, y: -1000 });
  const animationFrameId = useRef(null);
  const isMobile = useRef(window.innerWidth <= 768);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const dotSpacing = 24;
    const hoverRadius = 120;
    const dotSize = 1.5;

    // Only draw hover effect on desktop
    const shouldDrawHover = !isMobile.current;

    for (let x = 0; x < width; x += dotSpacing) {
      for (let y = 0; y < height; y += dotSpacing) {
        let opacity = 0.35;
        let size = dotSize;

        if (shouldDrawHover) {
          const dx = mousePos.current.x - x;
          const dy = mousePos.current.y - y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < hoverRadius) {
            const intensity = 1 - (distance / hoverRadius);
            size = dotSize * (1 - intensity * 0.7);
            opacity = 0.35 * (1 - intensity * 0.8);
          }
        }

        ctx.fillStyle = `rgba(255, 107, 53, ${opacity})`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      draw();
    };

    setCanvasSize();

    let lastUpdate = 0;
    const throttleDelay = 16; // ~60fps

    const handleMouseMove = (e) => {
      const now = Date.now();
      if (now - lastUpdate < throttleDelay) return;

      lastUpdate = now;
      mousePos.current = { x: e.clientX, y: e.clientY };

      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      animationFrameId.current = requestAnimationFrame(draw);
    };

    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        isMobile.current = window.innerWidth <= 768;
        setCanvasSize();
      }, 150);
    };

    if (!isMobile.current) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
    }
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      className="dot-grid"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        pointerEvents: 'none',
        opacity: 0.6,
        maskImage: 'radial-gradient(ellipse 120% 120% at 50% 50%, black 0%, black 30%, transparent 90%)',
        WebkitMaskImage: 'radial-gradient(ellipse 120% 120% at 50% 50%, black 0%, black 30%, transparent 90%)',
      }}
    />
  );
};

export default DotGrid;
