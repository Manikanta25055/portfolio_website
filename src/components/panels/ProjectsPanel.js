import React, { useState } from 'react';
import { PROJECTS } from '../../data/portfolio';

const ProjectsPanel = () => {
  const [selected, setSelected] = useState(null);

  if (selected !== null) {
    const project = PROJECTS[selected];
    return (
      <div className="panel-overlay">
        <div className="panel-window">
          <div className="panel-header">
            <span className="panel-title">POKeDEX ENTRY</span>
            <span className="panel-close-hint">B BUTTON: BACK</span>
          </div>
          <div className="panel-body">
            <div className="panel-section">
              <div className="panel-section-title">{project.title}</div>
              <div className="panel-badge">{project.achievement || 'REGISTERED PROJECT'}</div>
            </div>
            <div className="panel-section">
              <div className="panel-section-title">CATEGORY</div>
              <div className="panel-section-text">{project.subtitle}</div>
            </div>
            <div className="panel-section">
              <div className="panel-section-title">DEX DESCRIPTION</div>
              <div className="panel-section-text">{project.description}</div>
            </div>
            <div className="panel-section">
              <div className="panel-section-title">MOVES / RESULTS</div>
              {project.achievements.map((achievement) => (
                <div key={achievement} className="panel-section-text">{achievement}</div>
              ))}
            </div>
            <div className="panel-section">
              <div className="panel-section-title">TYPE MATCHUP</div>
              <div className="proj-tech-row">
                {project.tech.map((tech) => (
                  <span key={tech} className="proj-tech-tag">{tech}</span>
                ))}
              </div>
            </div>
            {project.github ? (
              <div className="panel-section">
                <div className="panel-section-title">TRAINER PC</div>
                <div className="panel-section-text">{project.github}</div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="panel-overlay">
      <div className="panel-window">
        <div className="panel-header">
          <span className="panel-title">PROF. OAK'S POKeDEX</span>
          <span className="panel-close-hint">B BUTTON: CLOSE</span>
        </div>
        <div className="panel-body">
          <div className="panel-section">
            <div className="panel-section-title">REGISTERED PROJECT MON</div>
            <div className="panel-section-text">Every project is treated like a captured rare entry.</div>
          </div>
          <div className="proj-list">
            {PROJECTS.map((project, i) => (
              <button
                key={project.id}
                className="proj-list-item"
                onClick={() => setSelected(i)}
                type="button"
              >
                <span className="proj-list-num">{String(i + 1).padStart(3, '0')}</span>
                <span className="proj-list-title">{project.title}</span>
                {project.achievement ? <span className="proj-list-badge">★</span> : null}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsPanel;
