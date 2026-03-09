import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SHORTCUTS } from '../hooks/useKeyboardShortcuts';

const KeyboardHint = ({ isVisible, onClose }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="kb-hint"
          initial={{ opacity: 0, y: 12, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.96 }}
          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className="kb-hint-header">
            <span className="kb-hint-title">Keyboard shortcuts</span>
            <button className="kb-hint-close" onClick={onClose} aria-label="Close">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <div className="kb-hint-list">
            {SHORTCUTS.map((s) => (
              <div key={s.key} className="kb-hint-row">
                <kbd className="kb-key">{s.label}</kbd>
                <span className="kb-desc">{s.description}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default KeyboardHint;
