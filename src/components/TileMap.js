import React from 'react';
import { T, TILE_SIZE } from '../game/constants';
import { MAP, MAP_COLS, MAP_ROWS } from '../game/mapData';

// Map tile ID → CSS class name
const TILE_CLASS = {
  [T.GRASS]:   'tile-grass',
  [T.PATH]:    'tile-path',
  [T.TREE]:    'tile-tree',
  [T.WATER]:   'tile-water',
  [T.HOUSE_W]: 'tile-house-wall',
  [T.HOUSE_R]: 'tile-house-roof',
  [T.HOUSE_D]: 'tile-house-door',
  [T.LEDGE]:   'tile-ledge',
  [T.FLOWER]:  'tile-flower',
  [T.SIGN]:    'tile-sign',
  [T.LAB_W]:   'tile-lab-wall',
  [T.LAB_R]:   'tile-lab-roof',
  [T.LAB_D]:   'tile-lab-door',
  [T.GRASS2]:  'tile-grass2',
  [T.FENCE]:   'tile-fence',
  [T.PATH2]:   'tile-path2',
  [T.SAND]:    'tile-grass',
  [T.ROCK]:    'tile-tree',
};

const TileMap = ({ cameraCol, cameraRow }) => {
  // Only render tiles visible in viewport (+ 2 tile buffer each side)
  const startCol = Math.max(0, Math.floor(cameraCol) - 1);
  const endCol   = Math.min(MAP_COLS - 1, Math.ceil(cameraCol) + 16);
  const startRow = Math.max(0, Math.floor(cameraRow) - 1);
  const endRow   = Math.min(MAP_ROWS - 1, Math.ceil(cameraRow) + 12);

  // Camera pixel offset (sub-tile smoothness)
  const offsetX = -(cameraCol * TILE_SIZE);
  const offsetY = -(cameraRow * TILE_SIZE);

  return (
    <div
      className="tilemap"
      style={{
        transform: `translate(${offsetX}px, ${offsetY}px)`,
        width: MAP_COLS * TILE_SIZE,
        height: MAP_ROWS * TILE_SIZE,
      }}
    >
      {MAP.map((row, r) => {
        if (r < startRow || r > endRow) return null;
        return (
          <div
            key={r}
            className="tile-row"
            style={{ position: 'absolute', top: r * TILE_SIZE, left: 0 }}
          >
            {row.map((tileId, c) => {
              if (c < startCol || c > endCol) return null;
              return (
                <div
                  key={c}
                  className={`tile ${TILE_CLASS[tileId] || 'tile-grass'}`}
                  style={{ left: c * TILE_SIZE, position: 'absolute' }}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default TileMap;
