import React, { useState } from 'react';

const ITEMS = [
  { label: 'PROJECTS',   panel: 'PROJECTS'  },
  { label: 'SKILLS',     panel: 'SKILLS'    },
  { label: 'BACKPACK',   panel: 'EXPERIENCE'},
  { label: 'ABOUT ME',   panel: 'ABOUT'     },
  { label: 'BLOG',       panel: 'BLOG'      },
  { label: 'CONTACT',    panel: 'CONTACT'   },
  { label: 'MAP',        panel: 'MAP'       },
  { label: 'TECH',       panel: 'TECH'      },
  { label: 'EXIT',       panel: null        },
];

const GameMenu = ({ onSelect, onClose }) => {
  const [cursor, setCursor] = useState(0);

  const handleClick = (item) => {
    if (!item.panel) { onClose(); return; }
    onSelect(item.panel);
  };

  return (
    <div className="game-menu">
      <div className="gm-header">GVM</div>
      {ITEMS.map((item, i) => (
        <div
          key={item.label}
          className={`gm-item${cursor === i ? ' gm-selected' : ''}`}
          onMouseEnter={() => setCursor(i)}
          onClick={() => handleClick(item)}
        >
          <span className="gm-arrow">{cursor === i ? '>' : ' '}</span>
          <span className="gm-label">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default GameMenu;
