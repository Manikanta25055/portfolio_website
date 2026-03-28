import React from 'react';
import { TILE_SIZE } from '../game/constants';

// Ash Ketchum-style trainer sprite — built from layered CSS divs
const Player = ({ col, row, direction, walking, cameraCol, cameraRow }) => {
  const screenX = (col - cameraCol) * TILE_SIZE;
  const screenY = (row - cameraRow) * TILE_SIZE;

  return (
    <div
      className={`player facing-${direction}${walking ? ' walking' : ''}`}
      style={{ left: screenX, top: screenY }}
    >
      {/* pc = player-content wrapper (mirrored for facing-left) */}
      <div className="pc">
        <div className="spr-hat" />
        <div className="spr-brim" />
        <div className="spr-hair-l" />
        <div className="spr-hair-r" />
        <div className="spr-face" />
        <div className="spr-eye-l" />
        <div className="spr-eye-r" />
        <div className="spr-jacket" />
        <div className="spr-collar" />
        <div className="spr-leg-l" />
        <div className="spr-leg-r" />
      </div>
    </div>
  );
};

export default Player;
