import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.6, 0.05, 0.01, 0.9]
      }
    }
  };

  return (
    <section className="hero" id="home">
      <motion.div
        className="hero-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="hero-tag">
          <span className="pulse-dot" />
          <span>Boeing Intern 2026</span>
        </motion.div>

        <motion.h1 variants={itemVariants} className="hero-name">
          <span className="name-line">Manikanta</span>
          <span className="name-line gradient-text">Gonugondla</span>
        </motion.h1>

        <motion.p variants={itemVariants} className="hero-role">
          Electrical & Electronics Engineer
        </motion.p>

        <motion.p variants={itemVariants} className="hero-description">
          Building cool stuff where hardware meets software - basically making silicon think.
          <br />
          Deep into FPGAs, embedded systems, and throwing AI at everything electronic.
        </motion.p>

        <motion.div variants={itemVariants} className="hero-achievements">
          <motion.a
            href="#about"
            className="achievement-badge achievement-badge-link"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="badge-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                <path d="M6 12v5c3 3 9 3 12 0v-5"/>
              </svg>
            </div>
            <div className="badge-content">
              <span className="badge-value">Dual Degree</span>
              <span className="badge-label">MIT 8.01 • IIT-M 7.33</span>
            </div>
          </motion.a>

          <motion.a
            href="#project-garuda"
            className="achievement-badge achievement-badge-link"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="badge-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="8" r="7"/>
                <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
              </svg>
            </div>
            <div className="badge-content">
              <span className="badge-value">1st Place Winner</span>
              <span className="badge-label">Gadget Expo 2025, IIT Madras</span>
            </div>
          </motion.a>

          <motion.a
            href="#patient-collapse-detection"
            className="achievement-badge achievement-badge-link"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="badge-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div className="badge-content">
              <span className="badge-value">Patent Filed</span>
              <span className="badge-label">Healthcare Innovation, MIT</span>
            </div>
          </motion.a>
        </motion.div>

        <motion.div variants={itemVariants} className="hero-cta">
          <motion.a
            href="#projects"
            className="cta-primary"
            whileHover={{ scale: 1.05, x: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            View Work
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </motion.a>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="scroll-indicator"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <span>Scroll</span>
          <div className="scroll-line" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
