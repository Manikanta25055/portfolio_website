import React from 'react';
import { TILE_SIZE } from '../game/constants';

const Player = ({ col, row, direction, walking, cameraCol, cameraRow }) => {
  // Convert world tile coords to viewport pixel position
  const screenX = (col - cameraCol) * TILE_SIZE;
  const screenY = (row - cameraRow) * TILE_SIZE;

  return (
    <div
      className={`player facing-${direction}${walking ? ' walking' : ''}`}
      style={{ left: screenX, top: screenY }}
    >
      <div className="player-sprite">
        <div className="player-head">
          <div className="player-hat-b" />
        </div>
        <div className="player-body" />
        <div className="player-legs" />
      </div>
    </div>
  );
};

export default Player;
