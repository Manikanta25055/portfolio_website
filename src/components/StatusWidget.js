import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const StatusWidget = () => {
  const [dismissed, setDismissed] = useState(false);

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          className="status-widget"
          initial={{ opacity: 0, y: 16, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.92, transition: { duration: 0.25 } }}
          transition={{ delay: 4.2, duration: 0.4, ease: [0.34, 1.2, 0.64, 1] }}
        >
          <div className="status-widget-dot" />
          <div className="status-widget-text">
            <span className="status-widget-eyebrow">Currently hacking on</span>
            <span className="status-widget-title">Portfolio Breadth Expansion</span>
          </div>
          <button
            className="status-widget-dismiss"
            onClick={() => setDismissed(true)}
            aria-label="Dismiss"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StatusWidget;
