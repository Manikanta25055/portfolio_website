import React, { useCallback } from 'react';

/**
 * Mobile touch D-pad + action buttons.
 * Injects key events into keysRef (same Set used by the game loop).
 * Only visible on touch/small-screen devices via CSS.
 */
const TouchControls = ({ onAction, keysRef }) => {
  const press   = useCallback((k) => keysRef.current.add(k),    [keysRef]);
  const release = useCallback((k) => keysRef.current.delete(k), [keysRef]);

  const dir = (key) => ({
    onTouchStart:  (e) => { e.preventDefault(); press(key);   },
    onTouchEnd:    (e) => { e.preventDefault(); release(key); },
    onTouchCancel: (e) => { e.preventDefault(); release(key); },
    onMouseDown:   ()  => press(key),
    onMouseUp:     ()  => release(key),
    onMouseLeave:  ()  => release(key),
  });

  return (
    <div className="touch-controls">
      {/* D-pad */}
      <div className="dpad">
        <button className="dpad-btn dpad-up"    {...dir('arrowup')}   >&#9650;</button>
        <button className="dpad-btn dpad-left"  {...dir('arrowleft')} >&#9664;</button>
        <div    className="dpad-center" />
        <button className="dpad-btn dpad-right" {...dir('arrowright')}>&#9654;</button>
        <button className="dpad-btn dpad-down"  {...dir('arrowdown')} >&#9660;</button>
      </div>

      {/* Action buttons */}
      <div className="act-cluster">
        <button className="act-btn act-b"
          onTouchStart={(e) => { e.preventDefault(); onAction({ type: 'ESCAPE' }); }}
          onClick={() => onAction({ type: 'ESCAPE' })}>B</button>
        <button className="act-btn act-x"
          onTouchStart={(e) => { e.preventDefault(); onAction({ type: 'MENU' }); }}
          onClick={() => onAction({ type: 'MENU' })}>X</button>
        <button className="act-btn act-a"
          onTouchStart={(e) => { e.preventDefault(); onAction({ type: 'ACTION' }); }}
          onClick={() => onAction({ type: 'ACTION' })}>A</button>
      </div>
    </div>
  );
};

export default TouchControls;
