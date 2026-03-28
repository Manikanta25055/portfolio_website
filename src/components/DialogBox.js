import React, { useState, useEffect, useRef } from 'react';

const CHARS_PER_TICK = 2;
const TICK_MS = 35;

const DialogBox = ({ dialog, speaker, onAdvance, onClose }) => {
  const [lineIndex, setLineIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [typing, setTyping] = useState(true);
  const timerRef = useRef(null);
  const fullText = dialog[lineIndex] || '';

  // Start/reset typewriter when line changes
  useEffect(() => {
    setDisplayed('');
    setTyping(true);
    let i = 0;
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      i += CHARS_PER_TICK;
      if (i >= fullText.length) {
        setDisplayed(fullText);
        setTyping(false);
        clearInterval(timerRef.current);
      } else {
        setDisplayed(fullText.slice(0, i));
      }
    }, TICK_MS);
    return () => clearInterval(timerRef.current);
  }, [lineIndex, fullText]);

  // Handle advance (Space/Enter)
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== ' ' && e.key !== 'Enter') return;
      e.preventDefault();

      if (typing) {
        // Skip typewriter — show full line
        clearInterval(timerRef.current);
        setDisplayed(fullText);
        setTyping(false);
        return;
      }

      // Advance to next line or close
      if (lineIndex < dialog.length - 1) {
        setLineIndex(prev => prev + 1);
      } else {
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [typing, lineIndex, dialog, fullText, onClose]);

  return (
    <div className="dialog-box">
      <div className="dialog-speaker">{speaker || ''}</div>
      <div className="dialog-text">{displayed}</div>
      {!typing && (
        lineIndex < dialog.length - 1
          ? <div className="dialog-advance">&#9660;</div>
          : <div className="dialog-hint">[SPACE] CLOSE</div>
      )}
    </div>
  );
};

export default DialogBox;
