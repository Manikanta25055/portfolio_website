import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Coursework = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const skills = {
    hardware: [
      { name: "FPGA Design & Verification", level: 3 },
      { name: "Embedded Systems", level: 3 },
      { name: "Power Electronics", level: 3 },
      { name: "Circuit Analysis", level: 3 },
      { name: "PCB Design", level: 2 },
      { name: "VLSI Design", level: 2 }
    ],
    software: [
      { name: "Python", level: 3 },
      { name: "Verilog/SystemVerilog", level: 3 },
      { name: "Embedded C", level: 3 },
      { name: "C", level: 2 },
      { name: "Linux", level: 2 },
      { name: "Git", level: 2 }
    ],
    aiml: [
      { name: "YOLOv8", level: 3 },
      { name: "Machine Learning", level: 2 },
      { name: "Computer Vision", level: 3 },
      { name: "AI Deployment", level: 2 },
      { name: "OpenCV", level: 2 },
      { name: "TensorFlow", level: 1 }
    ],
    tools: [
      { name: "MATLAB/Simulink", level: 3 },
      { name: "LTSpice", level: 3 },
      { name: "Vivado", level: 2 },
      { name: "KiCad", level: 2 },
      { name: "GStreamer", level: 2 },
      { name: "PyQt5", level: 2 }
    ]
  };

  const hardware = [
    "Analog Discovery 3",
    "ADALM 1000",
    "Raspberry Pi 5",
    "ESP32-C6/S3 DevKit",
    "Arduino Uno R4 WiFi",
    "Nexys A7 FPGA",
    "Hailo 8L AI Accelerator",
    "46-in-1 Sensor Kit"
  ];

  const categories = [
    { id: 'all', label: 'All Skills' },
    { id: 'hardware', label: 'Hardware' },
    { id: 'software', label: 'Software' },
    { id: 'aiml', label: 'AI/ML' },
    { id: 'tools', label: 'Tools' }
  ];

  const getDisplaySkills = () => {
    if (activeCategory === 'all') {
      return Object.values(skills).flat();
    }
    return skills[activeCategory] || [];
  };

  const getProficiencyDots = (level) => {
    return Array(3).fill(0).map((_, i) => (
      <span
        key={i}
        className={`proficiency-dot ${i < level ? 'active' : ''}`}
      />
    ));
  };

  return (
    <section className="coursework" id="coursework">
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
          Technical Arsenal
        </motion.h2>

        <motion.div
          className="skills-categories"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {categories.map((category) => (
            <motion.button
              key={category.id}
              className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(category.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category.label}
            </motion.button>
          ))}
        </motion.div>

        <motion.div
          className="skills-grid"
          key={activeCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {getDisplaySkills().map((skill, index) => (
            <motion.div
              key={`${skill.name}-${index}`}
              className="skill-card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ y: -4, boxShadow: "0 8px 20px rgba(255, 107, 53, 0.2)" }}
            >
              <span className="skill-name">{skill.name}</span>
              <div className="proficiency-dots">
                {getProficiencyDots(skill.level)}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="tech-section"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="tech-subtitle">Hardware & Development Kits</h3>
          <div className="tech-pills">
            {hardware.map((hw, index) => (
              <motion.span
                key={index}
                className="tech-pill"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.04 }}
                whileHover={{ scale: 1.05, y: -2 }}
              >
                {hw}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Coursework;
