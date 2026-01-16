import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <section className="about" id="about">
      <motion.div
        className="section-container"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          About Me
        </motion.h2>

        <div className="about-grid">
          <motion.div
            className="about-text"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p>
              I'm an Electrical & Electronics Engineer with a passion for bridging hardware and software.
              Currently pursuing a dual degree from Manipal Institute of Technology and IIT Madras,
              I specialize in FPGA design, embedded systems, and deploying machine learning on smart devices.
            </p>
            <p>
              My work spans from designing electronic circuits and programming microcontrollers to
              implementing AI-powered security systems. I've led projects like GARUDA, which won 1st
              place at the Gadget Expo, and filed a patent for healthcare monitoring innovation.
            </p>
            <p>
              Tools I work with include Analog Discovery 3, ADALM 1000, Raspberry Pi, ESP32, and
              Nexys A7 FPGA. I'm always exploring new ways to integrate hardware with intelligent
              software solutions.
            </p>
          </motion.div>

          <motion.div
            className="about-skills"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="skill-category">
              <h3>Languages</h3>
              <div className="skill-list">
                <span>C</span>
                <span>Python</span>
                <span>Verilog</span>
                <span>SystemVerilog</span>
                <span>Embedded C</span>
              </div>
            </div>

            <div className="skill-category">
              <h3>Hardware</h3>
              <div className="skill-list">
                <span>FPGA Design</span>
                <span>Circuit Analysis</span>
                <span>Embedded Systems</span>
                <span>Digital Electronics</span>
              </div>
            </div>

            <div className="skill-category">
              <h3>Tools</h3>
              <div className="skill-list">
                <span>MATLAB</span>
                <span>LT Spice</span>
                <span>NI LabView</span>
                <span>Vivado</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default About;
