/* global React */
const { useEffect: cuEffect, useRef: cuRef } = React;

// Animated PCB-style circuit background — traces, vias, pulses
function Circuit() {
  const ref = cuRef(null);
  cuEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    const pulses = svg.querySelectorAll('.circuit-pulse');
    pulses.forEach((p, i) => {
      const dur = 4 + (i % 3);
      p.animate(
        [{ offsetDistance: '0%' }, { offsetDistance: '100%' }],
        { duration: dur * 1000, iterations: Infinity, delay: i * 700, easing: 'linear' }
      );
    });
  }, []);
  return (
    <div className="circuit" aria-hidden>
      <svg ref={ref} viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="currentColor" strokeWidth=".3" opacity=".15"/>
          </pattern>
        </defs>
        <rect width="1200" height="700" fill="url(#grid)" color="var(--ink)" />

        {/* PCB traces */}
        <path className="circuit-trace" id="t1" d="M 50 120 L 280 120 L 280 240 L 540 240 L 540 80 L 820 80 L 820 200 L 1150 200" />
        <path className="circuit-trace" id="t2" d="M 80 580 L 320 580 L 320 460 L 600 460 L 600 620 L 900 620 L 900 500 L 1140 500" />
        <path className="circuit-trace" id="t3" d="M 50 360 L 200 360 L 200 300 L 460 300 L 460 400 L 720 400 L 720 360 L 1100 360" />
        <path className="circuit-trace" id="t4" d="M 200 80 L 200 180 L 360 180 L 360 360" />
        <path className="circuit-trace" id="t5" d="M 700 80 L 700 200 L 880 200 L 880 320" />
        <path className="circuit-trace" id="t6" d="M 1000 580 L 1000 480 L 800 480 L 800 360" />

        {/* Vias / pads */}
        <circle className="circuit-via" cx="280" cy="120" r="4"/>
        <circle className="circuit-via" cx="540" cy="240" r="4"/>
        <circle className="circuit-via" cx="820" cy="80"  r="4"/>
        <circle className="circuit-via" cx="320" cy="580" r="4"/>
        <circle className="circuit-via" cx="600" cy="460" r="4"/>
        <circle className="circuit-via" cx="900" cy="620" r="4"/>
        <circle className="circuit-via" cx="200" cy="360" r="4"/>
        <circle className="circuit-via" cx="460" cy="300" r="4"/>
        <circle className="circuit-via" cx="720" cy="400" r="4"/>

        {/* Chip outlines */}
        <g opacity=".55">
          <rect x="380" y="180" width="120" height="80" fill="none" stroke="currentColor" strokeWidth="1"/>
          <text x="440" y="225" fill="currentColor" fontSize="9" textAnchor="middle" fontFamily="monospace" opacity=".6">FPGA</text>
          {Array.from({length:6}).map((_,i)=>(
            <line key={'p'+i} x1={395+i*18} y1="178" x2={395+i*18} y2="170" stroke="currentColor" strokeWidth=".8"/>
          ))}
          {Array.from({length:6}).map((_,i)=>(
            <line key={'q'+i} x1={395+i*18} y1="262" x2={395+i*18} y2="270" stroke="currentColor" strokeWidth=".8"/>
          ))}
        </g>
        <g opacity=".55">
          <rect x="780" y="290" width="100" height="60" fill="none" stroke="currentColor" strokeWidth="1"/>
          <text x="830" y="325" fill="currentColor" fontSize="9" textAnchor="middle" fontFamily="monospace" opacity=".6">MCU</text>
        </g>
        <g opacity=".55">
          <rect x="160" y="500" width="80" height="50" fill="none" stroke="currentColor" strokeWidth="1"/>
          <text x="200" y="530" fill="currentColor" fontSize="9" textAnchor="middle" fontFamily="monospace" opacity=".6">DSP</text>
        </g>

        {/* Pulses moving along traces */}
        <circle className="circuit-pulse" r="3" style={{offsetPath:"path('M 50 120 L 280 120 L 280 240 L 540 240 L 540 80 L 820 80 L 820 200 L 1150 200')"}} />
        <circle className="circuit-pulse" r="3" style={{offsetPath:"path('M 80 580 L 320 580 L 320 460 L 600 460 L 600 620 L 900 620 L 900 500 L 1140 500')"}} />
        <circle className="circuit-pulse" r="3" style={{offsetPath:"path('M 50 360 L 200 360 L 200 300 L 460 300 L 460 400 L 720 400 L 720 360 L 1100 360')"}} />
        <circle className="circuit-pulse" r="2" style={{offsetPath:"path('M 200 80 L 200 180 L 360 180 L 360 360')"}} />
        <circle className="circuit-pulse" r="2" style={{offsetPath:"path('M 700 80 L 700 200 L 880 200 L 880 320')"}} />
      </svg>
    </div>
  );
}

window.Circuit = Circuit;
