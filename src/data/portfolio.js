export const PERSONAL = {
  name: 'Veera Manikanta Gonugondla',
  initials: 'VMG',
  tagline: 'Building where hardware meets software',
  sub: 'Silicon that thinks. Edge AI, FPGAs, embedded systems.',
  email: 'mgonugondlamanikanta@gmail.com',
  github: 'github.com/Manikanta25055',
  linkedin: 'linkedin.com/in/manikanta-gonugondla-349bb729a',
  location: 'Hyderabad, IN',
  role: 'Electrical & Electronics Engineer',
  summary: 'Dual-degree at MIT Manipal + IIT Madras. Patent filed. 1st place, IIT-M Gadget Expo 2025.',
};

export const IN_PROGRESS = [
  { title: 'Garuda — IEEE Access', kind: 'Journal in writing', note: 'Sub-100ms edge AI security on Pi 5 + Hailo 8L.' },
  { title: 'bREADth — IEEE Sensors Journal', kind: 'Journal in writing', note: 'Hardware project on multi-modal sensor fusion.' },
];

export const STATS = [
  { k: '9',    v: 'Shipped projects' },
  { k: '2',    v: 'IEEE journals in writing' },
  { k: '1',    v: 'Patent filed' },
  { k: '<100', v: 'ms inference latency' },
];

export const EDUCATION = [
  { inst: 'MIT Manipal', deg: 'BTech, Electrical & Electronics', cgpa: '8.02', sem: 'Sem 6 of 8', minor: 'Computational Intelligence', years: '2023 — 2027' },
  { inst: 'IIT Madras', deg: 'BS, Electronic Systems (Online)', cgpa: '7.33', sem: 'Diploma Phase', minor: null, years: '2023 — 2027' },
];

export const EXPERIENCE = [
  { role: 'Project Intern', co: 'Apsis Solutions', loc: 'Bangalore', period: 'Jul — Sep 2025', bullets: ['IoT solutions across FMCG, banking, supply chain, telecom.', 'Led integration across cross-vendor sensor stacks.'], skills: ['IoT', 'Industry', 'Leadership'] },
  { role: 'Project Intern', co: 'Mindenious Edutech', loc: 'Bangalore', period: 'Jul — Sep 2025', bullets: ['VLSI — RTL, verification, synthesis, ASIC flow.', 'Authored test benches for functional coverage.'], skills: ['RTL', 'Verif', 'ASIC'] },
  { role: 'Summer School', co: 'IIIT Hyderabad', loc: 'Hyderabad', period: 'Jun — Jul 2024', bullets: ['Product Development Management — concept to product lifecycle.'], skills: ['PDM', 'Strategy'] },
];

export const PROJECTS = [
  {
    id: 'garuda', title: 'Garuda', subtitle: 'Real-time AI security on edge hardware',
    badge: '1ST — IIT-M GADGET EXPO 2025', period: 'Jan — Apr 2025',
    blurb: 'A standalone, no-cloud security system that detects intruders in under 100 ms on a Raspberry Pi 5 augmented with a Hailo 8L NPU. YOLOv8 backbone runs on the accelerator; decode and NMS run on ARM cores.',
    problem: 'Existing home-security cameras either depend on the cloud or are too slow on edge hardware to trigger usable alerts.',
    approach: 'Split YOLOv8 at the backbone — feature extraction on Hailo 8L, post-processing on Pi. Zero-copy GStreamer pipeline from camera to inference. Vosk-based offline voice assistant ("Narada") + multi-user OTP gate.',
    tech: ['Python','YOLOv8','Hailo 8L','Raspberry Pi 5','GStreamer','OpenCV','Vosk'],
    metrics: [{k:'<100 ms',v:'detection latency'},{k:'30',v:'FPS sustained'},{k:'13 TOPS',v:'edge NPU compute'},{k:'0',v:'cloud calls'}],
    role: 'System architect + firmware', team: 'Solo build, 4 months',
    link: 'github.com/Manikanta25055/Garuda',
  },
  {
    id: 'patent', title: 'Patient Collapse Detection', subtitle: 'Wearable vital-signs anomaly system',
    badge: 'PATENT FILED — FEB 2025', period: 'Nov 2024 — Feb 2025',
    blurb: 'Non-invasive wearable that fuses heart rate, respiration, and motion data to flag patient collapse before bystanders notice. Targeted at elderly home-care and rehab wards.',
    problem: 'Falls and sudden cardiac events in elderly patients lose critical minutes between event and intervention.',
    approach: 'MEMS accelerometer + PPG + respiration sensor on a single low-power MCU. ML anomaly detector runs on-device; LoRa fallback uplink for caregiver alert. Patent filed Feb 2025.',
    tech: ['Biomed sensors','PPG','MEMS','Wearable','Edge ML','DSP','LoRa'],
    metrics: [{k:'95%+',v:'detection accuracy'},{k:'<2 s',v:'alert response'},{k:'48 h',v:'battery life'},{k:'Filed',v:'Feb 2025'}],
    role: 'Hardware + ML pipeline', team: '2-person team',
    link: null,
  },
  {
    id: 'battery', title: 'Active Battery Equalization', subtitle: 'Flyback converter BMS for EV packs',
    badge: '+20–30% PACK LIFESPAN', period: 'Aug — Nov 2024',
    blurb: 'A bidirectional active cell-balancer for lithium-ion packs. Replaces wasteful resistive balancing with energy-recycling flyback topology — measured 85%+ transfer efficiency in simulation.',
    problem: 'Passive balancing burns excess cell charge as heat. On EV packs that costs you both range and pack life.',
    approach: 'Single-transformer flyback per cell pair. Magnetization → demagnetization phases move energy from high-SoC to low-SoC cells. Modeled in LTSpice with realistic transformer parasitics.',
    tech: ['Power Electronics','BMS','LTSpice','EV Systems','Flyback Topology'],
    metrics: [{k:'+25%',v:'lifespan gain'},{k:'85%+',v:'transfer efficiency'},{k:'4S1P',v:'topology tested'},{k:'100 kHz',v:'switching freq'}],
    role: 'Circuit design + simulation', team: 'Solo coursework',
    link: 'github.com/Manikanta25055/Active_Battery_cell_Equalisation',
  },
  {
    id: 'suspension', title: 'Active Suspension System', subtitle: 'PID-controlled real-time damping',
    badge: '−15.24 dB VIBRATION', period: 'Mar — Jun 2024',
    blurb: 'Closed-loop PID controller for an automotive suspension model. Accelerometer feedback adjusts damping force to attenuate road vibration in real time.',
    problem: 'Passive shocks cannot adapt to road conditions; classical control textbooks rarely demonstrate full closed-loop tuning.',
    approach: 'Quarter-car model in MATLAB/Simulink, PID gains tuned via Ziegler-Nichols then refined with frequency-response analysis. Tested across step, sinusoidal and random road profiles.',
    tech: ['Control Systems','PID','MATLAB','Simulink','State-space modeling'],
    metrics: [{k:'−15.24 dB',v:'vibration cut'},{k:'60%',v:'faster settling'},{k:'<5%',v:'SS error'},{k:'4',v:'road profiles'}],
    role: 'Modeling + control design', team: 'Solo coursework',
    link: 'github.com/Manikanta25055/Active_Suspension_system',
  },
  {
    id: 'comms', title: 'Secure Comms (DSSS)', subtitle: 'Spread-spectrum + XOR encryption',
    badge: '14.91 dB PROCESSING GAIN', period: 'Nov 2024',
    blurb: 'A jam-resistant baseband chain combining 31-chip DSSS spreading with XOR keystream encryption. Tested across AWGN and narrowband jamming environments.',
    problem: 'Naive baseband links fall over under jamming; teaching DSSS without a working pipeline leaves it abstract.',
    approach: 'Generated PN sequence with maximum-length LFSR. Correlation-based despreader. Swept SNR across 4 BER scenarios; isolated processing-gain contribution from encryption layer.',
    tech: ['MATLAB','DSSS','Digital Comm','LFSR','Encryption'],
    metrics: [{k:'14.91 dB',v:'processing gain'},{k:'10 dB',v:'jam suppression'},{k:'31',v:'chip length'},{k:'4',v:'BER scenarios'}],
    role: 'Sim + analysis', team: 'Solo coursework',
    link: 'github.com/Manikanta25055/Secure_Communication_System',
  },
  {
    id: 'denoise', title: 'Speech Denoising', subtitle: 'Spectral subtraction, overlap-add',
    badge: '5–10 dB SNR GAIN', period: 'Oct 2024',
    blurb: 'Frame-based speech denoiser using N-point FFT spectral subtraction with adaptive noise estimation and spectral floor protection.',
    problem: 'Spectral subtraction in textbooks is single-frame; real speech needs windowing, overlap-add, and a floor to avoid musical noise.',
    approach: 'Hamming windowing, 50% overlap, adaptive noise floor updated during pauses. Compared multiple flooring schemes against PESQ scores.',
    tech: ['MATLAB','FFT','Spectral Analysis','Audio DSP'],
    metrics: [{k:'+5–10 dB',v:'SNR'},{k:'>0.85',v:'correlation'},{k:'3.0',v:'PESQ score'},{k:'50%',v:'overlap-add'}],
    role: 'DSP pipeline', team: 'Solo coursework',
    link: 'github.com/Manikanta25055/Speech_Denoising_Using_Spectral_Subtraction',
  },
  {
    id: 'thermal', title: '4-Channel Thermal Profiling', subtitle: 'Industrial MODBUS RTU over RS485',
    badge: 'INDUSTRIAL PROTOCOL STACK', period: 'Jan — Feb 2026',
    blurb: 'Industrial-grade temperature monitor: 8 DS18B20 sensors on a 1-Wire bus → ESP32-S3 MODBUS RTU slave → Python SCADA master over RS485. Real-time 2D heatmap and CSV logging.',
    problem: 'Off-the-shelf thermal monitors either do consumer-grade USB or are locked to vendor SCADA stacks.',
    approach: 'Hand-rolled MODBUS RTU slave on ESP32-S3 with 27 holding registers. RS485 transceiver with proper biasing. PyQt5 master with hotspot detection and CSV export.',
    tech: ['ESP32-S3','DS18B20','MODBUS RTU','RS485','PyQt5','Python'],
    metrics: [{k:'±0.5 °C',v:'accuracy'},{k:'2 Hz',v:'update rate'},{k:'8',v:'sensors'},{k:'27',v:'registers'}],
    role: 'Firmware + SCADA', team: 'Solo build',
    link: 'github.com/Manikanta25055/Thermal_Profiling',
  },
  {
    id: 'power', title: 'Power Quality Analysis', subtitle: 'DTFS harmonic analysis, IEEE 519',
    badge: 'IEEE 519 COMPLIANT', period: 'Oct 2024',
    blurb: 'Power-quality analyzer using DTFS to compute THD and K-factor, then designs corrective harmonic filters. Validated against LED, motor-drive, and data-center load profiles.',
    problem: 'IEEE 519 compliance is everywhere in industrial spec sheets but rarely demonstrated end-to-end on student lab data.',
    approach: 'DTFS-based spectral decomposition. Compute THD per IEEE 519. Filter design loop iterates LC topology to bring THD under 5%.',
    tech: ['MATLAB','DTFS','Power Systems','IEEE 519','Filter Design'],
    metrics: [{k:'<5%',v:'THD post-filter'},{k:'3',v:'load scenarios'},{k:'519',v:'compliant'},{k:'LC',v:'filter topology'}],
    role: 'Analysis + filter design', team: 'Solo coursework',
    link: 'github.com/Manikanta25055/Power_Quality_Analysis_Using_DTFS',
  },
  {
    id: 'mak8', title: 'MAK-8 / MAK8u', subtitle: '8-bit CPU + dual-core extension on Nexys A7',
    badge: 'CUSTOM SILICON', period: 'Ongoing',
    blurb: 'A from-scratch 8-bit CPU built in Verilog and synthesized to a Xilinx Artix-7 FPGA, plus a dual-core extension (MAK8u) sharing memory through arbitration logic.',
    problem: 'Most "build your own CPU" projects stop at single-core hello-world; multicore arbitration is where the real complexity hides.',
    approach: 'Designed ISA, hand-wrote assembler, then implemented control unit, ALU, register file, and memory bus in Verilog. MAK8u adds a second core with bus arbitration.',
    tech: ['Verilog','FPGA','Xilinx Vivado','Nexys A7','ISA Design','Assembler'],
    metrics: [{k:'2',v:'cores'},{k:'8-bit',v:'ISA'},{k:'Artix-7',v:'target'},{k:'~50 MHz',v:'fmax'}],
    role: 'ISA + RTL + assembler', team: 'Solo build',
    link: 'github.com/Manikanta25055/MAK-8',
  },
];

export const SKILLS = [
  { g: 'Hardware',     items: ['FPGA / Verilog','RTL design','ASIC flow','Power electronics','PCB design','Embedded C'] },
  { g: 'Software',     items: ['Python','MATLAB / Simulink','C / C++','GStreamer','OpenCV','PyQt5'] },
  { g: 'Signals & AI', items: ['YOLOv8','Hailo AI','DSP','Spectral analysis','Control systems','Edge inference'] },
  { g: 'Protocols',    items: ['MODBUS RTU','RS485','1-Wire','I2C / SPI','UART','IoT stacks'] },
];

export const WRITING = [
  { title: 'Building Garuda: sub-100ms AI on Pi 5', date: 'Apr 2025', read: '6 min', tags: ['Hailo 8L','YOLOv8','GStreamer'], excerpt: 'Splitting YOLOv8 at the backbone, zero-copy GStreamer pipelines, and why cloud dependency was never on the table.' },
  { title: 'MODBUS RTU from scratch on ESP32-S3', date: 'Feb 2026', read: '5 min', tags: ['ESP32','RS485','Industrial'], excerpt: 'A 1979 protocol still running half the world\'s industrial equipment. Here is how you implement a full RTU slave.' },
  { title: 'Active cell balancing: passive is not enough', date: 'Nov 2024', read: '4 min', tags: ['Power','BMS','LTSpice'], excerpt: 'Passive balancing burns charge as heat. Flyback recycles it — and gives you 20–30% more pack life.' },
];

export const THEMES = {
  glass: {
    label: 'Liquid Glass',
    desc: 'iOS 26, frosted translucent, heavy color',
  },
  terminal: {
    label: 'Brutalist Terminal',
    desc: 'Mono type, ASCII, hacker',
  },
  editorial: {
    label: 'Engineering Journal',
    desc: 'Typographic, serious, magazine',
  },
};
