import React from 'react';

const STACK = [
  { name: 'OVERWORLD ENGINE', detail: 'Tile map, camera follow, sprite placement, and world collisions.' },
  { name: 'BATTLE BOX UI', detail: 'FireRed-like dialog windows, panels, and menu framing.' },
  { name: 'TRAINER INPUT', detail: 'Keyboard and touch controls mapped to A, B, and movement.' },
  { name: 'VERCEL LINK CABLE', detail: 'Serverless contact endpoint handled through api/contact.js.' },
];

const TechPanel = () => (
  <div className="panel-overlay">
    <div className="panel-window">
      <div className="panel-header">
        <span className="panel-title">OPTION / TECH</span>
        <span className="panel-close-hint">B BUTTON: CLOSE</span>
      </div>
      <div className="panel-body">
        <div className="panel-section">
          <div className="panel-section-title">SYSTEM DATA</div>
          {STACK.map((item) => (
            <div key={item.name} className="tech-row">
              <div className="tech-name">{item.name}</div>
              <div className="tech-detail">{item.detail}</div>
            </div>
          ))}
        </div>
        <div className="panel-section">
          <div className="panel-section-title">ENGINE NOTES</div>
          <div className="panel-section-text">React drives the world state, CSS renders the pixel-art-inspired presentation, and every content area is reframed as an in-universe FireRed menu screen.</div>
        </div>
      </div>
    </div>
  </div>
);

export default TechPanel;
