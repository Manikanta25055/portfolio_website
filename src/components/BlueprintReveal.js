import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BOOT_LINES = [
  { text: '> BOOTING PORTFOLIO_OS v2.6 ...', delay: 0.1 },
  { text: '> LOADING FPGA MODULES ... OK', delay: 0.4 },
  { text: '> NEURAL LINK ... ESTABLISHED', delay: 0.7 },
  { text: '> RENDERING WORLD MAP ...', delay: 1.0 },
];

const BlueprintReveal = ({ onComplete }) => {
  const [phase, setPhase] = useState('boot'); // boot -> unfold -> done

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('unfold'), 1800);
    const t2 = setTimeout(() => {
      setPhase('done');
      onComplete?.();
    }, 3400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          key="blueprint"
          className="blueprint-overlay"
          exit={{ opacity: 0, transition: { duration: 0.5, ease: 'easeOut' } }}
        >
          {/* Blueprint grid background */}
          <div className="blueprint-grid" />

          {/* CRT scanlines */}
          <div className="blueprint-scanlines" />

          {/* Corner labels */}
          <div className="bp-corner bp-corner--tl">
            <span className="bp-bracket">+-</span>
            <span className="bp-label">SYS_INIT</span>
          </div>
          <div className="bp-corner bp-corner--tr">
            <span className="bp-label">17.385N / 78.486E</span>
            <span className="bp-bracket">-+</span>
          </div>
          <div className="bp-corner bp-corner--br">
            <span className="bp-label">MIT · IIT-M</span>
            <span className="bp-bracket">-+</span>
          </div>

          {/* Boot log lines */}
          {phase === 'boot' && (
            <div className="bp-boot-log">
              {BOOT_LINES.map((line, i) => (
                <motion.p
                  key={i}
                  className="bp-log-line"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 0.75, x: 0 }}
                  transition={{ delay: line.delay, duration: 0.28 }}
                >
                  {line.text}
                </motion.p>
              ))}
            </div>
          )}

          {/* Name / title */}
          <div className="bp-title-block">
            <motion.div
              className="bp-name-label"
              initial={{ opacity: 0, letterSpacing: '0.5em' }}
              animate={{ opacity: 1, letterSpacing: '0.28em' }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              GONUGONDLA
            </motion.div>
            <motion.h1
              className="bp-name"
              initial={{ opacity: 0, y: 20, letterSpacing: '0.4em' }}
              animate={{ opacity: 1, y: 0, letterSpacing: '-0.02em' }}
              transition={{ delay: 0.55, duration: 0.9 }}
            >
              Veera Manikanta
            </motion.h1>
            <motion.p
              className="bp-role"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.6 }}
            >
              <span className="bp-bracket-inline">[</span>
              Electrical &amp; Electronics Engineer
              <span className="bp-bracket-inline">]</span>
            </motion.p>
          </div>

          {/* Unfolding mask - expands outward during 'unfold' phase */}
          {phase === 'unfold' && (
            <motion.div
              className="bp-unfold-mask"
              initial={{ clipPath: 'inset(45% 48% round 4px)' }}
              animate={{ clipPath: 'inset(0% 0% round 0px)' }}
              transition={{ duration: 1.4, ease: [0.4, 0, 0.2, 1] }}
            />
          )}

          {/* Progress bar */}
          <div className="bp-progress-track">
            <motion.div
              className="bp-progress-fill"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.05, duration: 3.2, ease: [0.4, 0, 0.2, 1] }}
            />
          </div>

          {/* Orange anchor dot */}
          <motion.div
            className="bp-dot-anchor"
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.34, 1.2, 0.64, 1] }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BlueprintReveal;
