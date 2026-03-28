import React, { useRef, useState, useEffect, Suspense, lazy } from 'react';
import { motion } from 'framer-motion';

const OscilloscopeWave = lazy(() => import('./OscilloscopeWave'));

const skills = [
  { label: 'EMBEDDED SYS',    value: 92, unit: 'EE-001' },
  { label: 'FPGA / RTL',      value: 85, unit: 'EE-002' },
  { label: 'SIGNAL PROC',     value: 82, unit: 'EE-003' },
  { label: 'AI / ML',         value: 78, unit: 'CS-001' },
  { label: 'POWER ELEC',      value: 72, unit: 'EE-004' },
  { label: 'SOFTWARE DEV',    value: 68, unit: 'CS-002' },
];

const W = 280, CX = 140, CY = 140, R = 95, LEVELS = 4, N = skills.length;
const ANGLE_STEP = 360 / N;

function pt(angleDeg, radius) {
  const rad = (angleDeg - 90) * (Math.PI / 180);
  return { x: CX + radius * Math.cos(rad), y: CY + radius * Math.sin(rad) };
}

function polyPoints() {
  return skills.map((s, i) => {
    const p = pt(i * ANGLE_STEP, (s.value / 100) * R);
    return `${p.x},${p.y}`;
  }).join(' ');
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
    <div className="ctrl-doc" ref={ref}>
      {/* Panel header strip */}
      <div className="ctrl-header">
        <div className="ctrl-header-left">
          <div className="ctrl-status-led ctrl-status-led--on" />
          <span className="ctrl-title">SKILL SYSTEMS MONITOR</span>
        </div>
        <div className="ctrl-header-right">
          <span className="ctrl-sys-id">SYS-ID: GVM-SKL-2025</span>
          <div className="ctrl-status-led ctrl-status-led--pulse" />
        </div>
      </div>

      <div className="ctrl-body">
        {/* Radar instrument */}
        <div className="ctrl-instrument">
          <div className="ctrl-instr-label">CAPABILITY RADAR / SCAN</div>
          <div className="ctrl-radar-wrap">
            <svg viewBox={`0 0 ${W} ${W}`} className="ctrl-radar-svg">
              {/* Grid polygons */}
              {Array.from({ length: LEVELS }, (_, lvl) => {
                const r = R * ((lvl + 1) / LEVELS);
                const pts = skills.map((_, i) => { const p = pt(i * ANGLE_STEP, r); return `${p.x},${p.y}`; }).join(' ');
                return <polygon key={lvl} points={pts} fill="none" stroke="rgba(200,85,58,0.12)" strokeWidth="0.8" />;
              })}
              {/* Axis lines */}
              {skills.map((_, i) => {
                const end = pt(i * ANGLE_STEP, R);
                return <line key={i} x1={CX} y1={CY} x2={end.x} y2={end.y} stroke="rgba(200,85,58,0.15)" strokeWidth="0.8" />;
              })}
              {/* Skill polygon */}
              <motion.polygon
                points={polyPoints()}
                fill="rgba(200, 85, 58, 0.12)"
                stroke="#C8553A"
                strokeWidth="1.2"
                strokeLinejoin="round"
                style={{ transformOrigin: `${CX}px ${CY}px` }}
                initial={{ scale: 0, opacity: 0 }}
                animate={visible ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                transition={{ duration: 1.2, ease: [0.34, 1.2, 0.64, 1], delay: 0.2 }}
              />
              {/* Labels */}
              {skills.map((s, i) => {
                const angle = i * ANGLE_STEP;
                const lp = pt(angle, R + 18);
                const anchor = angle > 30 && angle < 150 ? 'start' : angle > 210 && angle < 330 ? 'end' : 'middle';
                return (
                  <text key={i} x={lp.x} y={lp.y} textAnchor={anchor} dominantBaseline="middle"
                    fontSize="7.5" fill="rgba(242,242,240,0.6)" fontFamily="var(--font-mono)" letterSpacing="0.05em">
                    {s.label}
                  </text>
                );
              })}
              {/* Center cross */}
              <circle cx={CX} cy={CY} r="2" fill="#C8553A" opacity="0.7" />
            </svg>
          </div>
        </div>

        {/* Gauge readouts */}
        <div className="ctrl-gauges">
          {skills.map((s) => (
            <div key={s.label} className="ctrl-gauge">
              <div className="ctrl-gauge-header">
                <span className="ctrl-gauge-unit">{s.unit}</span>
                <span className="ctrl-gauge-val">{s.value}%</span>
              </div>
              <div className="ctrl-gauge-label">{s.label}</div>
              <div className="ctrl-gauge-track">
                <motion.div
                  className="ctrl-gauge-fill"
                  initial={{ width: 0 }}
                  animate={visible ? { width: `${s.value}%` } : { width: 0 }}
                  transition={{ duration: 0.9, ease: 'easeOut', delay: 0.1 }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Oscilloscope panel */}
      <div className="ctrl-osc-panel">
        <div className="ctrl-osc-label">SIGNAL CHANNEL A — LIVE</div>
        <div className="ctrl-osc-display">
          <Suspense fallback={<div className="ctrl-osc-fallback">-- LOADING --</div>}>
            <OscilloscopeWave />
          </Suspense>
        </div>
      </div>

      {/* Status footer */}
      <div className="ctrl-footer">
        <span className="ctrl-footer-item">ALL SYSTEMS NOMINAL</span>
        <span className="ctrl-footer-item">LAST SCAN: 2025-09-01</span>
        <span className="ctrl-footer-item">GVM CONTROL v2.6</span>
      </div>
    </div>
  );
};

export default SkillsRadar;
