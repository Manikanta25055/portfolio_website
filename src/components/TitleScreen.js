import React, { useEffect, useState } from 'react';
import { PERSONAL } from '../data/portfolio';

const TitleScreen = ({ onStart }) => {
  const [fading, setFading] = useState(false);
  const [fadeOpacity, setFadeOpacity] = useState(0);
  const [introPhase, setIntroPhase] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setIntroPhase(1), 1500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleStart();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const handleStart = () => {
    if (fading || introPhase < 1) return;
    setFading(true);
    let opacity = 0;
    const step = () => {
      opacity += 0.06;
      setFadeOpacity(Math.min(opacity, 1));
      if (opacity < 1) {
        requestAnimationFrame(step);
      } else {
        setTimeout(onStart, 120);
      }
    };
    requestAnimationFrame(step);
  };

  if (introPhase === 0) {
    return (
      <div className="title-screen title-intro">
        <div className="title-license-card">
          <div className="title-license-top">NINTENDO STYLE INTRO</div>
          <div className="title-license-main">{PERSONAL.shortName} PRESENTS</div>
          <div className="title-license-sub">ASH KETCHUM PORTFOLIO VERSION</div>
        </div>
      </div>
    );
  }

  return (
    <div className="title-screen" onClick={handleStart} style={{ cursor: 'pointer' }}>
      <div className="title-sky" />
      <div className="title-cloud title-cloud-a" />
      <div className="title-cloud title-cloud-b" />

      <div className="title-logo-wrap">
        <div className="title-logo-kicker">SPECIAL EDITION</div>
        <div className="title-logo-pokemon">PORTFOLIO</div>
        <div className="title-logo-fire">FIRE RED</div>
        <div className="title-logo-tag">Ash Ketchum Journey of Veera Manikanta</div>
      </div>

      <div className="title-stage">
        <div className="title-stage-ground">
          <div className="title-grass-band" />
          <div className="title-path-band" />
        </div>
        <div className="title-stage-trees">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={`title-tree title-tree-${i}`} />
          ))}
        </div>
        <div className="title-stage-buildings">
          <div className="title-home title-house-left">
            <div className="title-roof" />
            <div className="title-wall" />
            <div className="title-door" />
          </div>
          <div className="title-lab">
            <div className="title-lab-roof" />
            <div className="title-lab-wall" />
            <div className="title-door title-lab-door" />
          </div>
          <div className="title-home title-house-right">
            <div className="title-roof" />
            <div className="title-wall" />
            <div className="title-door" />
          </div>
        </div>
        <div className="title-ash">
          <div className="title-ash-shadow" />
          <div className="title-ash-sprite">
            <div className="ash-cap" />
            <div className="ash-face" />
            <div className="ash-hair" />
            <div className="ash-jacket" />
            <div className="ash-jeans" />
            <div className="ash-shoes" />
          </div>
        </div>
      </div>

      <div className="title-ui">
        <div className="title-press-enter">PRESS START</div>
        <div className="title-controls-row">
          <span>ENTER START</span>
          <span>SPACE TALK</span>
          <span>X MENU</span>
        </div>
      </div>

      <div className="title-footer">
        <span>{PERSONAL.name}</span>
        <span>PALLET TOWN</span>
        <span>VER. 2026</span>
      </div>

      {fading && <div className="title-fade" style={{ opacity: fadeOpacity }} />}
    </div>
  );
};

export default TitleScreen;
