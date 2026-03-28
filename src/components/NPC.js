import React, { useState, useEffect } from 'react';
import { TILE_SIZE } from '../game/constants';

const NPC = ({ npc, cameraCol, cameraRow, showExclaim }) => {
  const [exclaim, setExclaim] = useState(false);

  useEffect(() => {
    if (showExclaim) {
      setExclaim(true);
      const t = setTimeout(() => setExclaim(false), 1200);
      return () => clearTimeout(t);
    }
  }, [showExclaim]);

  const screenX = (npc.col - cameraCol) * TILE_SIZE;
  const screenY = (npc.row - cameraRow) * TILE_SIZE;

  if (screenX < -TILE_SIZE * 2 || screenX > TILE_SIZE * 18 ||
      screenY < -TILE_SIZE * 2 || screenY > TILE_SIZE * 14) return null;

  return (
    <div
      className={`npc ${npc.sprite} facing-${npc.dir}`}
      style={{ left: screenX, top: screenY }}
    >
      {exclaim && <div className="npc-exclaim">!</div>}
      {/* nc = npc-content wrapper (mirrored for facing-left) */}
      <div className="nc">
        <div className="spr-hat" />
        <div className="spr-hair" />
        <div className="spr-face" />
        <div className="spr-eye-l" />
        <div className="spr-eye-r" />
        <div className="spr-body" />
        <div className="spr-leg-l" />
        <div className="spr-leg-r" />
      </div>
    </div>
  );
};

export default NPC;
