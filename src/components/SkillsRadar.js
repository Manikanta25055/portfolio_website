import React, { useRef, useState, useEffect, Suspense, lazy } from 'react';
import { motion } from 'framer-motion';

const OscilloscopeWave = lazy(() => import('./OscilloscopeWave'));

const skills = [
  { label: 'Embedded Systems', value: 92 },
  { label: 'FPGA / RTL',       value: 85 },
  { label: 'AI / ML',          value: 78 },
  { label: 'Signal Processing', value: 82 },
  { label: 'Power Electronics', value: 72 },
  { label: 'Software Dev',      value: 68 },
];

const W = 320;
const CX = W / 2;
const CY = W / 2;
const R = 105;
const LEVELS = 4;
const N = skills.length;
const ANGLE_STEP = 360 / N;

function pt(angleDeg, radius) {
  const rad = (angleDeg - 90) * (Math.PI / 180);
  return { x: CX + radius * Math.cos(rad), y: CY + radius * Math.sin(rad) };
}

function polyPoints() {
  return skills
    .map((s, i) => {
      const p = pt(i * ANGLE_STEP, (s.value / 100) * R);
      return `${p.x},${p.y}`;
    })
    .join(' ');
}

function getLabelAnchor(angle) {
  const a = ((angle % 360) + 360) % 360;
  if (a > 30 && a < 150) return 'start';
  if (a > 210 && a < 330) return 'end';
  return 'middle';
}

const SkillsRadar = () => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="skills-radar" id="skills" ref={ref}>
      <div className="section-container">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Skills Overview
        </motion.h2>

        <div className="radar-wrapper">
          {/* Oscilloscope wave 3D - represents signal processing / EE work */}
          <div className="radar-neural-panel" aria-hidden="true">
            <Suspense fallback={null}>
              <OscilloscopeWave />
            </Suspense>
            <p className="radar-neural-label">Signal Analysis</p>
          </div>

          {/* SVG radar chart */}
          <div className="radar-chart-area">
            <svg viewBox={`0 0 ${W} ${W}`} className="radar-svg">
              {/* Grid level polygons */}
              {Array.from({ length: LEVELS }, (_, lvl) => {
                const r = R * ((lvl + 1) / LEVELS);
                const pts = skills
                  .map((_, i) => { const p = pt(i * ANGLE_STEP, r); return `${p.x},${p.y}`; })
                  .join(' ');
                return (
                  <polygon
                    key={lvl}
                    points={pts}
                    fill="none"
                    stroke="rgba(255,255,255,0.07)"
                    strokeWidth="1"
                  />
                );
              })}

              {/* Axis lines */}
              {skills.map((_, i) => {
                const end = pt(i * ANGLE_STEP, R);
                return (
                  <line
                    key={i}
                    x1={CX} y1={CY}
                    x2={end.x} y2={end.y}
                    stroke="rgba(255,255,255,0.09)"
                    strokeWidth="1"
                  />
                );
              })}

              {/* Skill polygon - scale animated from center */}
              <motion.polygon
                points={polyPoints()}
                fill="rgba(200, 85, 58, 0.15)"
                stroke="#C8553A"
                strokeWidth="1.5"
                strokeLinejoin="round"
                style={{ transformOrigin: `${CX}px ${CY}px` }}
                initial={{ scale: 0, opacity: 0 }}
                animate={visible ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                transition={{ duration: 1.2, ease: [0.34, 1.2, 0.64, 1], delay: 0.2 }}
              />

              {/* Vertex dots */}
              {skills.map((s, i) => {
                const p = pt(i * ANGLE_STEP, (s.value / 100) * R);
                return (
                  <motion.circle
                    key={i}
                    cx={p.x} cy={p.y} r={4}
                    fill="#C8553A"
                    stroke="rgba(0,0,0,0.4)"
                    strokeWidth="1"
                    style={{ transformOrigin: `${p.x}px ${p.y}px` }}
                    initial={{ scale: 0 }}
                    animate={visible ? { scale: 1 } : { scale: 0 }}
                    transition={{ delay: 1.1 + i * 0.07, duration: 0.28, type: 'spring', stiffness: 400 }}
                  />
                );
              })}

              {/* Labels */}
              {skills.map((s, i) => {
                const angle = i * ANGLE_STEP;
                const p = pt(angle, R + 26);
                const anchor = getLabelAnchor(angle);
                return (
                  <text
                    key={i}
                    x={p.x} y={p.y}
                    textAnchor={anchor}
                    dominantBaseline="middle"
                    fill="rgba(240,240,240,0.65)"
                    fontSize="10"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    {s.label}
                  </text>
                );
              })}
            </svg>
          </div>

          {/* Bar legend */}
          <div className="radar-bars">
            {skills.map((s, i) => (
              <div key={i} className="radar-bar-item">
                <span className="radar-bar-label">{s.label}</span>
                <div className="radar-bar-track">
                  <motion.div
                    className="radar-bar-fill"
                    initial={{ width: 0 }}
                    animate={visible ? { width: `${s.value}%` } : { width: 0 }}
                    transition={{ duration: 1.0, ease: 'easeOut', delay: 0.15 + i * 0.1 }}
                  />
                </div>
                <span className="radar-bar-pct">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsRadar;
