import React from 'react';

const HUD = ({ location, showControls }) => (
  <div className="hud">
    <div className="hud-badge">
      <div className="hud-badge-top">LOCATION</div>
      <div className="hud-location">{location}</div>
    </div>
    {showControls && (
      <div className="hud-help">
        <span>WASD MOVE</span>
        <span>SPACE A</span>
        <span>ESC B</span>
      </div>
    )}
  </div>
);

export default HUD;
