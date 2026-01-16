import React from 'react';
import { motion } from 'framer-motion';

const Coursework = () => {
  const coursework = [
    "Digital Signal Processing",
    "Embedded Systems Design",
    "FPGA Design & Verification",
    "Control Systems Engineering",
    "Power Electronics",
    "VLSI Design",
    "Circuit Analysis & Design",
    "Machine Learning",
    "Computer Vision"
  ];

  const hardware = [
    "Analog Discovery 3",
    "ADALM 1000",
    "Raspberry Pi 5",
    "ESP32-C6 DevKit",
    "ESP32-S3 DevKit",
    "Arduino Uno R4 WiFi",
    "Nexys A7 FPGA",
    "Hailo 8L AI Accelerator",
    "HC-SR04 Ultrasonic",
    "LM741 Op-Amp",
    "IRFZ44N MOSFET",
    "PN2907 BJT",
    "XL6009 DC-DC Converter",
    "46-in-1 Sensor Kit"
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

        <div className="tech-container">
          <motion.div
            className="tech-section"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="tech-subtitle">Relevant Coursework</h3>
            <div className="tech-pills">
              {coursework.map((course, index) => (
                <motion.span
                  key={index}
                  className="tech-pill"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.3 + index * 0.03 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                >
                  {course}
                </motion.span>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="tech-section"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="tech-subtitle">Hardware & Kits</h3>
            <div className="tech-pills">
              {hardware.map((hw, index) => (
                <motion.span
                  key={index}
                  className="tech-pill"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.02 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                >
                  {hw}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Coursework;
