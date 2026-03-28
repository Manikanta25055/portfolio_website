import React from 'react';
import { MAP, MAP_COLS, MAP_ROWS } from '../../game/mapData';
import { T } from '../../game/constants';

// Tile → minimap color
const MINI_COLOR = {
  [T.GRASS]:   '#78C840',
  [T.PATH]:    '#D8B870',
  [T.TREE]:    '#305830',
  [T.WATER]:   '#3878F8',
  [T.HOUSE_W]: '#F0E8B0',
  [T.HOUSE_R]: '#D82020',
  [T.HOUSE_D]: '#884418',
  [T.LEDGE]:   '#8B6914',
  [T.FLOWER]:  '#78C840',
  [T.SIGN]:    '#D8B870',
  [T.LAB_W]:   '#E8E0C8',
  [T.LAB_R]:   '#C89830',
  [T.LAB_D]:   '#884418',
  [T.GRASS2]:  '#50A030',
};

const CELL = 8; // pixels per map tile in minimap

const MapPanel = ({ onClose }) => (
  <div className="panel-overlay">
    <div className="panel-window">
      <div className="panel-header">
        <span className="panel-title">PALLET TOWN</span>
        <span className="panel-close-hint">[ESC] CLOSE</span>
      </div>
      <div className="panel-body" style={{ display: 'flex', justifyContent: 'center', paddingTop: 12 }}>
        <div style={{ position: 'relative' }}>
          {/* Minimap grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${MAP_COLS}, ${CELL}px)`,
              gridTemplateRows:    `repeat(${MAP_ROWS}, ${CELL}px)`,
              border: '3px solid var(--dialog-border)',
              imageRendering: 'pixelated',
            }}
          >
            {MAP.flat().map((tileId, i) => (
              <div
                key={i}
                style={{
                  width: CELL,
                  height: CELL,
                  background: MINI_COLOR[tileId] || '#305830',
                }}
              />
            ))}
          </div>

          {/* Location labels */}
          <div style={{ marginTop: 10 }}>
            <div className="panel-section-title">LOCATIONS</div>
            <div className="map-legend">
              <span className="map-dot" style={{ background: '#D82020' }} />
              <span className="map-legend-text">PLAYER'S HOUSE</span>
            </div>
            <div className="map-legend">
              <span className="map-dot" style={{ background: '#C89830' }} />
              <span className="map-legend-text">OAK'S LAB</span>
            </div>
            <div className="map-legend">
              <span className="map-dot" style={{ background: '#F0E8B0' }} />
              <span className="map-legend-text">RIVAL'S HOUSE</span>
            </div>
            <div className="map-legend">
              <span className="map-dot" style={{ background: '#3878F8' }} />
              <span className="map-legend-text">SOUTH OCEAN</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default MapPanel;
