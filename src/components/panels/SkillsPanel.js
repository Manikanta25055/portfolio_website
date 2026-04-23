import React from 'react';
import { SKILLS } from '../../data/portfolio';

const SkillsPanel = () => (
  <div className="panel-overlay">
    <div className="panel-window">
      <div className="panel-header">
        <span className="panel-title">POKeMON SUMMARY</span>
        <span className="panel-close-hint">B BUTTON: CLOSE</span>
      </div>
      <div className="panel-body">
        <div className="panel-section">
          <div className="panel-section-title">ASH'S CORE STATS</div>
          <div className="panel-section-text">Skill bars are shown like battle-ready attributes.</div>
        </div>
        {SKILLS.map((skill) => (
          <div key={skill.label} className="panel-section skill-row">
            <div className="skill-label">{skill.label}</div>
            <div className="skill-bar-wrap">
              <div className="skill-bar-fill" style={{ width: `${skill.value}%` }} />
            </div>
            <div className="skill-val">{skill.value}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default SkillsPanel;
