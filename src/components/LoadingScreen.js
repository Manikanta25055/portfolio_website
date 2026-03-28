import React, { useState, useEffect, useRef } from 'react';

const BOOT_LINES = [
  '> INITIALIZING GVM PORTFOLIO v2025...',
  '> LOADING PALLET TOWN MAP DATA [24x20]...',
  '> CALIBRATING FPGA BITSTREAM...    [OK]',
  '> SPAWNING TRAINER + 5 NPCs...     [OK]',
  '> PRESS START 2P FONT LOADED...    [OK]',
  '> RENDERING PIXEL ART SPRITES...   [OK]',
  '> ALL SYSTEMS NOMINAL.',
];

const LoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [lineCount, setLineCount] = useState(0);
  const [done, setDone] = useState(false);
  const progressRef = useRef(0);
  const completedRef = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (completedRef.current) return;

      // Random-ish increment so it feels organic
      const inc = Math.random() * 2.8 + 0.5;
      progressRef.current = Math.min(progressRef.current + inc, 100);
      const p = Math.floor(progressRef.current);

      setProgress(p);
      setLineCount(Math.min(
        Math.floor((p / 100) * BOOT_LINES.length),
        BOOT_LINES.length
      ));

      if (progressRef.current >= 100) {
        completedRef.current = true;
        clearInterval(interval);
        setDone(true);
        setTimeout(onComplete, 900);
      }
    }, 55);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="loading-screen">
      <div className="ls-crt" />

      {/* Pixel avatar block */}
      <div className="ls-avatar-block">
        <PixelAvatar />
        <div className="ls-avatar-label">GVM.EXE</div>
      </div>

      {/* Terminal */}
      <div className="ls-terminal">
        <div className="ls-term-header">
          <span className="ls-dot ls-dot-r" />
          <span className="ls-dot ls-dot-y" />
          <span className="ls-dot ls-dot-g" />
          <span className="ls-term-title">BOOT SEQUENCE</span>
        </div>
        <div className="ls-term-body">
          {BOOT_LINES.slice(0, lineCount).map((line, i) => (
            <div key={i} className="ls-line">{line}</div>
          ))}
          {!done && <span className="ls-cursor">_</span>}
        </div>
      </div>

      {/* Progress bar */}
      <div className="ls-bar-wrap">
        <div className="ls-bar-track">
          <div className="ls-bar-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="ls-bar-pct">{progress}%</div>
      </div>

      {done && (
        <div className="ls-ready">ALL SYSTEMS READY</div>
      )}
    </div>
  );
};

/* ── CSS pixel art GVM avatar (Ash-inspired) ── */
const PixelAvatar = () => (
  <div className="lsa-wrap">
    <div className="lsa-hat" />
    <div className="lsa-brim" />
    <div className="lsa-hair-l" />
    <div className="lsa-hair-r" />
    <div className="lsa-face" />
    <div className="lsa-eye-l" />
    <div className="lsa-eye-r" />
    <div className="lsa-jacket" />
    <div className="lsa-collar" />
    <div className="lsa-leg-l" />
    <div className="lsa-leg-r" />
  </div>
);

export default LoadingScreen;
