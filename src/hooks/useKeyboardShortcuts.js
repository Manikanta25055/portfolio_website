import { useEffect, useCallback } from 'react';

// World-space positions for each section
const SECTION_POSITIONS = {
  '1': { wx: 0,     wy: 0,    label: 'Home'       },
  '2': { wx: 900,   wy: -700, label: 'Education'  },
  '3': { wx: 1100,  wy: -200, label: 'Skills'     },
  '4': { wx: 1000,  wy: 600,  label: 'Projects'   },
  '5': { wx: 100,   wy: 700,  label: 'Experience' },
  '6': { wx: 0,     wy: 1300, label: 'Contact'    },
  '7': { wx: -900,  wy: 400,  label: 'Blog'       },
  '8': { wx: -800,  wy: -300, label: 'GitHub'     },
};

const PAN_STEP = 120;
const ZOOM_IN_FACTOR = 1.15;
const ZOOM_OUT_FACTOR = 1 / 1.15;

export const SHORTCUTS = [
  { key: '1–8', label: '1–8', description: 'Jump to section' },
  { key: 'H / 0', label: 'H/0', description: 'Return to Hero' },
  { key: '+', label: '+', description: 'Zoom in' },
  { key: '-', label: '-', description: 'Zoom out' },
  { key: 'Arrows', label: '↑↓←→', description: 'Pan canvas' },
  { key: 'g', label: 'G', description: 'Open GitHub' },
  { key: 'e', label: 'E', description: 'Send email' },
];

export function useKeyboardShortcuts(canvasRef, onToggleHint) {
  const handleKeyDown = useCallback((e) => {
    if (
      e.target.tagName === 'INPUT' ||
      e.target.tagName === 'TEXTAREA' ||
      e.target.isContentEditable
    ) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;

    const k = e.key;
    const kl = k.toLowerCase();

    // Section jumps: 1–8
    if (SECTION_POSITIONS[k]) {
      e.preventDefault();
      const pos = SECTION_POSITIONS[k];
      canvasRef?.current?.panTo(pos.wx, pos.wy, 1.0);
      return;
    }

    // Home: H or 0
    if (kl === 'h' || k === '0') {
      e.preventDefault();
      canvasRef?.current?.panTo(0, 0, 1.0);
      return;
    }

    // Zoom: + / =  and  - / _
    if (k === '+' || k === '=') {
      e.preventDefault();
      canvasRef?.current?.zoomBy(ZOOM_IN_FACTOR);
      return;
    }
    if (k === '-' || k === '_') {
      e.preventDefault();
      canvasRef?.current?.zoomBy(ZOOM_OUT_FACTOR);
      return;
    }

    // Arrow pan
    if (k === 'ArrowLeft') { e.preventDefault(); canvasRef?.current?.panBy(PAN_STEP, 0); return; }
    if (k === 'ArrowRight') { e.preventDefault(); canvasRef?.current?.panBy(-PAN_STEP, 0); return; }
    if (k === 'ArrowUp') { e.preventDefault(); canvasRef?.current?.panBy(0, PAN_STEP); return; }
    if (k === 'ArrowDown') { e.preventDefault(); canvasRef?.current?.panBy(0, -PAN_STEP); return; }

    // Utility shortcuts
    if (kl === 'g') { window.open('https://github.com/Manikanta25055', '_blank'); return; }
    if (kl === 'e') { window.open('mailto:mgonugondlamanikanta@gmail.com'); return; }

    // Toggle hint panel
    if (k === '?') { onToggleHint?.(); return; }
  }, [canvasRef, onToggleHint]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
