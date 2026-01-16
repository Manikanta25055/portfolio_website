import React from 'react';
import { motion } from 'framer-motion';

const WorkTimeline = () => {
  const experiences = [
    {
      role: "Project Intern - IoT Solutions",
      company: "Apsis Solutions",
      location: "Bangalore, India",
      period: "July 2025 - Present",
      current: true,
      description: "Developing IoT solutions and providing mentorship for FMCG, Banking, Financial, Supply Chain & Telecom industries.",
      skills: ["IoT Development", "Industry Solutions", "Mentorship"],
      color: "#FF6B35"
    },
    {
      role: "Project Intern - VLSI Design",
      company: "Mindenious Edutech",
      location: "Bangalore, India",
      period: "July 2025 - Present",
      current: true,
      description: "VLSI design training with focus on FPGA validation, test bench development, RTL design, verification, synthesis, and ASIC design flow.",
      skills: ["FPGA Validation", "RTL Design", "Test Bench Development", "ASIC Design Flow"],
      color: "#0A66C2"
    },
    {
      role: "Summer School Participant",
      company: "IIIT Hyderabad",
      location: "Hyderabad, India",
      period: "June 2024 - July 2024",
      description: "Product Development Management program focusing on systematic approach to product innovation and development.",
      skills: ["Product Development", "Project Management", "Innovation"],
      color: "#34C759"
    }
  ];

  return (
    <section className="work-timeline" id="experience">
      <motion.div
        className="section-container"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Work Experience
        </motion.h2>

        <div className="timeline">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              className="timeline-item"
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <div className="timeline-marker" style={{ borderColor: exp.color }}>
                <div className="timeline-dot" style={{ background: exp.color }}></div>
              </div>
              <motion.div
                className="timeline-content"
                whileHover={{ y: -5, boxShadow: `0 12px 32px ${exp.color}20` }}
                transition={{ duration: 0.3 }}
              >
                {exp.current && <div className="current-badge">Current</div>}
                <h3 style={{ color: exp.color }}>{exp.role}</h3>
                <h4>{exp.company}</h4>
                <div className="timeline-meta">
                  <span className="timeline-location">{exp.location}</span>
                  <span className="timeline-period">{exp.period}</span>
                </div>
                <p>{exp.description}</p>
                <div className="timeline-skills">
                  {exp.skills.map((skill, idx) => (
                    <span key={idx} className="timeline-skill">{skill}</span>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default WorkTimeline;
