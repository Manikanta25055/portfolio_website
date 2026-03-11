import React, { useState, useEffect, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SiliconOrb = lazy(() => import('./SiliconOrb'));

const badges = [
  {
    href: '#about',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
        <path d="M6 12v5c3 3 9 3 12 0v-5"/>
      </svg>
    ),
    value: 'Dual Degree',
    label: 'MIT 8.02 \u2022 IIT-M 7.33',
  },
  {
    href: '#project-garuda',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="8" r="7"/>
        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
      </svg>
    ),
    value: '1st Place Winner',
    label: 'Gadget Expo 2025, IIT Madras',
  },
  {
    href: '#patient-collapse-detection',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
        <path d="M2 17l10 5 10-5"/>
        <path d="M2 12l10 5 10-5"/>
      </svg>
    ),
    value: 'Patent Filed',
    label: 'Healthcare Innovation, MIT',
  },
];

const Hero = () => {
  const [activeBadge, setActiveBadge] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBadge(prev => (prev + 1) % badges.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0, opacity: 1,
      transition: { duration: 0.8, ease: [0.6, 0.05, 0.01, 0.9] }
    }
  };

  return (
    <section className="hero" id="home">
      <div className="hero-orb-model" aria-hidden="true">
        <Suspense fallback={null}>
          <SiliconOrb />
        </Suspense>
      </div>
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
          <span className="name-line">Veera Manikanta</span>
          <span className="name-line gradient-text">Gonugondla</span>
        </motion.h1>

        <motion.p variants={itemVariants} className="hero-role">
          Electrical &amp; Electronics Engineer
        </motion.p>

        <motion.p variants={itemVariants} className="hero-description">
          Building cool stuff where hardware meets software — basically making silicon think.
          <br />
          Deep into FPGAs, embedded systems, and throwing AI at everything electronic.
        </motion.p>

        {/* Desktop: 3 floating cards */}
        <motion.div variants={itemVariants} className="hero-achievements">
          {badges.map((b, i) => (
            <motion.a
              key={i}
              href={b.href}
              className="achievement-badge achievement-badge-link"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="badge-icon">{b.icon}</div>
              <div className="badge-content">
                <span className="badge-value">{b.value}</span>
                <span className="badge-label">{b.label}</span>
              </div>
            </motion.a>
          ))}
        </motion.div>

        {/* Mobile: rotating single card */}
        <motion.div variants={itemVariants} className="hero-badge-carousel">
          <AnimatePresence mode="wait">
            <motion.a
              key={activeBadge}
              href={badges[activeBadge].href}
              className="achievement-badge achievement-badge-link hero-badge-solo"
              initial={{ opacity: 0, scale: 0.88, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.88, y: -18 }}
              transition={{ duration: 0.38, ease: [0.4, 0, 0.2, 1] }}
            >
              <div className="badge-icon">{badges[activeBadge].icon}</div>
              <div className="badge-content">
                <span className="badge-value">{badges[activeBadge].value}</span>
                <span className="badge-label">{badges[activeBadge].label}</span>
              </div>
            </motion.a>
          </AnimatePresence>
          <div className="badge-carousel-dots">
            {badges.map((_, i) => (
              <button
                key={i}
                className={`badge-carousel-dot ${i === activeBadge ? 'active' : ''}`}
                onClick={() => setActiveBadge(i)}
                aria-label={`Badge ${i + 1}`}
              />
            ))}
          </div>
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
        >
          <span>Scroll</span>
          <div className="scroll-line" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
