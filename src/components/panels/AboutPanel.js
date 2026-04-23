import React from 'react';
import { EDUCATION, PERSONAL } from '../../data/portfolio';

const AboutPanel = () => (
  <div className="panel-overlay">
    <div className="panel-window trainer-card">
      <div className="panel-header">
        <span className="panel-title">TRAINER CARD</span>
        <span className="panel-close-hint">B BUTTON: CLOSE</span>
      </div>
      <div className="panel-body">
        <div className="trainer-card-top">
          <div className="trainer-portrait">
            <div className="trainer-cap" />
            <div className="trainer-face" />
            <div className="trainer-jacket" />
          </div>
          <div className="trainer-meta">
            <div className="trainer-name">ASH / {PERSONAL.shortName}</div>
            <div className="trainer-role">{PERSONAL.role}</div>
            <div className="trainer-region">HOME: {PERSONAL.location}</div>
            <div className="trainer-region">CURRENT BASE: {PERSONAL.workLocation}</div>
          </div>
        </div>

        <div className="panel-section">
          <div className="panel-section-title">TRAINER MEMO</div>
          <div className="panel-section-text">{PERSONAL.summary}</div>
        </div>

        {EDUCATION.map((edu) => (
          <div key={edu.shortName} className="panel-section">
            <div className="panel-section-title">{edu.shortName} BADGE DATA</div>
            <div className="panel-section-text">
              {edu.degree}
              <br />
              CGPA {edu.cgpa}/{edu.maxCgpa} | {edu.sem}
              <br />
              STATUS: {edu.status}
              {edu.minor ? <><br />MINOR: {edu.minor}</> : null}
            </div>
          </div>
        ))}

        <div className="panel-section">
          <div className="panel-section-title">POKeNAV LINKS</div>
          <div className="panel-section-text">GITHUB: {PERSONAL.githubUser}</div>
          <div className="panel-section-text">MAIL: {PERSONAL.email}</div>
        </div>
      </div>
    </div>
  </div>
);

export default AboutPanel;
