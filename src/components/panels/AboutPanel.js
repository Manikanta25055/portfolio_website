import React from 'react';
import { PERSONAL, EDUCATION } from '../../data/portfolio';

const AboutPanel = ({ onClose }) => (
  <div className="panel-overlay">
    <div className="panel-window">
      <div className="panel-header">
        <span className="panel-title">PLAYER INFO</span>
        <span className="panel-close-hint">[ESC] CLOSE</span>
      </div>
      <div className="panel-body">
        <div className="panel-section">
          <div className="about-name">{PERSONAL.name}</div>
          <div className="about-role">{PERSONAL.role}</div>
          <div className="stat-row">
            <div className="stat-box">
              <div className="stat-box-label">MIT CGPA</div>
              <div className="stat-box-val">{EDUCATION[0].cgpa}</div>
            </div>
            <div className="stat-box">
              <div className="stat-box-label">IIT-M CGPA</div>
              <div className="stat-box-val">{EDUCATION[1].cgpa}</div>
            </div>
            <div className="stat-box">
              <div className="stat-box-label">PATENT</div>
              <div className="stat-box-val" style={{ fontSize: 7 }}>FILED</div>
            </div>
          </div>
        </div>

        <div className="panel-section">
          <div className="panel-section-title">BIO</div>
          <div className="panel-section-text">{PERSONAL.summary}</div>
        </div>

        {EDUCATION.map(edu => (
          <div key={edu.shortName} className="panel-section">
            <div className="panel-section-title">{edu.shortName}</div>
            <div className="panel-section-text">
              <b>{edu.degree}</b><br />
              CGPA: <b>{edu.cgpa}</b> / {edu.maxCgpa} &nbsp;|&nbsp; {edu.sem}<br />
              {edu.minor && <>MINOR: <b>{edu.minor}</b><br /></>}
              STATUS: <b style={{ color: 'var(--hp-green)' }}>{edu.status}</b>
            </div>
          </div>
        ))}

        <div className="panel-section">
          <div className="panel-section-title">LOCATION</div>
          <div className="panel-section-text">
            <b>{PERSONAL.location}</b><br />
            {PERSONAL.workLocation}
          </div>
        </div>

        <div className="panel-section">
          <div className="panel-section-title">LINKS</div>
          <div className="contact-line">
            <span className="contact-label">GITHUB</span>
            <span className="contact-val">{PERSONAL.githubUser}</span>
          </div>
          <div className="contact-line">
            <span className="contact-label">EMAIL</span>
            <span className="contact-val">{PERSONAL.email}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default AboutPanel;
