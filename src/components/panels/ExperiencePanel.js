import React from 'react';
import { EXPERIENCE } from '../../data/portfolio';

const STATUS_COLOR = {
  COMPLETED: 'var(--panel-dim)',
  ACTIVE: 'var(--hp-green)',
};

const ExperiencePanel = ({ onClose }) => (
  <div className="panel-overlay">
    <div className="panel-window">
      <div className="panel-header">
        <span className="panel-title">TOURIST — EXPERIENCE</span>
        <span className="panel-close-hint">[ESC] CLOSE</span>
      </div>
      <div className="panel-body">
        <div className="panel-section">
          <div className="panel-section-title">
            WORK HISTORY — {EXPERIENCE.length} ENTRIES
          </div>
        </div>

        {EXPERIENCE.map(exp => (
          <div key={exp.id} className="panel-section exp-entry">
            <div className="exp-header-row">
              <span className="exp-id">{exp.id}</span>
              <span
                className="exp-status"
                style={{ color: STATUS_COLOR[exp.status] || 'var(--panel-dim)' }}
              >
                {exp.status}
              </span>
            </div>
            <div className="exp-role">{exp.role}</div>
            <div className="exp-company">
              {exp.company}&nbsp;&nbsp;|&nbsp;&nbsp;{exp.location}
            </div>
            <div className="exp-period">{exp.period}</div>
            <div className="panel-section-text" style={{ marginTop: 4 }}>
              {exp.summary}
            </div>
            <div className="proj-tech-row" style={{ marginTop: 6 }}>
              {exp.skills.map(s => (
                <span key={s} className="proj-tech-tag">{s}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default ExperiencePanel;
