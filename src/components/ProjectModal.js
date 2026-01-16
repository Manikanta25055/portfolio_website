import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ProjectModal = ({ project, isOpen, onClose }) => {
  if (!project) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="modal-container"
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ duration: 0.3 }}
          >
            <button className="modal-close" onClick={onClose}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>

            <div className="modal-content">
              <div className="modal-header">
                <span className="modal-badge">{project.achievement}</span>
                <h2>{project.title}</h2>
                <h3>{project.subtitle}</h3>
              </div>

              {project.problemStatement && (
                <div className="modal-section">
                  <h4>Problem Statement</h4>
                  <p>{project.problemStatement}</p>
                </div>
              )}

              {project.solution && (
                <div className="modal-section">
                  <h4>Solution</h4>
                  <p>{project.solution}</p>
                </div>
              )}

              {project.keyFeatures && (
                <div className="modal-section">
                  <h4>Key Features</h4>
                  <ul className="modal-list">
                    {project.keyFeatures.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}

              {project.achievements && (
                <div className="modal-section">
                  <h4>Achievements</h4>
                  <div className="achievements-grid">
                    {project.achievements.map((achievement, index) => (
                      <div key={index} className="achievement-item">
                        <div className="achievement-value">{achievement.value}</div>
                        <div className="achievement-label">{achievement.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {project.timeline && (
                <div className="modal-section">
                  <h4>Timeline</h4>
                  <p>{project.timeline}</p>
                </div>
              )}

              <div className="modal-section">
                <h4>Technologies Used</h4>
                <div className="modal-tech">
                  {project.tech.map((tech, index) => (
                    <span key={index} className="modal-tech-pill">{tech}</span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProjectModal;
