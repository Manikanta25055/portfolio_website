import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  VIEWPORT_COLS, VIEWPORT_ROWS, MOVE_INTERVAL,
  COLLISION,
} from '../game/constants';
import { MAP, MAP_COLS, MAP_ROWS, PLAYER_START, HOTSPOTS, NPCS } from '../game/mapData';
import { useGameInput } from '../hooks/useGameInput';
import TileMap from './TileMap';
import Player from './Player';
import NPC from './NPC';
import DialogBox from './DialogBox';
import HUD from './HUD';
import AboutPanel from './panels/AboutPanel';
import ProjectsPanel from './panels/ProjectsPanel';
import BlogPanel from './panels/BlogPanel';
import SkillsPanel from './panels/SkillsPanel';
import ContactPanel from './panels/ContactPanel';
import ExperiencePanel from './panels/ExperiencePanel';

const PANEL_MAP = {
  ABOUT: AboutPanel,
  PROJECTS: ProjectsPanel,
  BLOG: BlogPanel,
  SKILLS: SkillsPanel,
  CONTACT: ContactPanel,
  EXPERIENCE: ExperiencePanel,
};

// Direction → tile delta
function delta(dir) {
  if (dir === 'up')    return [0, -1];
  if (dir === 'down')  return [0,  1];
  if (dir === 'left')  return [-1, 0];
  if (dir === 'right') return [ 1, 0];
  return [0, 0];
}

const GameCanvas = () => {
  const [pos, setPos]         = useState(PLAYER_START);
  const [walking, setWalking] = useState(false);
  const [dialog, setDialog]   = useState(null); // { lines, speaker, panelId }
  const [panel, setPanel]     = useState(null); // panel id string

  // Live refs for use inside setInterval
  const posRef    = useRef(PLAYER_START);
  const dialogRef = useRef(null);
  const panelRef  = useRef(null);

  useEffect(() => { posRef.current    = pos;    }, [pos]);
  useEffect(() => { dialogRef.current = dialog; }, [dialog]);
  useEffect(() => { panelRef.current  = panel;  }, [panel]);

  const [exclaim, setExclaim] = useState({});

  // ── Close dialog; open panel if queued ──────────────────────
  const closeDialog = useCallback(() => {
    const d = dialogRef.current;
    setDialog(null);
    if (d?.panelId) setPanel(d.panelId);
  }, []);

  // ── Trigger interaction (Space / Enter) ─────────────────────
  const handleAction = useCallback(({ type }) => {
    if (type === 'ESCAPE') {
      setPanel(null);
      setDialog(null);
      return;
    }
    // Dialog advances itself via DialogBox; only intercept if nothing open
    if (type === 'ACTION') {
      if (dialogRef.current || panelRef.current) return;

      const p = posRef.current;
      const [dc, dr] = delta(p.dir);
      const fc = p.col + dc;
      const fr = p.row + dr;

      // Tile the player is facing
      const hotspot = HOTSPOTS.find(h => h.col === fc && h.row === fr);
      if (hotspot) {
        const speakers = { PROJECTS: 'PROF. OAK', BLOG: 'GARY', ABOUT: 'MOM' };
        setDialog({
          lines: hotspot.dialog,
          speaker: speakers[hotspot.panel] || 'SIGN',
          panelId: hotspot.panel,
        });
        return;
      }

      // Adjacent NPC (Manhattan distance ≤ 1)
      const npc = NPCS.find(n => Math.abs(n.col - p.col) + Math.abs(n.row - p.row) <= 1);
      if (npc) {
        setDialog({ lines: npc.dialog, speaker: npc.name, panelId: npc.panel });
      }
    }
  }, []);

  const keysRef = useGameInput(handleAction);

  // ── Movement loop ────────────────────────────────────────────
  useEffect(() => {
    const id = setInterval(() => {
      if (dialogRef.current || panelRef.current) {
        setWalking(false);
        return;
      }

      const keys = keysRef.current;
      let dir = null;
      if (keys.has('w') || keys.has('arrowup'))    dir = 'up';
      else if (keys.has('s') || keys.has('arrowdown'))  dir = 'down';
      else if (keys.has('a') || keys.has('arrowleft'))  dir = 'left';
      else if (keys.has('d') || keys.has('arrowright')) dir = 'right';

      if (!dir) { setWalking(false); return; }

      const p = posRef.current;
      const [dc, dr] = delta(dir);
      const nc = p.col + dc;
      const nr = p.row + dr;

      // Update facing even if blocked
      if (nc < 0 || nc >= MAP_COLS || nr < 0 || nr >= MAP_ROWS ||
          COLLISION[MAP[nr][nc]]) {
        setPos(prev => ({ ...prev, dir }));
        setWalking(false);
        return;
      }

      setWalking(true);
      setPos({ col: nc, row: nr, dir });

      // NPC proximity exclaim
      const ex = {};
      NPCS.forEach(n => {
        if (Math.abs(n.col - nc) + Math.abs(n.row - nr) === 1) ex[n.id] = true;
      });
      setExclaim(ex);
    }, MOVE_INTERVAL);
    return () => clearInterval(id);
  }, [keysRef]);

  // ── Camera (clamp to map bounds) ─────────────────────────────
  const cameraCol = Math.max(0, Math.min(MAP_COLS - VIEWPORT_COLS, pos.col - Math.floor(VIEWPORT_COLS / 2)));
  const cameraRow = Math.max(0, Math.min(MAP_ROWS - VIEWPORT_ROWS, pos.row - Math.floor(VIEWPORT_ROWS / 2)));

  const PanelComp = panel ? PANEL_MAP[panel] : null;

  return (
    <div className="game-container">
      <TileMap cameraCol={cameraCol} cameraRow={cameraRow} />

      {NPCS.map(npc => (
        <NPC
          key={npc.id}
          npc={npc}
          cameraCol={cameraCol}
          cameraRow={cameraRow}
          showExclaim={!!exclaim[npc.id]}
        />
      ))}

      <Player
        col={pos.col}
        row={pos.row}
        direction={pos.dir}
        walking={walking}
        cameraCol={cameraCol}
        cameraRow={cameraRow}
      />

      <HUD location="PALLET TOWN" showControls={!dialog && !panel} />

      {dialog && (
        <DialogBox
          dialog={dialog.lines}
          speaker={dialog.speaker}
          onClose={closeDialog}
        />
      )}

      {PanelComp && <PanelComp onClose={() => setPanel(null)} />}
    </div>
  );
};

export default GameCanvas;
