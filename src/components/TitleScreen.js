import React, { useEffect, useState } from 'react';

const TitleScreen = ({ onStart }) => {
  const [fading, setFading] = useState(false);
  const [fadeOpacity, setFadeOpacity] = useState(0);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Enter' || e.key === ' ') handleStart();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fading]);

  const handleStart = () => {
    if (fading) return;
    setFading(true);
    // Animate fade to black
    let op = 0;
    const step = () => {
      op += 0.06;
      setFadeOpacity(Math.min(op, 1));
      if (op < 1) requestAnimationFrame(step);
      else setTimeout(onStart, 80);
    };
    requestAnimationFrame(step);
  };

  return (
    <div className="title-screen" onClick={handleStart} style={{ cursor: 'pointer' }}>
      {/* Scanline overlay */}
      <div className="title-logo">
        GVM
        <br />
        PORTFOLIO
      </div>
      <div className="title-sub">PALLET TOWN EDITION</div>

      {/* Pixel art town silhouette */}
      <TitleScene />

      <div className="title-press-enter">PRESS ENTER OR CLICK</div>

      <div className="title-version">VER. 2025</div>
      <div className="title-copyright">
        &copy; GONUGONDLA VEERA MANIKANTA &nbsp;&#8226;&nbsp; HYDERABAD, INDIA
      </div>

      {/* Fade overlay */}
      {fading && (
        <div
          className="title-fade"
          style={{ opacity: fadeOpacity }}
        />
      )}
    </div>
  );
};

/* CSS-drawn pixel art scene — 3 trees, player house, lab, rival house */
const TitleScene = () => (
  <div className="title-scene">
    {/* Tree left */}
    <div className="title-tree">
      <div className="title-tree-top" style={{ width: 20, height: 28 }} />
      <div className="title-tree-trunk" style={{ width: 6, height: 8 }} />
    </div>

    {/* Player's House */}
    <div className="title-house" style={{ position: 'relative' }}>
      {/* roof */}
      <div className="title-house-roof" style={{ width: 44, height: 14 }} />
      {/* wall */}
      <div className="title-house-wall" style={{ width: 44, height: 22, position: 'relative' }}>
        {/* window */}
        <div style={{
          position: 'absolute', top: 4, left: 4,
          width: 10, height: 8,
          background: 'var(--house-win)',
          border: '2px solid rgba(0,0,0,0.25)'
        }} />
        {/* door */}
        <div style={{
          position: 'absolute', bottom: 0, right: 8,
          width: 10, height: 14,
          background: 'var(--house-door)',
          border: '1px solid rgba(0,0,0,0.3)',
          borderBottom: 'none',
        }} />
      </div>
    </div>

    {/* Tree middle */}
    <div className="title-tree">
      <div className="title-tree-top" style={{ width: 22, height: 32 }} />
      <div className="title-tree-trunk" style={{ width: 8, height: 10 }} />
    </div>

    {/* Oak's Lab (wider, taller) */}
    <div className="title-lab" style={{ position: 'relative' }}>
      <div className="title-lab-roof" style={{ width: 72, height: 16 }} />
      <div className="title-lab-wall" style={{ width: 72, height: 32, position: 'relative' }}>
        {/* 2 windows */}
        <div style={{
          position: 'absolute', top: 5, left: 6,
          width: 14, height: 10,
          background: 'var(--house-win)',
          border: '2px solid rgba(0,0,0,0.2)',
        }} />
        <div style={{
          position: 'absolute', top: 5, right: 6,
          width: 14, height: 10,
          background: 'var(--house-win)',
          border: '2px solid rgba(0,0,0,0.2)',
        }} />
        {/* door */}
        <div style={{
          position: 'absolute', bottom: 0, left: '50%',
          transform: 'translateX(-50%)',
          width: 14, height: 20,
          background: 'var(--house-door)',
          border: '1px solid rgba(0,0,0,0.3)',
          borderBottom: 'none',
        }} />
      </div>
    </div>

    {/* Tree right */}
    <div className="title-tree">
      <div className="title-tree-top" style={{ width: 20, height: 26 }} />
      <div className="title-tree-trunk" style={{ width: 6, height: 8 }} />
    </div>

    {/* Rival's House */}
    <div className="title-house" style={{ position: 'relative' }}>
      <div className="title-house-roof" style={{ width: 44, height: 14 }} />
      <div className="title-house-wall" style={{ width: 44, height: 22, position: 'relative' }}>
        <div style={{
          position: 'absolute', top: 4, right: 4,
          width: 10, height: 8,
          background: 'var(--house-win)',
          border: '2px solid rgba(0,0,0,0.25)'
        }} />
        <div style={{
          position: 'absolute', bottom: 0, left: 8,
          width: 10, height: 14,
          background: 'var(--house-door)',
          border: '1px solid rgba(0,0,0,0.3)',
          borderBottom: 'none',
        }} />
      </div>
    </div>

    {/* Tree far right */}
    <div className="title-tree">
      <div className="title-tree-top" style={{ width: 20, height: 28 }} />
      <div className="title-tree-trunk" style={{ width: 6, height: 8 }} />
    </div>
  </div>
);

export default TitleScreen;
