import React from 'react';

const HUD = ({ location, showControls }) => (
  <div className="hud">
    {location && (
      <div className="hud-location" key={location}>
        {location}
      </div>
    )}
    {showControls && (
      <div className="hud-controls">
        <span><b>[WASD]</b> MOVE</span>
        <span><b>[SPACE]</b> TALK/OK</span>
        <span><b>[ESC]</b> CLOSE</span>
      </div>
    )}
  </div>
);

export default HUD;
