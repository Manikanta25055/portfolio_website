import React, { useEffect, useState } from 'react';

const ITEMS = [
  { label: 'POKeDEX', panel: 'PROJECTS' },
  { label: 'POKeMON', panel: 'SKILLS' },
  { label: 'BAG', panel: 'EXPERIENCE' },
  { label: 'ASH', panel: 'ABOUT' },
  { label: 'SAVE', panel: 'CONTACT' },
  { label: 'OPTION', panel: 'TECH' },
  { label: 'TOWN MAP', panel: 'MAP' },
  { label: 'PC', panel: 'BLOG' },
];

const GameMenu = ({ onSelect, onClose }) => {
  const [cursor, setCursor] = useState(0);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key === 'ArrowUp') setCursor((current) => (current + ITEMS.length - 2) % ITEMS.length);
      if (e.key === 'ArrowDown') setCursor((current) => (current + 2) % ITEMS.length);
      if (e.key === 'ArrowLeft') setCursor((current) => (current % 2 === 0 ? current + 1 : current - 1));
      if (e.key === 'ArrowRight') setCursor((current) => (current % 2 === 0 ? current + 1 : current - 1));
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onSelect(ITEMS[cursor].panel);
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [cursor, onClose, onSelect]);

  return (
    <div className="game-menu">
      <div className="gm-window">
        <div className="gm-grid">
          {ITEMS.map((item, i) => (
            <button
              key={item.label}
              className={`gm-item${cursor === i ? ' gm-selected' : ''}`}
              onMouseEnter={() => setCursor(i)}
              onClick={() => onSelect(item.panel)}
              type="button"
            >
              <span className="gm-cursor">{cursor === i ? '▶' : ''}</span>
              <span className="gm-label">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="gm-help">SELECT STARTING MENU COMMAND.</div>
    </div>
  );
};

export default GameMenu;
