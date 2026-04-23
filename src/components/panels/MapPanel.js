import React from 'react';
import { T } from '../../game/constants';
import { MAP, MAP_COLS } from '../../game/mapData';

const MINI_COLOR = {
  [T.GRASS]: '#73b84c',
  [T.PATH]: '#d0b068',
  [T.TREE]: '#2f6529',
  [T.WATER]: '#4588e8',
  [T.HOUSE_W]: '#f0e6bf',
  [T.HOUSE_R]: '#d84830',
  [T.HOUSE_D]: '#8e582c',
  [T.LEDGE]: '#896020',
  [T.FLOWER]: '#cb4f52',
  [T.SIGN]: '#d4a65f',
  [T.LAB_W]: '#ddd4ba',
  [T.LAB_R]: '#cf9d3f',
  [T.LAB_D]: '#8e582c',
  [T.GRASS2]: '#599837',
};

const CELL = 8;

const MapPanel = () => (
  <div className="panel-overlay">
    <div className="panel-window map-panel">
      <div className="panel-header">
        <span className="panel-title">TOWN MAP</span>
        <span className="panel-close-hint">B BUTTON: CLOSE</span>
      </div>
      <div className="panel-body">
        <div className="panel-section">
          <div className="panel-section-title">PALLET TOWN</div>
          <div className="panel-section-text">Trainer Ash starts here before heading north to bigger routes.</div>
        </div>
        <div className="town-map-grid">
          {MAP.flat().map((tileId, i) => (
            <div
              key={i}
              className="town-map-cell"
              style={{
                width: CELL,
                height: CELL,
                background: MINI_COLOR[tileId] || '#2f6529',
                gridColumn: `${(i % MAP_COLS) + 1}`,
                gridRow: `${Math.floor(i / MAP_COLS) + 1}`,
              }}
            />
          ))}
        </div>
        <div className="panel-section">
          <div className="panel-section-title">LANDMARKS</div>
          <div className="panel-section-text">House: About | Lab: Projects | PC House: Blog | NPCs: Skills, Contact, Experience</div>
        </div>
      </div>
    </div>
  </div>
);

export default MapPanel;
