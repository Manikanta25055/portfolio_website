import React from 'react';

// Connections: [fromX, fromY, toX, toY]
const CONNECTIONS = [
  [0, 0, 900, -700],       // Hero -> Education
  [0, 0, 1100, -200],      // Hero -> Skills
  [0, 0, 1000, 600],       // Hero -> Projects
  [0, 0, 100, 700],        // Hero -> Experience
  [0, 0, 0, 1300],         // Hero -> Contact
  [0, 0, -800, -300],      // Hero -> GitHub
  [0, 0, -900, 400],       // Hero -> Blog
  [100, 700, 1000, 600],   // Experience -> Projects
];

const NODE_POSITIONS = [
  [0, 0],
  [900, -700],
  [1100, -200],
  [1000, 600],
  [100, 700],
  [0, 1300],
  [-800, -300],
  [-900, 400],
];

const orthoPath = (x1, y1, x2, y2) => {
  const mx = (x1 + x2) / 2;
  return `M ${x1} ${y1} L ${mx} ${y1} L ${mx} ${y2} L ${x2} ${y2}`;
};

const CanvasTraces = () => {
  return (
    <svg
      className="canvas-traces"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        overflow: 'visible',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      <defs>
        <filter id="traceGlow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {CONNECTIONS.map(([x1, y1, x2, y2], i) => (
        <path
          key={i}
          d={orthoPath(x1, y1, x2, y2)}
          stroke="rgba(200,85,58,0.18)"
          strokeWidth="1"
          fill="none"
          filter="url(#traceGlow)"
        />
      ))}
      {/* Node junction dots */}
      {NODE_POSITIONS.map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r="3"
          fill="rgba(200,85,58,0.5)"
          filter="url(#traceGlow)"
        />
      ))}
    </svg>
  );
};

export default CanvasTraces;
