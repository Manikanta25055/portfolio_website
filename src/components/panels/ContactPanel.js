import React from 'react';
import { PERSONAL } from '../../data/portfolio';

const ContactPanel = () => (
  <div className="panel-overlay">
    <div className="panel-window">
      <div className="panel-header">
        <span className="panel-title">SAVE / CONTACT</span>
        <span className="panel-close-hint">B BUTTON: CLOSE</span>
      </div>
      <div className="panel-body">
        <div className="panel-section">
          <div className="panel-section-title">TRAINER STATUS</div>
          <div className="panel-section-text">ASH is ready for internships, projects, and full-time roles.</div>
        </div>
        <div className="panel-section">
          <div className="panel-section-title">SAVE DESTINATION</div>
          <div className="panel-section-text">EMAIL: {PERSONAL.email}</div>
          <div className="panel-section-text">GITHUB: {PERSONAL.githubUser}</div>
          <div className="panel-section-text">LINKEDIN: manikanta-gonugondla</div>
        </div>
        <div className="panel-section">
          <div className="panel-section-title">TRAINER NOTE</div>
          <div className="panel-section-text">{PERSONAL.tagline}</div>
        </div>
      </div>
    </div>
  </div>
);

export default ContactPanel;
