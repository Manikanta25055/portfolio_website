import React, { useState } from 'react';
import { PROJECTS } from '../../data/portfolio';

const ProjectsPanel = ({ onClose }) => {
  const [selected, setSelected] = useState(null);

  if (selected !== null) {
    const p = PROJECTS[selected];
    return (
      <div className="panel-overlay">
        <div className="panel-window">
          <div className="panel-header">
            <span className="panel-title">{p.title}</span>
            <span className="panel-close-hint">[ESC] BACK</span>
          </div>
          <div className="panel-body">
            <div className="panel-section">
              <div className="panel-section-title">{p.subtitle}</div>
              {p.achievement && (
                <div className="panel-badge">{p.achievement}</div>
              )}
            </div>

            <div className="panel-section">
              <div className="panel-section-title">DESCRIPTION</div>
              <div className="panel-section-text">{p.description}</div>
            </div>

            <div className="panel-section">
              <div className="panel-section-title">ACHIEVEMENTS</div>
              {p.achievements.map((a, i) => (
                <div key={i} className="panel-section-text">
                  &gt;&nbsp;{a}
                </div>
              ))}
            </div>

            <div className="panel-section">
              <div className="panel-section-title">TECH STACK</div>
              <div className="proj-tech-row">
                {p.tech.map(t => (
                  <span key={t} className="proj-tech-tag">{t}</span>
                ))}
              </div>
            </div>

            {p.github && (
              <div className="panel-section">
                <div className="panel-section-title">GITHUB</div>
                <div className="panel-section-text">{p.github}</div>
              </div>
            )}

            <div className="panel-section">
              <div className="panel-section-text" style={{ color: 'var(--panel-dim)' }}>
                PERIOD: {p.period}
              </div>
            </div>

            <div className="panel-nav-hint">
              [SPACE / ESC] BACK TO LIST
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="panel-overlay">
      <div className="panel-window">
        <div className="panel-header">
          <span className="panel-title">OAK'S LAB — PROJECTS</span>
          <span className="panel-close-hint">[ESC] CLOSE</span>
        </div>
        <div className="panel-body">
          <div className="panel-section">
            <div className="panel-section-title">
              CHOOSE A PROJECT — {PROJECTS.length} REGISTERED
            </div>
          </div>
          <div className="proj-list">
            {PROJECTS.map((p, i) => (
              <div
                key={p.id}
                className="proj-list-item"
                onClick={() => setSelected(i)}
              >
                <span className="proj-list-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="proj-list-title">{p.title}</span>
                {p.achievement && (
                  <span className="proj-list-badge">★</span>
                )}
              </div>
            ))}
          </div>
          <div className="panel-nav-hint">[CLICK / ENTER] SELECT</div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsPanel;
