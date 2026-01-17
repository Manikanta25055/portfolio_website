import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ProjectModal = ({ project, isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
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
                {project.githubLink && (
                  <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="github-link-btn"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    View on GitHub
                  </a>
                )}
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
