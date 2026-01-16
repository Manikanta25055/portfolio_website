import React from 'react';
import { motion } from 'framer-motion';

const Coursework = () => {
  const coursework = [
    { name: "Digital Signal Processing", category: "Core" },
    { name: "Embedded Systems Design", category: "Core" },
    { name: "FPGA Design & Verification", category: "Core" },
    { name: "Control Systems Engineering", category: "Core" },
    { name: "Power Electronics", category: "Core" },
    { name: "VLSI Design", category: "Core" },
    { name: "Circuit Analysis & Design", category: "Core" },
    { name: "Machine Learning", category: "AI/ML" },
    { name: "Computer Vision", category: "AI/ML" }
  ];

  const hardware = [
    { name: "Analog Discovery 3", type: "Test Equipment" },
    { name: "ADALM 1000", type: "Test Equipment" },
    { name: "Raspberry Pi 5", type: "SBC" },
    { name: "ESP32-C6 DevKit", type: "Microcontroller" },
    { name: "ESP32-S3 DevKit", type: "Microcontroller" },
    { name: "Arduino Uno R4 WiFi", type: "Microcontroller" },
    { name: "Nexys A7 FPGA", type: "FPGA" },
    { name: "Hailo 8L AI Accelerator", type: "AI Hardware" },
    { name: "HC-SR04 Ultrasonic", type: "Sensor" },
    { name: "LM741 Op-Amp", type: "IC" },
    { name: "IRFZ44N MOSFET", type: "Component" },
    { name: "PN2907 BJT", type: "Component" },
    { name: "XL6009 DC-DC Converter", type: "Module" },
    { name: "46-in-1 Sensor Kit", type: "Kit" }
  ];

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

        <div className="coursework-grid">
          <motion.div
            className="coursework-category"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3>Relevant Coursework</h3>
            <div className="coursework-items">
              {coursework.map((course, index) => (
                <motion.div
                  key={index}
                  className="coursework-item"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.05 }}
                  whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                >
                  <span className="item-name">{course.name}</span>
                  <span className="item-badge">{course.category}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="coursework-category"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3>Hardware & Kits</h3>
            <div className="coursework-items">
              {hardware.map((hw, index) => (
                <motion.div
                  key={index}
                  className="coursework-item"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.03 }}
                  whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                >
                  <span className="item-name">{hw.name}</span>
                  <span className="item-badge">{hw.type}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Coursework;
