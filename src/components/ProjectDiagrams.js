import React from 'react';

// Technical schematics for each project, drawn on a 400 x 200 canvas.

const arrowHead = (x1, y1, x2, y2, size = 5) => {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const left = [x2 - size * Math.cos(angle - 0.45), y2 - size * Math.sin(angle - 0.45)];
  const right = [x2 - size * Math.cos(angle + 0.45), y2 - size * Math.sin(angle + 0.45)];
  return `M${x2} ${y2}L${left[0].toFixed(1)} ${left[1].toFixed(1)}L${right[0].toFixed(1)} ${right[1].toFixed(1)}Z`;
};

function Arrow({ x1, y1, x2, y2, flow = false, both = false }) {
  return (
    <g className={flow ? 'dg-arrow dg-flow' : 'dg-arrow'}>
      <path className="dg-wire" d={`M${x1} ${y1}L${x2} ${y2}`} />
      <path className="dg-head" d={arrowHead(x1, y1, x2, y2)} />
      {both && <path className="dg-head" d={arrowHead(x2, y2, x1, y1)} />}
    </g>
  );
}

function Box({ x, y, w, h, label, sub, variant, labelY, rx = 2 }) {
  const top = labelY ?? (sub ? y + h / 2 - 4 : y + h / 2);
  return (
    <g>
      <rect className={`dg-box${variant ? ` dg-box-${variant}` : ''}`} x={x} y={y} width={w} height={h} rx={rx} />
      {label && <text className="dg-label" x={x + w / 2} y={top} dy="0.35em">{label}</text>}
      {sub && <text className="dg-sub" x={x + w / 2} y={top + 11} dy="0.35em">{sub}</text>}
    </g>
  );
}

function WindowChrome({ x, y, w, h, title }) {
  return (
    <g>
      <rect className="dg-box" x={x} y={y} width={w} height={h} rx="4" />
      <path className="dg-rule" d={`M${x} ${y + 13}H${x + w}`} />
      {[0, 1, 2].map((dot) => <circle key={dot} className="dg-dot" cx={x + 8 + dot * 7} cy={y + 6.5} r="2" />)}
      {title && <text className="dg-sub" x={x + w / 2 + 10} y={y + 6.5} dy="0.35em">{title}</text>}
    </g>
  );
}

function Mak8u() {
  const peripherals = ['DMA', 'SPI', 'I2C', 'UART', 'GPIO', 'PWM', 'XADC'];
  return (
    <>
      <Box x={160} y={8} w={80} h={30} label="MMCM" sub="2:1 RATIO" variant="ink" />
      <path className="dg-wire dg-clock" d="M180 38V48H76V60M220 38V48H324V60" />
      <text className="dg-note" x="118" y="43">50 MHz</text>
      <text className="dg-note" x="282" y="43">100 MHz</text>

      <Box x={12} y={60} w={128} h={62} label="CORE A · 5-STAGE" labelY={72} />
      {[0, 1, 2, 3, 4].map((stage) => (
        <g key={stage}>
          <rect className="dg-cell" x={22 + stage * 22.5} y={86} width="18" height="24" />
          <text className="dg-sub" x={31 + stage * 22.5} y="98" dy="0.35em">{stage + 1}</text>
        </g>
      ))}

      <Box x={260} y={60} w={128} h={62} label="CORE B · 7-STAGE" labelY={72} />
      {[0, 1, 2, 3, 4, 5, 6].map((stage) => (
        <g key={stage}>
          <rect className="dg-cell" x={270 + stage * 16} y={86} width="12" height="24" />
          <text className="dg-sub" x={276 + stage * 16} y="98" dy="0.35em">{stage + 1}</text>
        </g>
      ))}

      <Box x={164} y={58} w={72} h={66} variant="accent" label="INTER-CORE" labelY={70} />
      <text className="dg-sub" x="200" y="88" dy="0.35em">QUEUES</text>
      <text className="dg-sub" x="200" y="99" dy="0.35em">SEMAPHORES</text>
      <text className="dg-sub" x="200" y="110" dy="0.35em">BARRIERS</text>
      <Arrow x1={140} y1={91} x2={164} y2={91} both />
      <Arrow x1={236} y1={91} x2={260} y2={91} both />

      <path className="dg-wire" d="M76 122V140M324 122V140M200 124V131" />
      <path className="dg-bus" d="M44 140H356" />
      <Box x={164} y={131} w={72} h={18} label="LOCK ARBITER" variant="paper" />
      {peripherals.map((name, index) => {
        const x = 21 + index * 52;
        return (
          <g key={name}>
            <path className="dg-wire" d={`M${x + 23} 140V156`} />
            <Box x={x} y={156} w={46} h={22} label={name} />
          </g>
        );
      })}
    </>
  );
}

function Garuda() {
  return (
    <>
      <rect className="dg-boundary" x="8" y="10" width="318" height="180" rx="6" />
      <text className="dg-sub dg-start" x="18" y="22" dy="0.35em">HOME NETWORK · ON-PREMISES</text>
      <text className="dg-sub" x="167" y="176" dy="0.35em">NO VIDEO LEAVES THE HOME</text>

      <rect className="dg-box" x="22" y="78" width="52" height="34" rx="3" />
      <circle className="dg-lens" cx="48" cy="95" r="10" />
      <circle className="dg-dot" cx="48" cy="95" r="4" />
      <text className="dg-sub" x="48" y="124" dy="0.35em">CAMERA</text>
      <Arrow x1={74} y1={95} x2={98} y2={95} flow />

      <Box x={98} y={38} w={120} h={116} label="RASPBERRY PI 5" labelY={50} />
      <Box x={110} y={62} w={96} h={36} label="HAILO-8L M.2" sub="13 TOPS NPU" variant="accent" />
      <Box x={110} y={106} w={96} h={36} label="YOLOv8s" sub="INT8 QUANTIZED" variant="paper" />
      <path className="dg-wire" d="M158 98V106" />
      <Arrow x1={218} y1={95} x2={242} y2={95} flow />

      <WindowChrome x={242} y={48} w={72} h={90} />
      <path className="dg-figure" d="M268 132v-14a10 10 0 0 1 20 0v14" />
      <circle className="dg-figure" cx="278" cy="99" r="6" />
      <rect className="dg-detect" x="262" y="84" width="32" height="50" />
      <rect className="dg-tag" x="262" y="76" width="32" height="8" />
      <text className="dg-tag-text" x="278" y="80" dy="0.35em">DETECT</text>
      <text className="dg-sub" x="278" y="150" dy="0.35em">LOCAL ALERT</text>

      <path className="dg-wire dg-blocked" d="M326 95H342" />
      <path className="dg-cloud" d="M348 104H382A10 10 0 0 0 383 84A14 14 0 0 0 357 80A11 11 0 0 0 348 104Z" />
      <path className="dg-cross" d="M352 78L380 108M380 78L352 108" />
      <text className="dg-sub" x="366" y="122" dy="0.35em">CLOUD</text>
    </>
  );
}

function Breadth() {
  return (
    <>
      <rect className="dg-box" x="14" y="28" width="90" height="144" rx="12" />
      <text className="dg-label" x="59" y="42" dy="0.35em">WEARABLE</text>
      <text className="dg-sub dg-start" x="24" y="60" dy="0.35em">VITALS</text>
      <path className="dg-trace" d="M24 84h10l3-3 3 3h6l3-14 4 24 3-10h8l3-3 3 3h6l3-14 4 24 3-10h6" />
      <text className="dg-sub dg-start" x="24" y="110" dy="0.35em">MOTION</text>
      <path className="dg-trace dg-trace-alert" d="M24 144h14l3-2 3 3 3-2h10l3-26 3 36 3-12h6l3-2 3 2h14" />
      <text className="dg-note dg-start" x="64" y="122" dy="0.35em">FALL</text>
      <Arrow x1={104} y1={100} x2={122} y2={100} flow />

      <Box x={122} y={40} w={100} h={40} label="DSP · FUSION" sub="MULTI-MODAL" />
      <path className="dg-wire" d="M172 80V100" />
      <Box x={122} y={100} w={100} h={50} label="RANDOM FOREST" sub="104 FEATURES" variant="accent" />
      <text className="dg-sub" x="172" y="162" dy="0.35em">ON-DEVICE</text>
      <Arrow x1={222} y1={112} x2={250} y2={112} flow />
      <text className="dg-note" x="236" y="104">MQTT</text>

      <WindowChrome x={250} y={22} w={140} h={156} title="FLOOR PLAN" />
      <rect className="dg-room" x="260" y="44" width="120" height="96" />
      <path className="dg-room" d="M300 44V74M300 84V100M340 44V60M340 70V100M260 100H290M300 100H350M360 100H380M320 100V140" />
      <circle className="dg-led" cx="280" cy="70" r="3.5" />
      <circle className="dg-led" cx="320" cy="84" r="3.5" />
      <circle className="dg-led" cx="290" cy="122" r="3.5" />
      <circle className="dg-led" cx="352" cy="122" r="3.5" />
      <circle className="dg-led-alert dg-pulse" cx="360" cy="78" r="3.5" />
      <Box x={260} y={148} w={120} h={20} label="LOCAL RAG ASSISTANT" variant="paper" />
    </>
  );
}

function Thermal() {
  const heat = [1, 2, 3, 1, 2, 4, 3, 0];
  return (
    <>
      <text className="dg-sub dg-start" x="18" y="22" dy="0.35em">1-WIRE BUS · ONE GPIO</text>
      <path className="dg-bus" d="M18 36H270" />
      {Array.from({ length: 8 }, (_, index) => {
        const cx = 32 + index * 30;
        return (
          <g key={index}>
            <path className="dg-wire" d={`M${cx} 36V48`} />
            <path className="dg-sensor" d={`M${cx - 7} 62V54a7 7 0 0 1 14 0V62Z`} />
            <text className="dg-sub" x={cx} y="72" dy="0.35em">{`T${index + 1}`}</text>
          </g>
        );
      })}
      <Box x={270} y={16} w={116} h={44} label="ESP32-S3" sub="MODBUS RTU SLAVE" variant="ink" />

      <path className="dg-wire dg-flow" d="M322 60V126H262" />
      <path className="dg-wire dg-flow" d="M332 60V136H262" />
      <text className="dg-label dg-start" x="340" y="96" dy="0.35em">RS-485</text>
      <text className="dg-sub dg-start" x="340" y="108" dy="0.35em">A / B PAIR</text>

      <WindowChrome x={14} y={84} w={248} h={106} title="SCADA DASHBOARD" />
      {heat.map((level, index) => {
        const x = 24 + (index % 4) * 29;
        const y = 106 + Math.floor(index / 4) * 29;
        return <rect key={index} className={`dg-heat dg-heat-${level}`} x={x} y={y} width="26" height="26" rx="1" />;
      })}
      <circle className="dg-hotspot dg-pulse" cx="66" cy="148" r="17" />
      <text className="dg-sub dg-start" x="24" y="176" dy="0.35em">2D HEATMAP · HOTSPOT</text>

      {[0, 1, 2, 3, 4].map((line) => (
        <path
          key={line}
          className="dg-surface"
          d={`M${156 + line * 4} ${150 - line * 8}q12 ${-10 - line * 2} 24 -3t24 -2t24 -6`}
        />
      ))}
      <text className="dg-sub dg-start" x="156" y="106" dy="0.35em">3D SURFACE</text>
      <Box x={152} y={160} w={102} h={20} label="ISOLATION FOREST" variant="accent" />
    </>
  );
}

function Battery() {
  const levels = [0.78, 0.46, 0.92, 0.6];
  return (
    <>
      {levels.map((level, index) => {
        const x = 38 + index * 88;
        const fill = 44 * level;
        return (
          <g key={index}>
            <rect className="dg-box" x={x + 22} y="18" width="16" height="5" />
            <rect className="dg-box" x={x} y="23" width="60" height="52" rx="3" />
            <rect className={`dg-charge${index === 2 ? ' dg-charge-high' : ''}${index === 1 ? ' dg-charge-low' : ''}`} x={x + 4} y={71 - fill} width="52" height={fill} rx="1" />
            <text className="dg-sub" x={x + 30} y="86" dy="0.35em">{`CELL ${index + 1}`}</text>
            {index < 3 && <path className="dg-wire" d={`M${x + 60} 49H${x + 88}`} />}
          </g>
        );
      })}

      <Box x={110} y={100} w={180} h={30} label="BIDIRECTIONAL FLYBACK" sub="PROPORTIONAL DUTY CYCLE" variant="paper" />
      <path className="dg-wire dg-flow dg-accent-line" d="M246 75V100" />
      <Arrow x1={156} y1={100} x2={156} y2={77} flow />
      <path className="dg-wire dg-thin" d="M68 75V115H110M332 75V115H290" />

      <path className="dg-axis" d="M34 146V190H384" />
      {[150, 160, 172, 184].map((start, index) => (
        <path key={start} className={`dg-curve dg-curve-${index}`} d={`M34 ${start}C110 ${start} 170 168 250 168H384`} />
      ))}
      <text className="dg-note dg-start" x="40" y="143">ΔV ≈ 1.3 V</text>
      <text className="dg-note dg-end" x="382" y="162">≈ 0 V</text>
    </>
  );
}

function SmartFactory() {
  const machines = Array.from({ length: 13 }, (_, index) => {
    const row = index < 7 ? 0 : 1;
    const col = row ? index - 7 : index;
    return { index, x: (row ? 32 : 16) + col * 32, y: row ? 100 : 40 };
  });
  return (
    <>
      <text className="dg-sub dg-start" x="16" y="24" dy="0.35em">13 MACHINES · SHOP FLOOR</text>
      {machines.map(({ index, x, y }) => (
        <g key={index}>
          <rect className="dg-box" x={x} y={y} width="24" height="28" rx="2" />
          <path className="dg-rule" d={`M${x + 4} ${y + 18}H${x + 20}`} />
          <circle className={index === 9 ? 'dg-led-alert dg-pulse' : 'dg-led'} cx={x + 17} cy={y + 7} r="2.6" />
          <path className="dg-wire dg-thin" d={`M${x + 12} ${y + 28}V${y + 38}`} />
        </g>
      ))}
      <path className="dg-bus" d="M28 78H248M44 138H248M248 78V138" />
      <Arrow x1={248} y1={108} x2={268} y2={108} flow />

      <WindowChrome x={268} y={24} w={122} h={152} title="SUPERVISOR VIEW" />
      {machines.map(({ index }) => (
        <rect
          key={index}
          className={index === 9 ? 'dg-tile dg-tile-alert' : 'dg-tile'}
          x={280 + (index % 5) * 20}
          y={48 + Math.floor(index / 5) * 17}
          width="16"
          height="12"
          rx="1"
        />
      ))}
      <text className="dg-value" x="329" y="126" dy="0.35em">−89%</text>
      <text className="dg-sub" x="329" y="146" dy="0.35em">MANUAL CHECK TIME</text>
      <text className="dg-sub" x="329" y="160" dy="0.35em">ONE LIVE VIEW</text>
    </>
  );
}

const DIAGRAMS = {
  mak8u: { caption: 'Dual-core block diagram', spec: '50 / 100 MHz · 2:1', Diagram: Mak8u },
  garuda: { caption: 'On-device inference path', spec: '13 TOPS · INT8', Diagram: Garuda },
  breadth: { caption: 'Sensing-to-alert data path', spec: '104-feature RF', Diagram: Breadth },
  thermal: { caption: 'Sensor bus to SCADA view', spec: '8 × DS18B20 · RS-485', Diagram: Thermal },
  battery: { caption: 'Active charge redistribution', spec: 'ΔV 1.3 V → ≈ 0', Diagram: Battery },
  'smart-factory': { caption: 'Machine telemetry to supervisor', spec: '13 machines · −89%', Diagram: SmartFactory },
};

export default function ProjectIllustration({ projectId, figure }) {
  const entry = DIAGRAMS[projectId];
  if (!entry) return null;
  const { caption, spec, Diagram } = entry;

  return (
    <figure className={`project-illustration visual-${projectId}`} aria-hidden="true">
      <div className="figure-canvas">
        <svg viewBox="0 0 400 200" focusable="false" preserveAspectRatio="xMidYMid meet">
          <Diagram />
        </svg>
      </div>
      <figcaption>
        <span>{`Fig. ${String(figure).padStart(2, '0')}`}</span>
        <span>{caption}</span>
        <span>{spec}</span>
      </figcaption>
    </figure>
  );
}
