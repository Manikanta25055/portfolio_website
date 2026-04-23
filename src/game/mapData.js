import { T } from './constants';

// ============================================================
// PALLET TOWN MAP — 24 cols × 20 rows
// Faithful to Pokemon FireRed layout
// ============================================================

const _ = T.GRASS;    // 0 — walkable grass
const P = T.PATH;     // 1 — sandy path
const X = T.TREE;     // 2 — tree (blocked)
const W = T.WATER;    // 3 — water
const w = T.HOUSE_W;  // 4 — house wall
const r = T.HOUSE_R;  // 5 — house roof
const d = T.HOUSE_D;  // 6 — house door
const L = T.LEDGE;    // 7 — ledge
const F = T.FLOWER;   // 8 — flower
const S = T.SIGN;     // 9 — sign
const lw = T.LAB_W;   // 10 — lab wall
const lr = T.LAB_R;   // 11 — lab roof
const ld = T.LAB_D;   // 12 — lab door
const g = T.GRASS2;   // 13 — dark grass
// fe(FENCE), p2(PATH2), sa(SAND), Ro(ROCK) defined but not placed in this map layout

// MAP: 24 columns × 20 rows
// Col:  0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23
export const MAP = [
//row 0 — north tree wall (fully blocked except route-1 gap cols 10-11)
  [X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X],
//row 1 — north area (trees on edges, path in middle = Route 1 connection)
  [X, X, X, X, X, X, X, X, X, P, P, P, P, X, X, X, X, X, X, X, X, X, X, X],
//row 2 — top open area with houses starting
  [X, X, _, _, _, _, _, _, _, P, P, P, P, _, _, _, _, _, _, _, _, _, X, X, X],
//row 3 — player house roof (cols 2-5) + rival house roof (cols 17-20)
  [X, X, r, r, r, r, _, _, _, P, P, P, P, _, _, _, _, r, r, r, r, _, X, X, X],
//row 4 — house roofs continue
  [X, X, r, r, r, r, _, _, _, P, P, P, P, _, _, _, _, r, r, r, r, _, X, X, X],
//row 5 — house walls
  [X, X, w, w, w, w, _, _, _, _, _, _, _, _, _, _, _, w, w, w, w, _, X, X, X],
//row 6 — house doors + path
  [X, X, w, d, w, w, _, _, S, _, _, _, _, _, _, _, _, w, d, w, w, _, X, X, X],
//row 7 — open area with sign, flower patches
  [X, X, _, F, _, _, _, _, _, _, _, _, _, _, _, F, _, _, F, _, _, _, X, X, X],
//row 8 — mid area, NPCs roam here
  [X, X, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, X, X, X],
//row 9 — lab roof starts (cols 7-16)
  [X, X, _, _, _, _, _, lr,lr,lr,lr,lr,lr,lr,lr,lr, _, _, _, _, _, _, X, X, X],
//row 10 — lab roof continues
  [X, X, _, _, _, _, _, lr,lr,lr,lr,lr,lr,lr,lr,lr, _, _, _, _, _, _, X, X, X],
//row 11 — lab walls
  [X, X, _, _, _, _, _, lw,lw,lw,lw,lw,lw,lw,lw,lw, _, _, _, _, _, _, X, X, X],
//row 12 — lab door row
  [X, X, _, _, _, _, _, lw,lw, _, ld, _,lw,lw,lw,lw, _, _, _, _, _, _, X, X, X],
//row 13 — south area, grass patches
  [X, X, _, _, g, g, _, _, _, P, P, P, _, _, g, g, _, _, _, _, _, _, X, X, X],
//row 14 — more south area
  [X, X, _, _, _, _, _, _, _, P, P, P, _, _, _, _, _, _, _, F, _, _, _, X, X, X],
//row 15 — ledge row (blocks going north from water area)
  [X, X, L, L, L, L, L, L, L, L, L, L, L, L, L, L, L, L, L, L, L, L, X, X, X],
//row 16 — ledge + south trees
  [X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X],
//row 17 — water
  [W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W],
//row 18 — water
  [W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W],
//row 19 — water
  [W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W],
];

export const MAP_COLS = MAP[0].length; // 24
export const MAP_ROWS = MAP.length;    // 20

// Player starting position
export const PLAYER_START = { col: 10, row: 8, dir: 'down' };

// ── Interaction hotspots ──────────────────────────────────────
// { col, row } tiles that trigger specific panels/dialogs when player presses Space facing them
// (player must be one tile away, facing the hotspot)
export const HOTSPOTS = [
  // Player's House door
  { col: 3, row: 6, type: 'PANEL', panel: 'ABOUT',
    dialog: ['Welcome to GVM\'s home!', 'VEERA MANIKANTA GONUGONDLA', 'Electrical & Electronics Engineer', '[Press SPACE to enter]'] },
  // Rival's House door
  { col: 18, row: 6, type: 'PANEL', panel: 'BLOG',
    dialog: ['This is Gary\'s house... wait,', 'this is where the BLOG posts live!', '[Press SPACE to enter]'] },
  // Oak\'s Lab door
  { col: 10, row: 12, type: 'PANEL', panel: 'PROJECTS',
    dialog: ['PROF. OAK\'s RESEARCH LAB', 'Home to 8 engineering projects.', 'Choose your project wisely!', '[Press SPACE to enter lab]'] },
  // North sign (Route 1)
  { col: 9, row: 1, type: 'DIALOG', panel: null,
    dialog: ['ROUTE 1 — VIRIDIAN FOREST', 'Leads to more adventures!', 'But first, explore PALLET TOWN.'] },
  // Sign near center
  { col: 8, row: 6, type: 'DIALOG', panel: null,
    dialog: ['PALLET TOWN', 'Shades of your journey await.', 'Talk to the NPCs to learn more!'] },
];

// ── NPCs ───────────────────────────────────────────────────────
export const NPCS = [
  {
    id: 'trainer-red',
    col: 11, row: 8,
    dir: 'down',
    sprite: 'trainer',
    name: 'TRAINER RED',
    panel: 'SKILLS',
    dialog: [
      'I\'ve been training hard!',
      'Want to see my SKILL BUILD?',
      'Embedded: 92  FPGA/RTL: 85',
      'Signal: 82   AI/ML: 78',
      'Power: 72    Software: 68',
      '[Press SPACE to view full stats]',
    ],
  },
  {
    id: 'tourist',
    col: 5, row: 8,
    dir: 'right',
    sprite: 'tourist',
    name: 'TOURIST',
    panel: 'EXPERIENCE',
    dialog: [
      'Visiting from Bangalore!',
      'I heard GVM interned at',
      'Apsis Solutions + Mindenious.',
      'VLSI and IoT — quite a combo!',
      '[Press SPACE for full dossier]',
    ],
  },
  {
    id: 'old-man',
    col: 15, row: 8,
    dir: 'left',
    sprite: 'oldman',
    name: 'OLD MAN',
    panel: 'CONTACT',
    dialog: [
      'Back in my day we wrote letters.',
      'Now you can reach GVM via:',
      'mgonugondlamanikanta@gmail.com',
      'github.com/Manikanta25055',
      '[Press SPACE for contact panel]',
    ],
  },
  {
    id: 'scientist',
    col: 10, row: 5,
    dir: 'down',
    sprite: 'scientist',
    name: 'SCIENTIST',
    panel: null,
    dialog: [
      'I\'ve studied the data carefully.',
      'MIT CGPA: 8.02 / 10.0',
      'IIT Madras CGPA: 7.33 / 10.0',
      'Dual degree — both institutions!',
      'That\'s what I call dedication.',
    ],
  },
  {
    id: 'girl',
    col: 6, row: 13,
    dir: 'up',
    sprite: 'girl',
    name: 'RESEARCHER',
    panel: null,
    dialog: [
      'Did you hear?',
      'GVM filed a PATENT in 2025!',
      '"Non-Invasive Patient Collapse',
      'Detection" — biomedical systems.',
      'That\'s seriously impressive!',
    ],
  },
];
