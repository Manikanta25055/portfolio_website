import React, { useEffect, useState } from 'react';

const TitleScreen = ({ onStart }) => {
  const [fading, setFading] = useState(false);
  const [fadeOpacity, setFadeOpacity] = useState(0);
  const [introPhase, setIntroPhase] = useState(0);
  // 0 = "GVM PRESENTS" fade-in, 1 = title screen

  useEffect(() => {
    const t = setTimeout(() => setIntroPhase(1), 1800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Enter' || e.key === ' ') handleStart();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fading]);

  const handleStart = () => {
    if (fading || introPhase < 1) return;
    setFading(true);
    let op = 0;
    const step = () => {
      op += 0.05;
      setFadeOpacity(Math.min(op, 1));
      if (op < 1) requestAnimationFrame(step);
      else setTimeout(onStart, 100);
    };
    requestAnimationFrame(step);
  };

  if (introPhase === 0) {
    return (
      <div className="title-screen title-intro">
        <div className="title-gvm-presents">GVM PRESENTS</div>
      </div>
    );
  }

  return (
    <div className="title-screen" onClick={handleStart} style={{ cursor: 'pointer' }}>

      {/* Top badge */}
      <div className="title-badge">PALLET TOWN EDITION</div>

      {/* Main logo */}
      <div className="title-logo-block">
        <div className="title-logo-gvm">GVM</div>
        <div className="title-logo-portfolio">PORTFOLIO</div>
      </div>

      {/* PCB / electronics scene */}
      <PCBScene />

      {/* Trainer silhouette */}
      <div className="title-trainer-wrap">
        <TrainerSilhouette />
        <div className="title-trainer-shadow" />
      </div>

      {/* Press enter */}
      <div className="title-press-enter">PRESS ENTER TO PLAY</div>

      {/* Quick links row */}
      <div className="title-links">
        <a
          className="title-link-btn"
          href="https://www.linkedin.com/in/manikanta-gonugondla-349bb729a/"
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
        >
          LINKEDIN
        </a>
        <a
          className="title-link-btn"
          href="https://github.com/Manikanta25055"
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
        >
          GITHUB
        </a>
      </div>

      {/* Footer */}
      <div className="title-footer">
        <span>GONUGONDLA VEERA MANIKANTA</span>
        <span className="title-footer-dot">·</span>
        <span>VER. 2025</span>
      </div>

      {fading && <div className="title-fade" style={{ opacity: fadeOpacity }} />}
    </div>
  );
};

/* ── PCB / Electronics scene ──────────────────────────────── */
const PCBScene = () => (
  <div className="title-pcb">
    {/* PCB board */}
    <div className="pcb-board">
      {/* Trace lines */}
      <div className="pcb-trace pcb-trace-h" style={{ top: 14, left: 0, width: '35%' }} />
      <div className="pcb-trace pcb-trace-h" style={{ top: 14, right: 0, width: '20%' }} />
      <div className="pcb-trace pcb-trace-h" style={{ top: 38, left: '20%', width: '60%' }} />
      <div className="pcb-trace pcb-trace-v" style={{ top: 0, left: '35%', height: 38 }} />
      <div className="pcb-trace pcb-trace-v" style={{ top: 14, right: '20%', height: 50 }} />

      {/* IC Chip — main processor */}
      <div className="pcb-chip" style={{ left: 60, top: 4, width: 50, height: 22 }}>
        <div className="pcb-chip-label">ESP32</div>
        {[0,1,2,3].map(i => <div key={i} className="pcb-pin pcb-pin-t" style={{ left: 6 + i*11 }} />)}
        {[0,1,2,3].map(i => <div key={i} className="pcb-pin pcb-pin-b" style={{ left: 6 + i*11 }} />)}
      </div>

      {/* IC Chip 2 — FPGA */}
      <div className="pcb-chip" style={{ left: 160, top: 22, width: 44, height: 20 }}>
        <div className="pcb-chip-label">FPGA</div>
        {[0,1,2].map(i => <div key={i} className="pcb-pin pcb-pin-t" style={{ left: 8 + i*12 }} />)}
        {[0,1,2].map(i => <div key={i} className="pcb-pin pcb-pin-b" style={{ left: 8 + i*12 }} />)}
      </div>

      {/* Capacitor */}
      <div className="pcb-cap" style={{ left: 14, top: 20 }} />

      {/* Resistors */}
      <div className="pcb-res" style={{ left: 126, top: 36 }} />
      <div className="pcb-res" style={{ left: 220, top: 12 }} />

      {/* LED — blinks */}
      <div className="pcb-led" style={{ left: 246, top: 38 }} />

      {/* Microchip (small) */}
      <div className="pcb-chip" style={{ left: 230, top: 2, width: 22, height: 10 }}>
        {[0,1].map(i => <div key={i} className="pcb-pin pcb-pin-t" style={{ left: 4 + i*10 }} />)}
      </div>
    </div>
  </div>
);

/* ── Trainer silhouette ───────────────────────────────────── */
const TrainerSilhouette = () => (
  <div className="title-trainer">
    {/* Hat */}
    <div className="ts-hat" />
    <div className="ts-brim" />
    {/* Hair */}
    <div className="ts-hair-l" />
    {/* Head */}
    <div className="ts-head" />
    {/* Body */}
    <div className="ts-body" />
    {/* Raised arm (pointing forward) */}
    <div className="ts-arm" />
    {/* Legs */}
    <div className="ts-leg-l" />
    <div className="ts-leg-r" />
  </div>
);

export default TitleScreen;
