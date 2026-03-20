import React, { useState } from 'react';

// x, y = % positions on the 100x100 minimap viewport
// wx, wy = world-space coordinates to panTo
const SECTIONS = [
  { id: 'home',       label: 'Home',       x: 38, y: 38, wx: 0,     wy: 0     },
  { id: 'about',      label: 'Education',  x: 62, y: 8,  wx: 900,   wy: -700  },
  { id: 'skills',     label: 'Skills',     x: 72, y: 32, wx: 1100,  wy: -200  },
  { id: 'projects',   label: 'Projects',   x: 68, y: 58, wx: 1000,  wy: 600   },
  { id: 'experience', label: 'Experience', x: 40, y: 62, wx: 100,   wy: 700   },
  { id: 'contact',    label: 'Contact',    x: 38, y: 80, wx: 0,     wy: 1300  },
  { id: 'blog',       label: 'Blog',       x: 10, y: 52, wx: -900,  wy: 400   },
  { id: 'github',     label: 'GitHub',     x: 8,  y: 26, wx: -800,  wy: -300  },
];

const Minimap = ({ canvasRef, activeSection }) => {
  const [collapsed, setCollapsed] = useState(false);

  const jumpTo = (section) => {
    canvasRef.current?.panTo(section.wx, section.wy, 1.0);
  };

  return (
    <div className={`minimap ${collapsed ? 'minimap--collapsed' : ''}`}>
      <button
        className="minimap-toggle"
        onClick={() => setCollapsed(p => !p)}
        aria-label="Toggle minimap"
      >
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="1" y="1" width="14" height="14" rx="1"/>
          <rect x="3.5" y="3.5" width="4" height="3" rx="0.5"/>
          <rect x="9.5" y="5" width="3.5" height="5" rx="0.5"/>
          <rect x="3.5" y="9" width="6" height="3.5" rx="0.5"/>
        </svg>
      </button>

      {!collapsed && (
        <div className="minimap-body">
          <div className="minimap-canvas">
            {/* Trace lines (simplified) */}
            <svg className="minimap-traces" viewBox="0 0 100 100" preserveAspectRatio="none">
              {SECTIONS.slice(1).map((s) => (
                <line
                  key={s.id}
                  x1="38" y1="38"
                  x2={s.x} y2={s.y}
                  stroke="rgba(200,85,58,0.2)"
                  strokeWidth="0.5"
                />
              ))}
            </svg>

            {/* Section dots */}
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                className={`minimap-dot ${activeSection === s.id ? 'active' : ''}`}
                style={{ left: `${s.x}%`, top: `${s.y}%` }}
                onClick={() => jumpTo(s)}
                title={s.label}
                aria-label={`Go to ${s.label}`}
              />
            ))}
          </div>

          <div className="minimap-legend">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                className={`minimap-legend-item ${activeSection === s.id ? 'active' : ''}`}
                onClick={() => jumpTo(s)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Minimap;
