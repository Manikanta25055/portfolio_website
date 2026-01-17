import React, { useState, useEffect, useRef, useMemo } from 'react';

const DotGrid = () => {
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const containerRef = useRef(null);
  const dotSpacing = 24;
  const hoverRadius = 120; // pixels

  // Generate dot positions only once
  const dots = useMemo(() => {
    const dotsArray = [];
    const cols = Math.ceil(window.innerWidth / dotSpacing) + 2;
    const rows = Math.ceil(window.innerHeight / dotSpacing) + 2;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        dotsArray.push({
          id: `${row}-${col}`,
          x: col * dotSpacing,
          y: row * dotSpacing,
        });
      }
    }
    return dotsArray;
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const calculateDotStyle = (dotX, dotY) => {
    const dx = mousePos.x - dotX;
    const dy = mousePos.y - dotY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < hoverRadius) {
      const intensity = 1 - (distance / hoverRadius);
      const scale = 1 - (intensity * 0.7); // Shrink up to 70%
      const opacity = 1 - (intensity * 0.8); // Fade up to 80%

      return {
        transform: `scale(${scale})`,
        opacity: opacity,
      };
    }

    return {
      transform: 'scale(1)',
      opacity: 1,
    };
  };

  return (
    <div className="dot-grid" ref={containerRef}>
      {dots.map((dot) => (
        <div
          key={dot.id}
          className="dot-grid-item"
          style={{
            left: `${dot.x}px`,
            top: `${dot.y}px`,
            ...calculateDotStyle(dot.x, dot.y),
          }}
        />
      ))}
    </div>
  );
};

export default DotGrid;
