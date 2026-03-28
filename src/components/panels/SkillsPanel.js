import React from 'react';
import { SKILLS } from '../../data/portfolio';

const SkillsPanel = ({ onClose }) => (
  <div className="panel-overlay">
    <div className="panel-window">
      <div className="panel-header">
        <span className="panel-title">TRAINER RED — STATS</span>
        <span className="panel-close-hint">[ESC] CLOSE</span>
      </div>
      <div className="panel-body">
        <div className="panel-section">
          <div className="panel-section-title">SKILL LEVELS</div>
        </div>

        {SKILLS.map(skill => (
          <div key={skill.label} className="panel-section skill-row">
            <div className="skill-label">{skill.label}</div>
            <div className="skill-bar-wrap">
              <div
                className="skill-bar-fill"
                style={{ width: `${skill.value}%` }}
              />
            </div>
            <div className="skill-val">{skill.value}</div>
          </div>
        ))}

        <div className="panel-section">
          <div className="panel-section-title">PROFICIENCY GUIDE</div>
          <div className="panel-section-text">
            90+ ELITE&nbsp;&nbsp;80+ ADVANCED&nbsp;&nbsp;70+ STRONG
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default SkillsPanel;
