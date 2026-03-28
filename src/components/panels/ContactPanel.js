import React from 'react';
import { PERSONAL } from '../../data/portfolio';

const ContactPanel = ({ onClose }) => (
  <div className="panel-overlay">
    <div className="panel-window">
      <div className="panel-header">
        <span className="panel-title">OLD MAN — CONTACT</span>
        <span className="panel-close-hint">[ESC] CLOSE</span>
      </div>
      <div className="panel-body">
        <div className="panel-section">
          <div className="about-name">{PERSONAL.name}</div>
          <div className="about-role">{PERSONAL.role}</div>
        </div>

        <div className="panel-section">
          <div className="panel-section-title">REACH ME</div>
          <div className="contact-line">
            <span className="contact-label">EMAIL</span>
            <span className="contact-val">{PERSONAL.email}</span>
          </div>
          <div className="contact-line">
            <span className="contact-label">GITHUB</span>
            <span className="contact-val">{PERSONAL.githubUser}</span>
          </div>
          <div className="contact-line">
            <span className="contact-label">LINKEDIN</span>
            <span className="contact-val">manikanta-gonugondla</span>
          </div>
        </div>

        <div className="panel-section">
          <div className="panel-section-title">LOCATION</div>
          <div className="panel-section-text">
            {PERSONAL.location}<br />
            {PERSONAL.workLocation}
          </div>
        </div>

        <div className="panel-section">
          <div className="panel-section-title">STATUS</div>
          <div className="panel-section-text">
            <b style={{ color: 'var(--hp-green)' }}>OPEN TO OPPORTUNITIES</b><br />
            Full-time / Internship — Hardware, FPGA, AI/ML
          </div>
        </div>

        <div className="panel-section">
          <div className="panel-section-text" style={{ color: 'var(--panel-dim)' }}>
            {PERSONAL.tagline}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ContactPanel;
