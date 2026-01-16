import React from 'react';
import { motion } from 'framer-motion';

const projects = [
  {
    title: "Project GARUDA",
    subtitle: "AI-Powered Real-Time Security System",
    achievement: "1st Place - Gadget Expo 2025",
    description: "Intelligent home security system featuring real-time AI-based object detection with YOLOv8, multithreaded processing, and hardware integration with Raspberry Pi 5 and Hailo AI accelerator.",
    tech: ["Python", "YOLOv8", "Hailo AI", "Raspberry Pi 5", "GStreamer", "OpenCV"]
  },
  {
    title: "Patient Collapse Detection System",
    subtitle: "Healthcare Innovation",
    achievement: "Patent Filed",
    description: "Non-invasive real-time detection system using multi-modal vital monitoring for biomedical signal monitoring and wearable health technologies.",
    tech: ["Biomedical Sensors", "Wearable Tech", "AI/ML", "Signal Processing"]
  },
  {
    title: "Active Battery Cell Equalization",
    subtitle: "Electric Vehicle Technology",
    achievement: "20-30% Lifespan Increase",
    description: "Flyback converter topology for bidirectional energy transfer in lithium-ion battery packs, extending battery lifespan significantly.",
    tech: ["Power Electronics", "EV Systems", "BMS"]
  },
  {
    title: "Active Suspension System",
    subtitle: "Control Systems Design",
    achievement: "15.24 dB Vibration Reduction",
    description: "PID controller design achieving significant improvements in vibration isolation compared to passive systems.",
    tech: ["Control Systems", "PID", "MATLAB", "Simulink"]
  }
];

const Projects = () => {
  return (
    <section className="projects" id="projects">
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
          Featured Projects
        </motion.h2>

        <div className="projects-grid">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              className={`project-card ${index === 0 ? 'featured' : ''}`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
            >
              <div className="project-badge">{project.achievement}</div>
              <h3>{project.title}</h3>
              <h4>{project.subtitle}</h4>
              <p>{project.description}</p>
              <div className="project-tech">
                {project.tech.map((tech, i) => (
                  <span key={i}>{tech}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Projects;
