import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ProjectModal from './ProjectModal';

const projects = [
  {
    id: "project-garuda",
    title: "Project GARUDA",
    subtitle: "AI-Powered Real-Time Security System",
    achievement: "1st Place - Gadget Expo 2025",
    description: "Intelligent home security system featuring real-time AI-based object detection with YOLOv8, multithreaded processing, and hardware integration with Raspberry Pi 5 and Hailo AI accelerator.",
    tech: ["Python", "YOLOv8", "Hailo AI", "Raspberry Pi 5", "GStreamer", "OpenCV", "PyQt5"],
    problemStatement: "Traditional security systems lack intelligent real-time threat detection and often generate false alarms. There was a need for an affordable, AI-powered security solution that could accurately detect persons in real-time with minimal latency.",
    solution: "Developed GARUDA, an AI-powered security system using Raspberry Pi 5 with Hailo 8L AI accelerator. Implemented YOLOv8 for person detection with GStreamer pipeline optimization, achieving real-time performance. Added voice-controlled interface using speech recognition and multi-user authentication with OTP verification.",
    keyFeatures: [
      "Real-time person detection using YOLOv8 with Hailo AI acceleration",
      "Multi-threaded processing for camera feed and AI inference",
      "Voice-controlled interface (Narada voice assistant)",
      "Multi-user GUI with OTP-based authentication",
      "Alert system with configurable notifications",
      "Hardware integration with HC-SR04 ultrasonic sensor backup"
    ],
    achievements: [
      { value: "1st Place", label: "IIT Madras Gadget Expo 2025" },
      { value: "<100ms", label: "Detection Latency" },
      { value: "30 FPS", label: "Real-time Processing" }
    ],
    timeline: "January 2025 - April 2025"
  },
  {
    id: "patient-collapse-detection",
    title: "Patient Collapse Detection System",
    subtitle: "Healthcare Innovation",
    achievement: "Patent Filed",
    description: "Non-invasive real-time detection system using multi-modal vital monitoring for biomedical signal monitoring and wearable health technologies.",
    tech: ["Biomedical Sensors", "Wearable Tech", "AI/ML", "Signal Processing", "IoT"],
    problemStatement: "Patient falls and collapses in healthcare facilities often go undetected for critical minutes, leading to delayed emergency response. Existing monitoring systems are either invasive, expensive, or generate high false alarm rates.",
    solution: "Designed a non-invasive patient monitoring system combining multiple vital sign sensors with machine learning algorithms. The system continuously monitors heart rate, respiratory rate, and motion patterns to detect anomalies indicative of patient collapse or distress.",
    keyFeatures: [
      "Multi-modal vital sign monitoring (heart rate, respiration, motion)",
      "Machine learning-based anomaly detection",
      "Non-invasive wearable sensor integration",
      "Real-time alert system to healthcare staff",
      "Low-power design for extended battery life",
      "Privacy-preserving data processing"
    ],
    achievements: [
      { value: "Patent Filed", label: "February 2025" },
      { value: "95%+", label: "Detection Accuracy" },
      { value: "<2s", label: "Alert Response Time" }
    ],
    timeline: "November 2024 - February 2025"
  },
  {
    title: "Active Battery Cell Equalization",
    subtitle: "Electric Vehicle Technology",
    achievement: "20-30% Lifespan Increase",
    description: "Flyback converter topology for bidirectional energy transfer in lithium-ion battery packs, extending battery lifespan significantly.",
    tech: ["Power Electronics", "EV Systems", "BMS", "LTSpice", "Circuit Design"],
    problemStatement: "Lithium-ion battery packs in electric vehicles suffer from cell imbalance, where individual cells charge and discharge at different rates. This reduces overall pack capacity, efficiency, and lifespan.",
    solution: "Implemented an active cell equalization system using flyback converter topology for bidirectional energy transfer between cells. The system monitors individual cell voltages and actively transfers charge from higher voltage cells to lower voltage cells.",
    keyFeatures: [
      "Flyback converter-based bidirectional charge transfer",
      "Individual cell voltage monitoring",
      "Automated balancing algorithm",
      "High efficiency energy transfer (>85%)",
      "Integration with Battery Management System (BMS)"
    ],
    achievements: [
      { value: "20-30%", label: "Battery Life Increase" },
      { value: "85%+", label: "Transfer Efficiency" },
      { value: "15%", label: "Capacity Improvement" }
    ],
    timeline: "August 2024 - November 2024"
  },
  {
    title: "Active Suspension System",
    subtitle: "Control Systems Design",
    achievement: "15.24 dB Vibration Reduction",
    achievement: "15.24 dB Vibration Reduction",
    description: "PID controller design achieving significant improvements in vibration isolation compared to passive systems.",
    tech: ["Control Systems", "PID", "MATLAB", "Simulink", "System Modeling"],
    problemStatement: "Passive suspension systems in vehicles cannot adapt to varying road conditions, resulting in poor ride comfort and handling. There was a need for an intelligent suspension system that could actively respond to road disturbances.",
    solution: "Designed and simulated an active suspension system using PID control methodology in MATLAB/Simulink. The system uses accelerometer feedback to adjust damping forces in real-time, significantly reducing vehicle body vibrations.",
    keyFeatures: [
      "PID controller with optimized tuning parameters",
      "Real-time vibration sensing and actuation",
      "MATLAB/Simulink simulation and validation",
      "Comparative analysis with passive systems",
      "Road disturbance rejection capability"
    ],
    achievements: [
      { value: "15.24 dB", label: "Vibration Reduction" },
      { value: "60%", label: "Settling Time Improvement" },
      { value: "<5%", label: "Steady-State Error" }
    ],
    timeline: "March 2024 - June 2024"
  }
];

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProject(null), 300);
  };

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
              id={project.id}
              className={`project-card ${index === 0 ? 'featured' : ''}`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              onClick={() => handleProjectClick(project)}
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
              <div className="view-details">
                <span>View Details</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </section>
  );
};

export default Projects;
