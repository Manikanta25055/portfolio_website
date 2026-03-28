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
import GameMenu from './GameMenu';
import AboutPanel from './panels/AboutPanel';
import ProjectsPanel from './panels/ProjectsPanel';
import BlogPanel from './panels/BlogPanel';
import SkillsPanel from './panels/SkillsPanel';
import ContactPanel from './panels/ContactPanel';
import ExperiencePanel from './panels/ExperiencePanel';
import MapPanel from './panels/MapPanel';
import TechPanel from './panels/TechPanel';
import TouchControls from './TouchControls';

const PANEL_MAP = {
  ABOUT: AboutPanel,
  PROJECTS: ProjectsPanel,
  BLOG: BlogPanel,
  SKILLS: SkillsPanel,
  CONTACT: ContactPanel,
  EXPERIENCE: ExperiencePanel,
  MAP: MapPanel,
  TECH: TechPanel,
};

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
  const [dialog, setDialog]   = useState(null);
  const [panel, setPanel]     = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [exclaim, setExclaim] = useState({});
  const [scale, setScale]     = useState(1);

  const posRef    = useRef(PLAYER_START);
  const dialogRef = useRef(null);
  const panelRef  = useRef(null);
  const menuRef   = useRef(false);

  useEffect(() => { posRef.current    = pos;      }, [pos]);
  useEffect(() => { dialogRef.current = dialog;   }, [dialog]);
  useEffect(() => { panelRef.current  = panel;    }, [panel]);
  useEffect(() => { menuRef.current   = menuOpen; }, [menuOpen]);

  // ── Full-screen scale ────────────────────────────────────
  useEffect(() => {
    const calc = () => {
      const s = Math.min(window.innerWidth / 480, window.innerHeight / 352);
      setScale(Math.max(1, s));
    };
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, []);

  const closeDialog = useCallback(() => {
    const d = dialogRef.current;
    setDialog(null);
    if (d?.panelId) setPanel(d.panelId);
  }, []);

  const handleAction = useCallback(({ type }) => {
    if (type === 'ESCAPE') {
      setPanel(null);
      setDialog(null);
      setMenuOpen(false);
      return;
    }
    if (type === 'MENU') {
      if (!panelRef.current && !dialogRef.current) {
        setMenuOpen(prev => !prev);
      }
      return;
    }
    if (type === 'ACTION') {
      if (dialogRef.current || panelRef.current || menuRef.current) return;

      const p = posRef.current;
      const [dc, dr] = delta(p.dir);
      const fc = p.col + dc;
      const fr = p.row + dr;

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

      const npc = NPCS.find(n =>
        Math.abs(n.col - p.col) + Math.abs(n.row - p.row) <= 1
      );
      if (npc) {
        setDialog({ lines: npc.dialog, speaker: npc.name, panelId: npc.panel });
      }
    }
  }, []);

  const keysRef = useGameInput(handleAction);

  // ── Movement loop ────────────────────────────────────────
  useEffect(() => {
    const id = setInterval(() => {
      if (dialogRef.current || panelRef.current || menuRef.current) {
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

      if (nc < 0 || nc >= MAP_COLS || nr < 0 || nr >= MAP_ROWS ||
          COLLISION[MAP[nr][nc]]) {
        setPos(prev => ({ ...prev, dir }));
        setWalking(false);
        return;
      }

      setWalking(true);
      setPos({ col: nc, row: nr, dir });

      const ex = {};
      NPCS.forEach(n => {
        if (Math.abs(n.col - nc) + Math.abs(n.row - nr) === 1) ex[n.id] = true;
      });
      setExclaim(ex);
    }, MOVE_INTERVAL);
    return () => clearInterval(id);
  }, [keysRef]);

  const cameraCol = Math.max(0, Math.min(MAP_COLS - VIEWPORT_COLS, pos.col - Math.floor(VIEWPORT_COLS / 2)));
  const cameraRow = Math.max(0, Math.min(MAP_ROWS - VIEWPORT_ROWS, pos.row - Math.floor(VIEWPORT_ROWS / 2)));

  const PanelComp = panel ? PANEL_MAP[panel] : null;

  return (
    <div className="game-fullscreen">
      <div
        className="game-container"
        style={{ transform: `scale(${scale})` }}
      >
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
          col={pos.col} row={pos.row}
          direction={pos.dir} walking={walking}
          cameraCol={cameraCol} cameraRow={cameraRow}
        />

        <HUD location="PALLET TOWN" showControls={!dialog && !panel && !menuOpen} />

        {/* [X] menu button hint */}
        {!dialog && !panel && !menuOpen && (
          <div className="hud-x-hint">[X] MENU</div>
        )}

        {dialog && (
          <DialogBox
            dialog={dialog.lines}
            speaker={dialog.speaker}
            onClose={closeDialog}
          />
        )}

        {menuOpen && (
          <GameMenu
            onSelect={(p) => { setMenuOpen(false); setPanel(p); }}
            onClose={() => setMenuOpen(false)}
          />
        )}

        {PanelComp && <PanelComp onClose={() => setPanel(null)} />}
      </div>

      {/* Mobile touch controls — only visible on touch/small screens via CSS */}
      <TouchControls onAction={handleAction} keysRef={keysRef} />
    </div>
  );
};

export default GameCanvas;
