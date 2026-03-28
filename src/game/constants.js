// ============================================================
// GAME CONSTANTS — Pokemon Fire Red style
// ============================================================

export const TILE_SIZE = 32; // px per tile
export const VIEWPORT_COLS = 15;
export const VIEWPORT_ROWS = 11;
export const VIEWPORT_W = TILE_SIZE * VIEWPORT_COLS; // 480px
export const VIEWPORT_H = TILE_SIZE * VIEWPORT_ROWS; // 352px

export const MOVE_INTERVAL = 160; // ms per tile step (held key)

// Tile type IDs
export const T = {
  GRASS:    0,
  PATH:     1,
  TREE:     2,
  WATER:    3,
  HOUSE_W:  4,  // house wall (blocked)
  HOUSE_R:  5,  // house roof (blocked)
  HOUSE_D:  6,  // house door (walkable, interactable)
  LEDGE:    7,  // one-way ledge (can jump south, blocked going north)
  FLOWER:   8,  // decorative flower (walkable)
  SIGN:     9,  // sign post (walkable, interactable)
  LAB_W:   10,  // lab wall (blocked)
  LAB_R:   11,  // lab roof (blocked)
  LAB_D:   12,  // lab door (walkable, interactable)
  GRASS2:  13,  // dark grass tile (walkable)
  FENCE:   14,  // fence (blocked)
  PATH2:   15,  // path variant (walkable)
  SAND:    16,  // beach sand (walkable)
  ROCK:    17,  // rock / boulder (blocked)
};

// true = blocked (cannot walk into)
export const COLLISION = {
  [T.GRASS]:   false,
  [T.PATH]:    false,
  [T.TREE]:    true,
  [T.WATER]:   true,
  [T.HOUSE_W]: true,
  [T.HOUSE_R]: true,
  [T.HOUSE_D]: false,
  [T.LEDGE]:   false,  // can walk onto ledge, but jumping is directional
  [T.FLOWER]:  false,
  [T.SIGN]:    false,
  [T.LAB_W]:   true,
  [T.LAB_R]:   true,
  [T.LAB_D]:   false,
  [T.GRASS2]:  false,
  [T.FENCE]:   true,
  [T.PATH2]:   false,
  [T.SAND]:    false,
  [T.ROCK]:    true,
};

// Which tiles trigger interaction on Space/Enter
export const INTERACTABLE = new Set([
  T.HOUSE_D, T.LAB_D, T.SIGN,
]);

// Directions
export const DIR = {
  UP:    'up',
  DOWN:  'down',
  LEFT:  'left',
  RIGHT: 'right',
};

// Panel IDs
export const PANELS = {
  ABOUT:    'ABOUT',
  PROJECTS: 'PROJECTS',
  BLOG:     'BLOG',
  SKILLS:   'SKILLS',
  CONTACT:  'CONTACT',
  EXPERIENCE: 'EXPERIENCE',
};
