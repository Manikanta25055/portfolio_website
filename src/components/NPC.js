import React, { useState, useEffect } from 'react';
import { TILE_SIZE } from '../game/constants';

const SPRITE_CLASS = {
  trainer:   'npc-trainer',
  tourist:   'npc-tourist',
  oldman:    'npc-oldman',
  scientist: 'npc-scientist',
  girl:      'npc-girl',
};

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

  // Don't render if offscreen
  if (screenX < -TILE_SIZE * 2 || screenX > TILE_SIZE * 18 ||
      screenY < -TILE_SIZE * 2 || screenY > TILE_SIZE * 14) return null;

  return (
    <div
      className={`npc ${SPRITE_CLASS[npc.sprite] || ''} facing-${npc.dir}`}
      style={{ left: screenX, top: screenY }}
    >
      {exclaim && <div className="npc-exclaim">!</div>}
      <div className="npc-head" />
      <div className="npc-body" />
      <div className="npc-feet" />
    </div>
  );
};

export default NPC;
