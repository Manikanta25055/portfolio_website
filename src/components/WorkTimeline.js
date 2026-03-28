import React from 'react';

const experiences = [
  {
    id: 'APX-001',
    role: "Project Intern",
    company: "Apsis Solutions",
    location: "Bangalore, IN",
    period: "Jul 2025 – Sep 2025",
    clearance: "ACTIVE",
    skills: ["IoT Development", "Industry Solutions", "Technical Leadership"],
    summary: "IoT solutions for FMCG, banking, supply chain and telecom sectors.",
  },
  {
    id: 'MDN-002',
    role: "Project Intern",
    company: "Mindenious Edutech",
    location: "Bangalore, IN",
    period: "Jul 2025 – Sep 2025",
    clearance: "ACTIVE",
    skills: ["FPGA Validation", "RTL Design", "Test Bench Dev", "ASIC Flow"],
    summary: "VLSI design training — RTL design, verification, synthesis and ASIC design flow.",
  },
  {
    id: 'IIT-003',
    role: "Summer School Participant",
    company: "IIIT Hyderabad",
    location: "Hyderabad, IN",
    period: "Jun 2024 – Jul 2024",
    clearance: "COMPLETED",
    skills: ["Product Development", "Project Management", "Innovation Strategy"],
    summary: "Product Development Management programme — concept to product lifecycle.",
  },
];

const WorkTimeline = () => (
  <div className="dossier-doc">
    {/* Document header */}
    <div className="dossier-header">
      <div className="dossier-header-left">
        <div className="dossier-seal">&#9670;</div>
        <div>
          <div className="dossier-title">PERSONNEL DOSSIER</div>
          <div className="dossier-subtitle">EMPLOYMENT MANIFEST — CONFIDENTIAL</div>
        </div>
      </div>
      <div className="dossier-header-right">
        <div className="dossier-ref">REF: GVM-EXP-2025</div>
        <div className="dossier-date">ISSUED: 2025-07-01</div>
      </div>
    </div>

    <div className="dossier-rule" />

    {/* Subject line */}
    <div className="dossier-subject">
      <span className="dossier-field-label">SUBJECT:</span>
      <span className="dossier-field-val">GONUGONDLA, VEERA MANIKANTA</span>
    </div>
    <div className="dossier-subject">
      <span className="dossier-field-label">DESIGNATION:</span>
      <span className="dossier-field-val">ELECTRICAL &amp; ELECTRONICS ENGINEER</span>
    </div>

    <div className="dossier-rule" />

    {/* Entries */}
    {experiences.map((exp) => (
      <div key={exp.id} className="dossier-entry">
        <div className="dossier-entry-header">
          <span className="dossier-entry-id">{exp.id}</span>
          <span className="dossier-entry-period">{exp.period}</span>
          <span className={`dossier-status dossier-status--${exp.clearance === 'ACTIVE' ? 'active' : 'done'}`}>
            {exp.clearance}
          </span>
        </div>
        <div className="dossier-entry-role">{exp.role}</div>
        <div className="dossier-entry-org">{exp.company} · {exp.location}</div>
        <div className="dossier-entry-summary">{exp.summary}</div>
        <div className="dossier-entry-skills">
          {exp.skills.map((s) => (
            <span key={s} className="dossier-skill">{s}</span>
          ))}
        </div>
      </div>
    ))}

    <div className="dossier-rule" />

    {/* Footer */}
    <div className="dossier-footer">
      <span className="dossier-footer-stamp">VERIFIED</span>
      <span className="dossier-footer-text">GVM PERSONNEL RECORDS — PAGE 1 OF 1</span>
    </div>
  </div>
);

export default WorkTimeline;
