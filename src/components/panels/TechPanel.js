import React from 'react';

const STACK = [
  { name: 'REACT 18',       detail: 'SPA + hooks — no router, no Redux. Pure useState/useRef.' },
  { name: 'CSS PIXEL ART',  detail: '32px tile grid, box-shadow sprites, GBA Fire Red palette.' },
  { name: 'GAME LOOP',      detail: 'setInterval @ 160ms — refs sync state to avoid stale closures.' },
  { name: 'TILE ENGINE',    detail: '24x20 map grid, CSS transform camera follow, O(1) collision.' },
  { name: 'INPUT SYSTEM',   detail: 'Set-based keydown/keyup — holds multiple keys simultaneously.' },
  { name: 'DIALOG SYSTEM',  detail: 'Typewriter reveal, speaker names, panel-chain on close.' },
];

const INSPIRATION = [
  'peteroravec.com — pixel art game portfolio concept',
  'Pokemon Fire Red (GBA, 2004) — UI + color palette',
  'Pallet Town — map layout and NPC placement',
];

const TechPanel = ({ onClose }) => (
  <div className="panel-overlay">
    <div className="panel-window">
      <div className="panel-header">
        <span className="panel-title">UNDER THE HOOD</span>
        <span className="panel-close-hint">[ESC] CLOSE</span>
      </div>
      <div className="panel-body">

        <div className="panel-section">
          <div className="panel-section-title">TECH STACK</div>
          {STACK.map(s => (
            <div key={s.name} className="tech-row">
              <div className="tech-name">{s.name}</div>
              <div className="tech-detail">{s.detail}</div>
            </div>
          ))}
        </div>

        <div className="panel-section">
          <div className="panel-section-title">ARCHITECTURE</div>
          <div className="panel-section-text">
            App  loading → title → game{'\n'}
            GameCanvas: TileMap + Player + NPCs{'\n'}
            Panels: 7 content overlays via PANEL_MAP{'\n'}
            Dialog: chained to panel open on close
          </div>
        </div>

        <div className="panel-section">
          <div className="panel-section-title">INSPIRED BY</div>
          {INSPIRATION.map(s => (
            <div key={s} className="panel-section-text" style={{ marginBottom: 3 }}>
              {'• '}{s}
            </div>
          ))}
        </div>

        <div className="panel-section">
          <div className="panel-section-title">SOURCE CODE</div>
          <div className="panel-section-text">
            github.com/Manikanta25055
          </div>
        </div>

      </div>
    </div>
  </div>
);

export default TechPanel;
