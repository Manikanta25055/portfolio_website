import React from 'react';
import { EXPERIENCE } from '../../data/portfolio';

const ExperiencePanel = () => (
  <div className="panel-overlay">
    <div className="panel-window">
      <div className="panel-header">
        <span className="panel-title">BAG / BADGE CASE</span>
        <span className="panel-close-hint">B BUTTON: CLOSE</span>
      </div>
      <div className="panel-body">
        <div className="panel-section">
          <div className="panel-section-title">FIELD EXPERIENCE</div>
          <div className="panel-section-text">Collected like earned badges across internships and programs.</div>
        </div>
        {EXPERIENCE.map((exp) => (
          <div key={exp.id} className="panel-section exp-entry">
            <div className="exp-header-row">
              <span className="exp-id">{exp.id}</span>
              <span className="exp-status">{exp.status}</span>
            </div>
            <div className="exp-role">{exp.role}</div>
            <div className="exp-company">{exp.company} | {exp.location}</div>
            <div className="exp-period">{exp.period}</div>
            <div className="panel-section-text">{exp.summary}</div>
            <div className="proj-tech-row">
              {exp.skills.map((skill) => (
                <span key={skill} className="proj-tech-tag">{skill}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default ExperiencePanel;
