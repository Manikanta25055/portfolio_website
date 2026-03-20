import React from 'react';

/**
 * Positions a section panel at fixed world-space coordinates.
 * x and y are world-space px, relative to origin (Hero at 0,0).
 */
const WorldNode = ({ x = 0, y = 0, id, label, children }) => {
  return (
    <div
      className="world-node"
      id={id}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {label && (
        <div className="world-node-label" aria-hidden="true">
          <span className="world-node-dot" />
          {label}
        </div>
      )}
      {children}
    </div>
  );
};

export default WorldNode;
